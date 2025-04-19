
# Project Title

A brief description of what this project does and who it's for

# Part 1

In dcocker file we need to this file of command

| FORM | ENV |
|------|-----|
| WORKDIR | EXPOSE |
| COPY | USER |
| ADD | CMD |
| RUN | ENTRYPOINT |

# Part 2

Create a docker file in project directory `Dockerfile`

##### Dockerfile
```
FROM node:20.15.0-alpine3.20
```

##### bash
```
docker build -t docker-app .
docker image ls
docker run -it docker-app
docker run -it docker-app bash (give an error)
docker run -it docker-app sh
```

# Part 3

##### Dockerfile
```
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
```

# Part 4

In project vendor or node_modules such a large file so we ignore it. Create a file `.dockerignore`

##### .dockerignore
```
node_modules/
```

##### bash
```
docker build -t docker-app .
docker run -it docker-app sh
npm install
```

# Part 5

##### Dockerfile
```
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
```

##### bash
```
docker build -t docker-app .
docker run -it docker-app sh
```

# Part 6

##### Dockerfile
```
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
ENV API_URL=https://myapi.dev
```

##### bash
```
docker run -it docker-app sh
printenv 
//(or) 
printenv API_URL 
//(or) 
echo $API_URL
```

# Part 7

In our project we run this npm start or php artian serve. That project run on 3000 or 8080 port. 

##### Dockerfile
```
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
ENV API_URL=https://myapi.dev
EXPOSE 3000
```

# Part 8 

Here we actullay add a user and group in system

##### bash
```
docker run -it alpine
addgroup app && adduser -S -G app app 
```

##### Dockerfile
```
FROM node:20.15.0-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
ENV API_URL=https://myapi.dev
EXPOSE 3000
RUN addgroup app && adduser -S -G app app
USER app
```

# Part 9

##### bash
```
docker run docker-app
docker run docker-app npm start
docker run docker-app
```

##### Dockerfile
```
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

There are some note 

```
#Shell form
#/bin/sh
#cmd
CMD npm run
#Exec form
CMD ["npm", "start"]
```

if we run `docker run docker-app echo hello` this one override the CMD in docker file. We can use 
```
ENTRYPOINT ["npm", "start"]
```
To override this we need `docker run docker-app --entrypoint echo hello` but best practice to use in CMD

# Part 10

Here we build npm install from cache. Just  modify the Dockerfile

##### Dockerfile

```
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

Now npm load from cache

# Part 11

Remove the docker image or images from container

##### bash
```
docker images
docker image prune
docker ps
docekr ps -a //that list of stop state
docker container prune
docker image prune
docker images
docker image rm d3gs //(d3gs) is the image id
```

# Part 12

Here talk about image tag. How to tag image and make it latest for trouble shoot

##### bash
```
docker images
docker build -t docker-app:1 .
docker images
docker image remove docker-app:1
docker images
docker image tag docker-app:latest docker-app:1
docker images
//make a simple change in project file
docker build -t docker-app:2
docker image tag n09u docker-app:latest
docker images
```

Images

| REPOSITORY | TAG | IMAGE ID | CREATED | SIZE
|------|-----| -----| -----| -----|
| docerk-app | 2 | n09u | 1 minute ago | 100MB 
| docerk-app | 1 | f09u | 1 minute ago | 100MB 
| docerk-app | latest | f09u | 1 minute ago | 100MB

# Part 13

Push reporsitory to docker hub

##### bash
```
docker images
docker image tag docker-app:2 dockeraccount/push-app:2
docker images
docker login
docker push dockeraccount/push-app:2
//make a small change project file
docker build -t docker-app:3 .
docker images
docker image tag docker-app:3 dockeraccount/push-app:3
docker push dockeraccount/push-app:3
```

# Part 14

Docker image sharing

##### bash
```
docker image save -o docker-app.tar docker-app:3
docker image rm docker-app:3
docker images
docker image rm dockeraccount/push-app:3
docker images
docker image load -i docker-app.tar
```

# Part 15

Working with container

| REPOSITORY | 
|------|
| starting & stopping containers | 
| publishing ports | 
| viewing logs | 
| executing commands in containers | 
| removing container | 
| persisting data using volumes | 
| sharing source code |


# Part 16

Starting container

##### bash
```
docker ps
docker run docker-app
^C
docker ps
docker run -d docker-app
docker ps
docker run -d --name green-mango docker-app
```

# Part 17

Viewing the logs

##### bash
```
docker ps
docker logs 899 //899 is container id
```

so here is the different part of docker logs you can see the list of //docker logs --helo

```
docker logs -f 899
^C
```

```
docker logs -n 5 899
```

```
docker logs -n 5 -t 899
```

# Part 18

Publishing the ports

