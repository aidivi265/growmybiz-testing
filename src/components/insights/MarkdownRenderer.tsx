import React from 'react';
import Link from 'next/link';
import { Info, Lightbulb, AlertTriangle, CheckCircle2, Square, CheckSquare } from 'lucide-react';
import { SYNE_FONT } from '@/lib/fonts';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

// ── Inline Markdown Tokenizer ──────────────────────────────────────────────
// Priority order: Image -> Link -> Bold -> Italic -> Strike -> Inline Code
export function renderInline(text: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  const regex =
    /(!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)|\(?\[([^\]]+)\]\(([^)]+)\)\)?|\*\*([^*]+)\*\*|\*([^*]+)\*|_([^_]+)_|~~([^~]+)~~|`([^`]+)`)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenKey = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    const [
      ,
      ,
      imgAlt,
      imgSrc,
      imgTitle,
      linkLabel,
      linkHref,
      boldText,
      italicStar,
      italicUnder,
      strikeText,
      codeText,
    ] = match;

    if (imgSrc) {
      // 1. Inline Image
      tokens.push(
        <img
          key={tokenKey++}
          src={imgSrc}
          alt={imgAlt || 'Image'}
          title={imgTitle || imgAlt || undefined}
          loading="lazy"
          className="inline-block max-h-12 rounded-lg mx-1 align-middle border border-[#E2E8F0] shadow-2xs hover:scale-105 transition-transform"
        />
      );
    } else if (linkLabel && linkHref) {
      // 2. Link
      const isInternal = linkHref.startsWith('/') || linkHref.startsWith('#');
      tokens.push(
        isInternal ? (
          <Link
            key={tokenKey++}
            href={linkHref}
            className="text-[#477BDB] font-semibold hover:underline transition-colors"
          >
            {linkLabel}
          </Link>
        ) : (
          <a
            key={tokenKey++}
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#477BDB] font-semibold hover:underline inline-flex items-center gap-0.5"
          >
            {linkLabel}
          </a>
        )
      );
    } else if (boldText) {
      // 3. Bold
      tokens.push(
        <strong key={tokenKey++} className="font-bold text-[#0F1C31]">
          {boldText}
        </strong>
      );
    } else if (italicStar || italicUnder) {
      // 4. Italic
      tokens.push(
        <em key={tokenKey++} className="italic text-[#3D4F63]">
          {italicStar || italicUnder}
        </em>
      );
    } else if (strikeText) {
      // 5. Strikethrough
      tokens.push(
        <del key={tokenKey++} className="line-through text-slate-400">
          {strikeText}
        </del>
      );
    } else if (codeText) {
      // 6. Inline Code
      tokens.push(
        <code
          key={tokenKey++}
          className="px-1.5 py-0.5 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] font-mono text-[0.875em] text-[#0F1C31]"
        >
          {codeText}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

// ── Block-Level Markdown Parser ────────────────────────────────────────────
interface ParsedBlock {
  type: 'heading' | 'code' | 'table' | 'image' | 'blockquote' | 'callout' | 'list' | 'ordered-list' | 'hr' | 'paragraph';
  raw: string;
  level?: number;
  language?: string;
  code?: string;
  imgAlt?: string;
  imgSrc?: string;
  imgCaption?: string;
  tableHeaders?: string[];
  tableAlignments?: ('left' | 'center' | 'right')[];
  tableRows?: string[][];
  calloutType?: 'note' | 'tip' | 'warning' | 'important';
  calloutText?: string;
  listItems?: { text: string; checked?: boolean }[];
}

function parseMarkdownBlocks(rawContent: string): ParsedBlock[] {
  const lines = rawContent.replace(/\r\n/g, '\n').split('\n');
  const blocks: ParsedBlock[] = [];

  let inCode = false;
  let codeLanguage = '';
  let codeLines: string[] = [];

  let inTable = false;
  let tableLines: string[] = [];

  let currentLines: string[] = [];

  const flushParagraphOrBlock = () => {
    if (currentLines.length === 0) return;
    const text = currentLines.join('\n').trim();
    currentLines = [];
    if (!text) return;

    // Check Standalone Image Block: ![alt](src "caption") or ![alt](src)
    const imgMatch = text.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
    if (imgMatch) {
      blocks.push({
        type: 'image',
        raw: text,
        imgAlt: imgMatch[1],
        imgSrc: imgMatch[2],
        imgCaption: imgMatch[3] || imgMatch[1],
      });
      return;
    }

    // Check Headings
    if (text.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, raw: text.slice(2).trim() });
      return;
    }
    if (text.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, raw: text.slice(3).trim() });
      return;
    }
    if (text.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, raw: text.slice(4).trim() });
      return;
    }
    if (text.startsWith('#### ')) {
      blocks.push({ type: 'heading', level: 4, raw: text.slice(5).trim() });
      return;
    }

    // Check Horizontal Rule
    if (/^(---|___|\*\*\*)$/.test(text)) {
      blocks.push({ type: 'hr', raw: text });
      return;
    }

    // Check Blockquote / Callout
    if (text.startsWith('> ') || text.startsWith('>')) {
      const quoteBody = text
        .split('\n')
        .map((l) => l.replace(/^>\s?/, ''))
        .join(' ')
        .trim();

      const calloutMatch = quoteBody.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*(.*)$/i);
      if (calloutMatch) {
        const rawKind = calloutMatch[1].toLowerCase();
        const kind: 'note' | 'tip' | 'warning' | 'important' =
          rawKind === 'caution' ? 'warning' : (rawKind as 'note' | 'tip' | 'warning' | 'important');
        blocks.push({
          type: 'callout',
          calloutType: kind,
          calloutText: calloutMatch[2],
          raw: text,
        });
      } else {
        blocks.push({
          type: 'blockquote',
          raw: quoteBody,
        });
      }
      return;
    }

    // Check Task List or Unordered List
    const lineList = text.split('\n');
    const isTaskList = lineList.every((l) => /^\s*[-*]\s*\[([ xX])\]\s+.+/.test(l));
    if (isTaskList) {
      const items = lineList.map((l) => {
        const m = l.match(/^\s*[-*]\s*\[([ xX])\]\s+(.+)$/);
        return {
          checked: m ? m[1].toLowerCase() === 'x' : false,
          text: m ? m[2] : l,
        };
      });
      blocks.push({ type: 'list', listItems: items, raw: text });
      return;
    }

    const isBulletList = lineList.every((l) => /^\s*[-*]\s+.+/.test(l));
    if (isBulletList) {
      const items = lineList.map((l) => ({
        text: l.replace(/^\s*[-*]\s+/, ''),
      }));
      blocks.push({ type: 'list', listItems: items, raw: text });
      return;
    }

    // Check Ordered List
    const isOrderedList = lineList.every((l) => /^\s*\d+\.\s+.+/.test(l));
    if (isOrderedList) {
      const items = lineList.map((l) => ({
        text: l.replace(/^\s*\d+\.\s+/, ''),
      }));
      blocks.push({ type: 'ordered-list', listItems: items, raw: text });
      return;
    }

    // Fallback normal paragraph
    blocks.push({ type: 'paragraph', raw: text });
  };

  const flushTable = () => {
    if (tableLines.length < 2) {
      // Not a valid table, push as normal paragraph
      currentLines.push(...tableLines);
      tableLines = [];
      inTable = false;
      return;
    }

    const cleanLines = tableLines.map((l) => l.trim()).filter(Boolean);
    const headerLine = cleanLines[0];
    const delimiterLine = cleanLines[1];
    const dataLines = cleanLines.slice(2);

    const parseRow = (line: string): string[] => {
      let trimmed = line;
      if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
      if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
      return trimmed.split('|').map((c) => c.trim());
    };

    const headers = parseRow(headerLine);
    const delimiters = parseRow(delimiterLine);

    const alignments: ('left' | 'center' | 'right')[] = delimiters.map((d) => {
      const hasLeft = d.startsWith(':');
      const hasRight = d.endsWith(':');
      if (hasLeft && hasRight) return 'center';
      if (hasRight) return 'right';
      return 'left';
    });

    const rows = dataLines.map(parseRow);

    blocks.push({
      type: 'table',
      raw: tableLines.join('\n'),
      tableHeaders: headers,
      tableAlignments: alignments,
      tableRows: rows,
    });

    tableLines = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Fenced Code Block Handler
    if (!inCode && trimmed.startsWith('```')) {
      flushParagraphOrBlock();
      flushTable();
      inCode = true;
      codeLanguage = trimmed.slice(3).trim();
      codeLines = [];
      continue;
    }

    if (inCode) {
      if (trimmed === '```') {
        inCode = false;
        blocks.push({
          type: 'code',
          language: codeLanguage,
          code: codeLines.join('\n'),
          raw: codeLines.join('\n'),
        });
        codeLines = [];
        codeLanguage = '';
      } else {
        codeLines.push(line);
      }
      continue;
    }

    // 2. Table Row Detection: Line contains '|' and has at least two columns
    const isTableDelimiter = /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(trimmed);
    const isTableRow = trimmed.includes('|') && trimmed.split('|').length >= 3;

    if (isTableRow || isTableDelimiter) {
      flushParagraphOrBlock();
      inTable = true;
      tableLines.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // 3. Paragraph separation on blank lines
    if (trimmed === '') {
      flushParagraphOrBlock();
    } else {
      currentLines.push(line);
    }
  }

  // Flush any trailing state
  if (inCode && codeLines.length > 0) {
    blocks.push({
      type: 'code',
      language: codeLanguage,
      code: codeLines.join('\n'),
      raw: codeLines.join('\n'),
    });
  }
  flushTable();
  flushParagraphOrBlock();

  return blocks;
}

