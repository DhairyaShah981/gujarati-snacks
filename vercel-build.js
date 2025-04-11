const { execSync } = require('child_process');

// Run the build command
console.log('Building the application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build completed successfully!'); 