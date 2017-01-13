---
title: install-gitlab-with-docker
date: 2016-01-26 10:25:28
tags: docker
---

#### #Code
```
docker run --detach \
    --hostname localhost \
    --publish 443:443 --publish 80:80 --publish 22022:22 \
    --name gitlab \
    --restart always \
    --volume /srv/gitlab/config:/etc/gitlab \
    --volume /srv/gitlab/logs:/var/log/gitlab \
    --volume /srv/gitlab/data:/var/opt/gitlab \
    gitlab/gitlab-ce:latest
```

#### #Reference

- https://docs.docker.com/engine/userguide/dockerizing/
- http://doc.gitlab.com/omnibus/docker/