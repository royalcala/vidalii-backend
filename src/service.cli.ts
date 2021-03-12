#!/usr/bin/env node
import yargs from 'yargs'
import Vidalii from "./vidalii";
import fs from "fs";
import Path from "path";


export type OptionsCli = {
    INPUT?: string
    ENV?: 'production' | 'testing',
    PORT?: number,
    DB_PATH?: string,
    // DB_MIGRATIONS: string,
    // DB_CACHE: string

}

yargs
    .command(
        'start', 'vidalii service',
        (yargs: yargs.Argv<OptionsCli>) => {
            yargs
                .option('INPUT', {
                    describe: 'use glob pattern',
                    type: 'string',
                    default: 'src/**/*',
                    coerce: (value) => {
                        return Path.resolve(value)
                    }
                })
                // .option('ENV', {
                //     type: 'string',
                //     choices: ['production', 'testing'],
                //     default: 'production'
                // })
                .option('PORT', {
                    type: 'number',
                    default: 4000
                })
                //TODO only for slite
                .option('DB_PATH', {
                    type: 'string',
                    default: '.',
                    description: 'directory for local db, migrations and cache',
                    coerce: (value) => {
                        return Path.resolve(value)
                    }
                })
            // .option('DB_MIGRATIONS', {
            //     type: 'string',
            //     default: '.',
            //     description: '',
            //     coerce: (value) => {
            //         return Path.resolve(value)
            //     }
            // })
            // .option('DB_CACHE', {
            //     type: 'string',
            //     default: '.',
            //     description: 'entity metadata ',
            //     coerce: (value) => {
            //         return Path.resolve(value)
            //     }
            // })


        },
        async (args: OptionsCli) => {
            console.log(`optionsCli:${args}`)
            const packageJson = require('../package.json')
            console.log(`${packageJson.name}:${packageJson.version}`)
            if (!fs.existsSync(args.DB_PATH)) {
                fs.mkdirSync(args.DB_PATH, { recursive: true })
                console.log(`Created data directory:${args.DB_PATH}`)
            }
            else
                console.log(`Using data directory:${args.DB_PATH}`)
            await Vidalii.start(args)
        }
    )
    .argv