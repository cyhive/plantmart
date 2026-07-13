const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(appDir, function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('<img ')) {
    // 1. Replace <img src="..." alt="..." className="..." /> with <Image src="..." alt="..." fill className="..." />
    // This is naive but works for our w-full h-full object-cover patterns mostly.
    // If it has w-full h-full, we remove them and add fill.
    
    // Simple naive replacement for <img ... />
    let newContent = content.replace(/<img\s([^>]+)>/g, (match, p1) => {
      // If it ends with />
      let attrs = p1;
      if (attrs.endsWith('/')) {
        attrs = attrs.slice(0, -1);
      }
      
      // Remove w-full h-full
      attrs = attrs.replace(/w-full\s+h-full\s+/g, '');
      attrs = attrs.replace(/w-full\s+h-full/g, '');
      
      // Let's just use width/height if we are not sure, or fill if there's no width/height
      // To be very safe, if it has a specific w- / h- like w-12 h-12, we should probably keep them
      // and use width={48} height={48} etc. But since we can't parse everything, let's just 
      // replace <img with <Image and add fill if we removed w-full h-full, else leave it.
      
      let isFill = false;
      if (match.includes('w-full') || match.includes('w-[') || match.includes('h-full') || match.includes('h-[')) {
         isFill = true; // most likely fill
         // We must ensure the parent has relative in manual review, but this is a bulk script.
         // Let's just inject `fill` if it has w-full h-full
         return `<Image ${attrs.trim()} fill />`;
      }
      
      // If it's something like w-12 h-12, let's add width={100} height={100} just to satisfy next/image,
      // it will be overridden by CSS w-12 h-12 anyway.
      return `<Image ${attrs.trim()} width={100} height={100} />`;
    });
    
    if (newContent !== content) {
       // Add import if not present
       if (!newContent.includes("import Image from 'next/image'")) {
         // find last import
         const lastImportMatch = [...newContent.matchAll(/^import .* from .*;?$/gm)].pop();
         if (lastImportMatch) {
            const idx = lastImportMatch.index + lastImportMatch[0].length;
            newContent = newContent.slice(0, idx) + "\nimport Image from 'next/image';" + newContent.slice(idx);
         } else {
            newContent = "import Image from 'next/image';\n" + newContent;
         }
       }
       
       fs.writeFileSync(filePath, newContent);
       console.log('Updated', filePath);
    }
  }
});
