#!/usr/bin/env node
import yargs from 'yargs'
import Vidalii from "./vidalii";
import fs from "fs";
import Path from "path";


export type OptionsCli = {
    PATTERN: string
    ENV: 'production' | 'testing',
    PORT: number,
    DB_NAME: string,
    DB_MIGRATIONS: string,
    DB_CACHE: string

}

yargs
    .command(
        'start', 'vidalii service',
        (yargs: yargs.Argv<OptionsCli>) => {
            yargs
                .option('PATTERN', {
                    describe: 'default **/*.[entity|api].{js,ts}',
                    type: 'string',
                    default: '**/*',
                })
                .option('ENV', {
                    type: 'string',
                    choices: ['production', 'testing'],
                    default: 'production'
                })
                .option('PORT', {
                    type: 'number',
                    default: 4000
                })
                //TODO only for slite
                .option('DB_NAME', {
                    type: 'string',
                    default: 'data.db',
                    description: '',
                    coerce: (value) => {
                        return Path.resolve(value)
                    }
                })
                .option('DB_MIGRATIONS', {
                    type: 'string',
                    default: '.',
                    description: '',
                    coerce: (value) => {
                        return Path.resolve(value)
                    }
                })
                .option('DB_CACHE', {
                    type: 'string',
                    default: '.',
                    description: 'entity metadata ',
                    coerce: (value) => {
                        return Path.resolve(value)
                    }
                })


        },
        async (args: OptionsCli) => {
            Vidalii.cli = args
            if (!fs.existsSync(args.DB_NAME)) {
                fs.mkdirSync(args.DB_NAME, { recursive: true })
                console.log(`Created data directory:${args.DB_NAME}`)
            }
            else
                console.log(`Using data directory:${args.DB_NAME}`)
            await Vidalii.start()
        }
    ).argv