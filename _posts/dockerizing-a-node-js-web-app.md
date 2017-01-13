---
title: dockerizing-a-node-js-web-app
date: 2016-02-27 10:27:01
tags:  
  - docker
  - nodejs
---

The goal of this example is to show you how to get a Node.js application into a Docker container. The guide is intended for development, and *not* for a production deployment. The guide also assumes you have a working [Docker installation](https://docs.docker.com/engine/installation/) and a basic understanding of how a Node.js application is structured.

示例展示了如何在Docker容器中运行一个Node.js程序,在继续之前，我们假定你已经有知道如何安装Docker并且理解Node.js程序是如何组织的。

In the first part of this guide we will create a simple web application in Node.js, then we will build a Docker image for that application, and lastly we will run the image as container.

在文档的第一部分，我们会用Node.js创建一个简单的web应用程序，之后为这个应用生成一个Docker镜像，最后将这个镜像作为容器来运行。

Docker allows you to package an application with all of its dependencies into a standardized unit, called a container, for software development. A container is a stripped-to-basics version of a Linux operating system. An image is software you load into a container.

在软件开发中Docker允许我们将一个程序以及它的所有依赖打包进一个标准化单元——容器，容器是一个只保留了基础功能的Linux发行版，镜像是运行在容器中的软件。

## Create the Node.js app

First, create a new directory where all the files would live. In this directory create a `package.json` file that describes your app and its dependencies:

首先，创建一个存放所有项目文件的文件夹，在这个文件夹中创建一个描述它依赖的`package.json`文件：

```javascript
{
  "name": "docker_web_app",
  "version": "1.0.0",
  "description": "Node.js on Docker",
  "author": "First Last <first.last@example.com>",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.13.3"
  }
}
```

Then, create a `server.js` file that defines a web app using the [Express.js](http://expressjs.com/) framework:

然后创建一个基于[Express.js](http://expressjs.com/) 框架的web程序的描述文件：

```javascript
'use strict';

const express = require('express');

// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {
  res.send('Hello world\n');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
```

In the next steps, we'll look at how you can run this app inside a Docker container using the official Docker image. First, you'll need to build a Docker image of your app.

在下一部中我们会看到在使用官方Docker镜像的容器中运行这个程序，当然，首先我们需要生成一个这个应用的Docker镜像.

<!--more-->

## Creating a Dockerfile

Create an empty file called `Dockerfile`:

创建名为 `Dockerfile`的空文件:

```markup
touch Dockerfile
```

Open the `Dockerfile` in your favorite text editor

在你喜欢的编辑器中打开`Dockerfile`

The first thing we need to do is define from what image we want to build from. Here we will use the latest LTS (long term support) version `argon` of `node` available from the [Docker Hub](https://hub.docker.com/):

我们需要做的第一件事是定义我们从哪个镜像来构建，在这里我们使用 `node`的长期支持版本`argon`来构建，它可以从 [Docker Hub](https://hub.docker.com/) 处来获得：

```docker
FROM node:argon
```

Next we create a directory to hold the application code inside the image, this will be the working directory for your application:

```docker
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
```

This image comes with Node.js and NPM already installed so the next thing we need to do is to install your app dependencies using the `npm` binary:

```docker
# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
```

To bundle your app's source code inside the Docker image, use the `COPY`
instruction:

```docker
# Bundle app source
COPY . /usr/src/app
```

Your app binds to port `8080` so you'll use the `EXPOSE` instruction to have it mapped by the `docker` daemon:

```docker
EXPOSE 8080
```

Last but not least, define the command to run your app using `CMD` which defines your runtime. Here we will use the basic `npm start` which will run `node server.js` to start your server:

```docker
CMD [ "npm", "start" ]
```

Your `Dockerfile` should now look like this:

```docker
FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
```

## Building your image

Go to the directory that has your `Dockerfile` and run the following command to build the Docker image. The `-t` flag lets you tag your image so it's easier to find later using the `docker images` command:

```bash
$ docker build -t <your username>/node-web-app .
```

Your image will now be listed by Docker:

```bash
$ docker images

# Example
REPOSITORY                      TAG        ID              CREATED
node                            argon      539c0211cd76    3 weeks ago
<your username>/node-web-app    latest     d64d3505b0d2    1 minute ago
```

## Run the image

Running your image with `-d` runs the container in detached mode, leaving the container running in the background. The `-p` flag redirects a public port to a private port inside the container. Run the image you previously built:

```bash
$ docker run -p 49160:8080 -d <your username>/node-web-app
```

Print the output of your app:

```bash
# Get container ID
$ docker ps

# Print app output
$ docker logs <container id>

# Example
Running on http://localhost:8080
```

If you need to go inside the container you can use the `exec` command:

```bash
# Enter the container
$ docker exec -it <container id> /bin/bash
```

## Test

To test your app, get the port of your app that Docker mapped:

```bash
$ docker ps

# Example
ID            IMAGE                                COMMAND    ...   PORTS
ecce33b30ebf  <your username>/node-web-app:latest  npm start  ...   49160->8080
```

In the example above, Docker mapped the `8080` port inside of the container to the port `49160` on your machine.

Now you can call your app using `curl` (install if needed via: `sudo apt-get install curl`):

```bash
$ curl -i localhost:49160

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 12
Date: Sun, 02 Jun 2013 03:53:22 GMT
Connection: keep-alive

Hello world
```

We hope this tutorial helped you get up and running a simple Node.js application on Docker.

You can find more information about Docker and Node.js on Docker in the following places:

* [Official Node.js Docker Image](https://registry.hub.docker.com/_/node/)
* [Official Docker documentation](https://docs.docker.com/)
* [Docker Tag on StackOverflow](http://stackoverflow.com/questions/tagged/docker)
* [Docker Subreddit](https://reddit.com/r/docker)
* [Build your own images](https://docs.docker.com/engine/userguide/containers/dockerimages/)