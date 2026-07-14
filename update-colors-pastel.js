const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Promotions
content = content.replace('className="bg-emerald-950 py-16 md:py-24"', 'className="bg-emerald-100 py-16 md:py-24"');
content = content.replace('<h2 className="text-3xl font-display font-bold text-white tracking-tight">Exclusive Offers</h2>', '<h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Exclusive Offers</h2>');
content = content.replace('<p className="text-emerald-100/70 text-base font-medium">Grab these botanical deals before they vanish!</p>', '<p className="text-slate-600 text-base font-medium">Grab these botanical deals before they vanish!</p>');

// Catalog Products
content = content.replace('className="bg-slate-900 py-16 md:py-24"', 'className="bg-sky-100 py-16 md:py-24"');

// Features
content = content.replace('className="bg-slate-800 py-16 md:py-24"', 'className="bg-violet-100 py-16 md:py-24"');

// Categories
content = content.replace('className="bg-teal-950 py-16 md:py-24"', 'className="bg-teal-100 py-16 md:py-24"');
content = content.replace('<h2 className="text-5xl font-display font-bold text-white tracking-tight">Explore Categories</h2>', '<h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Explore Categories</h2>');
content = content.replace('<p className="text-teal-100/70 text-xl font-medium">Find the perfect match for your space</p>', '<p className="text-slate-600 text-xl font-medium">Find the perfect match for your space</p>');

// Top Nurseries
content = content.replace('className="bg-amber-950 py-16 md:py-24"', 'className="bg-amber-100 py-16 md:py-24"');
content = content.replace('<h2 className="text-5xl font-display font-bold text-white tracking-tight">Top Rated Nurseries</h2>', '<h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Top Rated Nurseries</h2>');
content = content.replace('<p className="text-amber-100/70 text-lg font-medium max-w-xl">Buying from local experts ensures you get plants adapted to your climate.</p>', '<p className="text-slate-600 text-lg font-medium max-w-xl">Buying from local experts ensures you get plants adapted to your climate.</p>');

// Testimonials
content = content.replace('className="bg-rose-950 py-16 md:py-24"', 'className="bg-rose-100 py-16 md:py-24"');
content = content.replace('<h2 className="text-5xl font-display font-bold text-white">What Our Gardeners Say</h2>', '<h2 className="text-5xl font-display font-bold text-slate-900">What Our Gardeners Say</h2>');
content = content.replace('<p className="text-rose-100/70 text-lg font-medium">Join 50,000+ happy plant parents</p>', '<p className="text-slate-600 text-lg font-medium">Join 50,000+ happy plant parents</p>');

// Newsletter
content = content.replace('className="bg-slate-950 py-16 md:py-24"', 'className="bg-fuchsia-100 py-16 md:py-24"');

fs.writeFileSync(file, content);
console.log('Pastel colors applied!');
