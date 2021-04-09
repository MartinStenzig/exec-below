"use strict";

const fileSystem = require('fs');
const resolve = require('path').resolve;
const join = require('path').join;
const cp = require('child_process');
const os = require('os');


module.exports = function (aCommandToExecute, aParameterArray, executionOptions) {

    console.log('Start');
    _commandToExecute = aCommandToExecute;
    _commandParameters = aParameterArray;
    _optionProcessingDepth = executionOptions.processingDepth || 9999;
    _optionStartingPath = executionOptions.startingPath || '.';

    // Start execution
    _executeCommandsInDirectory(_optionStartingPath);

};

let _commandToExecute = '';
let _commandParameters = [];

let _optionProcessingDepth = 0; // The _optionProcessingDepth determines how deep into the hierarchy the function should go. 
let _optionStartingPath = resolve(__dirname, '.'); // get starting Path

let REPLACE_PATTERN_DIRECTORY = /@DirectoryName@/g;
let REPLACE_PATTERN_PATH = /@PathToDirectory@/g;
let REPLACE_PATTERN_ORIGIN = /@OriginPath@/g;

/**
 * 
 * @param {String} aDirectoryName 
 * @param {int} aDepth 
 * @param {Function} resolutionFunction 
 */
function _executeCommandsInDirectory(aDirectoryName, aDepth = 0, resolutionFunction) {

    // Promise list for all file promises
    let promiseList = [];

    // Callbacks for each file in directory
    fileSystem.readdirSync(aDirectoryName).forEach((aFile) => {

        // Determine combined file location
        let fileLocation = join(aDirectoryName, aFile);

        // Promise for each file
        let filePromise = new Promise((fileResolve, fileReject) => {

            // Check if 
            // 1. file is of type directory and 
            // 2. not hidden and
            // 3. not below the processing depth
            if (fileSystem.lstatSync(fileLocation).isDirectory() && !_isHiddenUnixPath(aFile) && aDepth < _optionProcessingDepth) {

                new Promise((singlePromise, singleReject) => {

                    // recursive call to itself
                    _executeCommandsInDirectory(fileLocation, (aDepth + 1), singlePromise)

                }).then((singleResult) => {


                    // This might be useful later
                    //  var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';

                    let spawnParams = {
                        "env": process.env,
                        "cwd": fileLocation,
                        "stdio": 'inherit',
                        "shell": true
                    };

                    let command = _determineCommand(fileLocation, aFile);

                    // Determine filterd parameters
                    let params = _determineParameterArray(fileLocation, aFile);

                    // Execute the specified command
                    let spawnedChild = cp.spawn(command, params, spawnParams);

                    // Resolve promise when process execution is done
                    spawnedChild.on('close', (code) => {
                        fileResolve('Command for directory ' + fileLocation + ' concluded.');
                    });

                });
            }
            else {
                fileResolve('' + fileLocation + ' is not a directory to process.');
            }
        })

        promiseList.push(filePromise);


    });


    Promise.all(promiseList).then((values) => {
        if (resolutionFunction != undefined) {
            resolutionFunction('' + aDirectoryName + ' - processed');
        }
        //console.log('Reached Promise all end', aDirectoryName);
    });

}


/**
 * Determines the commmand based on 
 * 1. the first call parameter
 * 2. Replacement of potential placeholders 
 * @param {*} aPath 
 * @param {*} aDirectoryName 
 * @returns 
 */
function _determineCommand(aPath, aDirectoryName) {
    return _commandToExecute.replace(REPLACE_PATTERN_PATH, aPath).replace(REPLACE_PATTERN_DIRECTORY, aDirectoryName);
}

/**
 * Determines the parameter array based on 
 * 1. The incoming parameters
 * 2. replacements of all placeholders with the path and directory name provided
 * @param {String} aPath 
 * @param {String} aDirectoryName 
 * @returns {Array}
 */
function _determineParameterArray(aPath, aDirectoryName) {
    let returnArray = [];

    for (let z = 0; z < _commandParameters.length; z++) {
        returnArray.push(_commandParameters[z].replace(REPLACE_PATTERN_PATH, aPath).replace(REPLACE_PATTERN_DIRECTORY, aDirectoryName));
    }
    return returnArray;
}

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 */
function _isHiddenUnixPath(path) {
    return (/(^|\/)\.[^\/\.]/g).test(path);
};
