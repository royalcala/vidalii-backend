#!/usr/bin/env node
import yargs from "yargs"
import Path from "path";
import fse from "fs-extra";
import glob from 'glob'
import { spawn } from "child_process";
export type OptionsCli = {
    ROOT?: string

}
type NpmDependencies = {
    version: number,
    resolved: string//http path on npm server  
    name: string,
    path: string
}
yargs
    .command(
        'extract', 'components copy',
        (yargs: yargs.Argv<OptionsCli>) => {
            // yargs
            //     .option('ROOT', {
            //         describe: 'root path',
            //         type: 'string',
            //         default: '.',
            //         coerce: (value) => {
            //             return Path.resolve(value)
            //         }
            //     })
        },
        async (args: OptionsCli) => {
            const root = Path.resolve('.')
            const ls = spawn('npm', ['ls', '-json', '-long']);

            ls.stdout.on('data', (data) => {
                const npmLs = JSON.parse(data)
                const dependencies = Object.values(npmLs.dependencies) as any as NpmDependencies[]

                for (let index = 0; index < dependencies.length; index++) {
                    const element = dependencies[index];
                    const packageJson = require(`${element.path}/package.json`)
                    if (packageJson?.vidalii) {
                        glob.sync(`${element.path}/src/components/*`).forEach(
                            (src) => {
                                const arr = src.split('/')
                                const lastName = arr[arr.length - 1]
                                const dst = root + '/src/components/' + lastName
                                if (fse.pathExistsSync(src)) {
                                    console.log(`Remove directory for extract again:${lastName}.`)
                                } else
                                    fse.copySync(src, dst)

                            }
                        )

                    }
                }

            });

            ls.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            ls.on('close', (code) => {
                // console.log(`child process exited with code ${code}`);
            });
        }
    )
    .argv