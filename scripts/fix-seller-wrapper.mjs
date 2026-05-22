import { readFileSync, writeFileSync } from 'fs';

const p = 'app/seller/products/page.tsx';
const lines = readFileSync(p, 'utf8').split(/\r?\n/);

const idx = lines.findIndex((l) => l.includes('Plant photo') && l.includes('optional'));
if (idx < 0) throw new Error('label not found');

if (lines[idx - 1]?.includes('col-span-2')) {
  console.log('wrapper already present');
  process.exit(0);
}

lines.splice(idx, 0, '                    <div className="space-y-2 col-span-2">');
writeFileSync(p, lines.join('\r\n'));
console.log('added wrapper');
