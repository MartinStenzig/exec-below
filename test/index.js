
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const write = require('write')
const path = require('path')
const execbelow = require('./../lib/exec-below')

// Starts the test execution
executeTests()

/**
 * Execution of all tests
 */
function executeTests() {
  // Cleans up the directory structure
  console.log('-- Test Prep - Cleanup Directory Structure')
  cleanupDirectoryStructure()
    .then((param) => {
      console.log('-- Test Prep - Create Directory Structure')
      return createDirectoryStructure()
    })
    .then((param) => {
      console.log('-- Test Prep - Create Files In Directory')
      return createFilesInDirectories()
    }
    ).then((param) => {
      console.log('-- Start Exec Below')
      return executeBelowCommand()
    }
    ).then((param) => {
      console.log('-- Check Results')
      return checkResults()
    }
    ).catch((error) => {
      console.error('Error is ', error)
    })
}

/**
 * Checks the results
 * @returns {Promise}
 */
function checkResults() {
  return new Promise((resolve, reject) => {
    console.log('check')
    resolve()
  })
}

/**
 * Executes the core command
 * @returns {Promise}
 */
function executeBelowCommand() {
  // Run the functionality without parameters
  return execbelow('npx bestzip', ['@PathToExecuteFrom@/../output/@DirectoryName@.zip', '*'], { verbose: true, processingDepth: 1, startingPath: path.join(__dirname, './../testDir/input') })
}

/**
 * Creates the test directory structure
 * @returns {Promise}
 */
function createDirectoryStructure() {
  return new Promise((resolve, reject) => {
    const promiseList = []

    promiseList.push(mkdirp('./testDir/input/testDir0'))
    promiseList.push(mkdirp('./testDir/input/testDir1/testDir11/testDir111'))
    promiseList.push(mkdirp('./testDir/input/testDir1/testDir11/testDir112'))
    promiseList.push(mkdirp('./testDir/input/testDir1/testDir11/testDir113'))
    promiseList.push(mkdirp('./testDir/input/testDir1/testDir12/testDir121'))
    promiseList.push(mkdirp('./testDir/input/testDir1/testDir12/testDir122/testDir1221'))
    promiseList.push(mkdirp('./testDir/input/testDir2NoKids'))
    promiseList.push(mkdirp('./testDir/input/testDir3/.secret'))
    promiseList.push(mkdirp('./testDir/input/testDir3/testDirVisible'))
    promiseList.push(mkdirp('./testDir/input/testDir4Files'))
    promiseList.push(mkdirp('./testDir/output'))

    Promise.all(promiseList).then((returnValues) => {
      // console.log('-- Create Dir - Resolved')
      resolve('Return values', returnValues)
    }).catch((reason) => {
      reject(reason)
    })
  })
}

/**
 * creates test files in the directory
 * @returns {Promise}
 */
function createFilesInDirectories() {
  return new Promise((resolve, reject) => {
    const promiseList = []
    write('./testDir/input/testDir1/testDir11/testDir111/File1.txt', 'Content of file 1', { overwrite: false })
    write('./testDir/input/testDir1/testDir11/testDir111/File2.txt', 'Content of file 2', { overwrite: false })
    write('./testDir/input/testDir1/testDir11/testDir112/File3.txt', 'Content of file 3', { overwrite: false })
    write('./testDir/input/testDir1/testDir11/testDir112/File4.txt', 'Content of file 4', { overwrite: false })
    write('./testDir/input/testDir4Files/File5.txt', 'Content of file 5', { overwrite: false })
    Promise.all(promiseList).then((returnValues) => {
      // console.log('-- Create Files - Resolved')
      resolve('Return values', returnValues)
    }).catch((reason) => {
      reject(reason)
    })
  })
}

/**
 * Cleanup directory structure
 * @returns {Promise}
 */
function cleanupDirectoryStructure() {
  return new Promise((resolve, reject) => {
    rimraf('./testDir', (error) => {
      if (error === null) {
        // console.log('-- Cleanup - Resolved')
        resolve()
      } else {
        console.log('-- Cleanup - Error', error)
        reject(error)
      }
    })
  })
}
