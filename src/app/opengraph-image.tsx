import { ImageResponse } from 'next/og';
import { siteConfig } from '@/data/siteConfig';

export const runtime = 'nodejs';

export const alt = 'Growmybiz24 | Digital Solutions for a Bigger Tomorrow';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
            'radial-gradient(circle at 15% 20%, rgba(71, 123, 219, 0.28) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(100, 119, 200, 0.22) 0%, transparent 45%)',
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
                width: '48px',
                height: '48px',
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
                  fontSize: '24px',
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
                Digital Solutions for a Bigger Tomorrow
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
            <span>Full-Stack Digital Agency</span>
          </div>
        </div>

        {/* Center Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
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
              color: '#38BDF8',
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
            }}
          >
            <span>Next.js 16 Web Apps</span>
            <span>•</span>
            <span>AI Automation</span>
            <span>•</span>
            <span>B2B Growth Sprints</span>
          </div>

          <div
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#FFFFFF',
              letterSpacing: '-1.5px',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            Digital Solutions for a Bigger Tomorrow
          </div>

          <div
            style={{
              fontSize: '20px',
              lineHeight: 1.45,
              color: '#94A3B8',
              fontWeight: 400,
              maxWidth: '850px',
            }}
          >
            Transforming ambitious businesses with high-converting custom web applications, AI workflows, and strategic performance design.
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
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>growmybiz24.com</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <span style={{ fontSize: '14px', color: '#8A99AD' }}>
              Bespoke Development & Performance Marketing
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '12px',
              backgroundColor: 'linear-gradient(135deg, #477BDB, #6477C8)',
              fontSize: '13px',
              fontWeight: 700,
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(71, 123, 219, 0.3)',
            }}
          >
            <span>Start a Project ↗</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
