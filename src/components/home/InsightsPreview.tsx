import Link from 'next/link';
import { blogPosts } from '@/data';
import { ArrowRight, Clock } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  'Web & Digital Strategy': '#EBF1FB',
  'SEO': '#E6F5F1',
  'Design & Branding': '#EEF0FA',
  'AI & Automation': '#EBF1FB',
  'Business & Strategy': '#E6F5F1',
};
const CATEGORY_TEXT: Record<string, string> = {
  'Web & Digital Strategy': '#477BDB',
  'SEO': '#32A88A',
  'Design & Branding': '#6477C8',
  'AI & Automation': '#477BDB',
  'Business & Strategy': '#32A88A',
};

export default function InsightsPreview() {
  const posts = blogPosts.filter((p) => p.featured && p.published).slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-white" id="insights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12">
          <div>
            <p className="eyebrow mb-3">Insights</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#243247] leading-tight tracking-tight">
              Useful thinking for<br />growing businesses.
            </h2>
          </div>
          <Link href="/insights"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#477BDB] hover:text-[#3366C8] transition-colors shrink-0">
            All articles <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const catBg = CATEGORY_COLORS[post.category] ?? '#EBF1FB';
            const catTx = CATEGORY_TEXT[post.category] ?? '#477BDB';
            return (
              <Link key={post.id} href={`/insights/${post.slug}`} className="group block">
                <article className="h-full bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_8px_32px_rgba(36,50,71,0.12)] group-hover:border-[#CBD5E0]">

                  {/* Cover — colourful gradient using category colour */}
                  <div className="aspect-[16/7] relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${catBg} 0%, #F8FAFC 100%)` }}>
                    {/* Large initial letter */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[80px] font-black leading-none select-none"
                        style={{ color: catBg === '#EBF1FB' ? 'rgba(71,123,219,0.12)' : catBg === '#E6F5F1' ? 'rgba(50,168,138,0.12)' : 'rgba(100,119,200,0.12)' }}>
                        {post.category[0]}
                      </span>
                    </div>
                    {/* Category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                        style={{ background: catBg, color: catTx, borderColor: `${catTx}30` }}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3 text-xs text-[#A0AEC0]">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime} min read
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#243247] text-base leading-snug mb-2 group-hover:text-[#477BDB] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#718096] line-clamp-2">{post.excerpt}</p>

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#477BDB] opacity-0 group-hover:opacity-100 transition-opacity">
                      Read article <ArrowRight size={11} />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
