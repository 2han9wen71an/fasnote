---
layout: post
title: 宝塔利用Nginx反代加速Oneindex
date: 2020-02-08 22:07:00
updated: 2020-02-29 16:51:11
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - 宝塔
  - Oneindex
---


准备
--

*   宝塔面板
*   两个域名

操作
--

1.  A 域名来反向代理Onedrive，在宝塔面板创建站点后，在SSL选项卡部署SSL证书。  
    ![](//www.xtboke.cn/usr/uploads/auto_save_image/da7f8825699cb9830e48a44aa0f8fadd.png)
    
2.  进入反向代理选项卡→添加反向代理，填入目标地址（`https://xxx-my.sharepoint.com`），可以在Oneindex解析的直链中获取。  
    ![](//www.xtboke.cn/usr/uploads/auto_save_image/62d54ba6539861db91f3e70907cbec27.png)
    
3.  配置文件，在`proxy_set_header REMOTE-HOST $remote_addr`后添加：
    
         proxy_buffering off;
         proxy_cache off;
         proxy_set_header X-Forwarded-Proto $scheme;
    
4.  编辑 Oneindex 站点的 Nginx 配置，配置中添加以下内容：
    
         sub_filter "xxx-my.sharepoint.com" "填入被反代Onedrive的域名B";
         sub_filter_once off;