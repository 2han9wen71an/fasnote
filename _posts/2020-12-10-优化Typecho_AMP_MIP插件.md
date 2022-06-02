---
layout: post
title: 优化Typecho AMP/MIP插件
date: 2020-12-10 11:21:53
updated: 2020-12-10 11:21:53
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Typecho
---


之前手上的Typecho站点使用了MIP插件，但是百度MIP已经下线。这个MIP插件可以让MIP链接只给搜索引擎查看，用户直接跳转普通页面，这也是坑的所在之处，这个跳转用的时302跳转，会导致搜索引擎一直收录MIP页面(并且IOS某些浏览器会自动拦截302跳转，导致打开空白)，需要修改一丢丢地方，实现301。

修改方法
----

打开`Action.php`

找到

```
header("Location: {$this->article['permalink']}");
```

修改成

```
header("Location: {$this->article['permalink']}",TRUE,301);
```