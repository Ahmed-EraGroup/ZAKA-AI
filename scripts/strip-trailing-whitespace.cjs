const { execSync } = require('child_process');
const fs = require('fs');

function unique(arr){ return [...new Set(arr.filter(Boolean))]; }

let staged = '';
let unstaged = '';
try{
  staged = execSync('git diff --name-only --staged', { encoding: 'utf8' });
}catch(e){ staged = ''; }
try{
  unstaged = execSync('git diff --name-only', { encoding: 'utf8' });
}catch(e){ unstaged = ''; }

let files = unique((staged + '\n' + unstaged).split(/\r?\n/));
if(files.length === 0){ console.log('No staged or unstaged changed files found.'); process.exit(0); }

for(const f of files){
  if(!f) continue;
  // skip deleted files
  if(!fs.existsSync(f)) continue;
  try{
    let content = fs.readFileSync(f, 'utf8');
    let fixed = content.replace(/[ \t]+$/mg, '');
    if(fixed !== content){
      fs.writeFileSync(f, fixed, 'utf8');
      console.log('Stripped trailing whitespace:', f);
    }
  }catch(e){
    // binary or unreadable file
    continue;
  }
}
console.log('Done.');
