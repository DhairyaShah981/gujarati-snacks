const { execSync } = require('child_process');

// Log Node.js version
console.log('Node.js version:', process.version);

// Run the build command
console.log('Building the application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!'); 