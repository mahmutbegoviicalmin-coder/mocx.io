const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = 'lR1ZwYhc3quvk8pHKD6nRBXi';
const DEPLOYMENT_ID_OR_URL = '3kyMNamGGJQwTwpvhpEuvRqXcmsL'; 

const HEADERS = {
  'Authorization': `Bearer ${TOKEN}`,
};

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: HEADERS }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON'));
          }
        } else {
          reject(new Error(`Request failed: ${res.statusCode} ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: HEADERS }, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  try {
    console.log('Fetching deployment...');
    let deployment;
    try {
        deployment = await fetchJson(`https://api.vercel.com/v13/deployments/dpl_${DEPLOYMENT_ID_OR_URL}`);
    } catch (e) {
        console.log('Failed to find deployment.');
        return;
    }

    console.log(`Found deployment: ${deployment.url}`);
    
    console.log('Fetching file list...');
    const files = await fetchJson(`https://api.vercel.com/v6/deployments/${deployment.id}/files`);
    
    const targetDir = path.join(__dirname, 'restored_source');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    console.log(`Found ${files.length} entries.`);

    for (const file of files) {
      // file structure: { name: '...', type: 'directory' | 'file', uid: '...', children: [...] }
      // Wait, the v6 endpoint returns a flat list or a tree?
      // If it returns a tree (which 'src' suggests), I need to traverse it.
      
      // Let's inspect the first level.
      console.log(`Entry: ${file.name} (${file.type})`);
      
      if (file.type === 'directory') {
          // If it's a directory, we need to fetch its contents? 
          // Or does Vercel provide a recursive flat list?
          // The endpoint documentation says it returns a list of files.
          // If it returns top-level only, I need to recurse.
          // However, usually source retrieval involves `v6/deployments/{id}/files` returning the whole tree?
          // Let's assume I need to handle recursion if `children` exists or `type` is directory.
      }
    }
    
    // If the list is just top level, I need to rewrite this to recurse.
    // Since I can't easily debug interactively, I'll write a recursive downloader.
    
    async function processEntry(entry, currentPath) {
        const fullPath = path.join(targetDir, currentPath, entry.name);
        
        if (entry.type === 'directory') {
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
            }
            if (entry.children) {
                for (const child of entry.children) {
                    await processEntry(child, path.join(currentPath, entry.name));
                }
            }
        } else {
            // File
            console.log(`Downloading ${path.join(currentPath, entry.name)}...`);
            await downloadFile(
                `https://api.vercel.com/v7/deployments/${deployment.id}/files/${entry.uid}`,
                fullPath
            );
        }
    }

    for (const file of files) {
        await processEntry(file, '');
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
