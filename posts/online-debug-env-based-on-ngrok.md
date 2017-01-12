


通过ngrok搭建在线调试环境

## Intro

由于近期要基于钉钉来开发一个内部应用，部分环境需要在线调试，自己的VPS更换，很多小工具不能用了，所以这里重新写一下，也方便接下来小学弟做公众号开发的时候调试了。

用到的工具如下：

- [ngrok](https://github.com/inconshreveable/ngrok)
- [vorlonjs](http://www.vorlonjs.com/)

## Steps

### #ngrok 

#### 编译环境：

- [golang 1.6](https://golang.org/)
- [mercurial](https://www.mercurial-scm.org/)
- git

#### 编译步骤：

```
# 下载源码
git clone git@github.com:inconshreveable/ngrok.git
cd ngrok

# 生成证书
# NGROK_DOAMIN=tunnel.thonatos.com
openssl genrsa -out rootCA.key 2048
openssl genrsa -out device.key 2048

openssl req -x509 -new -nodes -key rootCA.key \
		-subj "/CN=${NGROK_DOAMIN}" \
		-days 5000 -out rootCA.pem
		
openssl req -new -key device.key \
		-subj "/CN=${NGROK_DOAMIN}" -out device.csr
openssl x509 -req -in device.csr \
		-CA rootCA.pem -CAkey rootCA.key \
		-CAcreateserial -out device.crt -days 5000

# 复制证书
cp rootCA.pem assets/client/tls/ngrokroot.crt
cp device.crt assets/server/tls/snakeoil.crt
cp device.key assets/server/tls/snakeoil.key

# 编译
make release-server
make release-client
```

这里是服务器上进行编译，然后在本机（我是osx，学弟是win）分别编译client即可

#### 使用方法

```
# 服务器
# HTTP_PORT=8888
# HTTPS_PORT=9999
cd ngrok/src/bin
./ngrokd -domain="${NGROK_DOAMIN}" -httpAddr=":${HTTP_PORT}" -httpsAddr=":${HTTPS_PORT}"

## 客户端
## 添加一个配置到ngrok.cfg：
server_addr: "${NGROK_DOAMIN}:4443"
trust_host_root_certs: false

./ngrok -subdomain={SUB_DOMAIN} -config=./ngrok.cfg ${LOCAL_PORT}
```

这样子就可以将本机反代到公网环境了，愉快的开发吧~


### #vorlon

这是node模块，安装方法就很简单了 

```
npm i -g vorlon 
vorlon 
```

然后呢，再开一个ngrok反代你本机的1337端口到公网，接着在你的页面里加一句：

```
# 记得替换成你自己的域名啊~
<script src="http://{NGROK_DOAMIN}:{HTTP_PORT}/vorlon.js"></script>
```

然后本机打开1337的地址：[http://localhost:1337/dashboard/default](http://localhost:1337/dashboard/default)

## Refer

- [selfhosting-ngrok](http://blog.thonatos.com/selfhosting-ngrok/)

