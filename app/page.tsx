import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';

export default async function Home() {
  const allPostsData = await getSortedPostsData();

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-16">
        <h1 className="text-4xl font-serif font-bold text-slate-900">J. R. Claxton</h1>
        <p className="text-slate-600 mt-2">Chef, writer, father.</p>
      </header>

      <section className="space-y-12">
        {allPostsData.map(({ id, date, title, excerpt, tags }) => (
          <Link href={`/posts/${id}`} key={id} className="block group">
            <article className="relative p-6 -mx-6 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <time className="text-xs font-bold tracking-widest uppercase text-emerald-600">
                  {date}
                </time>
                
                {/* Minimalist Initial Tags */}
                <div className="flex gap-1">
                  {tags?.map((tag) => (
                    <span 
                      key={tag} 
                      title={tag} // Shows full tag name on hover
                      className="flex items-center justify-center w-5 h-5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200"
                    >
                      {tag.charAt(0)}
                    </span>
                  ))}
                </div>

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