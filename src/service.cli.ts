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
        'links', 'import links from node_modules',
        linksOptions,
        linksAction
    )
    .argv