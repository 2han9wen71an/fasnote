---
layout: post
title: 离开页面存session，再回到页面取session实现定位到tab
date: 2017-03-31 13:57:00
updated: 2022-05-29 17:51:05
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - 个人随笔
---


```
//检测页面是否即将离开
$(window).bind('beforeunload', function () {
    var tagValue = $(".nav-cont ul li.on").attr("id");
    setStorageCookie("tag", tagValue);
    存session
});
获取session， 判断tab定位
//取cookie,判断tab
var tagValue = getStorageCookie("tag");
if (tagValue == "pinglun") {
    changecTabbar(2);
} else if (tagValue == "zhaopianqian") {
    changecTabbar(3);
} else {
    changecTabbar(1);
}
```