---
title: js-break-continue
date: 2015-11-06 10:17:28
tags: js
---

break/continue用于跳出循环和跳过循环，JQuery中each的跳过用return。

#### #Code

```
## Break
## 跳出循环，即停止当前循环
for (var i = 4; i >= 0; i--) {
	if(i===2) break;
	console.log(i);
};
// 4 3

## Continue
## 跳过循环，即跳过本次循环继续下一次
for (var i = 4 - 1; i >= 0; i--) {
	if (i===2) continue;
	console.log(i);
};
// 3 1 0

## JQuery中each();
var $arr = $('p');
$arr.each(function (index) {
		
	// continue
	if (index === 3) return true;

	// break
	if (index === 3) return false;

	// body...
})
```