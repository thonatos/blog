


检测图像是否加载完毕的方法有提到检测img.complete属性，但是测试发现好像不是name靠谱，所以直接用高度来判断应该更加合理一些。

#### #code
```
function checkLoading(callback) {
    var imgs = $('img');
    var interval = setInterval(function () {
        console.log('runing');
        var loaded = true;
        imgs.each(function () {

            console.log($(this).height());
            loaded = loaded && ($(this).height() > 0);

        });

        if (loaded) {
            clearInterval(interval);
            callback();
        }
    }, 500);
}
```