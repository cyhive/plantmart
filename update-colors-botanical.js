const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Promotions (currently bg-emerald-100) -> keep as bg-emerald-100 or maybe bg-emerald-50
content = content.replace('className="bg-emerald-100 py-16 md:py-24"', 'className="bg-emerald-50 py-16 md:py-24"');

// Catalog Products (currently bg-sky-100) -> bg-stone-100 (Earthy)
content = content.replace('className="bg-sky-100 py-16 md:py-24"', 'className="bg-stone-100 py-16 md:py-24"');

// Features (currently bg-violet-100) -> bg-teal-50 (Soft seafoam)
content = content.replace('className="bg-violet-100 py-16 md:py-24"', 'className="bg-teal-50 py-16 md:py-24"');

// Categories (currently bg-teal-100) -> bg-lime-50 (Fresh pale green)
content = content.replace('className="bg-teal-100 py-16 md:py-24"', 'className="bg-lime-50 py-16 md:py-24"');

// Top Nurseries (currently bg-amber-100) -> bg-orange-50 (Terracotta)
content = content.replace('className="bg-amber-100 py-16 md:py-24"', 'className="bg-orange-50 py-16 md:py-24"');

// Testimonials (currently bg-rose-100) -> bg-emerald-100/50
content = content.replace('className="bg-rose-100 py-16 md:py-24"', 'className="bg-emerald-100/50 py-16 md:py-24"');

// Newsletter (currently bg-fuchsia-100) -> bg-stone-50
content = content.replace('className="bg-fuchsia-100 py-16 md:py-24"', 'className="bg-stone-50 py-16 md:py-24"');

fs.writeFileSync(file, content);
console.log('Botanical pastel colors applied!');
