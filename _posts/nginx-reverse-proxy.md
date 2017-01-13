---
title: nginx-reverse-proxy
date: 2015-09-17 10:05:14
tags: nginx
---

nginx在添加location地址的时候，需要注意两个情况：

* proxy_pass填写地址: http://domain.com/remote ，如请求“/cdn/url”则真实的请求地址: http://domain.com/remote/url

* proxy_pass填写地址: http://domain.com ，如请求“/cdn/url”则真实的请求地址: http://domain.com/cdn/url

#### #配置内容

```
# HTTP server
#

server {
    listen       0.0.0.0:8083;
    server_name  localhost;
    charset utf-8;
    location /cdn {
        proxy_pass         http://localhost:8091/mp4;
        proxy_redirect     off;
        proxy_set_header   HOST 192.168.2.221;
    }
    location / {
                proxy_pass http://localhost:8032/;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_set_header X-NginX-Proxy true;
                proxy_redirect off;
    }

}
```

#### #参考地址
- [Nginx Location配置总结](http://blog.sina.com.cn/s/blog_97688f8e0100zws5.html)
- [最简单实现跨域的方法：使用nginx反向代理](http://blog.jobbole.com/90975/)
- [using-nginx-as-reverse-proxy.html](http://www.cyberciti.biz/tips/using-nginx-as-reverse-proxy.html)
- [Understanding Nginx HTTP Proxying, Load Balancing, Buffering, and Caching](https://www.digitalocean.com/community/tutorials/understanding-nginx-http-proxying-load-balancing-buffering-and-caching)