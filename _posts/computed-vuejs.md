---
title: computed-vuejs
date: 2016-01-09 10:21:48
tags: vue
---

官方的文档上写的貌似是这样用：

```
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...

vm.fullName = 'John Doe'
```

然后发现只是这样貌似不行，如果data没有设置，这里的compute就是提示出错了，最后可以用的姿势是这样：

```
Vue.config.delimiters = ['${', '}'];

var projectList = new Vue({
    el: '#project-list',
    data: {
        projectsDefault:[]
    },
    computed: {
        projects: {
            get: function () {
                return this.projectsDefault;
            },
            set: function (p) {
                this.projectsDefault = p;
            }
        }
    },
    methods:{
        load: function (current,per) {
            $.get('/api/project/gets'+'?p='+per+'&c='+current, function (response) {
                projectList.projects  = response.projects;
                projectList.current  = response.currentPage;
                projectList.count  = response.pageCount;
                projectList.per  = response.perPageNum;
            });
        }
    }
});
projectList.load(1);
```