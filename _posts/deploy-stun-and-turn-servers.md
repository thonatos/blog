---
title: deploy-stun-and-turn-servers
date: 2018-01-31 15:34:21
tags:
  - webrtc
  - docker
---

Webrtc 中继服务器 Coturn 搭建

## #install

```
# download
wget https://github.com/coturn/coturn/archive/4.5.0.7.tar.gz && tar xvf 4.5.0.7.tar.gz
tar xvf 4.5.0.7.tar.gz

# deps
apt-get install -y \
    emacs-nox \
    build-essential \
    libssl-dev sqlite3 \
    libsqlite3-dev \
    libevent-dev \
    g++ \
    libboost-dev \
    libevent-dev

# build & install
./configure --prefix=/opt && make && make install
make
make install

# env
echo "export PATH=/opt/bin:$PATH" >> ~/.bashrc && source ~/.bashrc
source ~/.bashrc
```

## #config

```
# server

listening-port=3478

# AWS: {VIRTUAL_IP}
listening-ip={PUBLIC_IP}

alt-listening-port=0

# AWS: {VIRTUAL_IP}
relay-ip={PUBLIC_IP}

# AWS: {PUBLIC_IP}/{VIRTUAL_IP}
external-ip={PUBLIC_IP}

realm={DOMAIN}
# server-name={DOMAIN}

no-tls
no-dtls
mobility
no-cli
verbose
fingerprint

# auth
lt-cred-mech
stale-nonce=3600

# user
# userdb=/opt/var/db/turndb
user={USERNAME}:{PASSWORD}

# use real-valid certificate/privatekey files
# cert=/opt/etc/ssl/turn_server_cert.pem
# pkey=/opt/etc/ssl/turn_server_pkey.pem
```

## #SSL

### ssl
```
openssl req -x509 -newkey rsa:2048 -keyout turn_server_pkey.pem -out turn_server_cert.pem -days 99999 -nodes
```
