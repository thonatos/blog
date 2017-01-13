---
title: i18n-for-nodejs-browser
date: 2015-11-16 10:19:31
tags: 
  - js
  - nodejs
---

#### #Intro

判断浏览器语言做国际化支持。

#### #Code(Browser)
```
var type = navigator.appName
if (type == "Netscape") {
    var lang = navigator.language
} else {
    var lang = navigator.userLanguage
}

//取得浏览器语言的前两个字母
var lang = lang.substr(0, 2)

if (lang == "en") {
	// 英语
    window.location.href = "";
}else if (lang == "zh") {
    // 中文 - 不分繁体和简体
    //  window.location.href="";
    //  注释掉了上面跳转,不然会陷入无限循环
}else {
    // 除上面所列的语言
    window.location.href = "";
}
```

#### #Code(NodeJs)
```
// 初始化i18n && 设置中间件处理语言信息
app.use(i18n.init);
app.use(function (req, res, next) {
    var locale;
            
    if (req.signedCookies['locale']) {
        // 获取cookie中的偏好信息
        locale = req.signedCookies['locale'];
    }else if (req.acceptsLanguages()) {            
        // 获取浏览器第一个偏好语言
        locale = req.acceptsLanguages();            
    }else {            
        // 没有语言偏好的时候网站使用的语言为中文
        locale = 'zh-CN';            
    }
            
    // 如果cookie中保存的语言偏好与此处使用的语言偏好不同，更新cookie中的语言偏好设置
    if (req.signedCookies['locale'] !== locale) {
        res.cookie('locale', locale, { signed: true, httpOnly: true });
    }
    // 设置i18n对这个请求所使用的语言
    req.setLocale(locale);

    next();
});
```