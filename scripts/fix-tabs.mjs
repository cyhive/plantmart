import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let t = readFileSync(p, 'utf8');
const d = '</' + 'div>';
const cmd = '</' + 'motion.div>';

t = t.replace('italic">"{review.comment}"</p>', 'italic">&quot;{review.comment}&quot;</p>');

t = t.replace(
  `                      ${d}\r\n\r\n            <div className="space-y-6">`,
  `                      ${d}\r\n                    ${d}\r\n\r\n                    <` + `div className="space-y-6">`
);

const insert = `                    ${d}\r\n                  ${d}\r\n                )}\r\n\r\n              ${cmd}\r\n            </AnimatePresence>\r\n          ${d}\r\n        ${d}\r\n      ${d}\r\n\r\n      `;

const seller = t.indexOf('          {/* Seller Details Section */}');
const checkout = t.indexOf('      {/* Checkout Preview Overlay */}');
if (seller === -1 || checkout === -1) throw new Error('markers missing');

t = t.replace(
  `            ${d}\r\n          ${d}\r\n\r\n          {/* Seller Details Section */}`,
  insert + '{/* Seller Details Section */}'
);

t = t.slice(0, seller) + t.slice(checkout);

writeFileSync(p, t);
console.log('tabs fixed');
