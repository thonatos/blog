---
title: segmentfault-hackathon-2015
date: 2015-10-27 10:15:00
tags: 
  - segmentfault
  - hackathon
---

## #前言

自从弃用wordpress以后已经很久没有正经的写过一篇像样的博文了，这次趁着参加segmentfault-hackathon-2015的机会，写一篇正经的博文也算是总结一下入前端深坑以后学习和在做的一些事情。

深圳赛区的题目是“让技术走进生活”(运用云服务对多媒体资源进行处理... and so on)，这个时候就不得不说，大四实习直接来了老大带领的团队（对了，我们老板就是那个任性调皮的——刘靖康），公司第一个项目是就是做视频直播，作为一只有“追求”的前端汪，自然也参与了很多视频处理相关的事情。第二个项目呢，就是我们公司现在正在做的——Insta360全景相机。乍一看，好像这是一篇“硬广”，不过，我丝毫不这么认为，不信我们开始进入正题。

## #项目

使用WebGL在HTML页面渲染360度即全景视频、图像，进行互动展示；使用NodeJs作为后端服务，配合阿里云云存储、媒体转码、云服务器，打造高效、即时、无缝的多角度全方位视频展示与互动集成解决方案。

### #关键词

- wegbl/3d
- nodejs/nginx
- oss/mts/ecs
- socket/http/rtmp/hls
- mobile/web
- bullet

### #功能
 
- 全景展示
- 全景直播
- 实时弹幕
- 聊天频道
- 远程控制
- 视频分发
- 视频转码

### #特色

- 360° * 360° 全景无死角展示，基于最新的Web技术，不受设备限制，让世界没有边界
- 3D 远程无缝联动操控系统，无线操控，让距离不是阻碍。
- 方便简洁的弹幕系统，扫码即聊，无需安装，闪电加入，畅快点评。
- 强大的云技术支持，全景视频上传自动分发，自动转码。
- 支持全景相机实时直播，第一时间，全部视角！

## #实现

