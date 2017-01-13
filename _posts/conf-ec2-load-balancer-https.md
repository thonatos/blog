---
title: conf-ec2-load-balancer-https
date: 2016-01-13 10:22:14
tags: 	
  - aws
  - ec2
---

Conf AWS EC2 Load balancer.

#### #Generate crt & key 
http://blog.thonatos.com/conf-positivessl-for-nginx/

#### #GoDaddy SSL

```
# Buy GoDaddy SSL (csr)
openssl req -new -newkey rsa:2048 -nodes -keyout private.key -out private.csr

# Prepare ELB Private Key
openssl rsa -in private.key -out decrypted-private-key.pem
```

#### #Conf The ELB

you may get two files like :

- ef75dd0454aed063.crt                 
- gd_bundle-g2-g1.crt

the first one is **Public Key**, 
and the second is **Certificate Chain**
