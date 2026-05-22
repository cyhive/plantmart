import { readFileSync, writeFileSync } from 'fs';

const p = 'app/seller/products/page.tsx';
const lines = readFileSync(p, 'utf8').split(/\r?\n/);

const urlLabelIdx = lines.findIndex((l) => l.includes('Image URL (https)'));
if (urlLabelIdx < 0) {
  console.log('URL section already updated');
  process.exit(0);
}

let blockStart = urlLabelIdx;
while (blockStart > 0 && !lines[blockStart].includes('col-span-2')) blockStart--;

let blockEnd = urlLabelIdx;
while (blockEnd < lines.length && !lines[blockEnd].includes('Plant Image')) blockEnd++;

lines.splice(blockStart, blockEnd - blockStart);

const plantIdx = lines.findIndex((l) => l.includes('Plant Image'));
if (plantIdx >= 0) {
  lines[plantIdx] =
    '                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Plant photo <span className="text-slate-300 font-semibold normal-case">(optional)</span></label>';
}

const descIdx = lines.findIndex((l, i) => i > plantIdx && l.includes('Description</label>'));
let insertAt = descIdx - 1;
while (insertAt > 0 && lines[insertAt].trim() !== '</div>') insertAt--;

const extra = [
  '                      <p className="text-[10px] text-slate-400 font-medium">',
  '                        Upload a photo or skip. A default image is used if you add none.',
  '                      </p>',
  '                      <details className="rounded-2xl bg-slate-50/80 px-4 py-3">',
  '                        <summary className="text-[10px] font-bold text-slate-500 cursor-pointer list-none">',
  '                          Optional: paste an image link instead',
  '                        </summary>',
  '                        <input',
  '                          type="text"',
  "                          value={formData.images[0] ?? ''}",
  '                          onChange={(e) =>',
  '                            setFormData((prev) => ({',
  '                              ...prev,',
  '                              images: [e.target.value],',
  '                            }))',
  '                          }',
  '                          className="mt-3 w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all"',
  '                          placeholder="Image link (not required)"',
  '                        />',
  '                      </details>',
];

lines.splice(insertAt, 0, ...extra);
writeFileSync(p, lines.join('\r\n'));
console.log('done');
