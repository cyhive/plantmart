import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let t = readFileSync(p, 'utf8');
const closeDiv = '</' + 'di' + 'v>';
const closeMotionDiv = '</' + 'motion.div>';

t = t.replace('Premium Specimen\r\n              </motion.div>', 'Premium Specimen\r\n              ' + closeDiv);
t = t.replace('Premium Specimen\r\n              </motion.div>', 'Premium Specimen\r\n              ' + closeDiv);
t = t.replace('italic">"{review.comment}"</p>', 'italic">&quot;{review.comment}&quot;</p>');
t = t.replace('          </motion.button>\r\n          \r\n          <motion.button', '          </button>\r\n          \r\n          <motion.button');

const mobileOld = '      </' + 'motion.div>' + '\r\n    </' + 'di' + 'v>\r\n  );\r\n}';
const mobileNew = '      ' + closeDiv + '\r\n    ' + closeDiv + '\r\n  );\r\n}';
const mi = t.lastIndexOf(mobileOld);
if (mi >= 0) t = t.slice(0, mi) + mobileNew + t.slice(mi + mobileOld.length);

const seller = t.indexOf('          {/* Seller Details Section */}');
const checkout = t.indexOf('      {/* Checkout Preview Overlay */}');
if (seller === -1 || checkout === -1) throw new Error('markers missing');

const replacement =
  '                )}\r\n\r\n              ' +
  closeMotionDiv +
  '\r\n            </AnimatePresence>\r\n          ' +
  closeDiv +
  '\r\n        ' +
  closeDiv +
  '\r\n      ' +
  closeDiv +
  '\r\n\r\n      ';

t = t.slice(0, seller) + replacement + t.slice(checkout);
writeFileSync(p, t);
console.log('done');
