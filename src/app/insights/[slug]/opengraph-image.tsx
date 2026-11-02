import { ImageResponse } from 'next/og';
import { fetchInsightBySlug } from '@/lib/dal';
import { blogPosts as defaultBlogPosts } from '@/data';

export const runtime = 'nodejs';

export const alt = 'Growmybiz24 Insights & Strategic Analysis';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = (await fetchInsightBySlug(slug)) || defaultBlogPosts.find((p) => p.slug === slug);

  const title = post?.title || 'Strategic Playbook & Engineering Insights';
  const category = post?.category || 'Web & Digital Strategy';
  const readTime = post?.readTime || '5 min read';
  const excerpt = post?.excerpt || 'Practical digital engineering and conversion optimization strategy.';
  const author = post?.author || 'Divyansh Gupta';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A111E',
          backgroundImage:
            'radial-gradient(circle at 12% 18%, rgba(71, 123, 219, 0.28) 0%, transparent 45%), radial-gradient(circle at 88% 82%, rgba(100, 119, 200, 0.22) 0%, transparent 45%)',
          padding: '54px 64px',
          fontFamily: 'sans-serif',
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        {/* Subtle Frame */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            bottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            pointerEvents: 'none',
            display: 'flex',
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #477BDB 0%, #6477C8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(71, 123, 219, 0.4)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  color: '#FFFFFF',
                }}
              >
                Growmybiz24
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: '#8A99AD',
                }}
              >
                Insights & Research
              </span>
            </div>
          </div>

          {/* Category Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(71, 123, 219, 0.18)',
              border: '1.5px solid rgba(71, 123, 219, 0.4)',
              color: '#7AA2FF',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '999px',
                backgroundColor: '#477BDB',
                display: 'flex',
              }}
            />
            <span>{category}</span>
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '1020px',
            
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {/* Metadata Subheading */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#38BDF8',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
            }}
          >
            <span>Strategic Guide</span>
            <span>•</span>
            <span>{readTime}</span>
            <span>•</span>
            <span>By {author}</span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 55 ? '44px' : title.length > 35 ? '52px' : '58px',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#FFFFFF',
              letterSpacing: '-1.5px',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {title}
          </div>

          {/* Excerpt */}
          <div
            style={{
              fontSize: '18px',
              lineHeight: 1.45,
              color: '#94A3B8',
              fontWeight: 400,
              maxHeight: '60px',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            {excerpt.length > 130 ? excerpt.slice(0, 130) + '...' : excerpt}
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#10B981' }}>●</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>growmybiz24.com/insights</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <span style={{ fontSize: '14px', color: '#8A99AD' }}>
              Full-Stack Engineering & Scalable Web Architecture
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
            }}
          >
            <span>Read Full Article ↗</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
