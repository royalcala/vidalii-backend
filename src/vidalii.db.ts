import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Connection, IDatabaseDriver, MikroORM, EntityManager, Options, AnyEntity, wrap } from '@mikro-orm/core';
import { OptionsCli } from './service.cli';
import glob from 'glob';

export type Em = EntityManager<IDatabaseDriver<Connection>>
export { wrap }

type DbInit = (orm: DB['orm']) => void
export class DB {
    public ormConfig: Options
    public orm: MikroORM<IDatabaseDriver<Connection>>
    private dbInit: DbInit[] = []
    public addDbInit(dbInit: DbInit) {
        this.dbInit.push(dbInit)
    }
    // private subField: {
    //     entity: Function,
    //     field: string,
    //     type: 'string' | 'number' | 'boolean',
    //     index?: boolean
    // }[] = []
    // public addSubField(subField: DB['subField'][0]) {
    //     this.subField.push(subField)
    // }
    // public entities = new Map() as Map<string, EntityClass<AnyEntity>>
    // public addEntity(entity: EntityClass<AnyEntity>, options: 'replace' = 'replace') {
    //     console.log('addEntity:', entity.name)
    //     if (options === 'replace')
    //         this.entities.set(entity.name, entity)
    // }

    private async initOrm(cli: OptionsCli) {
        this.ormConfig = {
            metadataProvider: TsMorphMetadataProvider,
            tsNode: process.env.NODE_DEV === 'true' ? true : false,
            type: 'sqlite',
            highlighter: new SqlHighlighter(),
            batchSize: 500,
            useBatchUpdates: true,
            useBatchInserts: true,
            // migrations: {
            //     // path: cli.DB_PATH,
            //     path: cli.INPUT,
            //     tableName: '_vidalii_migrations',
            //     transactional: true,
            //     pattern: /\.migration\.(ts|js)$/,
            // },
            entities: [cli.INPUT + '.entity.ts'],
            // entitiesTs =['src/**/*.entity.ts']
            dbName: cli.DB_PATH + '/data.db',
            cache: {
                enabled: true,
                pretty: true,
                options: { cacheDir: cli.DB_PATH }
            },
            debug: cli.DEBUG,
        }
        this.orm = await MikroORM.init(this.ormConfig);
    }
    private async initSchema() {
        const generator = this.orm.getSchemaGenerator();
        //TODO schema env for databases
        await generator.dropSchema();
        //TODO create subFields
        await generator.createSchema();
        await generator.updateSchema();
    }
    private async init_dbInits(cli: OptionsCli) {
        glob.sync(`${cli.INPUT}/*.entity.init.{js,ts}`, { absolute: true }).forEach(
            (path) => {
                require(path)
            }
        )
        for (let index = 0; index < this.dbInit.length; index++) {
            const fn = this.dbInit[index]
            await fn(this.orm)
        }
    }
    // private async migrations(){
    // const migrator = this.orm.getMigrator();
    // const migrations = await migrator.getPendingMigrations();
    // console.log({ migrations,migrator })
    // await migrator.up();
    // if (migrations && migrations.length > 0) {
    //     await migrator.up();
    // }
    //TODO entity.init.ts
    // }
    public async start(cli: OptionsCli): Promise<void> {
        try {
            await this.initOrm(cli)
            await this.initSchema()
            await this.init_dbInits(cli)


        } catch (error) {
            console.error('📌 Could not connect to the database', error);
            throw Error(error);
        }
    }
}