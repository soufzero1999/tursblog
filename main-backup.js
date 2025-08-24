#!/usr/bin/env node

/**
 * main-backup.js - A backup Node.js script to display blog content
 * This script can be executed with: node main-backup.js
 * It provides a simple way to access blog posts without the Next.js framework
 */

const fs = require('fs');
const path = require('path');

// Simple frontmatter parser (fallback if gray-matter is not available)
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: content };
  }
  
  const frontmatterText = match[1];
  const bodyContent = match[2];
  const data = {};
  
  // Parse simple YAML-like frontmatter
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle multi-line values (basic support)
      if (value.startsWith('>-')) {
        value = value.substring(2).trim();
      }
      
      data[key] = value;
    }
  });
  
  return { data, content: bodyContent };
}

// Try to use gray-matter if available, fallback to simple parser
let matter;
try {
  matter = require('gray-matter');
} catch (error) {
  console.log('📝 Note: gray-matter not found, using built-in parser');
  matter = parseFrontmatter;
}

// Configuration
const POSTS_PATH = path.join(__dirname, 'posts');

// Get global data (similar to utils/global-data.js)
function getGlobalData() {
  const name = process.env.BLOG_NAME || 'Jay Doe';
  const blogTitle = process.env.BLOG_TITLE || 'Next.js Blog Theme';
  const footerText = process.env.BLOG_FOOTER_TEXT || 'All rights reserved.';

  return {
    name,
    blogTitle,
    footerText,
  };
}

// Get all post file paths
function getPostFilePaths() {
  try {
    return fs
      .readdirSync(POSTS_PATH)
      .filter((path) => /\.mdx?$/.test(path));
  } catch (error) {
    console.error('Error reading posts directory:', error.message);
    return [];
  }
}

// Sort posts by date
function sortPostsByDate(posts) {
  return posts.sort((a, b) => {
    const aDate = new Date(a.data.date);
    const bDate = new Date(b.data.date);
    return bDate - aDate;
  });
}

// Get all posts
function getPosts() {
  const postFilePaths = getPostFilePaths();
  
  let posts = postFilePaths.map((filePath) => {
    try {
      const source = fs.readFileSync(path.join(POSTS_PATH, filePath), 'utf8');
      const { content, data } = matter(source);

      return {
        content,
        data,
        filePath,
      };
    } catch (error) {
      console.error(`Error reading post ${filePath}:`, error.message);
      return null;
    }
  }).filter(Boolean);

  return sortPostsByDate(posts);
}

// Display a single post
function displayPost(post, index) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`POST #${index + 1}: ${post.data.title || 'Untitled'}`);
  console.log(`${'='.repeat(60)}`);
  
  if (post.data.date) {
    console.log(`📅 Date: ${post.data.date}`);
  }
  
  if (post.data.description) {
    console.log(`📝 Description: ${post.data.description}`);
  }
  
  console.log(`📄 File: ${post.filePath}`);
  
  if (post.content) {
    console.log(`\n📖 Content Preview (first 200 chars):`);
    console.log('-'.repeat(40));
    const preview = post.content.substring(0, 200).replace(/\n/g, ' ');
    console.log(preview + (post.content.length > 200 ? '...' : ''));
  }
}

// Main function
function main() {
  console.log('🚀 Blog Backup Script Starting...\n');
  
  const globalData = getGlobalData();
  
  console.log(`📚 Blog: ${globalData.blogTitle}`);
  console.log(`👤 Author: ${globalData.name}`);
  console.log(`📜 Footer: ${globalData.footerText}`);
  
  const posts = getPosts();
  
  if (posts.length === 0) {
    console.log('\n❌ No posts found in the posts directory.');
    return;
  }
  
  console.log(`\n✅ Found ${posts.length} post(s):`);
  
  posts.forEach((post, index) => {
    displayPost(post, index);
  });
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('🎉 Blog backup script completed successfully!');
  console.log(`📊 Total posts processed: ${posts.length}`);
  console.log(`${'='.repeat(60)}\n`);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📖 Blog Backup Script Help
${'='.repeat(30)}

Usage: node main-backup.js [options]

Options:
  --help, -h     Show this help message
  --version, -v  Show version information

Environment Variables:
  BLOG_NAME        Set the blog author name
  BLOG_TITLE       Set the blog title
  BLOG_FOOTER_TEXT Set the footer text

Examples:
  node main-backup.js
  BLOG_NAME="John Doe" node main-backup.js
  BLOG_TITLE="My Awesome Blog" node main-backup.js
`);
  process.exit(0);
}

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log('Blog Backup Script v1.0.0');
  process.exit(0);
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = {
  getGlobalData,
  getPosts,
  getPostFilePaths,
  sortPostsByDate,
  displayPost,
  main
};