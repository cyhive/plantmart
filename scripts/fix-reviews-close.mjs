import { readFileSync, writeFileSync } from 'fs';

const p = 'app/plants/[id]/page.tsx';
let t = readFileSync(p, 'utf8');

const bad = `                </div>
              ))}
              <button className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors border-2 border-slate-100 rounded-2xl hover:border-slate-200 border-dashed cursor-pointer">
                Load More Reviews
              </button>
            </div>
          </div>

                )}`;

const good = `                        </motion.div>
                      ))}
                      <button type="button" className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors border-2 border-slate-100 rounded-2xl hover:border-slate-200 border-dashed cursor-pointer">
                        Load More Reviews
                      </button>
                    </motion.div>
                  </motion.div>
                )}`;

if (!t.includes(bad)) {
  console.error('bad block not found');
  const i = t.indexOf('Load More Reviews');
  console.error('context', JSON.stringify(t.slice(i - 200, i + 120)));
  process.exit(1);
}

t = t.replace(bad, good);
t = t.replace('      </motion.div>\n    </motion.div>\n  );\n}', '      </motion.div>\n    </motion.div>\n  );\n}');

writeFileSync(p, t);
console.log('ok');
