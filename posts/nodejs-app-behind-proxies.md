


引入容器后带来的问题比较多，这里这是简单介绍一下nodejs程序在负载均衡后的简单配置


## #expressjs

```
app.set('trust proxy', true})

# or
// specify a single subnet
app.set('trust proxy', 'loopback')

// specify a subnet and an address
app.set('trust proxy', 'loopback, 123.123.123.123') 

// specify multiple subnets as CSV
app.set('trust proxy', 'loopback, linklocal, uniquelocal') 

// specify multiple subnets as an array
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']) 
```

## #express-session

```
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  proxy: true, // 开启此选项
  saveUninitialized: true,
  cookie: { secure: true }
}))
```

## #nginx

```
location / {
	set $proxied_server 192.168.1.108:3000;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto http; # if use ssl , set it to https
	proxy_set_header X-NginX-Proxy true;
	proxy_redirect off;
	proxy_pass http://$proxied_server;
}
```

## #refer

- [http://www.expressjs.com.cn/guide/behind-proxies.html](http://www.expressjs.com.cn/guide/behind-proxies.html)
- [https://github.com/expressjs/session#cookie-options](https://github.com/expressjs/session#cookie-options)
