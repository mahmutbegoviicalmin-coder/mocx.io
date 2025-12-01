const fs = require('fs');
const path = require('path');

function restoreFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Check if it looks like the corrupted JSON format
        // It should start with {"data": and end with } and be parseable as JSON
        if (content.trim().startsWith('{"data":')) {
             try {
                const json = JSON.parse(content);
                if (json.data && Object.keys(json).length === 1) {
                    const decoded = Buffer.from(json.data, 'base64').toString('utf8');
                    fs.writeFileSync(filePath, decoded);
                    console.log(`Restored: ${filePath}`);
                }
             } catch (e) {
                 // Not valid JSON or other error, ignore
             }
        } else if (content.trim().startsWith('{"data":') && content.includes('"name":')) {
             // Handle package.json specifically if it was partially restored or has other fields
             // But my previous manual fix for package.json should have handled it. 
             // The corrupted files seem to ONLY have "data".
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
                scanDirectory(fullPath);
            }
        } else {
            restoreFile(fullPath);
        }
    }
}

// Start scanning from current directory
scanDirectory('.');


