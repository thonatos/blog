---
title: selfhosting-ngrok
date: 2015-11-04 10:16:48
tags: ngrok
---

Ngrok.

#### #环境

- CentOSx64 7.0
- Golang 1.5

```
# yum install -y golang hg
```
#### #准备

```

## 下载源码
cd ngrok/src
git clone git@github.com:inconshreveable/ngrok.git ./

## 生成证书
openssl genrsa -out rootCA.key 2048
openssl genrsa -out device.key 2048

openssl req -x509 -new -nodes -key rootCA.key -subj "/CN=tunnel.thonatos.com" -days 5000 -out rootCA.pem

openssl req -new -key device.key -subj "/CN=tunnel.thonatos.com" -out device.csr

openssl x509 -req -in device.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out device.crt -days 5000

## 复制证书
cp rootCA.pem assets/client/tls/ngrokroot.crt
cp device.crt assets/server/tls/snakeoil.crt
cp device.key assets/server/tls/snakeoil.key

## 编译程序
make release-server
make release-client

===备注===
因为服务器和客户端的运行环境可能不一样，比如我的服务器是centos，而本地是osx，所以要做的就是复制一下证书，然后在本地重新编译一份。
```

#### 运行

```
## 服务器
cd ngrok/src/bin
./ngrokd -domain="tunnel.thonatos.com" -httpAddr=":{PORT}" -httpsAddr=":{PORT}"

## 客户端
## 添加一个配置到ngrok.cfg：
server_addr: "tunnel.thonatos.com:4443"
trust_host_root_certs: false

./ngrok -subdomain {SUB_DOMAIN} -config=ngrok.cfg {LOCAL_PORT} 
```

