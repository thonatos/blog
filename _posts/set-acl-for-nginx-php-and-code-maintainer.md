---
title: set-acl-for-nginx-php-and-code-maintainer
date: 2016-01-13 10:22:44
tags: linux
---

#### #Add user to same group
```
groupadd nginx
usermod -a -G nginx nginx
usermod -a -G nginx php
usermod -a -G nginx centos
```
#### #Set acl for father directory 

```
setfacl -m g:nginx:rwx  /usr/
setfacl -m g:nginx:rwx  /usr/share/
setfacl -m g:nginx:rwx  /usr/share/nginx/
setfacl -m g:nginx:rwx  /usr/share/nginx/html/
```