import yargs from "yargs"
import Vidalii from "./vidalii";
import fs from "fs";
import Path from "path";
import symlink from "symlink-dir";

export type OptionsCli = {
    NODE_MODULES?: string
}

export const options = (yargs: yargs.Argv<OptionsCli>) => {
    yargs
        .option('NODE_MODUlES', {
            describe: 'path to node_modules',
            type: 'string',
            default: 'node_modules',
        })
}

export const action = async (args: OptionsCli) => {
    // console.log(`optionsCli:${args}`)
    // const packageJson = require('../package.json')
    // console.log(`${packageJson.name}:${packageJson.version}`)
    // if (!fs.existsSync(args.DB_PATH)) {
    //     fs.mkdirSync(args.DB_PATH, { recursive: true })
    //     console.log(`Created data directory:${args.DB_PATH}`)
    // }
    // else
    //     console.log(`Using data directory:${args.DB_PATH}`)
    // await Vidalii.start(args)
}