#!/usr/bin/env node
import yargs from 'yargs'
import { action, options } from "./service.server.command";
import { action as linksAction, options as linksOptions } from "./service.links.command";



yargs
    .command(
        'start', 'vidalii service',
        options,
        action
    )
    .command(
        'components', 'import vidalii components from node_modules',
        //@ts-ignore
        linksOptions,
        linksAction
    )
    .argv