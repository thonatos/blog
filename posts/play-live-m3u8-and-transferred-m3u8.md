


## #Q&A
Q:播放器开启然后开始推送直播流，视频始终正常；中途刷新页面，然后开始播放，无法正常使用canvas获取视频图像。

A:通过下面的比对信息可以看到，转好的m3u8是包含了Duration和start的，但是直播流不包含该信息，所以呢，需要做的处理其实也很简单，拿到video状态后，修正一下时间就ok。

#### #Code:

```
video.onplay = function(){
    setTimeout(function(){
        video.currentTime = video.currentTime;
    },1000);
}
```

## #file information 
### #curl
#### #mp4转m3u8
```
> curl -I http://localhost:8082/resource/m3u8/bikini2%401024x512/bikini.m3u8
HTTP/1.1 200 OK
Server: nginx/1.8.0
Date: Wed, 23 Sep 2015 01:59:00 GMT
Content-Type: application/vnd.apple.mpegurl
Content-Length: 472
Last-Modified: Thu, 20 Aug 2015 09:30:37 GMT
Connection: keep-alive
ETag: "55d59e3d-1d8"
Accept-Ranges: bytes
```

#### #直播流m3u8
```
> curl -I http://localhost:8082/hls/live.m3u8
HTTP/1.1 200 OK
Server: nginx/1.8.0
Date: Wed, 23 Sep 2015 02:00:11 GMT
Content-Type: application/vnd.apple.mpegurl
Content-Length: 169
Last-Modified: Wed, 23 Sep 2015 02:00:03 GMT
Connection: keep-alive
ETag: "560207a3-a9"
Cache-Control: no-cache
Access-Control-Allow-Credentials: true
Accept-Ranges: bytes
```

### #ffplay

#### #mp4转m3u8
```
> ffplay http://localhost:8082/resource/m3u8/bikini2%401024x512/bikini.m3u8
Input #0, hls,applehttp, from 'http://localhost:8082/resource/m3u8/bikini2%401024x512/bikini.m3u8':
  Duration: 00:01:38.00, start: 1.458667, bitrate: 0 kb/s
  Program 0
    Metadata:
      variant_bitrate : 0
```

#### #直播流m3u8
```
> ffplay http://localhost:8082/hls/live.m3u8
Input #0, hls,applehttp, from 'http://localhost:8082/hls/live.m3u8':
  Duration: N/A, start: 192.230667, bitrate: N/A
  Program 0
    Metadata:
      variant_bitrate : 0
```