import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let t = readFileSync(p, 'utf8');
const cd = '</' + 'div>';
const cmd = '</' + 'motion.div>';
const cmb = '</' + 'motion.button>';

t = t.replace(`Premium Specimen\r\n              ${cmd}`, `Premium Specimen\r\n              ${cd}`);
t = t.replace('italic">"{review.comment}"</p>', 'italic">&quot;{review.comment}&quot;</p>');
t = t.replace(`${cmb}\r\n          \r\n          <motion.button`, `</button>\r\n          \r\n          <motion.button`);
t = t.replace(`        ${cmd}\r\n      ${cmd}\r\n    ${cd}\r\n  );`, `        ${cd}\r\n      ${cd}\r\n    ${cd}\r\n  );`);

t = t.replace(
  `                      ${cd}\r\n\r\n            <div className="space-y-6">`,
  `                      ${cd}\r\n                    ${cd}\r\n\r\n                    <div className="space-y-6">`
);

const sellerStart = t.indexOf('          {/* Seller Details Section */}');
const checkoutStart = t.indexOf('      {/* Checkout Preview Overlay */}');
if (sellerStart === -1 || checkoutStart === -1) throw new Error('markers not found');

const panelClose =
  `                    ${cd}\r\n                  ${cd}\r\n                )}\r\n\r\n              ${cmd}\r\n            </AnimatePresence>\r\n          ${cd}\r\n        ${cd}\r\n      ${cd}\r\n\r\n`;

t = t.replace(
  `            ${cd}\r\n          ${cd}\r\n\r\n          {/* Seller Details Section */}`,
  panelClose + '          {/* Seller Details Section */}'
);

t = t.slice(0, sellerStart) + t.slice(checkoutStart);

writeFileSync(p, t);
console.log('patched');
