import { valueProps } from '@/data';
import { Icon } from '@/components/Icon';

export default function ValuePropsSection() {
  return (
    <section className="py-20 lg:py-24 bg-white" id="why">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: header */}
          <div>
            <p className="eyebrow mb-3">Why Growmybizz</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#243247] leading-tight tracking-tight mb-4">
              Built around<br />your outcomes.
            </h2>
            <p className="text-[#4A5568] leading-relaxed max-w-md">
              These are the principles we hold ourselves to. They need to be proven through delivery — not just stated on a website.
            </p>

            {/* Accent line */}
            <div className="mt-8 h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg,#477BDB,#32A88A)' }} />
          </div>

          {/* Right: 2×2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {valueProps.map((vp, i) => {
              const colors = [
                { bg: '#EBF1FB', icon: '#477BDB' },
                { bg: '#E6F5F1', icon: '#32A88A' },
                { bg: '#EEF0FA', icon: '#6477C8' },
                { bg: '#EBF1FB', icon: '#477BDB' },
              ];
              const c = colors[i % colors.length];
              return (
                <div key={vp.id}
                  className="group p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#CBD5E0] hover:shadow-[0_4px_20px_rgba(36,50,71,0.08)] transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: c.bg }}>
                    <Icon name={vp.icon} size={18} style={{ color: c.icon }} />
                  </div>
                  <h3 className="text-[#243247] font-bold text-sm mb-1.5">{vp.title}</h3>
                  <p className="text-[#718096] text-sm leading-relaxed">{vp.description}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
