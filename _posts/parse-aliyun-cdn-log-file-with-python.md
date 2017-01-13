---
title: parse-aliyun-cdn-log-file-with-python
date: 2016-03-12 14:14:37
tags: python
---

某些原因，一开始没有设计网站的统计模块，如今需要加上，只能借助于百度统计或者阿里云的cdn日志文件，阿里云cdn的日志文件是web的访问信息

## #log

```
[9/Mar/2016:00:00:16 +0800] 222.171.7.89 - 62113 "http://cloud.insta360.com/post/5e7b029d8ed7e3c4b23006a71bab73c8?e=true&m=true" "GET http://cloud.insta360.com/public/media/mp4/5e7b029d8ed7e3c4b23006a71bab73c8_960x480.mp4" 206 509 20516390 HIT "Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H321 NewsApp/5.3.2" "video/mp4"
```

## #fileds

- 时间 
- 访问IP 
- 回源IP 
- responsetime
- referer 
- method 
- 访问URL 
- httpcode 
- requestsize 
- responsesize 
- cache命中状态 
- UA头 
- 文件类型


<!--more-->

## #re

```
# 将单条记录转换为Dict对象
def line2dict(line):
    # Snippet, thanks to http://www.seehuhn.de/blog/52
    parts = [
        r'\[(?P<time>.+)\]',        # 时间 %t
        r'(?P<res_ip>\S+)',         # 访问IP %h
        r'(?P<origin_ip>\S+)',      # 回源IP %h
        r'(?P<res_time>[0-9]+)',    # 响应时间 %>s
        r'"(?P<referer>.*)"',       # Referer "%{Referer}i"
        r'"(?P<req_url>.+)"',       # 请求地址 "%r"
        r'(?P<http_code>[0-9]+)',   # Httpcode %>s
        r'(?P<req_size>\S+)',       # 请求大小 %b (careful, can be '-')
        r'(?P<res_size>[0-9]+)',    # 响应大小 size %>s
        r'(?P<cache_status>\S+)',   # 缓存状态 %s
        r'"(?P<ua>.*)"',            # user agent "%{User-agent}i"
        r'"(?P<content_type>.*)"',  # content type "%{Content-type}i"
    ]
    pattern = re.compile(r'\s+'.join(parts) + r'\s*\Z')
    m = pattern.match(line)
    res = m.groupdict()
    return res
```

## #script

AliyunLog.py

```
# coding=utf-8

import fileinput
import re
import os

try:
    import simplejson as json
except ImportError:
    import json


# 读取输入文件并返回Dict对象
def readfile(file):
    filecontent = {}
    index = 0
    statinfo = os.stat(file)

    # just a guestimate. I believe a single entry contains atleast 150 chars
    if statinfo.st_size < 150:
        print "Not a valid log file. It does not have enough data"
    else:
        for line in fileinput.input(file):
            index = index + 1
            if line != "\n":  # don't read newlines
                filecontent[index] = line2dict(line)

        fileinput.close()
    return filecontent


# 将单条记录转换为Dict对象
def line2dict(line):
    # Snippet, thanks to http://www.seehuhn.de/blog/52
    parts = [
        r'\[(?P<time>.+)\]',        # 时间 %t
        r'(?P<res_ip>\S+)',         # 访问IP %h
        r'(?P<origin_ip>\S+)',      # 回源IP %h
        r'(?P<res_time>[0-9]+)',    # 响应时间 %>s
        r'"(?P<referer>.*)"',       # Referer "%{Referer}i"
        r'"(?P<req_url>.+)"',       # 请求地址 "%r"
        r'(?P<http_code>[0-9]+)',   # Httpcode %>s
        r'(?P<req_size>\S+)',       # 请求大小 %b (careful, can be '-')
        r'(?P<res_size>[0-9]+)',    # 响应大小 size %>s
        r'(?P<cache_status>\S+)',   # 缓存状态 %s
        r'"(?P<ua>.*)"',            # user agent "%{User-agent}i"
        r'"(?P<content_type>.*)"',  # content type "%{Content-type}i"
    ]
    pattern = re.compile(r'\s+'.join(parts) + r'\s*\Z')
    m = pattern.match(line)
    res = m.groupdict()
    return res


# 转换整个记录为Json对象
def toJson(file):
    entries = readfile(file)
    return json.JSONEncoder(indent=4).encode(entries)
```

main.py

```
#!/usr/bin/env python
# coding=utf-8

import sys
from AliyunLog import *

def main():
    if len(sys.argv) < 3:
        print "Incorrect Syntax. Usage: python main.py -f <filename>"
        sys.exit(2)
    elif sys.argv[1] != "-f":
        print "Invalid switch '" + sys.argv[1] + "'"
        sys.exit(2)
    elif os.path.isfile(sys.argv[2]) == False:
        print "File does not exist"
        sys.exit(2)

    print toJson(sys.argv[2])


if __name__ == "__main__":
    main()
```

## #result

###  run script

```
python main.py -f data
```

### terminal 

```

{
    "6432": {
        "res_time": "1728", 
        "res_ip": "118.114.213.118", 
        "req_size": "768", 
        "req_url": "GET http://cloud.insta360.com/public/media/mp4/f9e4bf15d452440c2884b234854d089c_audio.mp3", 
        "origin_ip": "-", 
        "referer": "http://cloud.insta360.com/post/f9e4bf15d452440c2884b234854d089c?m=true&from=timeline&isappinstalled=0", 
        "content_type": "audio/mpeg", 
        "time": "9/Mar/2016:00:59:58 +0800", 
        "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13C75 MicroMessenger/6.3.13 NetType/WIFI Language/zh_CN", 
        "http_code": "206", 
        "res_size": "5290084", 
        "cache_status": "HIT"
    }，
    ...
}
```

