'use strict'

const fileSystem = require('fs')
const resolve = require('path').resolve
const join = require('path').join
const cp = require('child_process')
const path = require('path')

module.exports = function (aCommandToExecute, aParameterArray, executionOptions) {
  // console.log('Start');
  _commandToExecute = aCommandToExecute
  _commandParameters = aParameterArray
  _optionProcessingDepth = executionOptions.processingDepth || 9999
  _optionStartingPath = executionOptions.startingPath || '.'
  _verbose = executionOptions.verbose || false

  // Start execution
  return _executeCommandsInDirectory(_optionStartingPath)
}

let _commandToExecute = ''
let _commandParameters = []
let _verbose = false

let _optionProcessingDepth = 0 // The _optionProcessingDepth determines how deep into the hierarchy the function should go.
let _optionStartingPath = resolve(__dirname, '.') // get starting Path

const REPLACE_PATTERN_DIRECTORY = /@DirectoryName@/g
const REPLACE_PATTERN_PATH = /@PathToDirectory@/g
const REPLACE_PATTERN_STARTING_PATH = /@PathToExecuteFrom@/g

/**
 * The key function in this package
 * @param {string} aDirectoryName
 * @param {int} aDepth
 * @param {Function} resolutionFunction
 * @returns {Promise}
 */
function _executeCommandsInDirectory(aDirectoryName, aDepth = 0) {
  return new Promise((resolve, reject) => {
    // Processes the content in the directory first to determine if we need to crawl into a sub directory
    _processDirectory(aDirectoryName, aDepth)
      .then((result) => {
        // After all the sub directories were processed, we execute the command in teh current directory
        _executeCommand(aDirectoryName)
          .then((result) => {
            resolve(result)
          }).catch((error) => {
            reject(error)
          })
      }).catch((err) => {
        console.error('_executeCommandsInDirectory - error: ', err)
        reject(err)
      })
  })
}

/**
 * Processes the content of a directory
 * @param {string} aDirectoryName - Directory name of the directory to be processed
 * @param {int} currentDepth processing depth
 * @returns {Promise}
 */
function _processDirectory(aDirectoryName, currentDepth) {
  return new Promise((resolve, reject) => {
    let chain = Promise.resolve()
    // read directory
    fileSystem.readdir(aDirectoryName, (error, filesInDirectory) => {
      if (error) {
        reject(error)
      }

      for (const aFile of filesInDirectory) {
        // Determine combined file location
        const fileLocation = join(aDirectoryName, aFile)

        // Check if
        // 1. file is of type directory and
        // 2. not hidden and
        // 3. not below the processing depth
        if (fileSystem.lstatSync(fileLocation).isDirectory() && !_isHiddenUnixPath(aFile) && currentDepth < _optionProcessingDepth) {
          chain = chain.then(() => _executeCommandsInDirectory(fileLocation, (currentDepth + 1)))
        }
      }
      // Tie the chain to function level promise
      chain.then((result) => resolve(result))
    })
  })
}

/**
 * Executes the command in the specified directory
 * @param {string} aDirectoryName - The directory in which the commmand is executed
 * @returns {Promise}
 */
function _executeCommand(aDirectoryName) {
  return new Promise((resolve, reject) => {
    const spawnParams = {
      env: process.env,
      cwd: aDirectoryName,
      stdio: 'inherit',
      shell: true
    }

    // Determine the command based on varaible replacement
    const command = _determineCommand(aDirectoryName)

    // Determine filterd parameters
    const params = _determineParameterArray(aDirectoryName)

    if (_verbose) {
      console.log("- Execute Command '" + command.trim() + "' with parameters: ", params)
    }

    // Execute the specified command
    const spawnedChild = cp.spawn(command, params, spawnParams)

    // Resolve promise when process execution is done
    spawnedChild.on('close', (code) => {
      resolve('Command for directory ' + aDirectoryName + ' concluded.')
    })
    spawnedChild.on('error', (err) => {
      console.error('Failed to start subprocess.', err)
      reject(new Error('Command for directory ' + aDirectoryName + ' failed with: ' + err))
    })
  })
}

/**
 * Determines the commmand based on
 * 1. the first call parameter
 * 2. Replacement of potential placeholders
 * @param {string} aPath
 * @param {string} aDirectoryName
 * @returns {string}
 */
function _determineCommand(aDirectoryName) {
  const directoryNameWithoutPath = path.basename(aDirectoryName)
  const pathToDirectory = path.dirname(aDirectoryName)

  return _commandToExecute.replace(REPLACE_PATTERN_PATH, directoryNameWithoutPath).replace(REPLACE_PATTERN_DIRECTORY, pathToDirectory).replace(REPLACE_PATTERN_STARTING_PATH, _optionStartingPath)
}

/**
 * Determines the parameter array based on
 * 1. The incoming parameters
 * 2. replacements of all placeholders with the path and directory name provided
 * @param {String} aPath
 * @param {String} aDirectoryName
 * @returns {Array}
 */
function _determineParameterArray(aDirectoryName) {
  const returnArray = []
  const directoryNameWithoutPath = path.basename(aDirectoryName)
  const pathToDirectory = path.dirname(aDirectoryName)

  for (let z = 0; z < _commandParameters.length; z++) {
    returnArray.push(_commandParameters[z].replace(REPLACE_PATTERN_PATH, pathToDirectory).replace(REPLACE_PATTERN_DIRECTORY, directoryNameWithoutPath).replace(REPLACE_PATTERN_STARTING_PATH, _optionStartingPath))
  }
  return returnArray
}

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 */
function _isHiddenUnixPath(path) {
  return (/(^|\/)\.[^/.]/g).test(path)
};
