import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { processSteps } from '@/data';
import { Icon } from '@/components/Icon';

const STEP_COLORS = ['#477BDB', '#6477C8', '#32A88A', '#477BDB', '#6477C8', '#32A88A'];

export default function ProcessPreview() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" id="process"
      style={{ background: 'linear-gradient(135deg, #1A2B4A 0%, #243B66 50%, #1E3354 100%)' }}>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#32A88A] text-xs font-bold tracking-[0.18em] uppercase mb-3 inline-flex items-center gap-2">
            <span className="w-5 h-px bg-[#32A88A]" />
            How we work
            <span className="w-5 h-px bg-[#32A88A]" />
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Clear process, no surprises.
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            A six-step delivery process that keeps scope, communication and expectations aligned from start to finish.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {processSteps.map((step, i) => (
            <div key={step.id}
              className="group text-center p-5 rounded-2xl border border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all duration-200 cursor-default">

              {/* Number circle */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 border-2"
                style={{
                  background: `${STEP_COLORS[i]}22`,
                  borderColor: `${STEP_COLORS[i]}60`,
                }}>
                <span className="font-extrabold text-xs" style={{ color: STEP_COLORS[i] }}>
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Icon name={step.icon} size={14} className="text-white/40" />
              </div>

              <h3 className="text-white font-bold text-sm mb-1.5">{step.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/process"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors">
            Learn more about our process <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
