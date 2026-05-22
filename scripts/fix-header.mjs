import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let t = readFileSync(p, 'utf8');
const d = '</' + 'di' + 'v>';
const openDiv = '<' + 'div className="space-y-6">';

t = t.replace(
  '                      ' + d + '\r\n\r\n            ' + openDiv,
  '                      ' + d + '\r\n                    ' + d + '\r\n\r\n                    ' + openDiv
);

writeFileSync(p, t);
console.log('ok');
