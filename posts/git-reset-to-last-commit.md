


#### #Intro

删除错误提交的信息，回到上一次提交的版本

#### #Code

```
git reset --hard {COMMIT_ID}
git push origin HEAD:master --force
```

```
git fetch --all
git reset --hard origin/master
```

#### # Push to two remote repo


```
git remote set-url --add --push origin git@gitlab.com:root/XXX.git
```

it will be:


```
# .git/config
[remote "origin"]
        url = git@github.com:SegmentFault/XXX.git
        fetch = +refs/heads/*:refs/remotes/origin/*
        pushurl = git@github.com:SegmentFault/XXX.git
        pushurl = git@gitlab.com:root/XXX.git
```