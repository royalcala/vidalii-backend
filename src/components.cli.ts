#!/usr/bin/env node
import yargs from "yargs"
import Path from "path";
import symlinkDir from "symlink-dir";
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
        'link', 'link components',
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
            const pathComponents = `${root}/src/components`
            const ls = spawn('npm', ['ls', '-json', '-long']);
        
            ls.stdout.on('data', (data) => {
                const npmLs = JSON.parse(data)
                const dependencies = Object.values(npmLs.dependencies) as any as NpmDependencies[]
        
                // console.log(dependencies)
                // console.log(Object.keys(npmLs))
        
                for (let index = 0; index < dependencies.length; index++) {
                    const element = dependencies[index];
                    const packageJson = require(`${element.path}/package.json`)
                    if (packageJson?.vidalii) {
                        symlinkDir(`${element.path}/src/components`, pathComponents)
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