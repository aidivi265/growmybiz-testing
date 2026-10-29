import { testimonials as defaultTestimonials } from '@/data/company';
import { SYNE_FONT } from '@/lib/fonts';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '@/types';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({ testimonials: propTestimonials }: TestimonialsSectionProps) {
  const pool = Array.isArray(propTestimonials) ? propTestimonials : defaultTestimonials;
  const activeTestimonials = pool.filter((t) => (t as any).is_published ?? (t as any).published ?? true);

  if (!activeTestimonials || activeTestimonials.length === 0) return null;


  return (
    <section className="section-pad-lg relative overflow-hidden" id="testimonials" style={{ background: '#0D182A' }}>
      {/* Background ambient texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(71,123,219,0.12) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="reveal-on-scroll max-w-2xl mb-14">
          <span className="eyebrow eyebrow-teal block mb-4">Client Feedback</span>
          <h2
            style={{
              fontFamily: SYNE_FONT,
              fontWeight: 800,
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.028em',
              color: '#FFFFFF',
            }}
          >
            What working with us<br />
            <span
              style={{
                background: 'linear-gradient(120deg, #52D9B8 0%, #6AADFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              actually looks like.
            </span>
          </h2>
          <p className="text-white/50 text-sm mt-3 leading-relaxed">
            Real outcomes from direct engagements. We measure our success by the clarity of delivery and the revenue growth delivered to our clients.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTestimonials.map((t, idx) => (
            <div
              key={t.id}
              className={`reveal-on-scroll stagger-${idx + 1} interactive-glow-card rounded-2xl p-7 flex flex-col justify-between relative transition-all duration-300 hover:border-white/20 hover:-translate-y-1`}
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}
            >
              {/* Quote watermark */}
              <div className="absolute top-5 right-5 text-white/5 pointer-events-none">
                <Quote size={48} />
              </div>

              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-white/85 text-[0.9375rem] leading-relaxed mb-6 font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm leading-tight">{t.author}</h4>
                  <p className="text-white/40 text-xs mt-0.5">
                    {t.role} · <span className="text-[#6AADFF] font-medium">{t.company}</span>
                  </p>
                </div>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg text-white/50"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {t.projectType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
