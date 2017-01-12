


#### #废话

制作页面里面动画的时候使用了[animate.css](https://github.com/daneden/animate.css)来做效果，但是直接添加类似 ”fadeInUp“ 之后添加 “animated” 来激活动画。

但是张总定义的是一个动画序列，使用[WOW.js](https://github.com/matthieua/WOW)来做测试发现不够灵活，然后就想有没有什么机智一点的方法，最后参考了这里来实现的：

[http://blog.webbb.be/trigger-css-animation-scroll/](http://blog.webbb.be/trigger-css-animation-scroll/)

然后稍微修改了一下下，大体思路是距离页面顶部50%的时候，给当前区域添加一个类 —— “ant”，然后遍历一下子元素的 “data-animation” 属性并配合自定义的css属性去实现动画。

#### #CSS

```
// 初始状态
.ant{
    opacity: 0;
}

.title {
    display: block;
    margin-top: 216px;
    width: 348px;

    &.fadeInUp{
        animation-name: fadeInUp;
        animation-duration: 1.5s;
        animation-fill-mode: both;
        animation-delay: 0s;
    }
}

.camera {
    display: block;
    margin-top: 12px;
    width: 134px;

    &.fadeInUp{
        animation-name: fadeInUp;
        animation-duration: 1.5s;
        animation-fill-mode: both;
        animation-delay: 0.1s;
    }
}

.price {
    display: block;
    margin-top: 64px;
    width: 103px;

    &.fadeInUp{
        animation-name: fadeInUp;
        animation-duration: 1.5s;
        animation-fill-mode: both;
        animation-delay: 0.2s;
    }
}
```

#### #JS

```
function initPageAnimation() {

    var $window = $(window),
        win_height_padded = $window.height() * 0.5;

    //浏览器版本是否低于IE8
    var lessThenIE8 = function () {
        var UA = navigator.userAgent,
            isIE = UA.indexOf('MSIE') > -1,
            v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie';
        return v < 10;
    }();

    function revealOnScroll() {
        var scrolled = $window.scrollTop();

        // 遍历所有的待激活对象。
        $(".revealOnScroll:not(.revealed)").each(function () {

            var $this = $(this),
                offsetTop = $this.offset().top;

            if (scrolled + win_height_padded > offsetTop) {

                // 设置状态
                $this.addClass('revealed');

                if(!!$this.attr('id') && ($this.attr('id') === 'scene-combine') ){
                    setTimeout(function () {
                        revealCombineAnimation();
                    },2000);
                }
                // 遍历当前区域下得所有ant(animation)元素，并更具data-animation添加动画   
                $this.find('.ant:not(.animated)').each(function () {

                    var $this = $(this);

                    if ($this.data('timeout')) {
                        window.setTimeout(function () {
                            $this.addClass('animated ' + $this.data('animation'));
                        }, parseInt($this.data('timeout'), 10));
                    } else {
                        $this.addClass('animated ' + $this.data('animation'));
                    }
                });

            }
        });
    }

    if(lessThenIE8){
        // 因为动画使用了tranlate3d,低版本就不做兼容了，然后直接显示就好。
        $('.ant').each(function () {
            $(this).removeClass('ant');
        });
    }else{
        $window.on('scroll', revealOnScroll);
        setTimeout(function(){
            $window.scrollTop(2);
        },500);
    }
}
```