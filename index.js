const fileSystem = require('fs');
const resolve = require('path').resolve;
const join = require('path').join;
const cp = require('child_process');
const os = require('os');

let processingDepth = 999; // The processingDepth determines how deep into the hierarchy the function should go. 
let startingPath = resolve(__dirname, '.'); // get starting Path
let commandToExecute = 'echo';
let commandParameters = ['{{DirectoryName}}'];

const REPLACE_PATTERN_DIRECTORY = /{{DirectoryName}}/g;
const REPLACE_PATTERN_PATH = /{{Path}}/g;

executeCommandsInDirectory(startingPath);

/**
 * 
 * @param {String} aDirectoryName 
 * @param {int} aDepth 
 * @param {Function} resolutionFunction 
 */
function executeCommandsInDirectory(aDirectoryName, aDepth = 0, resolutionFunction) {

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
            if (fileSystem.lstatSync(fileLocation).isDirectory() && !isHiddenUnixPath(aFile) && aDepth < processingDepth) {

                new Promise((singlePromise, singleReject) => {

                    // recursive call to itself
                    executeCommandsInDirectory(fileLocation, (aDepth + 1), singlePromise)

                }).then((singleResult) => {


                    // This might be useful later
                    //  var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';

                    let spawnParams = {
                        "env": process.env,
                        "cwd": fileLocation,
                        "stdio": 'inherit',
                        "shell": true
                    };

                    let command = determineCommand(fileLocation, aFile);

                    // Determine filterd parameters
                    let params = determineParameterArray(fileLocation, aFile);

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

function determineCommand(aPath, aDirectoryName)
{
    return commandToExecute.replace(REPLACE_PATTERN_PATH,aPath).replace(REPLACE_PATTERN_DIRECTORY,aDirectoryName);
}

function determineParameterArray(aPath, aDirectoryName)
{
    let returnArray = [];

    for(let z=0; z < commandParameters.length; z++)
    {
        returnArray.push(commandParameters[z].replace(REPLACE_PATTERN_PATH,aPath).replace(REPLACE_PATTERN_DIRECTORY,aDirectoryName));
    }
    return returnArray;
}

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 */
function isHiddenUnixPath(path) {
    return (/(^|\/)\.[^\/\.]/g).test(path);
};