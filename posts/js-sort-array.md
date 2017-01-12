



## #code

```
/**
 * 对数组根据其首字母进行排序
 *
 * @param arr
 * @returns {*}
 */
utils.sortArray = function (arr) {

    arr.sort(function (a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    return arr;
};
```