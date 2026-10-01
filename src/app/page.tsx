import fs from 'fs';
import path from 'path';
import React from 'react';
import { DockerTutorialReader } from '@/components/DockerTutorialReader';

export const metadata = {
  title: 'Docker Playbook — 39 Hands-On Modules',
  description: 'Complete, hands-on Docker masterclass: Dockerfiles, images, containers, volumes, Compose and production.',
};

export default function HomePage() {
  const readmePath = path.join(process.cwd(), 'src', 'app', 'docker-tutorial.md');
  let readmeContent = '';
  try {
    readmeContent = fs.readFileSync(readmePath, 'utf8');
  } catch {
    readmeContent = '';
  }

  return <DockerTutorialReader rawMarkdown={readmeContent} />;
}