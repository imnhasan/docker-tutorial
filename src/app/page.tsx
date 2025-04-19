import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export default function HomePage() {
  const readmePath = path.join(process.cwd(), 'src', 'app', 'docker-tutorial.md');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  return (
    <main className="flex justify-center min-h-screen items-start pt-20 bg-white">
      <article className="prose prose-lg">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {readmeContent}
        </ReactMarkdown>
      </article>
    </main>
  );
}
