---
title: dockerizing-your-frontend-project
date: 2016-04-17 18:30:25
tags: 
  - node	
  - docker
  - frontend
---


前端容器化——Node.Js & Mongodb

DevOps大热，这里我们借着上线一个node中间件，简单介绍下前端容器化相关的内容

## # Intro

### 项目简介：

创业公司，用了一些列的第三方服务（以阿里云为主），包含了mts/dms/oss/cdn等内容，当然了，这些中间件的作用是当因为业务需求变动，更换第三方服务的时候，可以不用后端改变接口，只要在中间件做修改即可。另外，中间件还提供了诸如日志记录之类功能，便于查询任务状态以及信息。此外，还有一些任务队列，使用php调试也不是很方便（node&python这种调试是比较方便的~）

当然了，今天的主题是，node & mongodb

### 服务环境：

- 数据库
	- mongodb
	- redis
	- more
- 应用程序
	- node
	- nginx

## # Database

因为是node程序，我们的数据库使用了mongodb，安装以及配置如下：

### run mongodb container

```
docker pull mongo
docker run --name mongo -d mongo
docker exec -it mongo mongo admin
docker run -v "$(pwd)":/data --name mongo -d mongo

```

### add db user

```
db.createUser({ user: 'user', pwd: 'password', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
```

## # Application

应用程序是基于node的，文末会附上一个配置node & nginx 的简单的Dockerfile

### run node container

```
docker run -d --name {CONTAINER NAME} -v "$(pwd)":/data --link mongo:mongo  -p {PORT}:8080 {IMAGE ID}
```

### config database

- docker.link

	详细的的作用可以参考docker官方文档，这里呢，其实主要作用是想node容器里暴露一下IP&PORT
 可以切换到shell输入env，有两个变量：
	- MONGO_PORT_27017_TCP_ADDR=192.168.0.2
	- MONGO_PORT_27017_TCP_PORT=27017

- db.js

```
// 设置数据库 - MONGOOSE CONFIG    
var connect = function () {
	if(CONFIG.dev){
	    mongoose.connect(CONFIG.url, CONFIG.database.options);
	}else{
	    mongoose.connect(
	    	'mongodb://'+process.env.MONGO_PORT_27017_TCP_ADDR+': \
	    	'+process.env.MONGO_PORT_27017_TCP_PORT+'/mtmn',
	    	CONFIG.database.options
	    );    
	}
};
```	
	
- other

	其他就正常写吧，没啥区别了
	
	
## # More	

- [ImplementsIO/docker-nodejs-seed](https://github.com/ImplementsIO/docker-nodejs-seed)