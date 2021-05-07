
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const write = require('write')
const path = require('path')
const execbelow = require('./../lib/exec-below')

executeTests()

function executeTests() {
  // Cleans up the directory structure
  cleanupDirectoryStructure()

  // Creates a new test directory input strctucture
  createDirectoryStructure()

  setTimeout(() => {
    executeBelowCommand()
    checkResults()
  }, 2000)
}

function checkResults() {
  console.log('check')
}

function executeBelowCommand() {
  // Run the functionality without parameters
  execbelow('npx bestzip', ['@PathToExecuteFrom@/../output/@DirectoryName@.zip', '*'], { processingDepth: 1, startingPath: path.join(__dirname, './../testDir/input') })
}

function createDirectoryStructure() {
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
    console.log('Return values', returnValues)
    createFilesInDirectories()
  })
}

function createFilesInDirectories() {
  console.log('Create Files')
  write.sync('./testDir/input/testDir1/testDir11/testDir111/File1.txt', 'Content of file 1', { overwrite: false })
  write.sync('./testDir/input/testDir1/testDir11/testDir111/File2.txt', 'Content of file 2', { overwrite: false })
  write.sync('./testDir/input/testDir1/testDir11/testDir112/File3.txt', 'Content of file 3', { overwrite: false })
  write.sync('./testDir/input/testDir1/testDir11/testDir112/File4.txt', 'Content of file 4', { overwrite: false })
  write.sync('./testDir/input/testDir4Files/File5.txt', 'Content of file 5', { overwrite: false })
}

function cleanupDirectoryStructure() {
  rimraf.sync('./testDir')
}
