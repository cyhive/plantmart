import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let text = readFileSync(p, 'utf8');

const start = text.indexOf('          {/* Seller Details Section */}');
const end = text.indexOf('      {/* Checkout Preview Overlay */}');
if (start === -1 || end === -1) {
  throw new Error(`markers not found start=${start} end=${end}`);
}

const replacement = `                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      `;

text = text.slice(0, start) + replacement + text.slice(end);
writeFileSync(p, text, 'utf8');
console.log('patched');
