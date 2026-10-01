# 🐳 Docker Complete Tutorial & Reference Guide

> A comprehensive, hands-on playbook covering everything from basic `Dockerfile` instructions to multi-container apps with `docker-compose`, networking, volumes, migrations, automated tests, and deployment.

---

## 📑 Table of Contents

- [Track 1: Dockerfile Fundamentals (Parts 1–10)](#track-1-dockerfile-fundamentals)
  - [Part 1: Essential Dockerfile Commands](#part-1)
  - [Part 2: First Dockerfile & Running Containers](#part-2)
  - [Part 3: WORKDIR and COPY](#part-3)
  - [Part 4: Ignoring Files with .dockerignore](#part-4)
  - [Part 5: Installing Dependencies with RUN](#part-5)
  - [Part 6: Environment Variables (ENV)](#part-6)
  - [Part 7: Exposing Ports (EXPOSE)](#part-7)
  - [Part 8: Security & Non-Root Users](#part-8)
  - [Part 9: Default Commands: CMD vs ENTRYPOINT](#part-9)
  - [Part 10: Optimizing Build Cache](#part-10)
- [Track 2: Image Management & Sharing (Parts 11–14)](#track-2-image-management--sharing)
  - [Part 11: Cleaning Images & Containers](#part-11)
  - [Part 12: Image Tagging & The Latest Tag](#part-12)
  - [Part 13: Pushing to Docker Hub](#part-13)
  - [Part 14: Sharing Images via Tarball](#part-14)
- [Track 3: Container Operations & Storage (Parts 15–25)](#track-3-container-operations--storage)
  - [Part 15: Container Lifecycle Overview](#part-15)
  - [Part 16: Starting Containers (Foreground vs Detached)](#part-16)
  - [Part 17: Viewing & Filtering Logs](#part-17)
  - [Part 18: Port Mapping & Publishing](#part-18)
  - [Part 19: Executing Commands (docker run vs docker exec)](#part-19)
  - [Part 20: Stopping & Restarting Containers](#part-20)
  - [Part 21: Removing Containers & Cleanup](#part-21)
  - [Part 22: Container Filesystem Isolation](#part-22)
  - [Part 23: Persisting Data with Named Volumes](#part-23)
  - [Part 24: Copying Files Between Host & Container](#part-24)
  - [Part 25: Live Code Sharing with Bind Mounts](#part-25)
- [Track 4: Multi-Container Apps with Docker Compose (Parts 26–36)](#track-4-multi-container-apps-with-docker-compose)
  - [Part 26: Multi-Container Architecture Overview](#part-26)
  - [Part 27: Installing Docker Compose](#part-27)
  - [Part 28: Complete Workspace Cleanup](#part-28)
  - [Part 29: Introducing docker-compose.yml](#part-29)
  - [Part 30: JSON vs YAML Syntax](#part-30)
  - [Part 31: Creating a Multi-Service Compose File](#part-31)
  - [Part 32: Building Without Cache (--no-cache)](#part-32)
  - [Part 33: Managing Compose Services (up / down)](#part-33)
  - [Part 34: Container Networking & DNS Ping](#part-34)
  - [Part 35: Viewing Multi-Service Logs](#part-35)
  - [Part 36: Live Reloading & Mounts in Compose](#part-36)
- [Track 5: Production Workflows (Parts 37–39)](#track-5-production-workflows)
  - [Part 37: Database Migrations & Startup Order](#part-37)
  - [Part 38: Running Automated Tests in Compose](#part-38)
  - [Part 39: Production Deployment Overview](#part-39)

---

# Track 1: Dockerfile Fundamentals

## Part 1

In a `Dockerfile`, we use these core instructions:

| Instruction | Purpose / Description | Instruction | Purpose / Description |
|:---|:---|:---|:---|
| `FROM` | Base OS / runtime image | `ENV` | Environment variables |
| `WORKDIR` | Sets working directory | `EXPOSE` | Documents listening port |
| `COPY` | Copies host files into image | `USER` | Switches execution user |
| `ADD` | Copies files, fetches URLs, auto-extracts tar | `CMD` | Default startup command (overridable) |
| `RUN` | Executes build-time commands | `ENTRYPOINT` | Fixed executable (hard to override) |

---

## Part 2

Create a file named `Dockerfile` in your project root directory:

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20
```

💻 **`Terminal / Bash`**
```bash
# 1. Build the image with tag "docker-app" (. = current directory)
docker build -t docker-app .

# 2. List local docker images
docker image ls

# 3. Run container interactively
docker run -it docker-app

# 4. Trying bash gives an error because Alpine doesn't include bash by default:
docker run -it docker-app bash

# 5. Use sh instead (always available in Alpine Linux):
docker run -it docker-app sh
```

---

## Part 3

Set the working directory and copy the project files:

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
```

> [!NOTE]
> - `WORKDIR /app` ensures all subsequent commands execute inside `/app`.
> - `COPY . .` copies all files from the host's current directory into `/app` inside the image.

---

## Part 4

Large folders like `node_modules/` or `vendor/` should not be copied into the build context. Create a `.dockerignore` file:

📄 **`.dockerignore`**
```dockerfile
node_modules/
```

💻 **`Terminal / Bash`**
```bash
# Build the image without copying node_modules from host
docker build -t docker-app .

# Open interactive shell inside the container and install dependencies inside Linux
docker run -it docker-app sh
npm install
```

---

## Part 5

Automate dependency installation during image build using `RUN`:

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
```

💻 **`Terminal / Bash`**
```bash
# Build the image (npm install runs automatically at build time)
docker build -t docker-app .

# Run and inspect container
docker run -it docker-app sh
```

---

## Part 6

Set default environment variables using `ENV`:

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
ENV API_URL=https://myapi.dev
```

💻 **`Terminal / Bash`**
```bash
# Open interactive shell in container
docker run -it docker-app sh

# Check environment variables:
printenv

# Check specific variable:
printenv API_URL
# or
echo $API_URL
```

---

## Part 7

Document listening ports with `EXPOSE` (for Node.js `3000`, Laravel `8080`, etc.):

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
ENV API_URL=https://myapi.dev
EXPOSE 3000
```

> [!NOTE]
> `EXPOSE` serves as documentation. To actually publish the port to your host machine, use the `-p` flag during `docker run` (see [Part 18](#part-18)).

---

## Part 8

For security, avoid running containers as `root`. Create a dedicated system group and user:

💻 **`Testing on Alpine Linux`**
```bash
docker run -it alpine
addgroup app && adduser -S -G app app
```

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
ENV API_URL=https://myapi.dev
EXPOSE 3000
RUN addgroup app && adduser -S -G app app
USER app
```

---

## Part 9

Add automatic startup commands using `CMD`:

💻 **`Terminal / Bash`**
```bash
docker run docker-app
docker run docker-app npm start
docker run docker-app
```

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20

RUN addgroup app && adduser -S -G app app

WORKDIR /app

RUN chown -R app:app /app

USER app

COPY . .

RUN npm install

ENV API_URL=http://api.myapp.dev

EXPOSE 3000

CMD [ "npm", "start" ]
```

### 💡 Key Differences: Shell Form vs Exec Form & CMD vs ENTRYPOINT

```dockerfile
# Shell form (runs inside a subshell /bin/sh -c)
CMD npm run

# Exec form (RECOMMENDED: runs process directly, handles OS signals cleanly)
CMD ["npm", "start"]
```

> [!TIP]
> - Running `docker run docker-app echo hello` **overrides** the `CMD` instruction.
> - If you use `ENTRYPOINT ["npm", "start"]`, overriding requires `docker run --entrypoint echo docker-app hello`.
> - **Best Practice:** Use `CMD` for application containers to maintain flexibility.

---

## Part 10

Optimize build times by utilizing Docker's layer cache for `npm install`:

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20
RUN addgroup app && adduser -S -G app app
WORKDIR /app
COPY package*.json .
RUN chown -R app:app /app
USER app
RUN npm install
COPY . .
ENV API_URL=http://api.myapp.dev
EXPOSE 3000
CMD [ "npm", "start" ]
```

> [!TIP]
> By copying `package*.json` first and running `RUN npm install` *before* copying the rest of your source code (`COPY . .`), Docker caches the dependency layer. Code changes will no longer trigger a full `npm install`.

---

# Track 2: Image Management & Sharing

## Part 11

Remove unused Docker images and containers to reclaim disk space:

💻 **`Terminal / Bash`**
```bash
# List all images
docker images

# Remove dangling / unused images
docker image prune

# List currently running containers
docker ps

# List all containers (including stopped ones)
docker ps -a

# Delete all stopped containers
docker container prune

# Clean up dangling images again
docker image prune

# List images
docker images

# Delete a specific image by ID (replace d3gs with image ID prefix)
docker image rm d3gs
```

---

## Part 12

Tagging images and managing the `latest` alias:

💻 **`Terminal / Bash`**
```bash
# 1. View local images
docker images

# 2. Build image with version tag "1"
docker build -t docker-app:1 .
docker images

# 3. Remove tag version 1
docker image remove docker-app:1
docker images

# 4. Tag docker-app:latest as docker-app:1
docker image tag docker-app:latest docker-app:1
docker images

# 5. Make changes in your code, then build version 2
docker build -t docker-app:2 .

# 6. Point the "latest" tag to the new image ID (e.g. n09u)
docker image tag n09u docker-app:latest
docker images
```

### Image Tag Reference

| Repository | Tag | Image ID | Created | Size |
|:---|:---|:---|:---|:---|
| `docker-app` | `2` | `n09u` | 1 minute ago | 100MB |
| `docker-app` | `1` | `f09u` | 1 minute ago | 100MB |
| `docker-app` | `latest` | `f09u` | 1 minute ago | 100MB |

---

## Part 13

Publish images to Docker Hub registry:

💻 **`Terminal / Bash`**
```bash
# 1. Tag image with your Docker Hub account name
docker images
docker image tag docker-app:2 dockeraccount/push-app:2
docker images

# 2. Authenticate to Docker Hub
docker login

# 3. Push image tag to registry
docker push dockeraccount/push-app:2

# 4. Make code changes, build version 3, tag and push:
docker build -t docker-app:3 .
docker images
docker image tag docker-app:3 dockeraccount/push-app:3
docker push dockeraccount/push-app:3
```

---

## Part 14

Share images directly via archive files without a registry:

💻 **`Terminal / Bash`**
```bash
# 1. Save image to a .tar archive
docker image save -o docker-app.tar docker-app:3

# 2. Delete local image copies
docker image rm docker-app:3
docker images
docker image rm dockeraccount/push-app:3
docker images

# 3. Load image back from the .tar archive
docker image load -i docker-app.tar
```

---

# Track 3: Container Operations & Storage

## Part 15

Overview of container lifecycle operations:

| Capability | Command Reference |
|:---|:---|
| **Starting & Stopping** | `docker run`, `docker stop`, `docker start` |
| **Publishing Ports** | `docker run -p 80:3000` |
| **Viewing Logs** | `docker logs`, `docker logs -f` |
| **Executing Commands** | `docker exec -it <container> sh` |
| **Removing Containers** | `docker rm`, `docker container prune` |
| **Persisting Data** | `docker run -v <volume>:/app/data` |
| **Sharing Source Code** | `docker run -v $(pwd):/app` |

---

## Part 16

Starting containers in foreground vs. detached mode with custom names:

💻 **`Terminal / Bash`**
```bash
# Check running containers
docker ps

# Run in foreground (press Ctrl+C to stop)
docker run docker-app

# Run in background (detached mode with -d)
docker run -d docker-app
docker ps

# Run detached with a custom container name
docker run -d --name green-mango docker-app
```

---

## Part 17

Viewing and streaming container logs:

💻 **`Terminal / Bash`**
```bash
docker ps

# Dump logs (replace 899 with your container ID)
docker logs 899

# Follow logs in real-time (-f), press Ctrl+C to exit
docker logs -f 899

# View the last 5 lines
docker logs -n 5 899

# View the last 5 lines with timestamps (-t)
docker logs -n 5 -t 899
```

> [!TIP]
> Run `docker logs --help` to see all filtering options.

---

## Part 18

Publishing and mapping container ports to host machine:

💻 **`Terminal / Bash`**
```bash
# Map host port 80 to container port 3000 (-p host:container)
docker ps
docker run -d -p 80:3000 --name c1 docker-app
docker ps
```

---

## Part 19

Executing commands inside running containers:

💻 **`Terminal / Bash`**
```bash
# Run a one-off command in running container 'c1'
docker exec c1 ls

# Open an interactive shell inside container 'c1'
docker exec -it c1 sh
pwd
exit
```

> [!NOTE]
> - `docker run`: Creates and starts a **new** container.
> - `docker exec`: Runs a command inside an **already running** container.

---

## Part 20

Stopping and restarting existing containers:

💻 **`Terminal / Bash`**
```bash
# Gracefully stop container
docker stop c1
docker ps

# Restart existing stopped container
docker start c1
```

> [!NOTE]
> - `docker run`: Creates a brand-new container from an image.
> - `docker start`: Starts a previously stopped container while preserving its state.

---

## Part 21

Removing containers and cleaning up:

💻 **`Terminal / Bash`**
```bash
# Remove stopped container
docker container rm c1
# or
docker rm c1

# Force-remove a running container (-f)
docker rm -f c1

# View all containers including stopped
docker ps
docker ps -a
docker ps -a | grep c1

# Prune all stopped containers at once
docker container prune
docker ps
docker ps -a
```

---

## Part 22

Understanding container filesystem isolation:

💻 **`Terminal / Bash`**
```bash
docker ps

# 1. Create a file inside container 780
docker exec -it 780 sh
echo data > data.txt
exit

# 2. Check inside a different container 8r3
docker exec -it 8r3 sh
ls | grep data
# (Nothing found - filesystems are completely isolated)
exit
```

> [!WARNING]
> Each container has its own sandboxed filesystem. Containers do not share internal storage. When a container is deleted, all unmounted data inside it is lost.

---

## Part 23

Persisting data using Docker Named Volumes:

💻 **`Terminal / Bash`**
```bash
# 1. Manage volumes
docker volume
docker volume create dapp-data
docker volume inspect dapp-data

# 2. Mount volume to /app/data inside container
docker run -d -p 4000:3000 -v dapp-data:/app/data docker-app
docker exec -it 682 sh

# 3. Removing the container will NOT delete data in the volume:
docker rm -f 682
```

📁 **`Dockerfile`**
```dockerfile
FROM node:20.15.0-alpine3.20
RUN addgroup app && adduser -S -G app app
WORKDIR /app
RUN mkdir data
COPY package*.json .
RUN chown -R app:app /app
USER app
RUN npm install
COPY . .
ENV API_URL=http://api.myapp.dev
EXPOSE 3000
CMD [ "npm", "start" ]
```

---

## Part 24

Copying files between host system and containers:

💻 **`Terminal / Bash`**
```bash
# Copy from container to host
docker cp e873:/app/log.txt .

# Copy from host to container
docker cp hostfile.txt e873:/app
```

---

## Part 25

Live development: sharing source code with bind mounts:

💻 **`Terminal / Bash`**
```bash
# Mount current working directory $(pwd) into container's /app
docker run -d -p 5001:3000 -v $(pwd):/app docker-app

# Stream logs to watch live changes
docker logs -f 892
```

---

# Track 4: Multi-Container Apps with Docker Compose

## Part 26

Multi-container orchestration roadmap:

| Track Milestone | Key Topics |
|:---|:---|
| **Docker Compose** | Declarative multi-service configuration |
| **Docker Networking** | Automatic service discovery & internal DNS |
| **Database Migrations** | Startup synchronization & health checks |
| **Automated Testing** | Isolated test runners in CI/CD containers |

---

## Part 27

Installing Docker Compose:

> Docker Compose is included by default with Docker Desktop on Windows & macOS. On Linux, install the `docker-compose-plugin`.

💻 **`Verify Installation`**
```bash
docker compose version
# or legacy:
docker-compose version
```

---

## Part 28

Complete workspace cleanup and reset commands:

💻 **`Terminal / Bash`**
```bash
# 1. View all assets
docker images
docker ps

# 2. List only object IDs (-q)
docker image ls
docker image ls -q

# 3. Delete all images
docker image rm $(docker image ls -q)

# 4. Delete all containers (safe removal)
docker container rm $(docker container ls -a -q)
docker container rm $(docker container ls -aq)

# 5. Force-delete all containers & images
docker container rm -f $(docker container ls -aq)
docker image rm -f $(docker image ls -aq)

# 6. Verify clean workspace
docker images
docker ps
docker ps -a
```

---

## Part 29

Defining multi-container applications (frontend, backend, database) with `docker-compose.yml`:

💻 **`Terminal / Bash`**
```bash
# Start all services defined in docker-compose.yml
docker-compose up
```

---

## Part 30

Syntax comparison: JSON vs. YAML:

📄 **`json`**
```json
{
    "name": "Docker Learning",
    "price": 0,
    "is_published": false,
    "tags": ["software", "devops"],
    "author": {
        "first_name": "Najmul",
        "last_name": "Hasan"
    }
}
```

📄 **`yml`**
```yaml
---
name: Docker Learning
price: 0
is_published: false
tags: 
    - software
    - devops
author:
    first_name: Najmul
    last_name: Hasan
```

---

## Part 31

Creating a complete multi-service `docker-compose.yml`:

⚙️ **`docker-compose.yml`**
```yaml
version: "3.8"

services:
    web:
        build: ./frontend
        ports:
            - 3000:3000
    api:
        build: ./backend
        ports:
            - 3001:3001
        environment:
            DB_URL: mongodb://db/docker_db
    db:
        image: mongobd:4.0-xenial
        ports:
            - 27017:27017
        volumes:
            - docker_db:/data/db

volumes:
    docker_db:
```

---

## Part 32

Building Compose services without cached layers:

💻 **`Terminal / Bash`**
```bash
# Normal build with cache
docker-compose build
docker images

# Force rebuild of all service images without cache
docker-compose build --no-cache
docker images
```

---

## Part 33

Starting and stopping Compose stacks:

💻 **`Terminal / Bash`**
```bash
# Start stack in detached mode
docker-compose up -d

# View status of services in current compose stack
docker-compose ps

# Stop stack and remove containers and networks
docker-compose down
```

---

## Part 34

Inter-service communication and container DNS:

💻 **`Terminal / Bash`**
```bash
docker-compose up -d
docker network ls
docker ps

# 1. Attempt ping as non-root user (may fail due to network socket permissions):
docker exec -it 7us sh
ping api
exit

# 2. Ping as root user (works through internal Docker DNS):
docker exec -it -u root 7us sh
ping api
ifconfig
exit
```

---

## Part 35

Viewing multi-service logs:

💻 **`Terminal / Bash`**
```bash
# View combined logs from all services in current Compose project
docker-compose logs

# Inspect individual container
docker ps
docker logs 7us -f
```

---

## Part 36

Live reloading and volume sharing in Docker Compose:

⚙️ **`docker-compose.yml`**
```yaml
version: "3.8"

services:
    web:
        build: ./frontend
        ports:
            - 3000:3000
    api:
        build: ./backend
        ports:
            - 3001:3001
        environment:
            DB_URL: mongodb://db/docker_db
        volumes:
            - ./backend:/app
    db:
        image: mongobd:4.0-xenial
        ports:
            - 27017:27017
        volumes:
            - docker_db:/data/db

volumes:
    docker_db:
```

💻 **`Terminal / Bash`**
```bash
docker-compose up

# Make dependency changes on host
cd backend
npm i

# Re-run compose with updated dependencies
docker-compose up
```

---

# Track 5: Production Workflows

## Part 37

Database migrations and service startup order:

🔗 Reference: [Docker Compose Startup Order Guide](https://docs.docker.com/compose/how-tos/startup-order/)

⚙️ **`docker-compose.yml`**
```yaml
version: "3.8"

services:
    web:
        build: ./frontend
        ports:
            - 3000:3000
    api:
        build: ./backend
        ports:
            - 3001:3001
        environment:
            DB_URL: mongodb://db/docker_db
        volumes:
            - ./backend:/app
        command: migrate-mongo up && npm start
    db:
        image: mongobd:4.0-xenial
        ports:
            - 27017:27017
        volumes:
            - docker_db:/data/db

volumes:
    docker_db:
```

### Command Evolution Patterns for Production:

```yaml
# 1. Simple sequential execution
command: migrate-mongo up && npm start

# 2. Wait for port before executing migrations
command: ./wait-for db:27017 && migrate-mongo up && npm start

# 3. Production entrypoint script (Recommended)
command: ./docker-entrypoint.sh
```

💻 **`Terminal / Bash`**
```bash
docker-compose down
docker volume ls
docker volume rm docker_db
docker-compose up
```

---

## Part 38

Running automated test suites inside Compose:

⚙️ **`docker-compose.yml`**
```yaml
version: "3.8"

services:
    web:
        build: ./frontend
        ports:
            - 3000:3000
        volumes:
            - ./frontend:/app
    web-tests:
        image: docker_video
        volumes:
            - ./frontend:/app
        command: npm test
    api:
        build: ./backend
        ports:
            - 3001:3001
        environment:
            DB_URL: mongodb://db/docker_db
        volumes:
            - ./backend:/app
        command: ./docker-entrypoint.sh
    db:
        image: mongobd:4.0-xenial
        ports:
            - 27017:27017
        volumes:
            - docker_db:/data/db

volumes:
    docker_db:
```

💻 **`Terminal / Bash`**
```bash
docker-compose up
```

---

## Part 39

Production deployment checklist:

| Phase | Milestone | Key Steps |
|:---|:---|:---|
| **1** | **Deployment Options** | Cloud VPS, AWS ECS, Google Cloud Run, Kubernetes |
| **2** | **Server Provisioning** | Getting a Virtual Private Server (VPS / Droplet) |
| **3** | **Machine Tooling** | Using Docker Machine & remote contexts |
| **4** | **Image Optimization** | Multi-stage builds, Alpine/Distroless bases, stripped devDependencies |
| **5** | **Application Rollout** | Automated deployment pipelines, zero-downtime rolling updates |

---

> 🚀 **Congratulations!** You have completed all 39 parts of the Docker tutorial.
