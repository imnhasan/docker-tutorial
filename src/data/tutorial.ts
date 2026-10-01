export type CodeLang = 'dockerfile' | 'bash' | 'yaml' | 'json';

export interface Step {
  text?: string;
  code?: string;
  lang?: CodeLang;
  note?: string;
}

export type Block =
  | { k: 'p'; text: string }
  | { k: 'code'; lang: CodeLang; title?: string; code: string }
  | { k: 'steps'; items: Step[] }
  | { k: 'note'; text: string }
  | { k: 'tip'; text: string }
  | { k: 'table'; head: string[]; rows: string[][] }
  | { k: 'chips'; items: string[] }
  | { k: 'link'; label: string; href: string };

export interface Lesson {
  n: number;
  title: string;
  category: string;
  level: 'Start' | 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  blocks: Block[];
}

export const CATEGORIES = ['All', 'Basics', 'Images', 'Containers', 'Compose', 'Production'];

export const LESSONS: Lesson[] = [
  {
    n: 0,
    title: 'Docker Masterclass Playbook',
    category: 'Intro',
    level: 'Start',
    summary: '39 bite-size, hands-on modules that take you from your first Dockerfile to multi-container production apps.',
    blocks: [
      { k: 'p', text: 'This playbook is one continuous build-up: every part adds exactly one idea on top of the previous Dockerfile. Follow it in order, run every command, and you will end Docker confusion for good.' },
      {
        k: 'steps',
        items: [
          { text: 'Work top to bottom — Part 01 → Part 39. Each card builds on the last.' },
          { text: 'Run every `bash` block in your own terminal. Reading is not learning — typing is.' },
          { text: 'Watch the `Dockerfile` blocks grow. By Part 10 you have a production-grade file.' },
          { text: 'Tick “Mark done” on each card. Your progress is saved in this browser.' },
        ],
      },
      { k: 'p', text: 'The five tracks:' },
      { k: 'chips', items: ['Basics (01–10): build your first solid image', 'Images (11–14): tags, Hub & sharing', 'Containers (15–25): run, inspect & store data', 'Compose (26–36): multi-container apps', 'Production (37–39): migrations, tests & deploy'] },
      { k: 'tip', text: 'Stuck on a command? Every bash block has a COPY button — paste it into your terminal and read the output before moving on.' },
    ],
  },
  {
    n: 1,
    title: 'Dockerfile Instructions Overview',
    category: 'Basics',
    level: 'Beginner',
    summary: 'The 10 instructions a Dockerfile understands. You will use every single one of them by Part 10.',
    blocks: [
      { k: 'p', text: 'A `Dockerfile` is just a recipe: each instruction adds one layer to your image. Here is the full vocabulary — keep this card open while you read Parts 02–10.' },
      {
        k: 'table',
        head: ['Instruction', 'What it does'],
        rows: [
          ['FROM', 'Base image to start from (e.g. node:20-alpine)'],
          ['WORKDIR', 'Working directory inside the image — created if missing'],
          ['COPY', 'Copy files from your machine into the image'],
          ['ADD', 'Like COPY, plus URL fetching and tar auto-extract'],
          ['RUN', 'Execute a command at build time (e.g. npm install)'],
          ['ENV', 'Set an environment variable for the container'],
          ['EXPOSE', 'Document which port the app listens on'],
          ['USER', 'Switch to a non-root user for everything after'],
          ['CMD', 'Default command when the container starts (overridable)'],
          ['ENTRYPOINT', 'Fixed command when the container starts (hard to override)'],
        ],
      },
      { k: 'tip', text: 'Parts 02–10 introduce these one at a time, in the exact order you see above — minus ADD, which you rarely need.' },
    ],
  },
  {
    n: 2,
    title: 'First Dockerfile & Running Containers',
    category: 'Basics',
    level: 'Beginner',
    summary: 'Write a one-line Dockerfile, build it, and step inside your first container.',
    blocks: [
      { k: 'p', text: 'Create a file literally named `Dockerfile` (no extension) in your project directory with this single line:' },
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile', code: 'FROM node:20.15.0-alpine3.20' },
      {
        k: 'steps',
        items: [
          { text: 'Build the image and name it `docker-app` (the dot means “use this folder”):', code: 'docker build -t docker-app .', lang: 'bash' },
          { text: 'Confirm the image exists:', code: 'docker image ls', lang: 'bash' },
          { text: 'Run it interactively (`-it` = interactive terminal):', code: 'docker run -it docker-app', lang: 'bash' },
          { text: 'Try `bash` — it fails. Alpine Linux is tiny and ships no bash:', code: 'docker run -it docker-app bash', lang: 'bash', note: 'Expected error — this is the lesson, not a mistake.' },
          { text: 'Use `sh` instead — Alpine always has it:', code: 'docker run -it docker-app sh', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Alpine images are ~5 MB vs ~1 GB for full Node. Small images build, push and pull dramatically faster.' },
    ],
  },
  {
    n: 3,
    title: 'Setting WORKDIR and COPY',
    category: 'Basics',
    level: 'Beginner',
    summary: 'Give your app a home directory and copy your code into the image.',
    blocks: [
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile', code: ['FROM node:20.15.0-alpine3.20', 'WORKDIR /app', 'COPY . .'].join('\n') },
      {
        k: 'steps',
        items: [
          { text: '`WORKDIR /app` creates the folder and makes every following instruction run inside it.' },
          { text: '`COPY . .` copies everything from your project folder (first dot) into `/app` (second dot).' },
        ],
      },
      { k: 'note', text: 'Without WORKDIR your files land in `/` (the filesystem root) and later commands get confusing. Always set a WORKDIR.' },
    ],
  },
  {
    n: 4,
    title: 'Ignoring Files with .dockerignore',
    category: 'Basics',
    level: 'Beginner',
    summary: 'Keep giant folders like node_modules out of your image with a `.dockerignore` file.',
    blocks: [
      { k: 'p', text: 'Folders like `node_modules` or `vendor` are huge and get rebuilt inside the image anyway — sending them to the Docker daemon only slows your build. Create a `.dockerignore` file next to your `Dockerfile`:' },
      { k: 'code', lang: 'dockerfile', title: '.dockerignore', code: 'node_modules/' },
      {
        k: 'steps',
        items: [
          { text: 'Rebuild — notice the build context is now tiny:', code: 'docker build -t docker-app .', lang: 'bash' },
          { text: 'Step inside and install dependencies there instead:', code: 'docker run -it docker-app sh', lang: 'bash' },
          { code: 'npm install', lang: 'bash' },
        ],
      },
      { k: 'tip', text: '`.dockerignore` works exactly like `.gitignore` — same patterns, same idea: don’t ship what you can rebuild.' },
    ],
  },
  {
    n: 5,
    title: 'Installing Dependencies with RUN',
    category: 'Basics',
    level: 'Beginner',
    summary: 'Bake `npm install` into the image so nobody has to run it manually.',
    blocks: [
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile', code: ['FROM node:20.15.0-alpine3.20', 'WORKDIR /app', 'COPY . .', 'RUN npm install'].join('\n') },
      {
        k: 'steps',
        items: [
          { text: '`RUN` executes while the image is being built — its result becomes a permanent layer:', code: 'docker build -t docker-app .', lang: 'bash' },
          { text: 'Verify the dependencies are already there:', code: 'docker run -it docker-app sh', lang: 'bash' },
        ],
      },
      { k: 'note', text: 'RUN = build time. CMD = run time. Mixing them up is the #1 Dockerfile beginner mistake — Part 09 makes the difference crystal clear.' },
    ],
  },
  {
    n: 6,
    title: 'Environment Variables (ENV)',
    category: 'Basics',
    level: 'Beginner',
    summary: 'Inject configuration like API URLs with `ENV` — no code changes needed per environment.',
    blocks: [
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile', code: ['FROM node:20.15.0-alpine3.20', 'WORKDIR /app', 'COPY . .', 'RUN npm install', 'ENV API_URL=https://myapi.dev'].join('\n') },
      {
        k: 'steps',
        items: [
          { text: 'Start a shell in the container:', code: 'docker run -it docker-app sh', lang: 'bash' },
          { text: 'List all variables:', code: 'printenv', lang: 'bash' },
          { text: '…or read just yours:', code: 'printenv API_URL', lang: 'bash' },
          { text: '…or use shell expansion:', code: 'echo $API_URL', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Same image, different environments: override at run time with `docker run -e API_URL=https://prod.api …` — no rebuild required.' },
    ],
  },
  {
    n: 7,
    title: 'Exposing Container Ports',
    category: 'Basics',
    level: 'Beginner',
    summary: 'Document which port your app listens on. (`EXPOSE` alone does not publish it — Part 18 does that.)',
    blocks: [
      { k: 'p', text: 'Your app serves on port 3000 (`npm start`) or 8080 (`php artisan serve`). Tell Docker about it:' },
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile', code: ['FROM node:20.15.0-alpine3.20', 'WORKDIR /app', 'COPY . .', 'RUN npm install', 'ENV API_URL=https://myapi.dev', 'EXPOSE 3000'].join('\n') },
      { k: 'note', text: 'EXPOSE is documentation + a default for tooling. Traffic still cannot reach the port until you publish it with `-p 80:3000` (see Part 18).' },
    ],
  },
  {
    n: 8,
    title: 'Non-Root User & Security',
    category: 'Basics',
    level: 'Beginner',
    summary: 'Stop running as root: create an `app` group + user and switch to it.',
    blocks: [
      { k: 'p', text: 'By default everything in a container runs as `root`. If the app is compromised, the attacker is root too. Fix it with a dedicated user — first try it live on plain Alpine:' },
      {
        k: 'steps',
        items: [
          { text: 'Open a throwaway Alpine shell:', code: 'docker run -it alpine', lang: 'bash' },
          { text: 'Create group `app` and a system user in it:', code: 'addgroup app && adduser -S -G app app', lang: 'bash' },
        ],
      },
      { k: 'p', text: 'Now bake it into the Dockerfile and switch with `USER`:' },
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile', code: ['FROM node:20.15.0-alpine3.20', 'WORKDIR /app', 'COPY . .', 'RUN npm install', 'ENV API_URL=https://myapi.dev', 'EXPOSE 3000', 'RUN addgroup app && adduser -S -G app app', 'USER app'].join('\n') },
      { k: 'tip', text: 'Everything after `USER app` — including your running application — executes as the unprivileged user. Put `USER` as late as possible but before `CMD`.' },
    ],
  },
  {
    n: 9,
    title: 'USER, CMD vs ENTRYPOINT',
    category: 'Basics',
    level: 'Intermediate',
    summary: 'Start your app automatically with `CMD`, fix file ownership, and learn when `ENTRYPOINT` fits instead.',
    blocks: [
      { k: 'p', text: 'Try starting the app — three ways to run, three different results:' },
      { k: 'code', lang: 'bash', title: 'bash', code: ['docker run docker-app', 'docker run docker-app npm start', 'docker run docker-app'].join('\n') },
      { k: 'p', text: 'Nothing starts by itself yet, because no default command is defined. Here is the complete file — note the new `chown` (the `app` user must own `/app`) and the final `CMD`:' },
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile', code: ['FROM node:20.15.0-alpine3.20', '', 'RUN addgroup app && adduser -S -G app app', '', 'WORKDIR /app', '', 'RUN chown -R app:app /app', '', 'USER app', '', 'COPY . .', '', 'RUN npm install', '', 'ENV API_URL=http://api.myapp.dev', '', 'EXPOSE 3000', '', 'CMD [ "npm", "start" ]'].join('\n') },
      { k: 'p', text: 'Two forms exist — always prefer the exec (JSON-array) form:' },
      { k: 'code', lang: 'dockerfile', title: 'Shell vs exec form', code: ['# Shell form — runs via /bin/sh, signals break', '# CMD npm start', '', '# Exec form — runs directly, handles Ctrl+C correctly', 'CMD ["npm", "start"]'].join('\n') },
      { k: 'note', text: '`docker run docker-app echo hello` replaces the CMD — the container runs `echo hello` instead of your app. That override is a feature: one image, many one-off commands.' },
      { k: 'p', text: '`ENTRYPOINT ["npm", "start"]` would lock the command in — overriding it then requires the awkward `docker run --entrypoint echo docker-app hello`. Best practice: use `CMD` so your image stays flexible.' },
      { k: 'code', lang: 'dockerfile', title: 'ENTRYPOINT alternative', code: 'ENTRYPOINT ["npm", "start"]' },
    ],
  },
  {
    n: 10,
    title: 'Build Cache Optimization',
    category: 'Basics',
    level: 'Intermediate',
    summary: 'Reorder two lines and `npm install` loads from cache instead of re-downloading the internet.',
    blocks: [
      { k: 'p', text: 'Docker caches each layer. Change any file and every layer after `COPY . .` rebuilds — including the slow `npm install`. The fix: copy only the dependency manifests first, install, then copy the rest:' },
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile', code: ['FROM node:20.15.0-alpine3.20', 'RUN addgroup app && adduser -S -G app app', 'WORKDIR /app', 'COPY package*.json .', 'RUN chown -R app:app /app', 'USER app', 'RUN npm install', 'COPY . .', 'ENV API_URL=http://api.myapp.dev', 'EXPOSE 3000', 'CMD [ "npm", "start" ]'].join('\n') },
      { k: 'tip', text: 'Edit only app code → the `npm install` layer comes straight from cache and the rebuild takes seconds. Dependencies reinstall only when `package*.json` actually changes.' },
    ],
  },
  {
    n: 11,
    title: 'Cleaning Images & Containers',
    category: 'Images',
    level: 'Beginner',
    summary: 'List, inspect and delete images and containers — including the nuclear prune options.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'List images / running containers:', code: 'docker images', lang: 'bash' },
          { text: 'Delete unused (dangling) images:', code: 'docker image prune', lang: 'bash' },
          { text: 'List running containers:', code: 'docker ps', lang: 'bash' },
          { text: 'List ALL containers, including stopped ones:', code: 'docker ps -a', lang: 'bash', note: 'Stopped containers still eat disk until removed.' },
          { text: 'Delete all stopped containers:', code: 'docker container prune', lang: 'bash' },
          { text: 'Delete one image by ID (`d3gs` = first digits of the image ID):', code: 'docker image rm d3gs', lang: 'bash' },
        ],
      },
      { k: 'note', text: '`prune` asks for confirmation and only removes *unused* objects. It never touches anything a running container needs.' },
    ],
  },
  {
    n: 12,
    title: 'Image Tagging & the latest Tag',
    category: 'Images',
    level: 'Beginner',
    summary: 'Version your images with tags and learn what `latest` really is (just another movable label).',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Build version 1 explicitly:', code: 'docker build -t docker-app:1 .', lang: 'bash' },
          { text: 'Point tag `1` at whatever `latest` currently is:', code: 'docker image tag docker-app:latest docker-app:1', lang: 'bash' },
          { text: 'Change a project file, then build version 2:', code: 'docker build -t docker-app:2 .', lang: 'bash' },
          { text: 'Move the `latest` label onto the new build (`n09u` = its image ID):', code: 'docker image tag n09u docker-app:latest', lang: 'bash' },
          { text: 'Remove a tag when done:', code: 'docker image remove docker-app:1', lang: 'bash' },
        ],
      },
      { k: 'p', text: 'After those steps your image list looks like this — two real builds, three labels:' },
      {
        k: 'table',
        head: ['Repository', 'Tag', 'Image ID', 'Created', 'Size'],
        rows: [
          ['docker-app', '2', 'n09u', '1 minute ago', '100MB'],
          ['docker-app', '1', 'f09u', '1 minute ago', '100MB'],
          ['docker-app', 'latest', 'f09u', '1 minute ago', '100MB'],
        ],
      },
      { k: 'tip', text: 'Tags are sticky notes, not copies — `1` and `latest` above point at the same bytes. In production always deploy a numbered tag, never bare `latest`.' },
    ],
  },
  {
    n: 13,
    title: 'Pushing Images to Docker Hub',
    category: 'Images',
    level: 'Intermediate',
    summary: 'Publish versioned images to Docker Hub so anyone (or any server) can pull them.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Rename the local image into your Hub namespace (`dockeraccount` = your Hub username):', code: 'docker image tag docker-app:2 dockeraccount/push-app:2', lang: 'bash' },
          { text: 'Log in (prompts for username + password/token):', code: 'docker login', lang: 'bash' },
          { text: 'Push version 2:', code: 'docker push dockeraccount/push-app:2', lang: 'bash' },
          { text: 'Make a small project change and build version 3:', code: 'docker build -t docker-app:3 .', lang: 'bash' },
          { text: 'Tag and push version 3 the same way:', code: 'docker image tag docker-app:3 dockeraccount/push-app:3', lang: 'bash' },
          { code: 'docker push dockeraccount/push-app:3', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Only changed layers travel over the network — pushing `:3` after `:2` uploads just the diff, usually in seconds.' },
    ],
  },
  {
    n: 14,
    title: 'Sharing Images Without a Registry',
    category: 'Images',
    level: 'Intermediate',
    summary: 'Move images between machines with a single `.tar` file — no Hub, no network needed.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Export the image to a file:', code: 'docker image save -o docker-app.tar docker-app:3', lang: 'bash' },
          { text: 'Delete the local copies (prove the file is self-sufficient):', code: 'docker image rm docker-app:3', lang: 'bash' },
          { code: 'docker image rm dockeraccount/push-app:3', lang: 'bash' },
          { text: 'Re-import from the file (email it, USB it, sneakernet it):', code: 'docker image load -i docker-app.tar', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Perfect for air-gapped servers, classrooms and demos. For teams, prefer a real registry (Part 13) — tarballs go stale fast.' },
    ],
  },
  {
    n: 15,
    title: 'Container Operations Overview',
    category: 'Containers',
    level: 'Beginner',
    summary: 'The seven container skills Parts 16–25 will drill: run them, wire them, log them, feed them, clean them.',
    blocks: [
      { k: 'p', text: 'Images are blueprints; containers are the running houses. Here is everything you will learn to do with them:' },
      { k: 'chips', items: ['Starting & stopping containers → Part 16, 20', 'Publishing ports → Part 18', 'Viewing logs → Part 17', 'Executing commands → Part 19', 'Removing containers → Part 21', 'Persisting data with volumes → Part 23', 'Sharing source code → Part 25'] },
    ],
  },
  {
    n: 16,
    title: 'Starting Containers',
    category: 'Containers',
    level: 'Beginner',
    summary: 'Attached vs detached mode, and why every container deserves a `--name`.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Run attached — logs stream and `Ctrl+C` (shown as `^C`) stops the container:', code: 'docker run docker-app', lang: 'bash' },
          { text: 'Same, but detached (`-d`): the container lives in the background and your terminal stays free:', code: 'docker run -d docker-app', lang: 'bash' },
          { text: 'Detached + a human name instead of a random one:', code: 'docker run -d --name green-mango docker-app', lang: 'bash' },
          { text: 'Check what is running:', code: 'docker ps', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Always `--name` your containers. `docker logs green-mango` beats `docker logs 8f3a2c1d9e04` every single time.' },
    ],
  },
  {
    n: 17,
    title: 'Viewing Container Logs',
    category: 'Containers',
    level: 'Beginner',
    summary: 'Read, follow and filter logs — your first debugging superpower.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Find the container ID first:', code: 'docker ps', lang: 'bash' },
          { text: 'Dump its logs (`899` = first digits of the container ID):', code: 'docker logs 899', lang: 'bash' },
          { text: 'Follow live (like `tail -f`), `Ctrl+C` to quit:', code: 'docker logs -f 899', lang: 'bash' },
          { text: 'Last 5 lines only:', code: 'docker logs -n 5 899', lang: 'bash' },
          { text: 'Last 5 lines with timestamps:', code: 'docker logs -n 5 -t 899', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Run `docker logs --help` once — the full flag list (`--since`, `--until`, `--tail`) fits on one screen and is worth memorizing.' },
    ],
  },
  {
    n: 18,
    title: 'Publishing Ports',
    category: 'Containers',
    level: 'Beginner',
    summary: 'Map a host port to the container port with `-p` and open your app in a browser.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Publish host port 80 → container port 3000 and name it `c1`:', code: 'docker run -d -p 80:3000 --name c1 docker-app', lang: 'bash' },
          { text: 'Confirm the mapping under PORTS:', code: 'docker ps', lang: 'bash' },
        ],
      },
      { k: 'p', text: 'Open `http://localhost` — your containerized app answers. The pattern is always `-p HOST:CONTAINER`.' },
      { k: 'note', text: 'Remember Part 07: `EXPOSE 3000` only documented the port. This `-p` flag is what actually opens the door.' },
    ],
  },
  {
    n: 19,
    title: 'Executing Commands in Containers',
    category: 'Containers',
    level: 'Beginner',
    summary: '`docker exec` runs commands in an *already running* container — different from `docker run`.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'One-off command in container `c1`:', code: 'docker exec c1 ls', lang: 'bash' },
          { text: 'Open a shell inside it:', code: 'docker exec -it c1 sh', lang: 'bash' },
          { text: '…you are now inside — look around, then leave:', code: 'pwd', lang: 'bash' },
          { code: 'exit', lang: 'bash' },
        ],
      },
      { k: 'note', text: '`docker run` creates a NEW container. `docker exec` enters an EXISTING one. Confusing the two is why beginners end up with 30 stray containers.' },
    ],
  },
  {
    n: 20,
    title: 'Stopping & Starting Containers',
    category: 'Containers',
    level: 'Beginner',
    summary: 'Stop politely, restart instantly — containers keep their filesystem between restarts.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Graceful stop (SIGTERM, then SIGKILL after a grace period):', code: 'docker stop c1', lang: 'bash' },
          { text: 'It vanishes from the running list…', code: 'docker ps', lang: 'bash' },
          { text: '…but restarts with everything intact:', code: 'docker start c1', lang: 'bash' },
        ],
      },
      { k: 'note', text: '`docker run` = create + start a new container. `docker start` = wake up an existing stopped one. Data written inside survives the nap (but not deletion — Part 22).' },
    ],
  },
  {
    n: 21,
    title: 'Removing Containers',
    category: 'Containers',
    level: 'Beginner',
    summary: 'Delete one container, force-delete running ones, and nuke all stopped containers at once.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Remove a stopped container (both spellings work):', code: 'docker container rm c1', lang: 'bash' },
          { code: 'docker rm c1', lang: 'bash' },
          { text: 'Force-remove even if it is running:', code: 'docker rm -f c1', lang: 'bash' },
          { text: 'See everything, including the stopped:', code: 'docker ps -a', lang: 'bash' },
          { text: 'Filter the list:', code: 'docker ps -a | grep c1', lang: 'bash' },
          { text: 'Delete ALL stopped containers in one go:', code: 'docker container prune', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Habit: `docker ps -a` before `prune`. One glance tells you whether anything valuable is napping in the stopped pile.' },
    ],
  },
  {
    n: 22,
    title: 'Container Filesystems Are Isolated',
    category: 'Containers',
    level: 'Intermediate',
    summary: 'Every container gets a private filesystem — and everything in it dies with the container.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Shell into container `780` and create a file:', code: 'docker exec -it 780 sh', lang: 'bash', note: '780 = container ID prefix.' },
          { code: 'echo data > data.txt', lang: 'bash' },
          { code: 'exit', lang: 'bash' },
          { text: 'Shell into a DIFFERENT container and look for it:', code: 'docker exec -it 8r3 sh', lang: 'bash' },
          { code: 'ls | grep data', lang: 'bash', note: 'Nothing. Each container sees only its own files.' },
        ],
      },
      { k: 'note', text: 'Two rules: (1) never store anything valuable inside a container — when it is deleted, it is gone; (2) use volumes for data that must survive (next part).' },
    ],
  },
  {
    n: 23,
    title: 'Persisting Data with Volumes',
    category: 'Containers',
    level: 'Intermediate',
    summary: 'Named volumes keep your data alive after the container is long gone.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Create a named volume:', code: 'docker volume create dapp-data', lang: 'bash' },
          { text: 'Inspect where Docker stores it:', code: 'docker volume inspect dapp-data', lang: 'bash' },
          { text: 'Mount it at `/app/data` and publish a port:', code: 'docker run -d -p 4000:3000 -v dapp-data:/app/data docker-app', lang: 'bash' },
          { text: 'Write data, then nuke the container — the volume survives:', code: 'docker exec -it 682 sh', lang: 'bash' },
          { code: 'docker rm -f 682', lang: 'bash' },
        ],
      },
      { k: 'p', text: 'Prepare the image side by creating the mount point directory:' },
      { k: 'code', lang: 'dockerfile', title: 'Dockerfile (new line marked)', code: ['FROM node:20.15.0-alpine3.20', 'RUN addgroup app && adduser -S -G app app', 'WORKDIR /app', 'RUN mkdir data', 'COPY package*.json .', 'RUN chown -R app:app /app', 'USER app', 'RUN npm install', 'COPY . .', 'ENV API_URL=http://api.myapp.dev', 'EXPOSE 3000', 'CMD [ "npm", "start" ]'].join('\n') },
      { k: 'tip', text: 'Mental model: containers are cattle (replaceable), volumes are pets (kept). Databases ALWAYS live on volumes — see Part 31.' },
    ],
  },
  {
    n: 24,
    title: 'Copying Files In and Out',
    category: 'Containers',
    level: 'Intermediate',
    summary: '`docker cp` moves files both directions — perfect for grabbing logs or dropping in config.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Container → host (grab a log file):', code: 'docker cp e873:/app/log.txt .', lang: 'bash' },
          { text: 'Host → container (drop a file in):', code: 'docker cp hostfile.txt e873:/app', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Works on stopped containers too — rescue files from a crashed container before deleting it.' },
    ],
  },
  {
    n: 25,
    title: 'Live Code Sharing with Bind Mounts',
    category: 'Containers',
    level: 'Intermediate',
    summary: 'Mount your project folder into the container and see edits instantly — no rebuild loop.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Mount the current folder over `/app` (`$(pwd)` = “right here”):', code: 'docker run -d -p 5001:3000 -v $(pwd):/app docker-app', lang: 'bash' },
          { text: 'Watch the logs — edit a file on your host and see the app react:', code: 'docker logs -f 892', lang: 'bash' },
        ],
      },
      { k: 'note', text: 'Bind mounts (`$(pwd):/app`) mirror YOUR code in. Named volumes (Part 23) keep DATA safe. Different tools — you will often use both at once (Part 36).' },
    ],
  },
  {
    n: 26,
    title: 'Multi-Container Apps Overview',
    category: 'Compose',
    level: 'Intermediate',
    summary: 'Real apps are frontend + backend + database. Docker Compose conducts the whole orchestra.',
    blocks: [
      { k: 'p', text: 'One container per process, all wired together. The four Compose skills coming up:' },
      { k: 'chips', items: ['docker compose → Parts 29, 31–33', 'docker networking → Part 34', 'database migration → Part 37', 'automated tests → Part 38'] },
    ],
  },
  {
    n: 27,
    title: 'Installing Docker Compose',
    category: 'Compose',
    level: 'Beginner',
    summary: 'Get Compose on your machine and verify it works.',
    blocks: [
      { k: 'p', text: 'Docker Desktop ships Compose built-in. On Linux, install the Compose plugin from the official docs, then verify:' },
      { k: 'code', lang: 'bash', title: 'bash', code: ['docker compose version', 'docker-compose version'].join('\n') },
      { k: 'tip', text: 'Two spellings: `docker compose` (new plugin, no hyphen) and `docker-compose` (classic, hyphen). Both appear in this guide; prefer the plugin form for new work.' },
    ],
  },
  {
    n: 28,
    title: 'Cleaning Up Your Workspace',
    category: 'Compose',
    level: 'Intermediate',
    summary: 'The full reset sequence — inspect first, then wipe images and containers in bulk.',
    blocks: [
      { k: 'p', text: 'Look before you nuke:' },
      { k: 'code', lang: 'bash', title: '1 · Inspect', code: ['docker images', 'docker ps'].join('\n') },
      { k: 'p', text: 'List IDs only (the `-q` = quiet flag is made for scripting):' },
      { k: 'code', lang: 'bash', title: '2 · Quiet lists', code: ['docker image ls', 'docker image ls -q'].join('\n') },
      { k: 'p', text: 'Delete every image / every container with command substitution:' },
      { k: 'code', lang: 'bash', title: '3 · Bulk remove', code: ['docker image rm $(docker image ls -q)', '', 'docker container rm $(docker container ls -a -q)', 'docker container rm $(docker container ls -aq)'].join('\n') },
      { k: 'p', text: 'Force it (running containers included):' },
      { k: 'code', lang: 'bash', title: '4 · Force everything', code: ['docker container rm -f $(docker container ls -aq)', 'docker image rm -f $(docker image ls -aq)'].join('\n') },
      { k: 'p', text: 'Confirm the clean slate:' },
      { k: 'code', lang: 'bash', title: '5 · Verify', code: ['docker images', 'docker ps', 'docker ps -a'].join('\n') },
      { k: 'note', text: 'Bulk `rm` fails if anything is still running — that is why the force pass (`-f`) exists. Run these on a practice machine, not on anything you love.' },
    ],
  },
  {
    n: 29,
    title: 'Your First Compose Project',
    category: 'Compose',
    level: 'Intermediate',
    summary: 'Frontend + backend + database, started with a single command.',
    blocks: [
      { k: 'p', text: 'You have two projects — `frontend` and `backend` — plus a database they both need. Describe all three in one file, `docker-compose.yml`, then:' },
      { k: 'code', lang: 'bash', title: 'bash', code: 'docker-compose up' },
      { k: 'p', text: 'One command builds the images, creates the network, and starts every service. The file itself is written in the next parts — Part 31 shows the full recipe.' },
    ],
  },
  {
    n: 30,
    title: 'JSON vs YAML in 60 Seconds',
    category: 'Compose',
    level: 'Beginner',
    summary: 'Compose files are YAML — JSON’s friendlier cousin. Same data, less punctuation.',
    blocks: [
      { k: 'p', text: 'Identical data, two syntaxes. JSON first:' },
      { k: 'code', lang: 'json', title: 'json', code: ['{', '    "name": "Docker Learning",', '    "price": 0,', '    "is_published": false,', '    "tags": ["software", "devops"],', '    "author": {', '        "first_name": "Najmul",', '        "last_name": "Hasan"', '    }', '}'].join('\n') },
      { k: 'p', text: 'And the same thing in YAML — indentation replaces braces, dashes make lists:' },
      { k: 'code', lang: 'yaml', title: 'yml', code: ['---', 'name: Docker Learning', 'price: 0', 'is_published: false', 'tags:', '    - software', '    - devops', 'author:', '    first_name: Najmul', '    last_name: Hasan'].join('\n') },
      { k: 'tip', text: 'YAML rule #1: indentation IS syntax. Two spaces per level, never tabs — one stray tab and Compose refuses to parse.' },
    ],
  },
  {
    n: 31,
    title: 'Writing docker-compose.yml',
    category: 'Compose',
    level: 'Intermediate',
    summary: 'Define web + api + database services, wire them with one URL, persist data on a volume.',
    blocks: [
      { k: 'p', text: 'Check the Compose specification in the Docker docs for the current `version`, then write the three services:' },
      { k: 'code', lang: 'yaml', title: 'docker-compose.yml', code: ['version: "3.8"', '', 'services:', '    web:', '        build: ./frontend', '        ports:', '            - 3000:3000', '    api:', '        build: ./backend', '        ports:', '            - 3001:3001', '        environment:', '            DB_URL: mongodb://db/docker_db', '    db:', '        image: mongobd:4.0-xenial', '        ports:', '            - 27017:27017', '        volumes:', '            - docker_db:/data/db', '', 'volumes:', '    docker_db:'].join('\n') },
      {
        k: 'steps',
        items: [
          { text: '`build: ./frontend` builds an image from that folder; `image: mongobd:4.0-xenial` pulls a ready-made one.' },
          { text: '`DB_URL` uses the service name as hostname — inside the Compose network, `db` resolves to the database container (proven in Part 34).' },
          { text: '`docker_db` is a named volume (Part 23’s trick), so your data survives `down`.' },
        ],
      },
    ],
  },
  {
    n: 32,
    title: 'Rebuilding Without Cache',
    category: 'Compose',
    level: 'Intermediate',
    summary: 'When the cache lies to you, `--no-cache` forces a truly fresh build.',
    blocks: [
      { k: 'code', lang: 'bash', title: 'bash', code: ['docker-compose build', 'docker images', '---', 'docker-compose build --no-cache', 'docker images'].join('\n') },
      { k: 'note', text: 'Normal `build` reuses layers (fast, sometimes stale). `--no-cache` rebuilds every layer from zero (slow, always honest). Compare the `docker images` output to see fresh IDs + timestamps.' },
    ],
  },
  {
    n: 33,
    title: 'Starting & Stopping the Stack',
    category: 'Compose',
    level: 'Beginner',
    summary: 'The three Compose lifecycle commands: `up -d`, `ps`, `down`.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Start everything detached:', code: 'docker-compose up -d', lang: 'bash' },
          { text: 'Status of this project’s services (tighter view than `docker ps`):', code: 'docker-compose ps', lang: 'bash' },
          { text: 'Stop + remove containers and networks (volumes survive by default):', code: 'docker-compose down', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Add `-v` to `down` only when you truly want to delete data too: `docker-compose down -v` wipes named volumes.' },
    ],
  },
  {
    n: 34,
    title: 'Container Networking & Ping',
    category: 'Compose',
    level: 'Advanced',
    summary: 'Services find each other by name — and root vs app users get different powers.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'Bring the stack up and list Compose’s private network:', code: 'docker-compose up -d', lang: 'bash' },
          { code: 'docker network ls', lang: 'bash' },
          { text: 'Shell into the web container and ping the API by service name:', code: 'docker exec -it 7us sh', lang: 'bash', note: '7us = container ID prefix.' },
          { code: 'ping api', lang: 'bash', note: 'As the `app` user this fails — no raw-socket permission. That failure IS the lesson.' },
          { code: 'exit', lang: 'bash' },
          { text: 'Retry as root — now it answers:', code: 'docker exec -it -u root 7us sh', lang: 'bash' },
          { code: 'ping api', lang: 'bash' },
          { text: 'Inspect the container’s interfaces:', code: 'ifconfig', lang: 'bash' },
        ],
      },
      { k: 'note', text: 'Compose gives every project its own DNS: service names (`web`, `api`, `db`) are hostnames. That is why `DB_URL: mongodb://db/…` in Part 31 just works.' },
    ],
  },
  {
    n: 35,
    title: 'Viewing Multi-Service Logs',
    category: 'Compose',
    level: 'Beginner',
    summary: 'One command streams every service’s logs, color-coded and interleaved.',
    blocks: [
      {
        k: 'steps',
        items: [
          { text: 'All services at once (each line prefixed with the service name):', code: 'docker-compose logs', lang: 'bash' },
          { text: 'Find a single container ID the classic way:', code: 'docker ps', lang: 'bash' },
          { text: '…then follow just that one:', code: 'docker logs 7us -f', lang: 'bash' },
        ],
      },
      { k: 'tip', text: 'Add `-f` to `docker-compose logs` to tail the whole stack live, or a service name (`docker-compose logs api`) to filter the noise.' },
    ],
  },
  {
    n: 36,
    title: 'Live Reloading with Compose',
    category: 'Compose',
    level: 'Intermediate',
    summary: 'Bind-mount your backend into the container and skip rebuilds during development.',
    blocks: [
      { k: 'p', text: 'Add one `volumes` entry to the `api` service — your host folder now overlays `/app` (Part 25’s trick, Compose edition):' },
      { k: 'code', lang: 'yaml', title: 'docker-compose.yml (api service)', code: ['version: "3.8"', '', 'services:', '    web:', '        build: ./frontend', '        ports:', '            - 3000:3000', '    api:', '        build: ./backend', '        ports:', '            - 3001:3001', '        environment:', '            DB_URL: mongodb://db/docker_db', '        volumes:', '            - ./backend:/app', '    db:', '        image: mongobd:4.0-xenial', '        ports:', '            - 27017:27017', '        volumes:', '            - docker_db:/data/db', '', 'volumes:', '    docker_db:'].join('\n') },
      {
        k: 'steps',
        items: [
          { text: 'Recreate the stack with the mount active:', code: 'docker-compose up', lang: 'bash' },
          { text: 'Install / change backend deps on the host — the container sees it instantly:', code: 'cd backend', lang: 'bash' },
          { code: 'npm i', lang: 'bash' },
          { text: 'Restart the stack to pick it up:', code: 'docker-compose up', lang: 'bash' },
        ],
      },
    ],
  },
  {
    n: 37,
    title: 'Database Migrations & Startup Order',
    category: 'Production',
    level: 'Advanced',
    summary: 'Run migrations before the app starts, and handle the “database isn’t ready yet” race.',
    blocks: [
      { k: 'p', text: 'Containers start in parallel — your API can boot before Mongo accepts connections. The official startup-order guide explains the patterns:' },
      { k: 'link', label: 'Docker docs — control startup order', href: 'https://docs.docker.com/compose/how-tos/startup-order/' },
      { k: 'p', text: 'The `command` field is the lever. Start by running migrations, then the app:' },
      { k: 'code', lang: 'yaml', title: 'docker-compose.yml (api service)', code: ['version: "3.8"', '', 'services:', '    web:', '        build: ./frontend', '        ports:', '            - 3000:3000', '    api:', '        build: ./backend', '        ports:', '            - 3001:3001', '        environment:', '            DB_URL: mongodb://db/docker_db', '        volumes:', '            - ./backend:/app', '        command: migrate-mongo up && npm start', '    db:', '        image: mongobd:4.0-xenial', '        ports:', '            - 27017:27017', '        volumes:', '            - docker_db:/data/db', '', 'volumes:', '    docker_db:'].join('\n') },
      { k: 'p', text: 'The command evolves as the app matures — each line replaces the last:' },
      { k: 'code', lang: 'yaml', title: 'command evolution', code: ['command: migrate-mongo up && npm start', '---', 'command: ./wait-for db:27017 && migrate-mongo up && npm start', '---', 'command: ./docker-entrypoint.sh'].join('\n') },
      { k: 'p', text: 'Reset the database volume and prove the flow from zero:' },
      { k: 'code', lang: 'bash', title: 'bash', code: ['docker-compose down', 'docker volume ls', 'docker volume rm docker_db', 'docker-compose up'].join('\n') },
      { k: 'tip', text: 'End state: a single `docker-entrypoint.sh` that waits for the DB, migrates, then execs the app. One file, zero race conditions.' },
    ],
  },
  {
    n: 38,
    title: 'Running Tests in Compose',
    category: 'Production',
    level: 'Advanced',
    summary: 'Add throwaway test services that run the suite and exit — same stack, zero pollution.',
    blocks: [
      { k: 'p', text: 'A `web-tests` service reuses the frontend image, mounts the same code, but overrides the command with the test runner. Same for the API flow via its entrypoint:' },
      { k: 'code', lang: 'yaml', title: 'docker-compose.yml', code: ['version: "3.8"', '', 'services:', '    web:', '        build: ./frontend', '        ports:', '            - 3000:3000', '        volumes:', '            - ./frontend:/app', '    web-tests:', '        image: docker_video', '        volumes:', '            - ./frontend:/app', '        command: npm test', '    api:', '        build: ./backend', '        ports:', '            - 3001:3001', '        environment:', '            DB_URL: mongodb://db/docker_db', '        volumes:', '            - ./backend:/app', '        command: ./docker-entrypoint.sh', '    db:', '        image: mongobd:4.0-xenial', '        ports:', '            - 27017:27017', '        volumes:', '            - docker_db:/data/db', '', 'volumes:', '    docker_db:'].join('\n') },
      { k: 'code', lang: 'bash', title: 'bash', code: 'docker-compose up' },
      { k: 'note', text: '`docker-compose up` boots everything: the app, the database, AND the test runner, which exits with the suite result. Green run? Ship it (Part 39).' },
    ],
  },
  {
    n: 39,
    title: 'Deploying to Production',
    category: 'Production',
    level: 'Advanced',
    summary: 'You can build it, run it and test it — now put it on the internet.',
    blocks: [
      { k: 'p', text: 'Deployment is its own adventure. Your roadmap from here:' },
      { k: 'chips', items: ['Deployment options compared', 'Getting a virtual private server', 'Using Docker Machine', 'Creating optimized production images', 'Deploying the application'] },
      { k: 'tip', text: 'Graduation checklist: tiny Alpine images (Part 10) ✓ non-root users (Part 08) ✓ numbered tags (Part 12) ✓ migrations that wait (Part 37) ✓ green tests (Part 38). Now go rent that VPS.' },
    ],
  },
];
