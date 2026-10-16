import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Code2, Home, Sparkle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const location = useLocation();
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/library', label: 'Library', icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[.08] bg-[#07111f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link to="/" className="group flex items-center gap-3" aria-label="CodeVision home">
          <motion.div
            initial={{ rotate: -8, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/25 bg-cyan-300 text-[#07111f] shadow-[0_8px_24px_rgba(49,212,223,.18)]"
          >
            <Code2 className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#ff8a6b]" />
          </motion.div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-white">CodeVision</div>
            <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">Visual learning lab</div>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'}`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-300' : 'text-slate-600 group-hover:text-cyan-300'}`} />
                <span className="hidden sm:inline">{item.label}</span>
                {isActive && <motion.span layoutId="nav-active" className="absolute inset-x-2 -bottom-[21px] h-px bg-cyan-300" />}
              </Link>
            );
          })}
          <Link to="/" className="button-primary ml-2 flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold">
            <Sparkle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New lesson</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
