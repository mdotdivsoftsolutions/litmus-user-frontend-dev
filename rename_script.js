/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function replaceInFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file === 'node_modules' || file === '.next') continue;
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('@/pages/')) {
                content = content.replace(/@\/pages\//g, '@/views/');
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

try {
    const pagesDir = path.join(dir, 'pages');
    const viewsDir = path.join(dir, 'views');
    if (fs.existsSync(pagesDir)) {
        // Move contents from pages to views
        const pagesContents = fs.readdirSync(pagesDir);
        for (const item of pagesContents) {
            const srcPath = path.join(pagesDir, item);
            const destPath = path.join(viewsDir, item);
            if (!fs.existsSync(destPath)) {
                fs.renameSync(srcPath, destPath);
            }
        }
        // Remove empty pages directory
        const remaining = fs.readdirSync(pagesDir);
        if (remaining.length === 0) {
            fs.rmdirSync(pagesDir);
        }
        console.log('Moved pages to views');
    }
} catch (e) {
    console.error('Failed to move pages to views. Error: ' + e.message);
}

replaceInFiles(dir);