// ── Main Markdown Renderer Component ───────────────────────────────────────
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="article-body prose-custom text-[#3D4F63] leading-relaxed">
      {blocks.map((block, index) => {
        switch (block.type) {
          // 1. Fenced Code Block with Syntax Highlighting & Copy Button
          case 'code':
            return (
              <CodeBlock
                key={index}
                code={block.code || ''}
                language={block.language || ''}
              />
            );

          // 2. Markdown Tables
          case 'table':
            return (
              <div
                key={index}
                className="my-8 overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-2xs"
              >
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#0F1C31]">
                    <tr>
                      {block.tableHeaders?.map((h, colIdx) => (
                        <th
                          key={colIdx}
                          className="px-5 py-3.5 text-xs font-bold tracking-wider uppercase text-[#0F1C31]"
                          style={{
                            textAlign: block.tableAlignments?.[colIdx] || 'left',
                            fontFamily: SYNE_FONT,
                          }}
                        >
                          {renderInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[#3D4F63]">
                    {block.tableRows?.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-[#F8FAFC]/70 transition-colors"
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="px-5 py-3.5 text-[0.9375rem]"
                            style={{
                              textAlign: block.tableAlignments?.[cellIdx] || 'left',
                            }}
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          // 3. Standalone Figures / Images
          case 'image':
            return (
              <figure
                key={index}
                className="my-8 rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] shadow-2xs"
              >
                <div className="relative w-full overflow-hidden flex items-center justify-center bg-slate-50">
                  <img
                    src={block.imgSrc}
                    alt={block.imgAlt || 'Blog illustration'}
                    loading="lazy"
                    className="w-full h-auto object-cover max-h-[550px] mx-auto transition-transform duration-300 hover:scale-[1.01]"
                  />
                </div>
                {block.imgCaption && (
                  <figcaption className="text-center text-xs text-[#6B7E95] py-2.5 px-4 bg-[#F8FAFC] border-t border-[#E2E8F0] italic">
                    {block.imgCaption}
                  </figcaption>
                )}
              </figure>
            );

          // 4. Headings
          case 'heading': {
            if (block.level === 1) {
              return (
                <h1
                  key={index}
                  style={{
                    fontFamily: SYNE_FONT,
                    fontWeight: 800,
                    fontSize: '1.85rem',
                    letterSpacing: '-0.025em',
                    color: '#0F1C31',
                    marginTop: '2.8rem',
                    marginBottom: '1rem',
                  }}
                >
                  {renderInline(block.raw)}
                </h1>
              );
            }
            if (block.level === 2) {
              return (
                <h2
                  key={index}
                  style={{
                    fontFamily: SYNE_FONT,
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    letterSpacing: '-0.02em',
                    color: '#0F1C31',
                    marginTop: '2.4rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  {renderInline(block.raw)}
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3
                  key={index}
                  style={{
                    fontFamily: SYNE_FONT,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#0F1C31',
                    marginTop: '1.9rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  {renderInline(block.raw)}
                </h3>
              );
            }
            return (
              <h4
                key={index}
                style={{
                  fontFamily: SYNE_FONT,
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#0F1C31',
                  marginTop: '1.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                {renderInline(block.raw)}
              </h4>
            );
          }

          // 5. Callouts / Banners
          case 'callout': {
            const isTip = block.calloutType === 'tip';
            const isWarning = block.calloutType === 'warning';
            const borderColor = isTip ? 'border-emerald-300' : isWarning ? 'border-amber-300' : 'border-blue-300';
            const bgColor = isTip ? 'bg-emerald-50/70' : isWarning ? 'bg-amber-50/70' : 'bg-blue-50/70';
            const textColor = isTip ? 'text-emerald-900' : isWarning ? 'text-amber-900' : 'text-blue-900';
            const IconComponent = isTip ? Lightbulb : isWarning ? AlertTriangle : Info;

            return (
              <div
                key={index}
                className={`my-6 p-4 rounded-xl border ${borderColor} ${bgColor} flex items-start gap-3.5`}
              >
                <IconComponent size={18} className={`shrink-0 mt-0.5 ${textColor}`} />
                <div className={`text-sm leading-relaxed ${textColor}`}>
                  {renderInline(block.calloutText || '')}
                </div>
              </div>
            );
          }

          // 6. Blockquote
          case 'blockquote':
            return (
              <blockquote
                key={index}
                className="border-l-4 border-[#477BDB] pl-4 py-2.5 my-5 bg-[#F8FAFC] rounded-r-xl text-[#3D4F63] italic text-[0.95rem] leading-relaxed"
              >
                {renderInline(block.raw)}
              </blockquote>
            );

          // 7. Unordered / Task Lists
          case 'list':
            return (
              <ul key={index} className="list-none p-0 my-4 space-y-2.5">
                {block.listItems?.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-[#3D4F63] text-[0.9375rem] leading-relaxed"
                  >
                    {item.checked !== undefined ? (
                      item.checked ? (
                        <CheckSquare size={16} className="text-[#477BDB] shrink-0 mt-1" />
                      ) : (
                        <Square size={16} className="text-slate-400 shrink-0 mt-1" />
                      )
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#477BDB] mt-2 shrink-0 block" />
                    )}
                    <div className={item.checked ? 'line-through text-slate-400' : ''}>
                      {renderInline(item.text)}
                    </div>
                  </li>
                ))}
              </ul>
            );

          // 8. Ordered Lists
          case 'ordered-list':
            return (
              <ol key={index} className="list-none p-0 my-4 space-y-2.5">
                {block.listItems?.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="flex items-start gap-2.5 text-[#3D4F63] text-[0.9375rem] leading-relaxed"
                  >
                    <span
                      style={{ fontFamily: SYNE_FONT }}
                      className="font-bold text-[#477BDB] text-[0.875rem] shrink-0 min-w-[1.25rem]"
                    >
                      {itemIdx + 1}.
                    </span>
                    <div>{renderInline(item.text)}</div>
                  </li>
                ))}
              </ol>
            );

          // 9. Horizontal Rule
          case 'hr':
            return <hr key={index} className="my-8 border-t border-[#E2E8F0]" />;

          // 10. Normal Paragraph
          default:
            return (
              <p
                key={index}
                className="text-[#3D4F63] leading-[1.8] mb-4 text-[0.98rem]"
              >
                {renderInline(block.raw)}
              </p>
            );
        }
      })}
    </div>
  );
}
