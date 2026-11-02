'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

const LANG_LABELS: Record<string, string> = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TypeScript (React)',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JavaScript (React)',
  py: 'Python',
  python: 'Python',
  sh: 'Bash',
  bash: 'Bash',
  shell: 'Shell',
  zsh: 'Zsh',
  sql: 'SQL',
  pgsql: 'PostgreSQL',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  markdown: 'Markdown',
  env: 'Environment',
  dockerfile: 'Docker',
};

function highlightSyntax(code: string): React.ReactNode {
  // Regex tokenizing comments, strings, keywords, numbers, function calls, punctuation
  const tokenRegex =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|--[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|return|async|await|import|export|from|class|extends|if|else|switch|case|for|while|do|try|catch|finally|throw|new|typeof|instanceof|interface|type|default|break|continue|def|lambda|elif|SELECT|FROM|WHERE|INSERT|INTO|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|CREATE|TABLE|ALTER|DROP|AS|AND|OR|NOT|NULL|TRUE|FALSE|true|false)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())|([{}()[\];,]|=>|[=+\-*/%&|^!<>?:])/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      elements.push(code.slice(lastIndex, match.index));
    }

    const [full, comment, str, keyword, num, fnName, punct] = match;

    if (comment) {
      elements.push(
        <span key={keyIdx++} className="text-slate-400 italic">
          {comment}
        </span>
      );
    } else if (str) {
      elements.push(
        <span key={keyIdx++} className="text-emerald-300">
          {str}
        </span>
      );
    } else if (keyword) {
      elements.push(
        <span key={keyIdx++} className="text-sky-300 font-semibold">
          {keyword}
        </span>
      );
    } else if (num) {
      elements.push(
        <span key={keyIdx++} className="text-amber-300">
          {num}
        </span>
      );
    } else if (fnName) {
      elements.push(
        <span key={keyIdx++} className="text-cyan-300">
          {fnName}
        </span>
      );
    } else if (punct) {
      elements.push(
        <span key={keyIdx++} className="text-slate-400">
          {punct}
        </span>
      );
    } else {
      elements.push(full);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    elements.push(code.slice(lastIndex));
  }

  return elements;
}

export default function CodeBlock({ code, language = '', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const cleanLang = language.trim().toLowerCase();
  const displayLang = LANG_LABELS[cleanLang] || (cleanLang ? cleanLang.toUpperCase() : 'CODE');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      try {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Ignore fallback errors
      }
    }
  };

  return (
    <div className="relative my-7 rounded-2xl overflow-hidden border border-slate-800 bg-[#0A1120] shadow-xl text-xs md:text-sm">
      {/* Code window chrome header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F172A] border-b border-slate-800 text-slate-400 select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          {filename ? (
            <span className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
              <Terminal size={12} className="text-slate-400" />
              {filename}
            </span>
          ) : (
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 font-mono">
              {displayLang}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150 text-slate-400 hover:text-white hover:bg-slate-800/80 active:scale-95 cursor-pointer"
          title="Copy code to clipboard"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="p-4 md:p-5 overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <pre className="m-0 p-0 font-mono text-[13px] md:text-sm leading-relaxed whitespace-pre">
          <code>{highlightSyntax(code)}</code>
        </pre>
      </div>
    </div>
  );
}
