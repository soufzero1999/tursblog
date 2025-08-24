#!/usr/bin/env node

/**
 * run-test.js - Simple script to test main-backup.js execution
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Testing main-backup.js execution...\n');

// Test 1: Run main-backup.js
console.log('📋 Test 1: Running main-backup.js');
console.log('=' .repeat(50));

const mainBackupPath = path.join(__dirname, 'main-backup.js');
const child = spawn('node', [mainBackupPath], {
  stdio: 'inherit',
  cwd: __dirname
});

child.on('close', (code) => {
  console.log(`\n📊 main-backup.js exited with code: ${code}`);
  
  if (code === 0) {
    console.log('✅ main-backup.js executed successfully!');
  } else {
    console.log('❌ main-backup.js failed to execute properly');
  }
  
  // Test 2: Run help command
  console.log('\n📋 Test 2: Testing --help flag');
  console.log('=' .repeat(50));
  
  const helpChild = spawn('node', [mainBackupPath, '--help'], {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  helpChild.on('close', (helpCode) => {
    console.log(`\n📊 main-backup.js --help exited with code: ${helpCode}`);
    
    // Test 3: Run version command
    console.log('\n📋 Test 3: Testing --version flag');
    console.log('=' .repeat(50));
    
    const versionChild = spawn('node', [mainBackupPath, '--version'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    versionChild.on('close', (versionCode) => {
      console.log(`\n📊 main-backup.js --version exited with code: ${versionCode}`);
      
      console.log('\n🎉 All execution tests completed!');
      console.log('=' .repeat(50));
      
      if (code === 0 && helpCode === 0 && versionCode === 0) {
        console.log('✅ All tests passed!');
        process.exit(0);
      } else {
        console.log('❌ Some tests failed');
        process.exit(1);
      }
    });
  });
});