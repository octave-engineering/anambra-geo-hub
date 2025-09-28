import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

// Convert the current file's URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your build directory
const buildDir = path.join(__dirname, 'dist'); 

function removeLovableAttributes(htmlFile) {
  const filePath = path.join(buildDir, htmlFile);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const htmlContent = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const elements = document.querySelectorAll('[data-lov-id]');

  if (elements.length > 0) {
    elements.forEach(element => {
      element.removeAttribute('data-lov-id');
    });
    fs.writeFileSync(filePath, dom.serialize());
    console.log(`Cleaned up ${elements.length} Lovable attributes in: ${htmlFile}`);
  } else {
    console.log(`No attributes found in: ${htmlFile}`);
  }
}

fs.readdir(buildDir, (err, files) => {
  if (err) {
    console.error('Error reading the build directory. Did you run the build command first?');
    return;
  }

  const htmlFiles = files.filter(file => file.endsWith('.html'));
  if (htmlFiles.length > 0) {
    htmlFiles.forEach(file => {
      removeLovableAttributes(file);
    });
  } else {
    console.log('No HTML files found in the build directory. Cleanup skipped.');
  }
});