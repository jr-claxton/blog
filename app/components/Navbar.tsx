import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm group-hover:rotate-3 transition-transform">
            J.R.
          </div>
          <span className="font-serif font-bold text-xl text-slate-900"> Claxton</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className="text-slate-600 hover:text-emerald-600 transition-colors">
            Writing
          </Link>
          <Link href="/projects" className="text-slate-600 hover:text-emerald-600 transition-colors">
            Software
          </Link>
          <Link href="/culinary" className="text-slate-600 hover:text-emerald-600 transition-colors">
            Culinary
          </Link>
          <Link 
            href="/contact" 
            className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-emerald-600 transition-all shadow-md"
          >
            Let&apos;s Talk
          </Link>
        </div>

        {/* Mobile Icon (Optional logic for later) */}
        <div className="md:hidden text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </div>
      </div>
    </nav>
  );
}