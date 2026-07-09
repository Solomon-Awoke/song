const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'src', 'app', 'api', 'playlists', '[id]', 'route.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the problematic populate calls
// Replace the problematic populate calls - use regex to handle any whitespace
const regex = /\.populate\("songs", "titleAm titleEn slug lyricsAm category"\)\s*\.populate\("category", "nameAm nameEn slug"\)/;
const replacement = `.populate("songs", "titleAm titleEn slug lyricsAm lyricsEn category")\n    .lean()`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed!');
} else {
  console.log('⚠️ Pattern not found. Checking current content...');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('populate')) console.log(`Line ${i+1}: ${line.trim()}`);
  });
}
