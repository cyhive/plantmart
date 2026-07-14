const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

const insertContent = `      {/* Categories Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">Explore Categories</h2>
            <p className="text-slate-600 text-base md:text-xl font-medium">Find the perfect match for your space</p>
          </div>
          <Link href="/plants" className="inline-flex items-center gap-3 text-emerald-600 font-bold hover:gap-5 transition-all text-lg">
            Browse All Collection <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
          {categories.map((cat, i) => (
            <Link href={\`/plants?category=\${cat.slug}\`} key={cat.name} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="glass p-6 md:p-10 rounded-[32px] md:rounded-[48px] text-center cursor-pointer transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] border-white/40 relative z-10 overflow-hidden">
                  {/* Accent Glow */}
                  <div className={\`absolute -top-10 -right-10 w-32 h-32 \${cat.color} opacity-20 blur-[40px] group-hover:opacity-40 transition-opacity duration-500\`} />

                  <div className="relative z-20 space-y-4 md:space-y-6">
                    <div className={\`w-16 h-16 md:w-24 md:h-24 mx-auto \${cat.color} rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-5xl shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500\`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base md:text-xl tracking-tight">{cat.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-2 opacity-60 group-hover:opacity-100 transition-opacity">{cat.count}+ Varieties</p>
                    </div>
                  </div>
                </div>

                {/* Shadow/Glow effect behind the card */}`;

lines.splice(367, 0, insertContent);

fs.writeFileSync(file, lines.join('\n'));
console.log('Categories section restored!');
