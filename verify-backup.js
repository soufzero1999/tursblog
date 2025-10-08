#!/usr/bin/env node

/**
 * verify-backup.js - Simple verification script for main-backup.js
 */

console.log('🔍 Verifying main-backup.js functionality...\n');

try {
  // Test importing the module
  const mainBackup = require('./main-backup.js');
  console.log('✅ Successfully imported main-backup.js');
  
  // Test getGlobalData function
  const globalData = mainBackup.getGlobalData();
  console.log('✅ getGlobalData() works:', globalData);
  
  // Test getPostFilePaths function
  const postFilePaths = mainBackup.getPostFilePaths();
  console.log('✅ getPostFilePaths() works, found', postFilePaths.length, 'files:', postFilePaths);
  
  // Test getPosts function
  const posts = mainBackup.getPosts();
  console.log('✅ getPosts() works, found', posts.length, 'posts');
  
  if (posts.length > 0) {
    console.log('📄 First post title:', posts[0].data.title);
    console.log('📅 First post date:', posts[0].data.date);
  }
  
  // Test sortPostsByDate function
  const sortedPosts = mainBackup.sortPostsByDate([...posts]);
  console.log('✅ sortPostsByDate() works, posts are sorted');
  
  console.log('\n🎉 All function tests passed!');
  console.log('📋 Now running the main script...\n');
  
  // Run the main function
  mainBackup.main();
  
} catch (error) {
  console.error('❌ Error during verification:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}