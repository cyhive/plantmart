import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let t = readFileSync(p, 'utf8');

const d = '</' + 'div>';
const md = '</' + 'motion.div>';

t = t.replace(
  `                ${d}\r\n              ))}\r\n              <button className="w-full py-4`,
  `                        ${md}\r\n                      ))}\r\n                      <button type="button" className="w-full py-4`
);

t = t.replace(
  `            ${d}\r\n          ${d}\r\n\r\n                )}`,
  `                    ${d}\r\n                  ${d}\r\n                )}`
);

t = t.replace(
  `      ${md}\r\n    ${d}\r\n  );\r\n}`,
  `      ${d}\r\n    ${d}\r\n  );\r\n}`
);

writeFileSync(p, t);
console.log('patched');
