import React from 'react';
import { fetchLegalDoc } from '@/lib/dal';

interface LegalDocViewProps {
  slug: string;
  defaultTitle?: string;
  children?: React.ReactNode;
}

function renderFormattedInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-[#0F1C31]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const closingBracket = token.indexOf('](');
      const label = token.slice(1, closingBracket);
      const href = token.slice(closingBracket + 2, -1);
      parts.push(
        <a
          key={match.index}
          href={href}
          className="text-[#477BDB] hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      );
    } else if (token.includes('@')) {
      parts.push(
        <a key={match.index} href={`mailto:${token}`} className="text-[#477BDB] hover:underline">
          {token}
        </a>
      );
    } else {
      parts.push(token);
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export default async function LegalDocView({ slug, children }: LegalDocViewProps) {
  const dynamicContent = await fetchLegalDoc(slug, '');

  if (dynamicContent && dynamicContent.trim().length > 0) {
    return (
      <div className="prose-legal space-y-6">
        {dynamicContent.split('\n\n').map((block, idx) => {
          const trimmed = block.trim();
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-bold text-[#0F1C31] mt-8 mb-3">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl font-bold text-[#0F1C31] mt-8 mb-4">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-semibold text-[#0F1C31] mt-6 mb-2">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
            return (
              <ul key={idx} className="list-disc pl-5 space-y-2 text-[#475467] text-sm leading-relaxed">
                {items.map((it, iIdx) => (
                  <li key={iIdx}>{renderFormattedInline(it.replace(/^[-*]\s*/, ''))}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-[#475467] text-sm leading-relaxed whitespace-pre-line">
              {renderFormattedInline(trimmed)}
            </p>
          );
        })}
      </div>
    );
  }

  return <>{children}</>;
}
