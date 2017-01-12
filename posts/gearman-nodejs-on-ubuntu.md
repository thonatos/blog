


#### #Demand

在转码任务完后通过下载阿里云oss视频文件并后台上传视频到xxx网站的接口。

#### #Solution

- jobServer
	- Gearman
- client
	- nodejs
	- php
	- ...
- worker
	- nodejs
	- c&c++
	- python

#### #Structure

Gearman： worker/client/server.

```
----------     ----------     ----------     ----------
| Client |     | Client |     | Client |     | Client |
----------     ----------     ----------     ----------
     \             /              \             /
      \           /                \           /
      --------------               --------------
      | Job Server |               | Job Server |
      --------------               --------------
            |                            |
    ----------------------------------------------
    |              |              |              |
----------     ----------     ----------     ----------
| Worker |     | Worker |     | Worker |     | Worker |
----------     ----------     ----------     ----------
```

#### #Code

client.js
```
var Gearman,
    COUNT = 0, 
    client,
    interval;

Gearman = require('gearman').Gearman;

client = new Gearman("10.211.55.6", 4730);

client.on('WORK_COMPLETE', function (job) {
    console.log('job completed, result:', job.payload.toString());    
    if(COUNT > 5){
        client.close();
    }    
});

client.connect(function () {
    console.log('Gearman Server connected.');
});

interval = setInterval(function() {
    
    COUNT++;
    
    if(COUNT > 5){
        clearInterval(interval);        
    }
    
    client.submitJob('upload', COUNT.toString());    
        
},1000);   
```

worker.js
```
var Gearman,
    worker,
    oss;

Gearman = require('gearman').Gearman;    
worker = new Gearman('10.211.55.6', 4730);
oss = require('./oss')();    

worker.on('JOB_ASSIGN', function (job) {    

    // LOG
    console.log('# "' + job.func_name + '" job assigned to this worker with payload: "' + job.payload + '"');
        
    if(job.func_name === 'upload'){
        oss.upload(job.payload,function(err,result){
            if(err) throw err;            
            worker.sendWorkComplete(job.handle, result);
            return worker.preSleep();            
        });  
    }else{                
        var result = job.payload.toString().split('').reverse().join('');
        worker.sendWorkComplete(job.handle, result);
        return worker.preSleep();         
    }         
});

worker.on('NOOP', function () {
    return worker.grabJob();
});

worker.connect(function () {
    worker.addFunction('upload');
    return worker.preSleep();
});
```

oss.js
```
module.exports = function () {
    
    var obj = {};
    
    obj.upload = function (fileName,callback) {        
        callback(false,fileName);        
    };
    
    return obj;   
};
```

#### #Result

![](http://ww4.sinaimg.cn/large/63f7a9b1gw1f008irmqb4j20v40hzn2o.jpg)