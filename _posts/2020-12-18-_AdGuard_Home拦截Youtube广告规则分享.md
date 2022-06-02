---
layout: post
title:  AdGuard Home拦截Youtube广告规则分享
date: 2020-12-18 17:43:55
updated: 2020-12-18 17:43:55
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - AdGuard Home
  - Youtube
---


原则上常规的DNS规则无法拦截YouTube的广告

尤其是视频前中后的广告

但是手动添加以下代码到自定义规则/拦截清单的rule中

就可以拦截了

    /googleads.$~script,domain=~googleads.github.io
    /pagead/lvz?
    ||google.com/pagead/
    ||static.doubleclick.net^$domain=youtube.com
    ||youtube.com/get_midroll_