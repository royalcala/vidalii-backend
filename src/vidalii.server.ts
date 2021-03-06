import express from 'express';
// import 'express-async-errors';
import type { Api } from "./vidalii.api";
import type { DB, Em } from "./vidalii.db";
import { OptionsCli } from './service.cli';
import { ApolloServer, } from 'apollo-server';
import DataLoader from 'dataloader';
import { ExecutionParams } from 'graphql-tools';

export interface Context {
    em: Em,
    dataLoader: Map<string, DataLoader<any, any, any>>
}
export interface ExpressContext {
    req: express.Request;
    res: express.Response;
    connection?: ExecutionParams;
}
export type FnContext = (data: ExpressContext) => object
export class VServer {
    private host: express.Application
    public server: ApolloServer

    private middlewareContext: FnContext[] = []
    public addContext(fnContext: FnContext) {
        this.middlewareContext.push(fnContext)
    }
    public async start(db: DB, api: Api, cli: OptionsCli) {
        try {
            const schema = await api.getSchemaApi(cli)

            this.server = new ApolloServer({
                schema,
                playground: true,
                context: async (data: ExpressContext): Promise<Context> => {
                    let mcontext = {}
                    for (let index = 0; index < this.middlewareContext.length; index++) {
                        let newdata = await this.middlewareContext[index](data)
                        mcontext = {
                            ...mcontext,
                            ...newdata
                        }

                    }
                    return ({
                        ...mcontext,
                        em: db.orm?.em?.fork() || 'no database init',
                        dataLoader: new Map(),
                    }) as Context
                },
                plugins: [
                    {
                        requestDidStart: () => ({
                            willSendResponse: async (data) => {
                                const context = data.context as Context
                                //save all the data to the database
                                //THIS USE TRANSACTIONS BY DEFAULT  
                                await context.em.flush()
                                // if (operationName === 'holis') {
                                //     // console.log('**********willSendResponse', { operationName, context, response })
                                // }
                            },
                            didEncounterErrors: async (data) => {
                                const context = data.context as Context
                                context.em.clear()
                            }
                        }
                            //TODO didEncounterErrors
                        ),
                    },
                ],
            })
            // Start the server
            const { url } = await this.server.listen(cli.PORT)
            console.log(`????Server is running, GraphQL Playground available at ${url}`);
        } catch (error) {
            console.error('???? Could not start server', error)
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
//             console.error('???? Something went wrong', error);
//             res.status(400).send(error);
//         });

//         this.server = this.host.listen(cli.PORT, () => {
//             console.log(`???? http://localhost:${cli.PORT}/graphql`);
//         });
//     } catch (error) {
//         console.error('???? Could not start server', error);
//     }
// }