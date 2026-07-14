const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Promotions: keep bg-emerald-50 (green pastel)

// Catalog Products
content = content.replace('className="bg-stone-100 py-16 md:py-24"', 'className="bg-white py-16 md:py-24"');

// Features
content = content.replace('className="bg-teal-50 py-16 md:py-24"', 'className="bg-emerald-100/50 py-16 md:py-24"');

// Categories
content = content.replace('className="bg-lime-50 py-16 md:py-24"', 'className="bg-white py-16 md:py-24"');

// Top Nurseries
content = content.replace('className="bg-orange-50 py-16 md:py-24"', 'className="bg-green-50 py-16 md:py-24"');

// Testimonials
content = content.replace('className="bg-emerald-100/50 py-16 md:py-24"', 'className="bg-white py-16 md:py-24"');

// Newsletter
content = content.replace('className="bg-stone-50 py-16 md:py-24"', 'className="bg-emerald-50 py-16 md:py-24"');

fs.writeFileSync(file, content);
console.log('Green and white combination applied!');
