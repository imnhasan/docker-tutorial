'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Block, Step } from '@/data/tutorial';
import { CopyIcon, CheckIcon, SparklesIcon, InfoIcon } from './Icons';

/** Render `inline code` inside plain strings. */
export function RichText({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
          <code
            key={i}
            className="px-1.5 py-0.5 mx-0.5 rounded-md font-mono text-[0.85em] bg-[var(--bg-elevated)] text-[var(--accent-color)] border border-[var(--border-subtle)] font-medium whitespace-nowrap"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </span>
  );
}

function miniLangClass(lang: Step['lang']): string {
  switch (lang) {
    case 'dockerfile':
      return 'text-cyan-400 dark:text-cyan-300';
    case 'yaml':
    case 'json':
      return 'text-amber-400 dark:text-amber-300';
    default:
      return 'text-emerald-400 dark:text-emerald-300';
  }
}

function Snippet({ code, lang = 'bash' }: { code: string; lang?: Step['lang'] }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mt-2.5 rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--code-bg)] shadow-inner group">
      <div className="flex items-center justify-between">
        <div className={`flex-1 px-3.5 py-2 font-mono text-[0.82rem] font-medium overflow-x-auto whitespace-pre ${miniLangClass(lang)}`}>
          {code}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy command"
          title="Copy command"
          className={`shrink-0 m-1.5 px-2.5 py-1 rounded-md font-mono text-[10px] font-semibold tracking-wider uppercase border transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
              : 'bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)]'
          }`}
        >
          {copied ? <CheckIcon className="w-3 h-3 text-emerald-400" size={12} /> : <CopyIcon className="w-3 h-3 text-[var(--text-muted)]" size={12} />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>
    </div>
  );
}

/** Full-size code block with syntax coloring. */
function RichCode({ code, lang, title }: { code: string; lang: Step['lang'] | 'dockerfile' | 'bash' | 'yaml' | 'json'; title?: string }) {
  const [copied, setCopied] = useState(false);
  const fence = lang === 'json' ? 'json' : lang === 'yaml' ? 'yaml' : lang === 'dockerfile' ? 'dockerfile' : 'bash';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const label =
    title ??
    (fence === 'dockerfile' ? 'Dockerfile' : fence === 'bash' ? 'Terminal' : fence === 'yaml' ? 'docker-compose.yml' : 'JSON');

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-[var(--border-card)] bg-[var(--code-bg)] shadow-xl group">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-[var(--code-header)] border-b border-[var(--border-card)]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-[var(--bg-elevated)] text-[var(--accent-color)] border border-[var(--border-subtle)] truncate">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code block"
          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium rounded-md border transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
              : 'bg-black/30 hover:bg-black/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)]'
          }`}
        >
          {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" size={14} /> : <CopyIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto font-mono text-[0.88rem] leading-relaxed text-slate-200 [data-theme='sepia']_&:text-[#f0e6d2]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre: ({ children }) => (
              <pre className="!bg-transparent !p-0 !m-0 whitespace-pre overflow-x-auto font-mono">
                {children}
              </pre>
            ),
            code: ({ children, className }) => (
              <code className={`${className ?? ''} !bg-transparent !p-0 font-mono whitespace-pre block`}>
                {children}
              </code>
            ),
          }}
        >
          {`\`\`\`${fence}\n${code}\n\`\`\``}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export function LessonBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, bi) => {
        switch (block.k) {
          case 'p':
            return (
              <p key={bi} className="text-[var(--text-primary)] leading-relaxed text-[0.96rem]">
                <RichText text={block.text} />
              </p>
            );
          case 'code':
            return <RichCode key={bi} code={block.code} lang={block.lang} title={block.title} />;
          case 'steps':
            return (
              <ol key={bi} className="my-4 space-y-3">
                {block.items.map((step, si) => (
                  <li
                    key={si}
                    className="flex gap-3 items-start bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-card-hover)] rounded-xl p-3.5 transition-colors"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-lg bg-[var(--accent-bg)] text-[var(--accent-color)] border border-[var(--accent-border)] text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                      {si + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      {step.text && (
                        <p className="text-[0.93rem] font-medium text-[var(--text-primary)] leading-relaxed">
                          <RichText text={step.text} />
                        </p>
                      )}
                      {step.code && <Snippet code={step.code} lang={step.lang} />}
                      {step.note && (
                        <p className="mt-2 text-xs font-normal text-[var(--text-muted)] flex items-center gap-1.5">
                          <span className="text-[var(--accent-color)]">↳</span>
                          <RichText text={step.note} />
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            );
          case 'note':
            return (
              <div key={bi} className="my-4 rounded-xl border border-[var(--callout-note-border)] bg-[var(--callout-note-bg)] p-4 flex gap-3 items-start shadow-sm">
                <InfoIcon className="w-5 h-5 text-[var(--callout-note-text)] shrink-0 mt-0.5" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--callout-note-text)] mb-1">
                    Note
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--callout-note-text)] font-normal opacity-95">
                    <RichText text={block.text} />
                  </p>
                </div>
              </div>
            );
          case 'tip':
            return (
              <div key={bi} className="my-4 rounded-xl border border-[var(--callout-tip-border)] bg-[var(--callout-tip-bg)] p-4 flex gap-3 items-start shadow-sm">
                <SparklesIcon className="w-5 h-5 text-[var(--callout-tip-text)] shrink-0 mt-0.5" size={20} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--callout-tip-text)] mb-1">
                    Pro Tip
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--callout-tip-text)] font-normal opacity-95">
                    <RichText text={block.text} />
                  </p>
                </div>
              </div>
            );
          case 'table':
            return (
              <div key={bi} className="my-4 overflow-hidden rounded-xl border border-[var(--border-card)] bg-[var(--bg-card-solid)] shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                        {block.head.map((h, hi) => (
                          <th key={hi} className="px-4 py-3 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {block.rows.map((row, ri) => (
                        <tr key={ri} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                          {row.map((cell, ci) => (
                            <td key={ci} className="px-4 py-2.5 text-[var(--text-primary)]">
                              {ci === 0 ? (
                                <code className="px-2 py-0.5 rounded bg-[var(--accent-bg)] text-[var(--accent-color)] border border-[var(--accent-border)] font-mono text-xs font-semibold">
                                  {cell}
                                </code>
                              ) : (
                                <RichText text={cell} />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          case 'chips':
            return (
              <div key={bi} className="my-3 flex flex-wrap gap-2">
                {block.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card-solid)] text-xs font-medium text-[var(--text-primary)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]" />
                    <RichText text={item} />
                  </div>
                ))}
              </div>
            );
          case 'link':
            return (
              <a
                key={bi}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="my-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent-color)] hover:opacity-90 text-sm font-medium transition-all group"
              >
                <span>{block.label}</span>
                <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
