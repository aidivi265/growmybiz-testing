import { ImageResponse } from 'next/og';
import { fetchPortfolioBySlug } from '@/lib/dal';
import { portfolioItems as defaultPortfolioItems } from '@/data';

export const runtime = 'nodejs';

export const alt = 'Growmybiz24 Portfolio Case Study';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = (await fetchPortfolioBySlug(slug)) || defaultPortfolioItems.find((p) => p.slug === slug);

  const title = item?.title || 'Client Case Study & Engineering Delivery';
  const client = item?.client || 'Verified Client';
  const category = item?.category || 'Web Application & E-Commerce';
  const outcome = item?.outcome || item?.approach || 'High-performance web architecture delivering measurable business impact.';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#07111E',
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.22) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(71, 123, 219, 0.25) 0%, transparent 45%)',
          padding: '54px 64px',
          fontFamily: 'sans-serif',
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        {/* Border Frame */}
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
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
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
                Client Case Study
              </span>
            </div>
          </div>

          {/* Verified Delivery Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
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
                backgroundColor: '#10B981',
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
          {/* Client & Proof badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#34D399',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
            }}
          >
            <span>Client: {client}</span>
            <span>•</span>
            <span>Verified Production Delivery</span>
            <span>•</span>
            <span>Live Case Study</span>
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

          {/* Measurable Outcome Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: '850px',
            }}
          >
            <span style={{ fontSize: '18px', color: '#10B981' }}>📈</span>
            <span
              style={{
                fontSize: '16px',
                lineHeight: 1.4,
                color: '#CBD5E1',
                fontWeight: 500,
              }}
            >
              {outcome.length > 130 ? outcome.slice(0, 130) + '...' : outcome}
            </span>
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
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>growmybiz24.com/portfolio</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <span style={{ fontSize: '14px', color: '#8A99AD' }}>
              Milestone Protection & Verified Delivery
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
            <span>Explore Case Study ↗</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
