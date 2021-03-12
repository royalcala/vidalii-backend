import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { EntityClass, EntityClassGroup } from '@mikro-orm/core/typings';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { Connection, IDatabaseDriver, MikroORM, EntityManager, Options, AnyEntity, wrap } from '@mikro-orm/core';
import { OptionsCli } from './service.cli';
// import { Author } from "./test/test1/Author.entity";
// import { BaseEntity } from "./test/test1/BaseEntity.entity";
export type Em = EntityManager<IDatabaseDriver<Connection>>
export { wrap }

export class DB {
    public entities = new Map() as Map<string, EntityClass<AnyEntity>>
    public ormConfig: Options = {
        metadataProvider: TsMorphMetadataProvider,
        // migrations: {
        //     path: './src/migrations',//TODO define in root path
        //     tableName: 'migrations',
        //     transactional: true,
        // },
        tsNode: process.env.NODE_DEV === 'true' ? true : false,
        type: 'sqlite',
        // as we are using class references here, we don't need to specify `entitiesTs` option
        // entities: [Author, BaseEntity],
        highlighter: new SqlHighlighter(),
        debug: true,
        batchSize: 500,
        useBatchUpdates: true,
        useBatchInserts: true,

    }
    public orm: MikroORM<IDatabaseDriver<Connection>>

    public addEntity(entity: EntityClass<AnyEntity>, options: 'replace' = 'replace') {
        console.log('addEntity:', entity.name)
        if (options === 'replace')
            this.entities.set(entity.name, entity)
    }


    public async start(cli: OptionsCli): Promise<void> {
        try {
            this.ormConfig.migrations = {
                path: cli.DB_PATH,
                tableName: '_migrations',
                transactional: true
            }
            this.ormConfig.entities = [cli.INPUT + '.entity.ts']
            // this.ormConfig.entitiesTs = ['src/**/*.entity.ts']
            this.ormConfig.dbName = cli.DB_PATH + '/data.db'
            this.ormConfig.cache = {
                enabled: true,
                pretty: true,
                options: { cacheDir: cli.DB_PATH }
            }
            // this.ormConfig.entities = [...this.entities.values()] as any
            // this.ormConfig.dbName = 'src/test/test1/data.db'
            this.orm = await MikroORM.init(this.ormConfig);
            const generator = this.orm.getSchemaGenerator();
            // const dropDump = await generator.getDropSchemaSQL();
            // console.log(dropDump);

            // const createDump = await generator.getCreateSchemaSQL();
            // console.log(createDump);

            // const updateDump = await generator.getUpdateSchemaSQL();
            // console.log(updateDump);

            // // there is also `generate()` method that returns drop + create queries
            // const dropAndCreateDump = await generator.generate();
            // console.log(dropAndCreateDump);
            //TODO
            // if (process.env.NODE_ENV === 'testing') {
            await generator.dropSchema();
            await generator.createSchema();
            await generator.updateSchema();
            // }
            // else
            //     await generator.createSchema()

            const migrator = this.orm.getMigrator();
            const migrations = await migrator.getPendingMigrations();
            if (migrations && migrations.length > 0) {
                await migrator.up();
            }

        } catch (error) {
            console.error('📌 Could not connect to the database', error);
            throw Error(error);
        }
    }
}