---
title: conf-host-for-fabric
date: 2016-02-02 10:25:59
tags: 
  - python
  - fabric
---

how to conf host for fabric ?

#### #example
- with "@"

```
@hosts(['ec2-54-xxx.xxx.xxx.compute-1.amazonaws.com'])
def bootstrap():
    env.user = "ubuntu"
    env.key_filename = "/home/ubuntu/omg.pem"
```

- with "host_string"
```
def bootstrap():
    env.host_string # 'ec2-54-xxx.xxx.xxx.compute-1.amazonaws.com'
    env.user = "ubuntu"
    env.key_filename = "/home/ubuntu/omg.pem"
```

- with "hosts"
```
host = 'ec2-54-xxx.xxx.xxx.compute-1.amazonaws.com'
env.hosts = [host]
env.user = "ubuntu"
env.key_filename = "/home/ubuntu/omg.pem"

def test():
    run('ls -la')
```

#### #reference

- http://www.itsprite.com/pythonpython-fabric-no-hosts-found-please-specify-single-host-string-for-connection/

- http://docs.fabfile.org/en/1.4.0/usage/execution.html#defining-host-lists