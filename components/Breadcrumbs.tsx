'use client';

import React from 'react';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs = React.memo(function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex mb-8 overflow-x-auto no-scrollbar py-2" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 whitespace-nowrap">
        <li>
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-600 transition-colors group"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-emerald-50 transition-colors">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-slate-300" />
            {item.href ? (
              <Link 
                href={item.href}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-xs font-black uppercase tracking-widest text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100/50">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});

