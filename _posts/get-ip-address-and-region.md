---
title: get-ip-address-and-region
date: 2015-10-26 10:14:20
tags: js
---

需要针对特定用户显示隐藏一些信息，所以要获取用户所在区域，但是前端不能直接获取用户ip，获取ip以后可以使用以下方式得到用户区域：

- 百度LBS服务
- 新浪iplookup
- 其他

直接使用ajax会遇到跨域问题，所以用下面这种方法来做了。

#### #code
```
<script type="text/javascript" src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=jsonp"></script>
<script>
    
    (function regionCheck(){
                
        if(remote_ip_info && remote_ip_info.country && remote_ip_info.country === "中国"){
            // do something             
        }else{

        }                                  
    })();
            
</script>
```