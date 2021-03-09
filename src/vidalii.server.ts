import express from 'express';
// import 'express-async-errors';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import { Server } from 'http';
import type { Api } from "./vidalii.api";
import type { DB, Em } from "./vidalii.db";
import type { Request, Response } from 'express';
import { execute } from "graphql";
import { OptionsCli } from './service.cli';

export interface Context {
    req: Request;
    res: Response;
    em: Em
}

export class VServer {
    private host: express.Application
    private server: Server
    public async start(db: DB, api: Api, cli: OptionsCli) {
        this.host = express();
        this.host.use(cors());
        const endpoint = '/graphql'
        // if (cli.ENV !== 'production') {
        this.host.get('/graphqli', expressPlayground({ endpoint }));
        // }
        try {
            const schema = await api.getSchemaApi()
            this.host.post(
                endpoint,
                graphqlHTTP(
                    (req, res) => ({
                        schema,
                        context: { req, res, em: db.orm?.em?.fork() || 'no database init' } as Context,
                        // customFormatErrorFn: (error) => {
                        //     throw error;
                        // },
                        customExecuteFn: async (args) => {
                            let response = await execute(args)
                            const context = args.contextValue as Context
                            await context.em.flush()
                            return response
                        },
                    })
                ),
            );

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.host.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
                console.error('📌 Something went wrong', error);
                res.status(400).send(error);
            });

            this.server = this.host.listen(cli.PORT, () => {
                console.log(`🚀 http://localhost:${cli.PORT}/graphql`);
            });
        } catch (error) {
            console.error('📌 Could not start server', error);
        }
    }
}