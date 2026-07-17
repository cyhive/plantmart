'use client';

import { motion } from 'motion/react';
import { 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Leaf, 
  Globe, 
  CheckCircle2, 
  Info,
  Package,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const shippingMethods = [
  {
    type: "Standard Shipping",
    time: "3-5 Business Days",
    price: "₹99 (Free above ₹1499)",
    description: "Our most popular option. Perfect for hardy plants and accessories.",
    icon: <Truck className="w-6 h-6" />
  },
  {
    type: "Priority Nursery Delivery",
    time: "1-2 Business Days",
    price: "₹249",
    description: "Direct from the nearest verified nursery to your door. Ideal for delicate specimen plants.",
    icon: <Clock className="w-6 h-6" />
  },
  {
    type: "Local Pickup",
    time: "Same Day",
    price: "Free",
    description: "Available at select heritage nurseries in major cities.",
    icon: <MapPin className="w-6 h-6" />
  }
];

const deliveryAreas = [
  "Bangalore", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai", 
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh"
];

const packagingFeatures = [
  {
    title: "Eco-Friendly Materials",
    description: "100% plastic-free, recycled cardboard and compostable cushioning.",
    icon: <Leaf className="w-8 h-8" />
  },
  {
    title: "Breathable Boxes",
    description: "Specialized ventilation holes to keep your botanical companions breathing during transit.",
    icon: <Package className="w-8 h-8" />
  },
  {
    title: "Secure Fastening",
    description: "Innovative internal bracing to prevent soil spill and structural damage.",
    icon: <ShieldCheck className="w-8 h-8" />
  }
];

export default function ShippingPage() {
  return (
    <div className="bg-[#92B031]/20 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden mesh-gradient">
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <div className="absolute inset-0 z-0">
          <Image src="/eco_plant_shipping_packaging_1778929477070.png" 
            alt="Shipping Packaging" 
            className="object-cover" fill />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-emerald-100 text-sm font-bold border border-white/20"
          >
            <Globe className="w-4 h-4" />
            <span className="tracking-widest uppercase">Nationwide Logistics</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9]"
          >
            Safe & Sustainable <br />
            <span className="text-emerald-400 italic font-serif">Delivery</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-50/80 text-xl max-w-2xl mx-auto font-medium"
          >
            We've revolutionized botanical logistics to ensure your plants arrive in nursery-fresh condition, every single time.
          </motion.p>
        </div>
      </section>

      {/* Shipping Methods Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">Options</span>
          <h2 className="text-4xl font-display font-bold text-slate-900">Shipping Methods</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {shippingMethods.map((method, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] p-10 border border-slate-100 hover:border-emerald-200 transition-all group"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {method.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{method.type}</h3>
              <p className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-4">{method.time}</p>
              <p className="text-slate-500 mb-6 leading-relaxed">{method.description}</p>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="font-display font-black text-xl text-slate-900">{method.price}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packaging Detail Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em]">The Pacha Bhoomi Standard</span>
                <h2 className="text-5xl font-display font-bold text-white tracking-tight">Zero-Plastic <br /><span className="text-emerald-500 italic font-serif">Botanical Armour</span></h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                  Standard shipping kills plants. Ours nourishes them. We use custom-engineered packaging that maintains humidity while allowing airflow.
                </p>
              </div>

              <div className="space-y-8">
                {packagingFeatures.map((feature, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">{feature.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[60px] overflow-hidden border-8 border-white/5 relative z-10">
                <Image src="/eco_plant_shipping_packaging_1778929477070.png" 
                  alt="Packaging Details" 
                  className="object-cover" fill />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-emerald-500 p-10 rounded-[40px] z-20 shadow-2xl">
                <p className="text-emerald-950 font-display font-black text-4xl leading-tight">100%<br />Plastic Free</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Areas */}
      <section id="areas" className="py-24 max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[60px] p-16 border border-slate-100 shadow-xl shadow-emerald-900/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 blur-[80px] rounded-full -mr-20 -mt-20" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-emerald-600 text-xs font-black uppercase tracking-[0.3em]">Coverage</span>
                <h2 className="text-4xl font-display font-bold text-slate-900">Where we deliver</h2>
                <p className="text-slate-500 leading-relaxed">
                  We are currently operating in 25+ cities across India. If your city isn't listed, stay tuned—we're growing faster than a Pothos!
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                {deliveryAreas.map((city, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Link href="/support" className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all">
                  Check full city list <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[40px] p-10 space-y-8">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-emerald-600 mt-1" />
                <div>
                  <h4 className="text-slate-900 font-bold text-lg mb-2">Important Note</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Plant deliveries are scheduled to avoid weekends in transit to ensure your plants don't spend unnecessary time in warehouses. Orders placed on Thursday-Sunday will typically ship on Monday.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-4">Track your companion</p>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Order ID" 
                    className="flex-grow bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all">
                    Track
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="pb-24 max-w-3xl mx-auto px-4 text-center space-y-8">
        <h3 className="text-2xl font-display font-bold text-slate-900">Still have questions?</h3>
        <p className="text-slate-500">Visit our support center for detailed information about international shipping, bulk orders, and heritage nursery partnerships.</p>
        <Link href="/support" className="inline-block bg-slate-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
          Go to Support Center
        </Link>
      </section>
    </div>
  );
}
