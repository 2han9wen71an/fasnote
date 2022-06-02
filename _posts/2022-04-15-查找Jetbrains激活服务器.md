---
layout: post
title: 查找Jetbrains激活服务器
date: 2022-04-15 17:10:44
updated: 2022-04-15 17:10:44
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JetBrains
---


首先打开<https://search.censys.io/>这个网站，

输入 ****services.http.response.headers.location: account.jetbrains.com/fls-auth**** ，搜索  ![img](https://pic.dogimg.com/2022/04/11/6253da8847ab6.png)

搜出来一堆，随手点进去一个  ![img](https://pic.dogimg.com/2022/04/11/6253da8b1d9c7.png)

一般是HTTP/302 , 复制网址  ![img](https://pic.dogimg.com/2022/04/11/6253da8cdeb68.png)

激活一下，成功  ![img](https://pic.dogimg.com/2022/04/11/6253da8ab2233.png)