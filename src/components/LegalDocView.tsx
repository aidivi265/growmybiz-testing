import React from 'react';
import { fetchLegalDoc } from '@/lib/dal';

interface LegalDocViewProps {
  slug: string;
  defaultTitle?: string;
  children?: React.ReactNode;
}

export default async function LegalDocView({ slug, children }: LegalDocViewProps) {
  const dynamicContent = await fetchLegalDoc(slug, '');

  if (dynamicContent && dynamicContent.trim().length > 0) {
    return (
      <div className="prose-legal space-y-6">
        {dynamicContent.split('\n\n').map((block, idx) => {
          if (block.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-bold text-[#0F1C31] mt-8 mb-3">
                {block.replace('## ', '')}
              </h2>
            );
          }
          if (block.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl font-bold text-[#0F1C31] mt-8 mb-4">
                {block.replace('# ', '')}
              </h1>
            );
          }
          if (block.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-semibold text-[#0F1C31] mt-6 mb-2">
                {block.replace('### ', '')}
              </h3>
            );
          }
          if (block.startsWith('- ') || block.startsWith('* ')) {
            const items = block.split('\n').filter((l) => l.trim().length > 0);
            return (
              <ul key={idx} className="list-disc pl-5 space-y-2 text-[#475467] text-sm leading-relaxed">
                {items.map((it, iIdx) => (
                  <li key={iIdx}>{it.replace(/^[-*]\s*/, '')}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-[#475467] text-sm leading-relaxed whitespace-pre-line">
              {block}
            </p>
          );
        })}
      </div>
    );
  }

  return <>{children}</>;
}
