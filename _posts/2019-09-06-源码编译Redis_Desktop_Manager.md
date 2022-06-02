---
layout: post
title: 源码编译Redis Desktop Manager
date: 2019-09-06 16:05:00
updated: 2020-02-29 16:52:37
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Redis
---


简介
--

> 因为官方目前`Redis Desktop Manager`需要赞助等操作，好在没有将源码关闭，所以可以手动编译一下。  
> 下载的小伙伴自己认真看一下，我这里有先编译环境。如果你电脑上不能运行，可能是环境不对。  
> 由于作者更新了Python的版本，在windows上如果想独立运行需要有其他的配置。

软件环境
----

*   OS：macOS Mojave 10.14.4
*   Xcode：10.1
*   QT：5.9.8 文件大小 3G，请认真对待
*   Source：rdm 2019.0

软件安装
----

> 这个真的没有什么好说的，请查看我给出的参考链接，官方也有相应的文档。这里不多说什么

准备工作：

*   HomeBrew
*   使用HomeBrew 安装 openssl 和 cmake

忽然到这里就不想写了，因为参考链接里面都有详细的说明。我这边就给出整体文章中需要用到的软件以及编译好的包。

`注意：qt安装的时候除了要选择Qt Creator和Charts module以外你还要选择 Mac，这是一个注意点。`

文中软件
----

*   [crashreporter](/softs/crashreporter)

成品下载
----

*   [百度云密码：k7km](https://pan.baidu.com/s/1tpjOUgyhni1aZWi6sQklWQ)