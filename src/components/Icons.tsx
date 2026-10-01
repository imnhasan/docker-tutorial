import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
}

export function DockerIcon({ className = "w-5 h-5", size = "1.25rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ display: 'inline-block' }}
    >
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 2.714h2.12a.186.186 0 00.184-.185V9.006a.185.185 0 00-.185-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m0-2.714h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185h-2.119a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.955 5.428h2.118a.185.185 0 00.186-.185V11.72a.186.186 0 00-.186-.186H5.144a.185.185 0 00-.185.186v1.888c0 .102.083.185.185.185m0-2.714h2.118a.185.185 0 00.186-.185V9.006a.186.186 0 00-.186-.186H5.144a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m0-2.714h2.118a.185.185 0 00.186-.186V6.29a.186.186 0 00-.186-.185H5.144a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.93 5.428h2.12a.185.185 0 00.184-.185V11.72a.185.185 0 00-.185-.186H2.214a.185.185 0 00-.185.186v1.888c0 .102.083.185.185.185m0-2.714h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.185-.186H2.214a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m21.688 1.488a9.356 9.356 0 00-3.32-3.864c-.366-.25-.873-.13-1.077.251-.252.47-.384 1.016-.384 1.584 0 .324.045.642.13.948-1.57.106-4.996.173-6.236.173H1.47c-.504 0-.912.408-.912.912 0 4.093 3.32 7.412 7.412 7.412 5.068 0 8.784-3.13 11.026-6.497.643-.028 1.403-.186 2.052-.738.257-.218.29-.607.072-.864l-.098-.117z" />
    </svg>
  );
}

export function TerminalIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 17l6-6-6-6m8 14h8" />
    </svg>
  );
}

export function FileCodeIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export function CopyIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

export function CheckIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function SearchIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export function SunIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

export function MoonIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

export function SepiaIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

export function BookOpenIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function BookmarkIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

export function ArrowUpIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

export function LayersIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

export function LinkIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

export function SparklesIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z" />
    </svg>
  );
}

export function InfoIcon({ className = "w-4 h-4", size = "1rem" }: IconProps) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      style={{ display: 'inline-block' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
