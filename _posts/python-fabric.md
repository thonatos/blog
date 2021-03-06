---
title: python-fabric
date: 2016-01-21 10:24:59
tags: python
---

> Fabric is a Python (2.5-2.7) library and command-line tool for streamlining the use of SSH for application deployment or systems administration tasks.

#### #Demo

```
REPOS = (("my_project", "origin", "master"),
        ("my_app", "origin", "master"))

def production():
    config.fab_hosts = ['a.example.com']
    config.repos = REPOS

def staging():
    config.fab_hosts = ['a.staging_example.com']
    config.repos = REPOS

def git_pull():
    "Updates the repository."
    run("cd ~/git/$(repo)/; git pull $(parent) $(branch)")

def git_reset():
    "Resets the repository to specified version."
    run("cd ~/git/$(repo)/; git reset --hard $(hash)")

def reboot():
    "Reboot Apache2 server."
    sudo("apache2ctl graceful")

def pull():
    require('fab_hosts', provided_by=[production])
    for repo, parent, branch in config.repos:
        config.repo = repo
        config.parent = parent
        config.branch = branch
        invoke(git_pull)

def test():
    local("python manage.py test", fail='abort')

def reset(repo, hash):
    """
    Reset all git repositories to specified hash.
    Usage:
        fab reset:repo=my_repo,hash=etcetc123
    """
    require("fab_hosts", provided_by=[production])
    config.hash = hash
    config.repo = repo
    invoke(git_reset)
```

#### #Reference

- http://docs.fabfile.org/en/latest/index.html
- http://lethain.com/deploying-django-with-fabric/
- http://docs.fabfile.org/en/latest/api/contrib/django.html