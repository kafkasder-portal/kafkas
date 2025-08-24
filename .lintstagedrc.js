module.exports = {
  // Lint and fix JavaScript/TypeScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // Format JSON, CSS, and Markdown files
  '*.{json,css,md}': [
    'prettier --write',
  ],
  
  // Run tests for changed files
  '*.{js,jsx,ts,tsx}': [
    'jest --bail --findRelatedTests',
  ],
};
