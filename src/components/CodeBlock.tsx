'use client';

import React, { useState } from 'react';
import { CopyIcon, CheckIcon, TerminalIcon, DockerIcon, FileCodeIcon, LayersIcon } from './Icons';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

export function CodeBlock({ children, className = '', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const extractText = (node: React.ReactNode): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
      return extractText((node.props as { children?: React.ReactNode }).children);
    }
    return '';
  };

  const rawCode = extractText(children).trim();

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1].toLowerCase() : detectLanguage(rawCode);

  function detectLanguage(code: string): string {
    const trimmed = code.trim();
    if (trimmed.startsWith('FROM ') || trimmed.startsWith('WORKDIR ') || trimmed.startsWith('CMD ') || trimmed.startsWith('ENTRYPOINT ') || trimmed.startsWith('COPY ')) {
      return 'dockerfile';
    }
    if (trimmed.startsWith('docker ') || trimmed.startsWith('npm ') || trimmed.startsWith('echo ') || trimmed.startsWith('curl ') || trimmed.startsWith('#')) {
      return 'bash';
    }
    if (trimmed.includes('services:') || trimmed.includes('version:') || trimmed.startsWith('volumes:')) {
      return 'yaml';
    }
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json';
    }
    return 'terminal';
  }

  const handleCopy = async () => {
    if (!rawCode) return;
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = rawCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getLanguageMeta = (lang: string) => {
    switch (lang) {
      case 'dockerfile':
        return {
          label: title || 'Dockerfile',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          icon: <DockerIcon className="w-3.5 h-3.5 text-cyan-400" size={14} />,
        };
      case 'bash':
      case 'sh':
      case 'shell':
      case 'terminal':
        return {
          label: title || 'Terminal',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" size={14} />,
        };
      case 'yaml':
      case 'yml':
        return {
          label: title || 'docker-compose.yml',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <LayersIcon className="w-3.5 h-3.5 text-amber-400" size={14} />,
        };
      case 'json':
        return {
          label: title || 'config.json',
          badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
          icon: <FileCodeIcon className="w-3.5 h-3.5 text-pink-400" size={14} />,
        };
      default:
        return {
          label: title || (lang || 'Code').toUpperCase(),
          badge: 'bg-slate-700/50 text-slate-300 border-slate-600/40',
          icon: <FileCodeIcon className="w-3.5 h-3.5 text-slate-400" size={14} />,
        };
    }
  };

  const meta = getLanguageMeta(language);
  const lineCount = rawCode ? rawCode.split('\n').length : 0;

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-[var(--border-card)] bg-[var(--code-bg)] shadow-xl transition-all group">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[var(--code-header)] border-b border-[var(--border-card)] text-xs select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Window dots */}
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[11px] font-mono font-medium tracking-wide ${meta.badge}`}>
            {meta.icon}
            <span>{meta.label}</span>
          </span>

          {lineCount > 1 && (
            <span className="hidden sm:inline-block text-[11px] font-mono text-[var(--text-muted)]">
              {lineCount} lines
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all duration-150 cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-black/30 hover:bg-black/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
          }`}
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5 text-emerald-400" size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]" size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto text-[0.88rem] leading-relaxed font-mono font-normal text-slate-200 [data-theme='sepia']_&:text-[#f0e6d2] bg-[var(--code-bg)]">
        <pre className="!bg-transparent !p-0 !m-0 whitespace-pre overflow-x-auto font-mono">
          <code className={`${className} !bg-transparent !p-0 block whitespace-pre font-mono`}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
}
