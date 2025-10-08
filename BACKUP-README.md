# Blog Backup Script

This repository includes a backup Node.js script (`main-backup.js`) that provides a simple way to access and display blog content without the Next.js framework.

## Features

- 📖 Reads and displays all blog posts from the `posts/` directory
- 🔍 Parses MDX frontmatter (title, date, description, etc.)
- 📅 Sorts posts by date (newest first)
- 🎨 Provides formatted console output with post previews
- 🛠️ Works with or without external dependencies
- 🔧 Supports environment variable configuration
- 📋 Includes comprehensive test suite

## Usage

### Basic Execution

```bash
# Run the backup script directly
node main-backup.js

# Or use the npm script
npm run backup
```

### Command Line Options

```bash
# Show help information
node main-backup.js --help

# Show version information
node main-backup.js --version
```

### Environment Variables

You can customize the blog information using environment variables:

```bash
# Set custom blog information
BLOG_NAME="John Doe" BLOG_TITLE="My Awesome Blog" node main-backup.js

# Or export them
export BLOG_NAME="Jane Smith"
export BLOG_TITLE="Tech Blog"
export BLOG_FOOTER_TEXT="© 2024 Jane Smith"
node main-backup.js
```

## Testing

The script includes a comprehensive test suite:

```bash
# Run all tests
node main-backup.test.js

# Or use the npm script
npm run test:backup

# Verify functionality
npm run verify:backup
```

## Script Structure

### Main Functions

- `getGlobalData()` - Retrieves blog configuration from environment variables
- `getPostFilePaths()` - Gets list of MDX files in the posts directory
- `getPosts()` - Reads and parses all blog posts
- `sortPostsByDate()` - Sorts posts by publication date
- `displayPost()` - Formats and displays a single post
- `main()` - Main execution function

### Dependencies

The script is designed to work with minimal dependencies:

- **Required**: Node.js built-in modules (`fs`, `path`)
- **Optional**: `gray-matter` (for advanced frontmatter parsing)
- **Fallback**: Built-in simple frontmatter parser

## Output Format

The script displays posts in the following format:

```
🚀 Blog Backup Script Starting...

📚 Blog: Next.js Blog Theme
👤 Author: Jay Doe
📜 Footer: All rights reserved.

✅ Found 5 post(s):

============================================================
POST #1: Next.js Blog Theme Style Guide
============================================================
📅 Date: 2025-01-06
📝 Description: A style guide for a website...
📄 File: example-post-1.mdx

📖 Content Preview (first 200 chars):
----------------------------------------
A style guide for a website is a set of design standards...

============================================================
🎉 Blog backup script completed successfully!
📊 Total posts processed: 5
============================================================
```

## Error Handling

The script includes robust error handling for:

- Missing posts directory
- Malformed MDX files
- Invalid frontmatter
- File system permissions
- Missing dependencies

## Integration

The backup script is designed to work alongside the main Next.js application without conflicts:

- Uses the same posts directory structure
- Compatible with existing MDX files
- Doesn't modify any existing files
- Can be run independently of the Next.js server

## Files

- `main-backup.js` - Main backup script
- `main-backup.test.js` - Comprehensive test suite
- `verify-backup.js` - Simple verification script
- `run-test.js` - Execution test script

## Contributing

When modifying the backup script:

1. Run the test suite to ensure functionality
2. Update tests for new features
3. Verify compatibility with existing posts
4. Test both with and without external dependencies

## License

Same as the main project (MIT License).