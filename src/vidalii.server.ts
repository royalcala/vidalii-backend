import express from 'express';
// import 'express-async-errors';
import { Server } from 'http';
import type { Api } from "./vidalii.api";
import type { DB, Em } from "./vidalii.db";
import { OptionsCli } from './service.cli';
import { ApolloServer } from 'apollo-server';
import { servicesVersion } from 'typescript';

export interface Context {
    em: Em
}

export class VServer {
    private host: express.Application
    public server: ApolloServer
    public async start(db: DB, api: Api, cli: OptionsCli) {
        try {
            const schema = await api.getSchemaApi(cli)

            this.server  = new ApolloServer({
                schema,
                playground: true,
                context: (): Context => ({ em: db.orm?.em?.fork() || 'no database init' }) as Context,
                plugins: [
                    {
                        requestDidStart: () => ({
                            willSendResponse: async (data) => {
                                const context = data.context as Context
                                // await db.flush()//save all the data to the database  
                                await context.em.flush()
                                // if (operationName === 'holis') {
                                //     // console.log('**********willSendResponse', { operationName, context, response })
                                // }
                            },
                        }),
                    },
                ],
            })
            // Start the server
            const { url } = await this.server.listen(cli.PORT)            
            console.log(`🚀Server is running, GraphQL Playground available at ${url}`);
        } catch (error) {
            console.error('📌 Could not start server', error)
        }

    }
}


//express
// public async start(db: DB, api: Api, cli: OptionsCli) {
//     this.host = express();
//     this.host.use(cors());
//     const endpoint = '/graphql'
//     this.host.get('/graphqli', expressPlayground({ endpoint }));
//     try {
//         const schema = await api.getSchemaApi(cli)
//         this.host.post(
//             endpoint,
//             graphqlHTTP(
//                 (req, res) => ({
//                     schema,
//                     context: { req, res, em: db.orm?.em?.fork() || 'no database init' } as Context,
//                     // customFormatErrorFn: (error) => {
//                     //     console.log(error)
//                     //     throw new Error()
//                     // },
//                     customExecuteFn: async (args) => {
//                         let response = await execute(args)
//                         const context = args.contextValue as Context
//                         await context.em.flush()
//                         return response
//                     },
//                 })
//             ),
//         );

//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         this.host.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
//             console.error('📌 Something went wrong', error);
//             res.status(400).send(error);
//         });

//         this.server = this.host.listen(cli.PORT, () => {
//             console.log(`🚀 http://localhost:${cli.PORT}/graphql`);
//         });
//     } catch (error) {
//         console.error('📌 Could not start server', error);
//     }
// }