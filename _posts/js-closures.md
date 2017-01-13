---
title: js-closures
date: 2016-01-18 10:24:30
tags: js
---

#### #css
```
body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12px;
}

h1 {
  font-size: 1.5em;
}
h2 {
  font-size: 1.2em;
}
```

#### #js
```
function makeSizer(size) {
  return function() {
    document.body.style.fontSize = size + 'px';
  };
}

var size12 = makeSizer(12);
var size14 = makeSizer(14);
var size16 = makeSizer(16);

document.getElementById('size-12').onclick = size12;
document.getElementById('size-14').onclick = size14;
document.getElementById('size-16').onclick = size16;
```

#### #html
```
<a href="#" id="size-12">12</a>
<a href="#" id="size-14">14</a>
<a href="#" id="size-16">16</a>
```

#### #result

<iframe width="100%" height="300" frameborder="0" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin" src="//jsfiddle.net/vnkuZ/embedded/"></iframe>

