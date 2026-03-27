const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dpath = path.join(dir, file);
    if (fs.statSync(dpath).isDirectory()) {
      if (!dpath.includes('node_modules') && !dpath.includes('.git') && !dpath.includes('dist')) {
        filelist = walkSync(dpath, filelist);
      }
    } else {
      if (
        (dpath.endsWith('.tsx') || dpath.endsWith('.ts') ||
        dpath.endsWith('.js') || dpath.endsWith('.jsx') ||
        dpath.endsWith('.html') || dpath.endsWith('.css') || dpath.endsWith('.md') || dpath.endsWith('.json')) &&
        !dpath.endsWith('package-lock.json') && !file.includes('rename.js')
      ) {
        filelist.push(dpath);
      }
    }
  }
  return filelist;
};

const map = [
  { search: /https:\/\/webappdevelopersofchicago\.vercel\.app/g, replace: 'https://www.developersofchicago.com' },
  { search: /Webapp Developers of Chicago/g, replace: 'Developers of Chicago' },
  { search: /Web App Developers of Chicago/g, replace: 'Developers of Chicago' },
  { search: /webapp Developers of Chicago/g, replace: 'developers of Chicago' },
  { search: /Webappdevelopersofchicago/g, replace: 'Developersofchicago' },
  { search: /webappdevelopersofchicago/g, replace: 'developersofchicago' },
  { search: /inquiry@wdc\.com/g, replace: 'inquiry@developersofchicago.com' },
  { search: /\bWDC\b/g, replace: 'DC' }
];

const files = walkSync(path.join(__dirname, '.'));
let changed = 0;

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  for (let rule of map) {
    content = content.replace(rule.search, rule.replace);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
    changed++;
  }
}

console.log(`Updated ${changed} files.`);
