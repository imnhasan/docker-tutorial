'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { CodeBlock } from './CodeBlock';
import { InfoIcon, SparklesIcon } from './Icons';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const enrichedContent = React.useMemo(() => {
    return content
      .replace(/#####\s+Dockerfile\s*\n+```\s*\n/g, '##### Dockerfile\n\n```dockerfile\n')
      .replace(/#####\s+bash\s*\n+```\s*\n/g, '##### bash\n\n```bash\n')
      .replace(/#####\s+docker-compose\.ya?ml\s*\n+```\s*\n/g, '##### docker-compose.yml\n\n```yaml\n')
      .replace(/#####\s+yml\s*\n+```\s*\n/g, '##### yml\n\n```yaml\n')
      .replace(/#####\s+json\s*\n+```\s*\n/g, '##### json\n\n```json\n')
      .replace(/#####\s+\.dockerignore\s*\n+```\s*\n/g, '##### .dockerignore\n\n```dockerfile\n');
  }, [content]);

  return (
    <div className="max-w-none text-[var(--text-primary)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-6 mt-8 pb-3 border-b border-[var(--border-subtle)]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-4 mt-10 pb-2 border-b border-[var(--border-subtle)]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)] mb-3 mt-8">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2 mt-6">
              {children}
            </h4>
          ),
          h5: ({ children }) => {
            const title = String(children).trim();
            return (
              <div className="inline-flex items-center gap-2 mt-5 -mb-2 px-3 py-1 rounded-md bg-[var(--bg-elevated)] text-[var(--accent-color)] border border-[var(--border-subtle)] text-xs font-mono font-medium">
                <span>{title}</span>
              </div>
            );
          },
          p: ({ children }) => {
            const rawText = String(children);
            const lower = rawText.toLowerCase();
            const isNote = lower.startsWith('note:') || lower.startsWith('note ');
            const isTip = lower.startsWith('tip:') || lower.startsWith('pro tip:') || lower.startsWith('protip:');

            if (isTip) {
              return (
                <div className="my-4 rounded-xl border border-[var(--callout-tip-border)] bg-[var(--callout-tip-bg)] p-4 flex gap-3 items-start shadow-sm">
                  <SparklesIcon className="w-5 h-5 text-[var(--callout-tip-text)] shrink-0 mt-0.5" size={20} />
                  <div className="flex-1 text-sm leading-relaxed text-[var(--callout-tip-text)] font-normal">
                    {children}
                  </div>
                </div>
              );
            }

            if (isNote) {
              return (
                <div className="my-4 rounded-xl border border-[var(--callout-note-border)] bg-[var(--callout-note-bg)] p-4 flex gap-3 items-start shadow-sm">
                  <InfoIcon className="w-5 h-5 text-[var(--callout-note-text)] shrink-0 mt-0.5" size={20} />
                  <div className="flex-1 text-sm leading-relaxed text-[var(--callout-note-text)] font-normal">
                    {children}
                  </div>
                </div>
              );
            }

            return (
              <p className="my-3 text-[var(--text-primary)] leading-relaxed text-[0.98rem]">
                {children}
              </p>
            );
          },
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 mx-0.5 rounded-md font-mono text-[0.86em] bg-[var(--bg-elevated)] text-[var(--accent-color)] border border-[var(--border-subtle)] font-medium"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          table: ({ children }) => (
            <div className="my-6 overflow-hidden rounded-xl border border-[var(--border-card)] bg-[var(--bg-card-solid)] shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)] font-normal">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[var(--bg-card-hover)] transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-[var(--text-secondary)]">
              {children}
            </th>
          ),
          td: ({ children }) => {
            const text = String(children);
            const isCommand = /^[A-Z_]+$/.test(text.trim());
            return (
              <td className="px-4 py-2.5 font-mono text-[0.88rem] text-[var(--text-primary)]">
                {isCommand ? (
                  <span className="inline-block px-2 py-0.5 rounded bg-[var(--accent-bg)] text-[var(--accent-color)] border border-[var(--accent-border)] text-xs font-semibold">
                    {children}
                  </span>
                ) : (
                  children
                )}
              </td>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-color)] font-medium underline decoration-current/40 underline-offset-4 hover:decoration-current transition-colors"
            >
              {children} ↗
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-4 space-y-2 text-[var(--text-primary)] pl-5 list-disc marker:text-[var(--accent-color)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 space-y-2 text-[var(--text-primary)] pl-5 list-decimal marker:text-[var(--accent-color)]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-[0.96rem]">
              {children}
            </li>
          ),
          hr: () => <hr className="my-8 border-t border-[var(--border-subtle)]" />,
          blockquote: ({ children }) => (
            <blockquote className="my-4 pl-4 border-l-4 border-[var(--accent-color)] bg-[var(--accent-bg)] py-2 pr-4 rounded-r-lg text-[var(--text-primary)] italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {enrichedContent}
      </ReactMarkdown>
    </div>
  );
}
