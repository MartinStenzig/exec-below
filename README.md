# exec-below
[![npm version](https://badge.fury.io/js/exec-below.svg)](https://badge.fury.io/js/exec-below)
[![npm downloads](https://img.shields.io/npm/dm/exec-below)](https://www.npmjs.com/package/exec-below)
![GitHub CodeQL Check](https://github.com/MartinStenzig/exec-below/actions/workflows/codeql-analysis.yml/badge.svg)
This module provides a `exec-below` command that opens a shell in recursively in every directory below the current directory and executes the specified command.  

## Why? 
Certain build and deployment operations require the zipping of folder content. Without this tool, individual package.json files or individually coded calls are necesary. 
## Global command line usage
```shell
npm install -g exec-below
exec-below "npx bestzip" "packed.zip" "*" 
```
## NPX Usage
```shell
npx exec-below "npx bestzip" "packed.zip" "*" 
```
## Command line usage within `package.json` scripts

    npm install --save-dev exec-below

package.json:

```javascript
{
    //...
    "scripts": {
        "build" "...",
        "zip": "exec-below '@DirectoryName@.zip' '*' --depth 1",
        "upload": "....",
        "deploy": "npm run build && npm run zip && npm run upload"
    }
}
```
## Programmatic usage from within Node.js

```javascript
const execbelow = require('exec-below')

execbelow('npx bestzip', ['@PathToExecuteFrom@/../output/@DirectoryName@.zip', '*'], { verbose: true, depth: 1, startPath: path.join(__dirname, './../testDir/input')).then(function() {
  console.log('all done!');
}).catch(function(err) {
  console.error(err.stack);
  process.exit(1);
});
```

### Replacement Parameters
The following replacement parameters can be specified as part of a command or an command argument. 

* `@DirectoryName@`: The name of the directory. If the current directory that is processed is `/home/etc/testdir1` then the replacement value is `testdir1`
* `@PathToDirectory@`: The path to the directory. If the current directory that is processed is `/home/etc/testdir1` then the replacement value is `/home/etc`
* `@PathToExecuteFrom@`: The path to directory from which you executed the comand. If you execute the `exec-below` in the direcory `/home/etc` then the replacement value is `/home/etc` 

### Options
* `-d` or `--depth`: Specifies the execution depth (default; 9999)
* `-s` or `--startPath`: Starting path
* `-v` or `--verbose`: Runs the command with verbose logging
* `--version`: Shows the version of the package
* `--help`: Shows help

