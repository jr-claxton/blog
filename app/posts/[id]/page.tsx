import { getPostData, getSortedPostsData } from '@/lib/posts';
import { Metadata } from 'next';
import Link from 'next/link';

// Fixed: This must be awaited because the function is now async
export async function generateStaticParams() {
  const posts = await getSortedPostsData(); 
  return posts.map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostData(id);

  return {
    title: `${post.title} | Josh Claxton`,
    description: post.excerpt,
  };
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postData = await getPostData(id);

  return (
    <main className="min-h-screen bg-slate-50/50">
      <nav className="max-w-3xl mx-auto px-6 py-8">
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
          ← Back to Writing
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pb-24">
        <header className="mb-12">
          <div className="flex items-center space-x-2 text-sm text-slate-400 mb-4">
            <time dateTime={postData.date}>{postData.date}</time>
            <span>•</span>
            <span>5 min read</span> 
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
            {postData.title}
          </h1>
        </header>

        <div className="prose prose-slate lg:prose-xl mx-auto prose-headings:font-serif prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg">
          {/* Fixed: Added a fallback empty string to satisfy TypeScript's TrustedHTML requirement */}
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} />
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-500 italic">
            Thanks for reading. I&apos;m Josh, a writer and chef sharing my thoughts and short stories.
          </p>
        </footer>
      </article>
    </main>
  );
}