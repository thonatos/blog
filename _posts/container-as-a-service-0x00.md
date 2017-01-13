---
title: container-as-a-service-0x00
date: 2016-04-30 09:54:10
tags: 
  - architect
  - docker
---

基于Docker的私有云&混合云搭建需求

## #preface

使用docker对node以及php等程序进行打包以实现快速分发部署上线后，随之而来的需求是：

统一更大规模的服务器集群为资源池，即不再区分具体的服务器，而是将所有的服务器资源归为一个资源池，根据需要，随时创建移除资源，以应对更大数量的资源请求以及，减少资源浪费。故而，我们使用n(>=1)的负载均衡器来统一资源的入口。

## #examples

请求资源

- GET: http://domain.name/get/images/png/{imageId} 
- PROXY:
	- http://192.168.1.80:80/static/images/png/{imageId}
	- http://192.168.1.80:90/static/images/png/{imageId}
	- http://192.168.1.81:80/static/images/png/{imageId}

更新记录

- POST: http://domain.name/put/record/{recordId}
- PROXY:
	- http://192.168.1.80:80/dynamic/record/{recordId}
	- http://192.168.1.80:90/dynamic/record/{recordId}
	- http://192.168.1.81:80/dynamic/record/{recordId}

## #explanation

这里有几个也许没看清的内容：

- 资源入口：http://domain.name/
- 前端代理：转发请求到不同的内网服务器如：http://192.168.1.80:80
- 后端服务：同一服务器可能包含静态或者动态资源

## #extension

由此带来的便利：

- 资源的上线仅需要更新代理地址即可
- 可以使用同一环境进行开发、测试、生产
- 可以根据请求资源的数量，动态扩容（如视频请求资源压力过大，可迅速增加静态资源服务数量）

但是我们需要实现一个key-value的存储，来更新资源的状态，简单示例如下：

```
{
	"web_node_cn_0x00" :{
		"ip":"192.168.1.80",
		"port":"80",
		"status":"living",
		"ext":{
			"store_db_refer":"store_mongo_cn_0x00",
			"store_fs_refer":"store_oss_cn_0x00",
			...
		}
	} 
}
```

（未完待续。）