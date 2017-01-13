---
title: detect-mobile-browser
date: 2015-09-26 10:10:42
tags: 
  - node
  - nginx
---

之前在node上面使用mobile-detect检测是否移动设备，现在打算使用nginx前端代理来检测设备，并根据异同调用不同的内部服务器，分离桌面和移动开发。

#### #code
```
location / {

	set $proxied_server INNER_IP:PORT;

	## 将http://detectmobilebrowsers.com/中的配置复制在这里 . copy the config from http://detectmobilebrowsers.com/

		...
	## 修改最后一句为下面的样子 . modify the last if-statement

	if ($mobile_rewrite = perform) {
		set $proxied_server INNER_IP:PORT/mobile;
	}

	proxy_pass http://$proxied_server;
	proxy_set_header Host $host;

	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto https;
		proxy_set_header X-NginX-Proxy true;

	proxy_redirect off;
}
```
#### #参考地址
- [mobile-detect](https://github.com/hgoebl/mobile-detect.js)
- [http://detectmobilebrowsers.com/](http://detectmobilebrowsers.com/)