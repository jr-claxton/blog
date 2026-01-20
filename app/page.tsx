import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-4xl font-serif font-bold text-slate-900">Josh Claxton</h1>
        <p className="text-slate-600 mt-2">Chef, writer, father.</p>
      </header>

<section className="space-y-12">
  {allPostsData.map(({ id, date, title, excerpt }) => (
          <Link href={`/posts/${id}`} key={id}>

    <article className="group relative p-6 -mx-6 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
  <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-3">
    <time className="text-xs font-bold tracking-widest uppercase text-emerald-600">
      {date}
    </time>
    <span className="hidden md:block text-slate-300">|</span>
    <h2 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
        {title}
    </h2>
  </div>
  
  <p className="text-slate-600 leading-relaxed max-w-2xl">
    {excerpt}
  </p>
  
  <div className="mt-4 flex items-center text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
    Read Full Story 
    <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
  </div>
</article>
      </Link>

  ))}
</section>
    </main>
  );
}