import { ImageResponse } from 'next/og';
import { fetchServiceBySlug } from '@/lib/dal';
import { services as defaultServices } from '@/data';

export const runtime = 'nodejs';

export const alt = 'Growmybiz24 Digital Growth Service';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = (await fetchServiceBySlug(slug)) || defaultServices.find((s) => s.slug === slug);

  const title = service?.title || 'Digital Growth & Engineering Service';
  const shortDesc = service?.shortDescription || service?.description || 'Bespoke high-performance digital services tailored to scale your enterprise.';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#09101D',
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.2) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(71, 123, 219, 0.24) 0%, transparent 45%)',
          padding: '54px 64px',
          fontFamily: 'sans-serif',
          color: '#FFFFFF',
          position: 'relative',
        }}
      >
        {/* Frame */}
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
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)',
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
                Core Growth Services
              </span>
            </div>
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              color: '#FBBF24',
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
                backgroundColor: '#F59E0B',
                display: 'flex',
              }}
            />
            <span>Professional Service</span>
          </div>
        </div>

        {/* Center Content */}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#FBBF24',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
            }}
          >
            <span>Service Offering</span>
            <span>•</span>
            <span>Transparent 50/30/20 Milestones</span>
            <span>•</span>
            <span>Direct Engineering Handover</span>
          </div>

          <div
            style={{
              fontSize: title.length > 40 ? '48px' : '58px',
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
            {shortDesc.length > 130 ? shortDesc.slice(0, 130) + '...' : shortDesc}
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
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>growmybiz24.com/services</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <span style={{ fontSize: '14px', color: '#8A99AD' }}>
              Full-Stack Scope & Deliverables
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
            <span>View Pricing & Scope ↗</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
