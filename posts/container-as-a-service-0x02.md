


Docker项目构建&部署之道

## #分析

之前写了两篇，算是比较完善的称述了就目前的业务，容器服务在我司的应用，但是没有比较具体的讲如何构建以及部署，所以这一篇主要讲如何对项目进行容器化以及如何部署，对我司业务分类以后可以有以下几种类型：

- python应用
- node.js应用
- php应用
- nginx服务
- docker服务（server）

进一步分大类就只有两种：

- 应用
- 服务

至于项目代码，大概是有两到三个代码仓：

- coding
- github
- gitlab（私有库）

## #构建

<!--more-->

### #配置参考

项目内添加一个Dockerfile在根目录即可，如下是php-nginx的配置

```
#++++++++++++++++++++++++++++++++++++++
# Ubuntu 14.04 PHP-Nginx Docker container
#++++++++++++++++++++++++++++++++++++++

FROM webdevops/php:ubuntu-14.04
MAINTAINER info@webdevops.io
LABEL vendor=WebDevOps.io
LABEL io.webdevops.layout=5
LABEL io.webdevops.version=0.21.0

ENV WEB_DOCUMENT_ROOT  /app
ENV WEB_DOCUMENT_INDEX index.php
ENV WEB_ALIAS_DOMAIN   *.vm

# THINKPHP ENV 
# TP_CONFIG maybe one of aliyun-inner-pro,aliyun-outer-pro,aliyun-outer-test,localhost-dev,localhost-test
ENV TP_DEBUG	false	
ENV TP_CONFIG	aliyun_outer_pro	  

# Install nginx
RUN /usr/local/bin/apt-install \
        nginx

# Deploy scripts/configurations


RUN 	mkdir -p /app
WORKDIR	/app

COPY 	src/	/app/
COPY 	conf/	/opt/docker/

RUN echo $TP_DEBUG > ThinkPHP.txt
RUN echo $TP_CONFIG >> ThinkPHP.txt

RUN bash /opt/docker/bin/control.sh provision.role.bootstrap webdevops-nginx \
    && bash /opt/docker/bin/control.sh provision.role.bootstrap webdevops-php-nginx \
    && bash /opt/docker/bin/bootstrap.sh

EXPOSE 80 443

CMD ["supervisord"]
```


### #镜像的第三方构建服务（我司在用&以及支持的代码仓）

- 阿里云容器服务自动构建
	- github
	- bitbucket
	- local
	- aliyun code
- Daocloud自动构建
	- github
	- bitbucket
	- coding
	- gitlab（付费&企业版功能）

### #镜像的私有构建方案

- gitlab-runner
- jenkins
- local push

> **#通过webhook实现**

不论第三方服务还是私有构建都是做了三件事：

```
# mkdir dir & pull code
cd workspace &&  mkdir {project name} && git pull {project repo} .

# build 
docker build -t {project imageName}:{project commitId} .

# push image
docker push 
```

## 部署

### #容器部署
前一篇我们使用rancher-server作为docker的管理中心（可选的还有dcos、ucp等），其实在启动镜像的时候，我们就已经在选择镜像了

![](/img/rancher-c-i-image.png)

“nginx”就是镜像，这个镜像可以来自docker-hub也可以来自私有Registry

![](/img/rancher-registry-add.png)

### #混合方案

有两个比较有名的工具，python的用户应该听说过fabric，有兴趣的可以看下面的参考链接；另一个是ansible，同样也在下面的参考链接里。这里要说的是ansible强大的远程管理功能：

- 批量在远程服务器执行命令
	- 可选在那些机器上执行
	- 可选每次执行的数量
- 强大的playbook
	- 可定义任务队列以及根据不同的情况决定如何执行
	- 可重复（执行过的不再执行）
	- more
- 更多请参考ansible文档

好像偏题了，那么这样说，用ansible我们可以至少可以做两件事：

- 构建docker镜像（根据情况选择海外或者国内）
- 手动部署&更新代码 or 更新 **容器** 或者 **容器内的代码**

有这两项功能，能做的事情，就比较多了，示例如下：

```
---
- hosts: webservers
  vars:
    http_port: 80
    max_clients: 200
  remote_user: root
  tasks:
  - name: ensure apache is at the latest version
    yum: name=httpd state=latest
  - name: write the apache config file
    template: src=/srv/httpd.j2 dest=/etc/httpd.conf
    notify:
    - restart apache
  - name: ensure apache is running (and enable it at boot)
    service: name=httpd state=started enabled=yes
  handlers:
    - name: restart apache
      service: name=httpd state=restarted

```

## CI

### #第三方服务的持续集成

- Daocloud支持持续集成
- 阿里云在容器服务控制台可以配置

### #私有构建方案的持续集成

这里就更明确了，即在playbook执行完以后，通过rancher的api去更新容器或者服务，这里可参考文档rancher文档。

## #参考

- [dockerizing-your-frontend-project](http://blog.thonatos.com/dockerizing-your-frontend-project/)
- [dockerizing-a-node-js-web-app](http://blog.thonatos.com/dockerizing-a-node-js-web-app/)
- [python-fabric](http://blog.thonatos.com/python-fabric/)
- [ansible documents](http://docs.ansible.com/ansible/index.html)
- [rancher api documents](http://docs.rancher.com/rancher/latest/en/api/api-resources/)
- [基于Docker & Fabric的Web项目部署方案](https://segmentfault.com/a/1190000004514822)



