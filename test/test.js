const { mkdirp } = require('mkdirp')
const { rimraf } = require('rimraf')
const write = require('write')
const fs = require('fs')
const path = require('path')
const execbelow = require('../lib/exec-below')
const assert = require('assert')

describe('exec-below', function () {
  this.timeout(10000)
  describe('exec-below', function () {
    before(async function () {
      console.log('-- Test Prep - Cleanup Directory Structure')
      await cleanupDirectoryStructure()
      console.log('-- Test Prep - Create Directory Structure')
      await createDirectoryStructure()
      console.log('-- Test Prep - Create Files In Directory')
      await createFilesInDirectories()
    })

    describe('execute()', function () {
      it('responds', async function () {
        this.slow(300000)
        this.timeout(1000000)
        const execResult = await execbelow('npx bestzip', ['@DirectoryName@.zip', '*'], { verbose: true, startPath: path.join(__dirname, './../testDir/input') })
        // const execResult = 'Command for directory C:\\_projects\\martinstenzig\\exec-below\\testDir\\input concluded.'
        const searchRegex = /concluded/g

        // console.log('Results: ', execResult.search(searchRegex))
        assert.strictEqual(true, execResult.search(searchRegex) > 0)
      })
    })

    describe('checkPackingResults()', function () {
      const pathTestDir1 = './testDir/input/testDir1/testDir1.zip'
      const pathTestDir11 = './testDir/input/testDir1/testDir11/testDir11.zip'
      const pathTestDir111 = './testDir/input/testDir1/testDir11/testDir111/testDir111.zip'
      const pathTestDir112 = './testDir/input/testDir1/testDir11/testDir112/testDir112.zip'
      const pathTestDir12 = './testDir/input/testDir1/testDir12/testDir12.zip'
      const pathTestDir3 = './testDir/input/testDir3/testDir3.zip'
      const pathTestDir4Files = './testDir/input/testDir4Files/testDir4Files.zip'
      const pathInput = './testDir/input/input.zip'

      it('packed testDir1 into ' + pathTestDir1, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir1))
      })
      it('packed testDir11 into ' + pathTestDir11, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir11))
      })
      it('packed testDir111 into ' + pathTestDir111, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir111))
      })
      it('packed testDir112 into ' + pathTestDir112, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir112))
      })
      it('packed testDir12 into ' + pathTestDir12, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir12))
      })
      it('packed testDir3 into ' + pathTestDir3, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir3))
      })
      it('packed testDir4Files into ' + pathTestDir4Files, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir4Files))
      })
      it('packed input into ' + pathInput, function () {
        assert.strictEqual(true, fs.existsSync(pathInput))
      })
    })
  })

  describe('exec-below with depth=1', function () {
    before(async function () {
      console.log('-- Test Prep - Cleanup Directory Structure')
      await cleanupDirectoryStructure()
      console.log('-- Test Prep - Create Directory Structure')
      await createDirectoryStructure()
      console.log('-- Test Prep - Create Files In Directory')
      await createFilesInDirectories()
    })

    describe('execute()', function () {
      it('responds', async function () {
        this.slow(200000)
        this.timeout(500000)
        const execResult = await execbelow('npx bestzip', ['@PathToExecuteFrom@/../output/@DirectoryName@.zip', '*'], { verbose: true, depth: 1, startPath: path.join(__dirname, './../testDir/input') })
        // const execResult = 'Command for directory C:\\_projects\\martinstenzig\\exec-below\\testDir\\input concluded.'
        const searchRegex = /concluded/g

        // console.log('Results: ', execResult.search(searchRegex))
        assert.strictEqual(true, execResult.search(searchRegex) > 0)
      })
    })

    describe('checkPackingResults()', function () {
      const pathTestDir1 = './testDir/output/testDir1.zip'
      const pathTestDir3 = './testDir/output/testDir3.zip'
      const pathTestDir4Files = './testDir/output/testDir4Files.zip'
      const pathInput = './testDir/output/input.zip'

      it('packed testDir1 into ' + pathTestDir1, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir1))
      })
      it('packed testDir3 into ' + pathTestDir3, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir3))
      })
      it('packed testDir4Files into ' + pathTestDir4Files, function () {
        assert.strictEqual(true, fs.existsSync(pathTestDir4Files))
      })
      it('packed input into ' + pathInput, function () {
        assert.strictEqual(true, fs.existsSync(pathInput))
      })
    })
  })
})

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
    write('./testDir/input/testDir0/File0.txt', 'Content of file 1', { overwrite: false })
    write('./testDir/input/testDir1/testDir11/testDir111/File111-1.txt', 'Content of file 1', { overwrite: false })
    write('./testDir/input/testDir1/testDir11/testDir111/File111-2.txt', 'Content of file 2', { overwrite: false })
    write('./testDir/input/testDir1/testDir11/testDir112/File112-1.txt', 'Content of file 3', { overwrite: false })
    write('./testDir/input/testDir1/testDir11/testDir112/File112-2.txt', 'Content of file 4', { overwrite: false })
    write('./testDir/input/testDir1/testDir11/testDir113/File112.txt', 'Content of file', { overwrite: false })
    write('./testDir/input/testDir1/testDir12/testDir121/File121.txt', 'Content of file', { overwrite: false })
    write('./testDir/input/testDir1/testDir12/testDir122/testDir1221/File1221.txt', 'Content of file', { overwrite: false })
    write('./testDir/input/testDir2NoKids/File2nok.txt', 'Content of file', { overwrite: false })
    write('./testDir/input/testDir3/.secret/Filesecret.txt', 'Content of file', { overwrite: false })
    write('./testDir/input/testDir3/testDirVisible/Filesvisible.txt', 'Content of file', { overwrite: false })
    write('./testDir/input/testDir3/testDirVisible/Filesvisible.txt', 'Content of file', { overwrite: false })
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
async function cleanupDirectoryStructure() {
  await rimraf('./testDir')
}
