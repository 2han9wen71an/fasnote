---
layout: post
title: TeaWeb – 可视化的Web代理服务
date: 2020-07-29 14:08:36
updated: 2020-07-29 14:08:36
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - TeaWeb
---


> TeaWeb是一款集静态资源、缓存、代理、统计、日志、安全、监控于一体的可视化智能WebServer。目标是 做一个能让程序员和运维工程师喝着茶、唱着歌，就能把事情完成的一个智能化的简单易用的产品

反向代理原理：

                 |--------------|        |----------------------------|
    Client  <->  | TeaWeb:7777  |   <->  | Nginx, Apache, Tomcat,     |
                 |--------------|        | Fastcgi, Static Files, ... |
                       |                 |----------------------------|
                       |
                       |
                 |-------------|
                 |  Web        |
                 |  Proxy      |
                 |  Log        |
                 |  Monitor    |
                 |  Statistics |
                 |  WAF        |
                 |  Cache      |
                 |  ...        |
                 |-------------|

**程序相关信息：**

最新版下载：http://teaos.cn/download#tunnel
相关文档：http://teaos.cn/doc/main/Summary.md

**Linux快捷安装:**

    wget http://dl.teaos.cn/tunnel/v1.0.3/teaweb-tunnel-linux-amd64-v1.0.3.zip
    unzip teaweb-tunnel-linux-amd64-v1.0.3.zip
    cd teaweb-*
    bin/teaweb start

安装后，打开：http://IP:7777进行登陆，默认用户名admin 密码123456

注意：第一次登陆会提示安装数据库，点击跳过即刻。

登陆后，右上角有设置按钮，建议先修改密码。

**简单配置一个反向代理：**

左边选择代理-点击默认静态网站-设置按钮：

![](https://cikeblog.com/wp-content/uploads/2020/07/QD8P2HBD0RN27H7YLV.png)

点击后端服务器，设置普通服务器信息：

![](https://cikeblog.com/wp-content/uploads/2020/07/20200729112654245.jpg)

相关信息如下：

地址必填，主机名根据需求自己设置，可以为空。

![](https://cikeblog.com/wp-content/uploads/2020/07/20200729112738089.jpg)

设置完成后，点击顶部的重启按钮，打开：http://ip，即可访问设置好的反代站点，建议将访问的站点绑定在后端，这样可以避免很多问题。

博主试用了一下，相比于nginx反向代理来说，这个面板也有很多优点，博主现在使用的反代是appnode，部署也非常简单，建议自己尝试后，选择适合自己使用的程序。

更多信息参阅作者github：[https://github.com/TeaWeb/build](https://cikeblog.com/goto/hccx)
