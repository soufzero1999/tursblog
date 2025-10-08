#!/usr/bin/env node

/**
 * main-backup.test.js - Test file for main-backup.js
 * Run with: node main-backup.test.js
 */

const fs = require('fs');
const path = require('path');

// Import the functions from main-backup.js
const {
  getGlobalData,
  getPosts,
  getPostFilePaths,
  sortPostsByDate,
  displayPost
} = require('./main-backup.js');

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  assertNotNull(value, message) {
    if (value === null || value === undefined) {
      throw new Error(message || 'Value should not be null or undefined');
    }
  }

  async run() {
    console.log('🧪 Running tests for main-backup.js\n');
    
    for (const { name, testFn } of this.tests) {
      try {
        await testFn.call(this);
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Total: ${this.passed + this.failed}`);
    
    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

// Create test runner instance
const runner = new TestRunner();

// Test getGlobalData function
runner.test('getGlobalData returns default values', function() {
  const globalData = getGlobalData();
  
  this.assertNotNull(globalData, 'Global data should not be null');
  this.assertNotNull(globalData.name, 'Name should not be null');
  this.assertNotNull(globalData.blogTitle, 'Blog title should not be null');
  this.assertNotNull(globalData.footerText, 'Footer text should not be null');
  
  // Test default values
  this.assertEqual(globalData.name, 'Jay Doe', 'Default name should be Jay Doe');
  this.assertEqual(globalData.blogTitle, 'Next.js Blog Theme', 'Default blog title should be Next.js Blog Theme');
  this.assertEqual(globalData.footerText, 'All rights reserved.', 'Default footer text should be All rights reserved.');
});

// Test getGlobalData with environment variables
runner.test('getGlobalData respects environment variables', function() {
  // Set environment variables
  process.env.BLOG_NAME = 'Test Author';
  process.env.BLOG_TITLE = 'Test Blog';
  process.env.BLOG_FOOTER_TEXT = 'Test Footer';
  
  const globalData = getGlobalData();
  
  this.assertEqual(globalData.name, 'Test Author', 'Should use environment variable for name');
  this.assertEqual(globalData.blogTitle, 'Test Blog', 'Should use environment variable for blog title');
  this.assertEqual(globalData.footerText, 'Test Footer', 'Should use environment variable for footer text');
  
  // Clean up environment variables
  delete process.env.BLOG_NAME;
  delete process.env.BLOG_TITLE;
  delete process.env.BLOG_FOOTER_TEXT;
});

// Test getPostFilePaths function
runner.test('getPostFilePaths returns MDX files', function() {
  const filePaths = getPostFilePaths();
  
  this.assert(Array.isArray(filePaths), 'Should return an array');
  this.assert(filePaths.length > 0, 'Should find at least one post file');
  
  // Check that all files are MDX files
  filePaths.forEach(filePath => {
    this.assert(/\.mdx?$/.test(filePath), `${filePath} should be an MDX file`);
  });
  
  // Check for expected example posts
  this.assert(filePaths.includes('example-post-1.mdx'), 'Should include example-post-1.mdx');
});

// Test getPosts function
runner.test('getPosts returns parsed posts', function() {
  const posts = getPosts();
  
  this.assert(Array.isArray(posts), 'Should return an array');
  this.assert(posts.length > 0, 'Should find at least one post');
  
  // Check structure of first post
  const firstPost = posts[0];
  this.assertNotNull(firstPost.data, 'Post should have data property');
  this.assertNotNull(firstPost.content, 'Post should have content property');
  this.assertNotNull(firstPost.filePath, 'Post should have filePath property');
  
  // Check that posts have required frontmatter fields
  this.assertNotNull(firstPost.data.title, 'Post should have a title');
  this.assertNotNull(firstPost.data.date, 'Post should have a date');
});

// Test sortPostsByDate function
runner.test('sortPostsByDate sorts posts correctly', function() {
  // Create test posts with different dates
  const testPosts = [
    { data: { date: '2023-01-01' }, content: 'Post 1', filePath: 'post1.mdx' },
    { data: { date: '2023-12-31' }, content: 'Post 2', filePath: 'post2.mdx' },
    { data: { date: '2023-06-15' }, content: 'Post 3', filePath: 'post3.mdx' }
  ];
  
  const sortedPosts = sortPostsByDate([...testPosts]);
  
  this.assertEqual(sortedPosts.length, 3, 'Should maintain all posts');
  this.assertEqual(sortedPosts[0].data.date, '2023-12-31', 'Most recent post should be first');
  this.assertEqual(sortedPosts[2].data.date, '2023-01-01', 'Oldest post should be last');
});

// Test displayPost function (capture console output)
runner.test('displayPost formats output correctly', function() {
  const testPost = {
    data: {
      title: 'Test Post',
      date: '2023-01-01',
      description: 'Test description'
    },
    content: 'This is test content for the post.',
    filePath: 'test-post.mdx'
  };
  
  // Capture console output
  const originalLog = console.log;
  const logOutput = [];
  console.log = (...args) => logOutput.push(args.join(' '));
  
  try {
    displayPost(testPost, 0);
    
    // Restore console.log
    console.log = originalLog;
    
    // Check that output contains expected elements
    const output = logOutput.join('\n');
    this.assert(output.includes('Test Post'), 'Output should contain post title');
    this.assert(output.includes('2023-01-01'), 'Output should contain post date');
    this.assert(output.includes('Test description'), 'Output should contain post description');
    this.assert(output.includes('test-post.mdx'), 'Output should contain file path');
    
  } finally {
    console.log = originalLog;
  }
});

// Test file system error handling
runner.test('handles missing posts directory gracefully', function() {
  // Temporarily rename posts directory to simulate missing directory
  const postsPath = path.join(__dirname, 'posts');
  const tempPath = path.join(__dirname, 'posts_temp');
  
  try {
    if (fs.existsSync(postsPath)) {
      fs.renameSync(postsPath, tempPath);
    }
    
    // This should not throw an error, but return empty array
    const filePaths = getPostFilePaths();
    this.assert(Array.isArray(filePaths), 'Should return an array even when directory is missing');
    this.assertEqual(filePaths.length, 0, 'Should return empty array when directory is missing');
    
  } finally {
    // Restore posts directory
    if (fs.existsSync(tempPath)) {
      fs.renameSync(tempPath, postsPath);
    }
  }
});

// Run all tests
if (require.main === module) {
  runner.run().catch(console.error);
}

module.exports = TestRunner;