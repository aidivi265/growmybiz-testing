import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const title = searchParams.get('title') || 'Growmybiz24 | Digital Solutions for a Bigger Tomorrow';
    const category = searchParams.get('category') || 'Digital Agency';
    const type = searchParams.get('type') || 'general'; // 'insight' | 'case-study' | 'service' | 'general'
    const subtitle = searchParams.get('subtitle') || '';
    const readTime = searchParams.get('readTime') || '';
    const client = searchParams.get('client') || '';
    const badge = searchParams.get('badge') || (type === 'case-study' ? 'Verified Case Study' : type === 'insight' ? 'Strategic Insight' : 'Digital Growth');

    // Type-specific badge styling
    const isCaseStudy = type === 'case-study';
    const isInsight = type === 'insight';
    const isService = type === 'service';

    const accentColor = isCaseStudy ? '#10B981' : isService ? '#F59E0B' : '#477BDB';
    const accentBg = isCaseStudy
      ? 'rgba(16, 185, 129, 0.15)'
      : isService
      ? 'rgba(245, 158, 11, 0.15)'
      : 'rgba(71, 123, 219, 0.18)';
    const accentBorder = isCaseStudy
      ? 'rgba(16, 185, 129, 0.35)'
      : isService
      ? 'rgba(245, 158, 11, 0.35)'
      : 'rgba(71, 123, 219, 0.4)';

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
              'radial-gradient(circle at 15% 20%, rgba(71, 123, 219, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(100, 119, 200, 0.18) 0%, transparent 45%)',
            padding: '54px 64px',
            fontFamily: 'sans-serif',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          {/* Subtle Outer Frame Accent */}
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

          {/* Top Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              
            }}
          >
            {/* Brand Logo & Name */}
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
                  Digital Agency & Engineering
                </span>
              </div>
            </div>

            {/* Category / Badge Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: accentBg,
                border: `1.5px solid ${accentBorder}`,
                color: accentColor,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '999px',
                  backgroundColor: accentColor,
                  display: 'flex',
                }}
              />
              <span>{category || badge}</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '1000px',
              
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            {/* Context meta label */}
            {(client || badge) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#7AA2FF',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {client && <span>Client: {client}</span>}
                {client && badge && <span>•</span>}
                {badge && <span>{badge}</span>}
                {readTime && <span>•</span>}
                {readTime && <span>{readTime}</span>}
              </div>
            )}

            {/* Big Headline Title */}
            <div
              style={{
                fontSize: title.length > 55 ? '44px' : title.length > 35 ? '52px' : '60px',
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

            {/* Subtitle / Excerpt */}
            {subtitle && (
              <div
                style={{
                  fontSize: '19px',
                  lineHeight: 1.45,
                  color: '#A0AEC0',
                  fontWeight: 400,
                  maxHeight: '62px',
                  overflow: 'hidden',
                  display: 'flex',
                }}
              >
                {subtitle.length > 130 ? subtitle.slice(0, 130) + '...' : subtitle}
              </div>
            )}
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
            {/* Domain & Verification */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                <span style={{ color: '#10B981' }}>●</span>
                <span>growmybiz24.com</span>
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
              <span style={{ fontSize: '14px', color: '#8A99AD' }}>
                Next.js & Custom AI Automation Solutions
              </span>
            </div>

            {/* Callout Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
              }}
            >
              <span>
                {isCaseStudy
                  ? 'Explore Live Case Study ↗'
                  : isInsight
                  ? 'Read Full Strategic Article ↗'
                  : isService
                  ? 'View Deliverables & Pricing ↗'
                  : 'Start a Project ↗'}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('[OG Generation Error]', e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
