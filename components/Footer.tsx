'use client';

import Link from 'next/link';
import { Leaf, Facebook, Twitter, Instagram, Github, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import { usePathname } from 'next/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith('/admin');
  const isSellerPage = pathname?.startsWith('/seller');
  const isBecomeSellerPage = pathname === '/become-a-seller';

  if (isAdminPage || isSellerPage || isBecomeSellerPage) {
    return (
      <footer className="bg-[#0F172B] border-t border-white/5 py-6 text-center">
        <p className="text-xs text-slate-400 font-medium">
          © {currentYear} Pacha Bhoomi Dashboard. All rights reserved. 
          <span className="mx-2">•</span>
          <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
          <span className="mx-2">•</span>
          <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link>
        </p>
      </footer>
    );
  }

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'Indoor Plants', href: '/plants?category=indoor' },
        { name: 'Outdoor Plants', href: '/plants?category=outdoor' },
        { name: 'Succulents', href: '/plants?category=succulents' },
        { name: 'Pots & Tools', href: '/plants?category=pots' },
        { name: 'New Arrivals', href: '/plants' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/support' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Return Policy', href: '/returns' },
        { name: 'Track Order', href: '/track' },
        { name: 'Care Journal', href: '/care-journal' },
        { name: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Company',
      links: [
        // { name: 'Our Story', href: '/about' },
        { name: 'Verified Nurseries', href: '/sellers' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Careers', href: '/careers' },
        { name: 'Merchant Portal', href: '/seller' },
        
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 py-20 border-t border-white/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/Pachabhoomi footer.png" alt="Pacha Bhoomi" className="h-24 w-auto object-contain group-hover:scale-100 transition-transform duration-500  p-2 " />
            </Link>
            <p className="text-lg leading-relaxed max-w-sm">
              Connecting nature lovers with verified nurseries across India. 
              Our mission is to bring greenery to every home with care and sustainability.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Facebook className="w-7 h-7" />, href: '#' },
                { icon: <Twitter className="w-7 h-7" />, href: '#' },
                { icon: <Instagram className="w-7 h-7" />, href: '#' },
                { icon: <Github className="w-7 h-7" />, href: '#' },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-emerald-500 hover:text-white transition-all hover:-translate-y-1 border border-white/10"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-white font-bold text-lg tracking-tight">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="hover:text-emerald-400 transition-colors flex items-center group gap-2"
                    >
                      <ArrowRight className="w-0 h-4 group-hover:w-4 transition-all text-emerald-500" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-bold">Visit Us</p>
              <p className="text-sm">Green Avenue, Bangalore, KA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-bold">Call Anytime</p>
              <p className="text-sm">+91 80 1234 5678</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white font-bold">Email Support</p>
              <p className="text-sm">hello@pachabhoomi.in</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <p>© {currentYear} Pacha Bhoomi. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-white font-medium">Service Status: Normal</span>
            </div>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
