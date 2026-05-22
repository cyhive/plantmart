import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let t = readFileSync(p, 'utf8');
const cd = '</' + 'di' + 'v>';
const cmd = '</' + 'motion.div>';

t = t.replace('Premium Specimen\r\n              ' + cd + '\r\n            ' + cmd, 'Premium Specimen\r\n              ' + cd + '\r\n            ' + cd);
t = t.replace('            </AnimatePresence>\r\n          ' + cmd + '\r\n        ', '            </AnimatePresence>\r\n          ' + cd + '\r\n        ');
t = t.replace('            {/* Checkout Preview Overlay */}', '      {/* Checkout Preview Overlay */}');

writeFileSync(p, t);
console.log('ok');
