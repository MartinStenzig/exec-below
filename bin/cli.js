#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const execbelow = require('./../lib/exec-below')

// Yargs command line edfintion
const res = yargs(hideBin(process.argv))
  .scriptName('exec-below')
  .usage('$0 <cmd> [args]', 'execute command in all directories below current')
  .example([
    ['$0 "npx bestzip" "a.zip" "*"', 'zip each folder into a.zip'],
    ['$0 -v "dir" ">ls.txt"', 'output directory listing into text file (Windows)']
  ])
  .wrap(null)
  .option('depth', {
    alias: 'd',
    type: 'number',
    description: 'Execution depth: 1 or greater (default: 9999)'
  })
  .option('startPath', {
    alias: 's',
    type: 'string',
    description: 'Starting path'
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .argv

// determine command
const command = res._.shift()

// determine command parameter array
const commandParamArray = res._

// deterine parameter object
const paramObject = res
delete paramObject._

// Execute the real command
// console.log('Exec', command, commandParamArray, paramObject)
execbelow(command, commandParamArray, paramObject)