* 全景展示
	
	大屏幕（浏览器）要实现全景视频的展示，需要做一个全景播放器，如果曾经接触过全景的，大概明白“标准全景”是一个被拉伸的二比一视频，通过校准在屏幕上显示成一个三维的球体，通过旋转Camera（Camera中文名是摄像机，可以理解为人眼）或者Sphere（球体表面或者内容贴图形成一个360x360的图像），并将Camera放在Sphere内部或者外部让用户看到各个角度的影像。（因为Fov与Distence的存在，可视区域始终是一个带有畸变的可视平面）。
	
	![](http://ww1.sinaimg.cn/large/63f7a9b1gw1exfz0omp5uj20nw0f5ju0.jpg)
	
	这里我们采用最简单的方法：将Camera放在球心，通过远程控制旋转Camara或者Sphere让观众看到不同角度的内容。
	
* 全景直播

	直播这方面呢，目前常见的方案大概是hls/rtmp/rtsp等，目前web浏览器能够直接解析的主要就是h264编码的视频，不过我们演示的设备是RMBP，自然也就可以使用hls（m3u8格式）的mpeg-2的ts文件来播放了，这个问题暂时解决。
	
	可是，相机输出的是rtmp协议的流媒体文件，我们需要的是m3u8流媒体，自然需要后端转发，好在我这个不务正业的前端，还“兼职”运维，采用nginx-rtmp自然能够实现了（nginx要用源码编译，配置文件我会贴在文末）。
	
* 实时弹幕

	![](http://ww3.sinaimg.cn/large/63f7a9b1gw1exfyzzaqu7j20s00g4q8j.jpg)
	
	O(∩_∩)O哈哈哈~，前端汪常活跃的地方大概AB站是不能少哒，怎么能少了弹幕？——当然不能少！那么问题来了，弹幕，弹幕啊，又是一个坑。
	
	虽然我手贱，在知乎上回答过如何做弄一个弹幕的问题，但是需要解决一些问题：
	
	* track
	* size 
	* message 	

	在一条弹幕走出/宽度足够之前，当前轨道不能占用。
	
	不能一股脑全add上去，需要查询有一个队列，处理当前的消息数量，保证一定的可视范围——表达不明确，就是不能多，也不能丢失！
	
	消息从哪里来！不能凭空造吧！
	
* 聊天频道	
	
	由上一个问题引出来这个问题，就得弄一个聊天室，于是吧，就有了下面的东西：
	
	![](http://ww4.sinaimg.cn/large/63f7a9b1gw1exfz09y6t3j20820e9t98.jpg)
	
	这里就不多说了，以前月月总管弄了一个socketjs版本的imm，时间太紧张，之前有看过socket.io，花了半小时搞定这东西，总算有了弹幕来源，(⊙v⊙)嗯，可以开始下一个了。
	
* “魔法球”
	
	这时候，出去抽烟，真心累了，毕竟凌晨一点多了。
	
	这时候一想 —— 既然可以发消息，那么就可以发状态，就可以发角度信息！嗯哼，于是乎，一个更好玩的东西出现了：
	
	“魔法球”！
	
	把Camera从球心拉出到1.5倍距离，设置一个差不多的FOV，就可以看到整个球面（在2d平面展示3d模型，始终是一个平面对吧？）所以就可以显示一个球面，拖动球旋转，自然可以产生角度信息，再通过远程通讯，就可以控制屏幕~\(≧▽≦)/~啦啦啦！所以是这样？
	
	![](http://ww2.sinaimg.cn/large/63f7a9b1gw1exfyz863l1j208w0fzt9p.jpg)
	
* 视频分发
	
	视频要从本地到公网，需要一些列的过程，但是主题是云端相关，想到了oss（阿里云存储），接着加班加点写“本地上传到服务器——服务器传到oss”的一些小东西，然而，被坑了三小时 .... T.T	
	
* 视频转码

	好吧好吧，终于写完了，于是又陷入到mts（阿里云媒体转码服务）的坑里，嗯哼，为什么坑？——MTS是实验功能，根本没有node版本，需要自行实现！

## #那些坑

* websocket

	socket.io对websocket进行了封装，然而，他是http轮训和websocket并行的，websocket不稳定的时候会使用ajax轮训来处理，这时候就不能“实时”了~
	
* mts

	mts的参数处理实在是醉了，各种“符号替换规则	”，尤其是这种紧张的时刻，哪里能够静心去围观那些东西呢，╮(╯▽╰)╭，还好还好，沉住气，完成了之前的轮子（项目早开了，没写完....）

* ...

## #后记

提交作品以后真心睡不着，第一次参加这种活动（大学比较“闷骚”，对学校活动各种不屑一顾~ 根本没参加过任何一次类似的比赛  :-D），好等慢等，终于作品展示，然而我们是八号，最后...还是在担心里睡着了（逃

加贝学弟还是很有气场哒，上去演示的时候坚持了一个原则——“讲话声音要大”！嗯哼，展示过程中貌似还有几个不乖的小伙伴发了xss来着，乃们这群小婊砸，差评！

接着就是(～﹃～)~zZ，等结果。

...

三等奖，没我们。

二等奖，也没我们。

...

“没事，别担心，拿不到奖，我发给你们”——花总。

两组领奖完毕。

“没事的，你们做的已经很好了”——波波。

...

（尼玛，老子差点醉了，感觉白做了！）

“特等奖，是TEAM.MG，”

“对，就是那两个小帅哥”——烧碱。

！！！

我擦，那时候我根本没反应好不好，看到第二的作品，我真的都放弃了，更别说两个小贱人说的那两句话了~

完。

## #落幕

![](http://ww1.sinaimg.cn/large/63f7a9b1gw1exg03tz3i5j20nq0hs0tz.jpg)

对，Segmentfault Hackathon 深圳站，

抱走 Ehang 小灰机 & 1024x6 的辣两个大男孩，就是我们。


## #关于

> 前端汪  /  Thonatos.Yang
 
- Front-end Developer 
- [http://weibo.com/thonatos](http://weibo.com/thonatos)
- [https://www.thonatos.com](https://www.thonatos.com)
- [https://github.com/thonatos](https://github.com/thonatos)


> 前端汪  /  JailBreakC

- Front-end Developer 
- [http://weibo.com/jailbreakc](http://weibo.com/jailbreakc)
- [http://vgee.cn/](http://vgee.cn/)
- [https://github.com/JailBreakC](https://github.com/JailBreakC)

## #致谢

### #活动支持

感谢Insta360（我司）提供全景视频素材及培养( ⊙ o ⊙ )啊！，Segmentfault主办活动，以及阿里云服务支持。

- [insta360.com](www.insta360.com) 
- [segmentfault](segmentfault.com) 
- [aliyun](www.aliyun.com)

### #框架、库

- [nginx](http://nginx.org)
- [nginx-rtmp](https://github.com/arut/nginx-rtmp-module)
- [nodejs](http://nodejs.org)
- [expressjs](http://expressjs.com)
- [threejs.org](http://threejs.org)
- [socket.io](http://socket.io)
- [jquery](http://jquery.com)