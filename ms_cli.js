#!/usr/bin/env node
const packageJson = require('./package.json')
console.log(`Version:${packageJson.version}`)
require('./dist/service.cli')