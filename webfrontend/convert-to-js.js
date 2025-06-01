const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

function convertFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Remove type annotations
  let newContent = content
    .replace(/: React\.FC(\<.*?\>)?/g, '')
    .replace(/: string/g, '')
    .replace(/: number/g, '')
    .replace(/: boolean/g, '')
    .replace(/: any/g, '')
    .replace(/: void/g, '')
    .replace(/: React\.ReactNode/g, '')
    .replace(/: \{.*?\}/g, '')
    .replace(/interface .*?\{[\s\S]*?\}/g, '')
    .replace(/type .*? = .*?;/g, '')
    .replace(/import.*?from '.*?\.tsx?'/g, (match) => match.replace('.tsx', '.jsx').replace('.ts', '.js'))
    .replace(/export interface .*?\{[\s\S]*?\}/g, '');

  // Create new file path
  const newPath = filePath.replace(/\.tsx?$/, filePath.endsWith('.tsx') ? '.jsx' : '.js');
  
  // Write new file
  fs.writeFileSync(newPath, newContent);
  
  // Delete old file
  fs.unlinkSync(filePath);
  
  console.log(`Converted ${filePath} to ${newPath}`);
}

const srcPath = path.join(process.cwd(), 'src');
const files = walkDir(srcPath);

files.forEach(file => {
  convertFile(file);
}); 