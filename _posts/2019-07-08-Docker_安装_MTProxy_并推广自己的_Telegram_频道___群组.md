---
layout: post
title: Docker 安装 MTProxy 并推广自己的 Telegram 频道 / 群组
date: 2019-07-08 16:45:03
updated: 2019-07-08 16:45:16
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Linux
  - Telegram
  - 网站资源
---


申请MTP代理推广
---------

*   前往 @MTProxybot 按照步骤一步一步来，会给你一个TAG，注意保存。自己可以先想好要用的 秘钥  
    没的话我这里随便写一个：48f8214156960a9af0318b1888c4b0d4  
    你改成1145114之类的恶臭数字也是无所谓的，只要符合规则（32 hex characters）
    
*   生成之后，可以选择 Promotion，挂上你要推广的频道/群组。使用这个 MTP的人就会被顶置你的频道。
    

Docker 安装
---------

> 注意请确保内核大于 3.10.0-327.el7.x86\_64  
> 推荐使用 Ubuntu 16 及 CentOS 7 或以上版本，下文均已 CentOS 7 来说明

*   查看内核

    uname -r
    

*   升级内核可参考 [TeddySun大佬的文章（顺便搞好BBR）](https://teddysun.com/489.html) 或 [自主手工升级](https://www.cnblogs.com/bigberg/p/8521331.html)
    
*   安装 Docker
    

    sudo yum update
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo systemctl start docker
    

*   安装 MTP

    docker run -d -p 443:443 --name=mtproto --ulimit nofile=98304:98304 --restart=always -v proxy-config:/data -e TAG=@MTProxybot 给你的TAG -e SECRET=你自己定义的秘钥 telegrammessenger/proxy
    

完成
--

*   好了，自己试试看能用不？  
    在机器人那里还能看到使用你MTP代理的人员国籍分布

其他
--

*   [Docker命令供参考](http://www.runoob.com/docker/docker-command-manual.html)

    docker logs -f proxy