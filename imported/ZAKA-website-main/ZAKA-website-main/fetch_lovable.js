import https from 'https';
import fs from 'fs';

https.get('https://autonomous-layer-control.lovable.app', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('lovable.html', data);
    console.log('Saved to lovable.html');
  });
}).on('error', (err) => {
  console.error(err);
});
