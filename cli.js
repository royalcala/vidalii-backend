#!/usr/bin/env node
const packageJson = require('./package.json')
console.log(packageJson.version)
require('./dist/service.cli')