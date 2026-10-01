'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DockerIcon,
  SearchIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  LinkIcon,
  LayersIcon,
  BookOpenIcon,
  SparklesIcon,
  MoonIcon,
  SunIcon,
  SepiaIcon,
} from './Icons';
import { LessonBody } from './LessonBody';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LESSONS, CATEGORIES, type Block, type Lesson } from '@/data/tutorial';

type ThemeMode = 'dark' | 'sepia' | 'light';

interface TutorialPart {
  id: number;
  partNumber: number;
  heading: string;
  title: string;
  category: string;
  level: string;
  summary: string;
  blocks: Block[];
  searchable: string;
  readingTime: number;
}

function blocksToText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.k) {
        case 'p':
        case 'note':
        case 'tip':
          return b.text;
        case 'code':
          return `${b.title ?? ''}\n${b.code}`;
        case 'steps':
          return b.items.map((s) => `${s.text ?? ''}\n${s.code ?? ''}\n${s.note ?? ''}`).join('\n');
        case 'table':
          return [...b.head, ...b.rows.flat()].join(' ');
        case 'chips':
          return b.items.join(' ');
        case 'link':
          return b.label;
        default:
          return '';
      }
    })
    .join('\n');
}

const CATEGORY_COLORS: Record<string, { badge: string; dot: string }> = {
  Intro: { badge: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]', dot: 'bg-slate-400' },
  Basics: { badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30', dot: 'bg-sky-400' },
  Images: { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-400' },
  Containers: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  Compose: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  Production: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dot: 'bg-rose-400' },
  All: { badge: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]', dot: 'bg-slate-400' },
};

export function DockerTutorialReader({ rawMarkdown = '' }: { rawMarkdown?: string }) {
  const parts: TutorialPart[] = useMemo(() => {
    return LESSONS.map((lesson: Lesson) => {
      const searchable = blocksToText(lesson.blocks);
      const words = `${lesson.title} ${lesson.summary} ${searchable}`.split(/\s+/).length;
      return {
        id: lesson.n,
        partNumber: lesson.n,
        heading: lesson.n === 0 ? 'Introduction' : `Part ${lesson.n}`,
        title: lesson.title,
        category: lesson.category,
        level: lesson.level,
        summary: lesson.summary,
        blocks: lesson.blocks,
        searchable,
        readingTime: Math.max(1, Math.ceil(words / 140)),
      };
    });
  }, []);

  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activePartId, setActivePartId] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'stream' | 'focus' | 'doc'>('stream');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedParts, setCompletedParts] = useState<number[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLinkPartId, setCopiedLinkPartId] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('docker_tutorial_theme') as ThemeMode | null;
      if (savedTheme && ['dark', 'sepia', 'light'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
      const savedCompleted = localStorage.getItem('docker_tutorial_completed');
      if (savedCompleted) setCompletedParts(JSON.parse(savedCompleted));
      const savedMode = localStorage.getItem('docker_tutorial_mode') as 'stream' | 'focus' | 'doc' | null;
      if (savedMode && ['stream', 'focus', 'doc'].includes(savedMode)) setViewMode(savedMode);
      const savedFont = localStorage.getItem('docker_tutorial_font') as 'sm' | 'md' | 'lg' | null;
      if (savedFont && ['sm', 'md', 'lg'].includes(savedFont)) setFontSize(savedFont);
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Sync theme with HTML root class & data-theme attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.remove('dark', 'sepia', 'light');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  // Keyboard shortcut: '/' or 'Ctrl+K' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' && document.activeElement !== searchInputRef.current) || ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('docker_tutorial_theme', newTheme);
    } catch { /* noop */ }
  };

  const toggleCompleted = (partNumber: number) => {
    setCompletedParts((prev) => {
      const updated = prev.includes(partNumber)
        ? prev.filter((id) => id !== partNumber)
        : [...prev, partNumber];
      try {
        localStorage.setItem('docker_tutorial_completed', JSON.stringify(updated));
      } catch { /* noop */ }
      return updated;
    });
  };

  const handleModeChange = (newMode: 'stream' | 'focus' | 'doc') => {
    setViewMode(newMode);
    try {
      localStorage.setItem('docker_tutorial_mode', newMode);
    } catch { /* noop */ }
  };

  const handleFontChange = (newFont: 'sm' | 'md' | 'lg') => {
    setFontSize(newFont);
    try {
      localStorage.setItem('docker_tutorial_font', newFont);
    } catch { /* noop */ }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
      setShowScrollTop(window.scrollY > 400);

      if (viewMode === 'stream') {
        const partElements = parts.map((p) => ({
          id: p.partNumber,
          elem: document.getElementById(`part-${p.partNumber}`),
        }));

        const offset = 180;
        for (let i = partElements.length - 1; i >= 0; i--) {
          const item = partElements[i];
          if (item.elem) {
            const rect = item.elem.getBoundingClientRect();
            if (rect.top <= offset) {
              setActivePartId(item.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parts, viewMode]);

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const matchesSearch =
        part.title.toLowerCase().includes(query) ||
        part.heading.toLowerCase().includes(query) ||
        part.summary.toLowerCase().includes(query) ||
        part.searchable.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [parts, searchQuery, selectedCategory]);

  const scrollToPart = (partNumber: number) => {
    setActivePartId(partNumber);
    if (viewMode === 'focus') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(`part-${partNumber}`);
    if (elem) {
      const top = elem.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const copyPartLink = (partNumber: number) => {
    const url = `${window.location.origin}${window.location.pathname}#part-${partNumber}`;
    try {
      navigator.clipboard.writeText(url);
    } catch { /* noop */ }
    setCopiedLinkPartId(partNumber);
    setTimeout(() => setCopiedLinkPartId(null), 2000);
  };

  const jumpRandom = () => {
    const pool = parts.filter((p) => p.partNumber > 0);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) scrollToPart(pick.partNumber);
  };

  const fontScaleClass = {
    sm: 'text-[0.93rem]',
    md: 'text-[1rem]',
    lg: 'text-[1.08rem]',
  }[fontSize];

  const completedCount = completedParts.length;
  const totalCount = parts.filter((p) => p.partNumber > 0).length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentFocusPart = parts.find((p) => p.partNumber === activePartId) || parts[0];

  return (
    <div
      data-theme={theme}
      className={`min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col antialiased transition-colors duration-200 theme-${theme}`}
    >
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-header)] border-b border-[var(--border-subtle)] transition-colors">
        {/* Progress bar line */}
        <div
          className="h-1 w-full bg-[var(--border-subtle)] overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(viewMode === 'stream' ? scrollProgress : ((activePartId + 1) / parts.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-amber-500 to-emerald-500 transition-all duration-200"
            style={{
              width: `${viewMode === 'stream' ? scrollProgress : ((activePartId + 1) / parts.length) * 100}%`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Hide contents' : 'Show contents'}
              className="p-2 rounded-lg bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors flex items-center justify-center cursor-pointer"
            >
              <LayersIcon className="w-5 h-5" size={18} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <DockerIcon className="w-5 h-5 text-white" size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-[var(--text-primary)] leading-none">
                    Docker<span className="text-[var(--accent-color)]">Playbook</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[var(--accent-bg)] text-[var(--accent-color)] border border-[var(--accent-border)]">
                    39 Modules
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] hidden sm:block mt-0.5">
                  Complete hands-on reference & masterclass
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" size={16} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search commands, topics, keywords... (Press /)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 rounded-xl text-xs font-mono bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder:text-[var(--text-muted)] transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-muted)] text-xs rounded cursor-pointer"
                >
                  ✕
                </button>
              ) : (
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[var(--bg-button)] text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-subtle)] pointer-events-none">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Controls: Theme Selector, Mode Switcher, Font Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Selector: Dark, Sepia, Light */}
            <div
              className="flex items-center rounded-xl bg-[var(--bg-button)] border border-[var(--border-subtle)] p-0.5 text-xs font-medium"
              title="Reading theme"
            >
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-sky-400 shadow-sm font-semibold border border-slate-700/80'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Dark theme (Slate)"
              >
                <MoonIcon className="w-3.5 h-3.5" size={14} />
                <span className="hidden xl:inline text-[11px]">Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange('sepia')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  theme === 'sepia'
                    ? 'bg-[#eddcc2] text-[#5c3e1e] shadow-sm font-semibold border border-[#d6be9a]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Sepia theme (Warm parchment for reading)"
              >
                <SepiaIcon className="w-3.5 h-3.5 text-amber-700" size={14} />
                <span className="text-[11px] font-semibold">Sepia</span>
              </button>
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold border border-slate-200'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Light theme"
              >
                <SunIcon className="w-3.5 h-3.5" size={14} />
                <span className="hidden xl:inline text-[11px]">Light</span>
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-[var(--bg-button)] border border-[var(--border-subtle)] p-0.5 text-xs font-medium">
              <button
                onClick={() => handleModeChange('stream')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'stream'
                    ? 'bg-[var(--accent-color)] text-white shadow-sm font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Continuous scroll reading mode"
              >
                Stream
              </button>
              <button
                onClick={() => handleModeChange('focus')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'focus'
                    ? 'bg-[var(--accent-color)] text-white shadow-sm font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title="Step-by-step focused reading mode"
              >
                Focus
              </button>
              {rawMarkdown && (
                <button
                  onClick={() => handleModeChange('doc')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'doc'
                      ? 'bg-[var(--accent-color)] text-white shadow-sm font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                  title="Full raw documentation view"
                >
                  Doc
                </button>
              )}
            </div>

            {/* Font scale buttons */}
            <div className="hidden sm:flex items-center rounded-xl bg-[var(--bg-button)] border border-[var(--border-subtle)] p-0.5 text-xs font-mono">
              {(['sm', 'md', 'lg'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => handleFontChange(f)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    fontSize === f
                      ? 'bg-[var(--bg-elevated)] text-[var(--accent-color)] font-bold border border-[var(--border-subtle)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                  title={`${f === 'sm' ? 'Compact' : f === 'md' ? 'Default' : 'Large'} text size`}
                >
                  {f === 'sm' ? 'A-' : f === 'md' ? 'A' : 'A+'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="p-3 border-t border-[var(--border-subtle)] md:hidden bg-[var(--bg-header)]">
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" size={16} />
            <input
              type="text"
              placeholder="Search commands, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-xl text-xs font-mono bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent-color)]"
            />
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start gap-8 px-4 sm:px-6 py-8">
        {/* Sidebar */}
        <aside
          className={`shrink-0 transition-all duration-200 z-40 ${
            sidebarOpen ? 'w-full lg:w-[320px]' : 'hidden'
          } fixed lg:sticky inset-x-4 top-24 bottom-6 lg:inset-auto lg:top-24 lg:h-[calc(100vh-7.5rem)]`}
        >
          <div className="bg-[var(--bg-sidebar)] backdrop-blur-xl border border-[var(--border-card)] rounded-2xl shadow-2xl flex flex-col h-full max-h-full overflow-hidden transition-colors">
            {/* Sidebar header */}
            <div className="p-3.5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4 text-[var(--accent-color)]" size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Modules ({filteredParts.length})
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {completedCount}/{totalCount} done
              </span>
            </div>

            {/* Track filters */}
            <div className="p-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] shrink-0">
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                        active
                          ? 'bg-[var(--accent-color)] text-white font-semibold'
                          : 'bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modules List */}
            <nav className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1 overscroll-contain">
              {filteredParts.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <p className="text-xs text-[var(--text-muted)] mb-2">No modules match “{searchQuery}”</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="text-xs text-[var(--accent-color)] hover:underline cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                filteredParts.map((part) => {
                  const isActive = activePartId === part.partNumber;
                  const isDone = completedParts.includes(part.partNumber);
                  const color = CATEGORY_COLORS[part.category] || CATEGORY_COLORS.All;

                  return (
                    <div
                      key={part.partNumber}
                      onClick={() => scrollToPart(part.partNumber)}
                      className={`group flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                        isActive
                          ? 'bg-[var(--accent-bg)] text-[var(--accent-color)] border border-[var(--accent-border)] font-semibold shadow-sm'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`} />
                        <span className="font-mono text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] shrink-0">
                          {part.partNumber === 0 ? 'Intro' : `P${String(part.partNumber).padStart(2, '0')}`}
                        </span>
                        <span className="truncate font-medium">{part.title}</span>
                      </div>

                      {part.partNumber > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompleted(part.partNumber);
                          }}
                          title={isDone ? 'Mark as unread' : 'Mark as done'}
                          aria-label={isDone ? `Mark part ${part.partNumber} as unread` : `Mark part ${part.partNumber} as done`}
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors cursor-pointer ${
                            isDone
                              ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border-emerald-500/50'
                              : 'border-[var(--border-subtle)] text-transparent hover:border-[var(--text-muted)]'
                          }`}
                        >
                          <CheckIcon className="w-3 h-3 text-emerald-500 dark:text-emerald-400" size={12} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </nav>

            {/* Bottom progress info */}
            <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] shrink-0">
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] mb-1.5">
                <span>Course Progress</span>
                <span className="text-emerald-500 dark:text-emerald-400 font-semibold">{completionPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className={`flex-1 min-w-0 ${fontScaleClass}`}>
          {/* Stream Mode */}
          {viewMode === 'stream' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Hero Banner (Only when not searching) */}
              {!searchQuery && selectedCategory === 'All' && (
                <section className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors">
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-bg)] text-[var(--accent-color)] border border-[var(--accent-border)] text-xs font-mono mb-4">
                      <SparklesIcon className="w-3.5 h-3.5" size={14} />
                      <span>Zero-Boredom Docker Masterclass</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
                      Master Docker from Zero to Production.
                    </h2>
                    <p className="mt-3 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-2xl">
                      39 hands-on modules designed for developers and DevOps engineers. Every part adds exactly one concept on top of real Dockerfiles and Compose stacks. Run the commands in your terminal as you go.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => scrollToPart(1)}
                        className="px-4 py-2 rounded-xl bg-[var(--accent-color)] hover:opacity-90 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-lg flex items-center gap-2"
                      >
                        <span>Start at Part 01</span>
                        <span>→</span>
                      </button>
                      <button
                        onClick={jumpRandom}
                        className="px-4 py-2 rounded-xl bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-primary)] font-medium text-xs sm:text-sm border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <span>🎲 Surprise Me</span>
                      </button>
                    </div>

                    <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex flex-wrap gap-4 text-xs font-mono text-[var(--text-muted)]">
                      <span>✓ 39 Step-by-Step Parts</span>
                      <span>✓ 5 Learning Tracks</span>
                      <span>✓ Copy-Paste Terminal Ready</span>
                      <span>✓ Browser Progress Saved</span>
                    </div>
                  </div>
                </section>
              )}

              {/* Module Cards */}
              {filteredParts.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]">
                  <p className="text-[var(--text-muted)] mb-3">No modules match your current search.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white text-xs font-medium cursor-pointer"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                filteredParts.map((part) => {
                  const isCompleted = completedParts.includes(part.partNumber);
                  const color = CATEGORY_COLORS[part.category] || CATEGORY_COLORS.All;

                  return (
                    <article
                      key={part.partNumber}
                      id={`part-${part.partNumber}`}
                      className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-xl transition-all duration-200 hover:border-[var(--border-card-hover)] scroll-mt-24"
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--border-subtle)]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[var(--bg-button)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                            {part.partNumber === 0 ? 'START HERE' : `PART ${String(part.partNumber).padStart(2, '0')}`}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${color.badge}`}>
                            {part.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                            {part.level}
                          </span>
                          <span className="text-[11px] text-[var(--text-muted)] font-mono">
                            · ~{part.readingTime} min
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => copyPartLink(part.partNumber)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                            title="Copy anchor link"
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" size={14} />
                            <span>{copiedLinkPartId === part.partNumber ? 'Copied!' : 'Link'}</span>
                          </button>

                          {part.partNumber > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleCompleted(part.partNumber)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border-emerald-500/40'
                                  : 'bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                              }`}
                            >
                              <CheckIcon className="w-3.5 h-3.5" size={14} />
                              <span>{isCompleted ? 'Done ✓' : 'Mark Done'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Title & Summary */}
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-3">
                        {part.title}
                      </h3>

                      <div className="mb-6 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[0.93rem] leading-relaxed">
                        {part.summary}
                      </div>

                      {/* Body Content */}
                      <LessonBody blocks={part.blocks} />

                      {/* Navigation between parts */}
                      <div className="mt-8 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 flex-wrap">
                        {part.partNumber > 1 ? (
                          <button
                            onClick={() => scrollToPart(part.partNumber - 1)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                          >
                            <ChevronLeftIcon className="w-3.5 h-3.5" size={14} />
                            <span>Part {part.partNumber - 1}</span>
                          </button>
                        ) : (
                          <span />
                        )}

                        {part.partNumber < 39 ? (
                          <button
                            onClick={() => scrollToPart(part.partNumber + 1)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-white text-xs font-mono font-medium transition-colors cursor-pointer"
                          >
                            <span>Part {part.partNumber + 1}</span>
                            <ChevronRightIcon className="w-3.5 h-3.5" size={14} />
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                            🎉 All 39 Modules Finished!
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

          {/* Focus Mode */}
          {viewMode === 'focus' && currentFocusPart && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Focus Navigation Bar */}
              <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3 flex items-center justify-between gap-3">
                <button
                  disabled={currentFocusPart.partNumber <= 0}
                  onClick={() => scrollToPart(currentFocusPart.partNumber - 1)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-subtle)] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeftIcon className="w-4 h-4" size={16} />
                  <span>Prev</span>
                </button>

                <div className="text-center min-w-0 px-2">
                  <div className="text-xs font-mono text-[var(--accent-color)]">
                    Module {currentFocusPart.partNumber} of 39
                  </div>
                  <div className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-xs sm:max-w-sm">
                    {currentFocusPart.title}
                  </div>
                </div>

                <button
                  disabled={currentFocusPart.partNumber >= 39}
                  onClick={() => scrollToPart(currentFocusPart.partNumber + 1)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-xs font-mono font-medium text-white disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="w-4 h-4" size={16} />
                </button>
              </div>

              {/* Single Module Card */}
              <article className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[var(--bg-button)] text-[var(--text-primary)]">
                      Part {currentFocusPart.partNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[var(--accent-bg)] text-[var(--accent-color)] border border-[var(--accent-border)]">
                      {currentFocusPart.category}
                    </span>
                  </div>

                  {currentFocusPart.partNumber > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleCompleted(currentFocusPart.partNumber)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border cursor-pointer ${
                        completedParts.includes(currentFocusPart.partNumber)
                          ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border-emerald-500/40'
                          : 'bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                      }`}
                    >
                      <CheckIcon className="w-3.5 h-3.5" size={14} />
                      <span>{completedParts.includes(currentFocusPart.partNumber) ? 'Done ✓' : 'Mark Done'}</span>
                    </button>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
                  {currentFocusPart.title}
                </h2>

                <div className="mb-6 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] leading-relaxed">
                  {currentFocusPart.summary}
                </div>

                <LessonBody blocks={currentFocusPart.blocks} />

                <div className="mt-8 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  {currentFocusPart.partNumber > 0 && (
                    <button
                      onClick={() => scrollToPart(currentFocusPart.partNumber - 1)}
                      className="px-4 py-2 rounded-xl bg-[var(--bg-button)] hover:bg-[var(--bg-button-hover)] text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer"
                    >
                      ← Previous Module
                    </button>
                  )}

                  {currentFocusPart.partNumber < 39 ? (
                    <button
                      onClick={() => scrollToPart(currentFocusPart.partNumber + 1)}
                      className="px-4 py-2 rounded-xl bg-[var(--accent-color)] hover:opacity-90 text-xs font-mono font-medium text-white cursor-pointer ml-auto"
                    >
                      Next Module →
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400 ml-auto">
                      All modules complete!
                    </span>
                  )}
                </div>
              </article>
            </div>
          )}

          {/* Doc Mode: Raw Markdown */}
          {viewMode === 'doc' && rawMarkdown && (
            <div className="max-w-4xl mx-auto rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-2xl">
              <MarkdownRenderer content={rawMarkdown} />
            </div>
          )}
        </main>
      </div>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[var(--bg-card)] hover:bg-[var(--accent-color)] text-[var(--text-primary)] hover:text-white border border-[var(--border-card)] shadow-xl transition-all duration-200 cursor-pointer"
        >
          <ArrowUpIcon className="w-5 h-5" size={20} />
        </button>
      )}
    </div>
  );
}
