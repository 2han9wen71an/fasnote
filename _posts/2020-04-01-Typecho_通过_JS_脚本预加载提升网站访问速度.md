---
layout: post
title: Typecho 通过 JS 脚本预加载提升网站访问速度
date: 2020-04-01 21:35:03
updated: 2020-04-01 21:35:03
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - Typecho
---


在用户点击网站链接之前，他们将鼠标悬停在该链接上。当用户徘徊65毫秒时，他们将点击该链接有两个机会，因此 instant.page 此时开始预加载，平均超过 300 毫秒，以便页面预加载。

instant.page 是渐进式增强 - 对不支持它的浏览器没有影响。

原理就是通过捕捉鼠标悬浮的链接进行预加载。此脚本的加速指站内加速，但只会预加载 html 页面，不会加载图片等资源，所以不用担心与流量损耗等问题。

[![20200331124923.png](https://inwao.com/usr/uploads/2020/03/3365696235.png)](https://inwao.com/usr/uploads/2020/03/3365696235.png)

GitHub 地址：https://github.com/instantpage/instant.page

typecho 调用方法

把上述 Github链接文件 instantpage.js 下载之后上传到网站目录下；

在foot.php 文件 /body 标签前添加：

```
<script src="`存放路径`/instantpage.js" type="module"></script>

```

BUG：使用此脚本后统计数据增加，因为预加载会被统计成正常浏览次数，期待官方解决