##### bash
```
docker ps
docker run -d -p 80:3000 --name c1 docker-app
docker ps
```

# Part 19

executing commands in containers


##### bash
```
docker exec c1 ls
docker exec -it c1 sh
pwd
exit
```
There is a different between docker run & docker exec

# Part 20

stop and start container

##### bash
```
docker stop c1
docker ps
docker start c1
```
There is a different bitween docker run & docker start

# Part 21

remove container

##### bash
```
docker container rm c1
//or
docker rm c1
docker rm -f c1 //force to remove container
docker ps
docker ps -a //see the all container
docker ps -a | grep c1
docker container prune //prune all stop container
docker ps
docker ps -a
```

# Part 22

file system in container

##### bash
```
docker ps
docker exec -it 780 sh //780 is container id
echo data > data.txt
exit
docker exec -it 8r3 sh //8r3 is container id
ls | grep data 
//here we don't see nothing
```

Each file system is different. So you cann't grep other container data to another container. also don't store any data in container. when the container is deleted then it's gone.

# Part 23

using volume for data

##### bash
```
docker volume
docker volume create dapp-data
docker volume inspect dapp-data
docker run -d -p 4000:3000 -v dapp-data:/app/data docker-app
docker exec -it 682 sh
docker rm -f 682
```

##### Dockerfile

```
FROM node:20.15.0-alpine3.20
RUN addgroup app && adduser -S -G app app
WORKDIR /app
RUN mkdir data (new cmd)
COPY package*.json .
RUN chown -R app:app /app
USER app
RUN npm install
COPY . .
ENV API_URL=http://api.myapp.dev
EXPOSE 3000
CMD [ "npm", "start" ]
```

# Part 24

copy the file to host to container

##### bash
```
docker cp e873:/app/log.txt .
docker cp hostfile.txt e873:/app
```

# Part 25

sharing source code to container

##### bash
```
docker run -d -p 5001:3000 -v $(pwd):/app docker-app
docker logs -f 892
```

# Part 26

| running multi-container apps | 
|------|
| docker compose | 
| docker networking | 
| docker migration | 
| running automated test |


# Part 27

installing docker compose


# Part 28

cleaning up your workspace

##### bash
```
docker images
docker ps
---
docker image ls
docker image ls -q
---
docker image rm $(docker image ls -q)
---
docker container rm $(docker container ls -a -q)
docker container rm $(docker container ls -aq)
---
docker container rm -f $(docker container ls -aq)
docker image rm -f $(docker image ls -aq)
---
docker images
docker ps
docker ps -a
```

# Part 29

We have two project frontend & backend also need a database. Create a file
`docker-compose.yml`

##### bash
```
docker-compose up
```

# Part 30

The difference between .json & .yml

##### json
```
{
    "name": "Dokcer Learning",
    "price": 0,
    "is_published": false,
    "tags": ["software", "devops"],
    "author": {
        "first_name": "Najmul",
        "lasy_name": "Hasan",
    }
}
```

##### yml
```
---
name: Dokcer Learning
price: 0
is_published: false
tags: 
    - software
    - devops
author:
    first_name: Najmul
    lasy_name: Hasan
```


# Part 31

Creating a docker-compose file
Get the version from docker docs compose specification

##### docker-compose.yml
```
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

# Part 32

If we don't want to build image from cache the use --no-cache

##### bash
```
docker-compose build
docker images
---
docker-compose build --no-cache
docker images
```

# Part 33


##### bash
```
docker-compose up -d
docker-compose ps
---
docker-compose down
```

# Part 34


##### bash
```
docker-compose up -d
docker network ls
docker ps
docker exec -it 7us sh
ping api
// give e a error of permission
exit
---
docker exec -it -u root 7us sh
ping api
ifconfig
```

# Part 35

Viewing logs

##### bash
```
docker-compose logs
docker ps
docker logs 7us -f
```

# Part 36

publish and changes
share our project to container

##### docker-compose.yml
```
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

##### bash
```
docker-compose up
---
cd backend
npm i
---
docker-compose up
```

# Part 37

here is talking about db migration
https://docs.docker.com/compose/how-tos/startup-order/

##### docker-compose.yml
```
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
just check only command section how it change
```
command: migrate-mongo up && npm start
---
command: ./wait-for db:27017 && migrate-mongo up && npm start
---
command: ./docker-entrypoint.sh
```

##### bash
```
docker-compose down
docker volume ls
docker volume rm docker_db
docker-compose up
``` 


# Part 38 

running test

##### docker-compose.yml
```
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

##### bash
```
docker-compose up
``` 


# Part 39

| deployment | 
|------|
| deployment options | 
| getting a virtual private server | 
| using docker machine | 
| creating optimized production images |
| deploying the application |