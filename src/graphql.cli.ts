#!/usr/bin/env node
import yargs from 'yargs'
import VidaliiService from "./vidalii";
import fse from "fs-extra";
import Path from "path";
import { buildSchema, printSchema } from "graphql";

export type OptionsCli = {
    INPUT: string
    OUTPUT: string
}

yargs
    .command(
        'generate', 'generate code .graphql',
        (yargs: yargs.Argv<OptionsCli>) => {
            yargs
                .option('INPUT', {
                    describe: 'use glob patter',
                    type: 'string',
                    default: '**/*',
                })
                .option('OUTPUT', {
                    describe: '',
                    type: 'string',
                    default: './',
                    coerce: (value) => {
                        return Path.resolve(value)
                    }
                })
        },
        async (args: OptionsCli) => {
            //TODO check if works
            const schema = await VidaliiService.api.getSchemaApi(args as any)            
            // const typeDefs = [...VidaliiService.api.type.values()].join('/n')
            // const schema = buildSchema(typeDefs)
            const prettier = printSchema(schema)
            fse.outputFileSync(args.OUTPUT + '/typeDefs.graphql', prettier)
        }
    )
    .argv