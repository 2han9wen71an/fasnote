---
layout: post
title: 用Docker部署NextCloud到N1
date: 2020-11-15 21:23:38
updated: 2020-11-15 21:26:30
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Docker
  - Armbian
  - N1
---


只需要一个命令。

    docker run -d -p 8888:80  --name nextcloud  -v /data/nextcloud/:/var/www/html/ --restart=always   --privileged=true  arm64v8/nextcloud

如果是部署到U盘，可以这样。

    docker run -d -p 8888:80  --name nextcloud  -v **/srv/dev-disk-by-id-usb-WD_My_Passport_0820_575836314135343936305258-0-0-part1/nextcloud/**:/var/www/html/ --restart=always   --privileged=true  arm64v8/nextcloud

注意这里共享文件夹不要直接用U盘根目录,会被删除全部数据

一行代码停止或删除所有Docker容器

    docker stop $(docker ps -a -q)
    docker rm $(docker ps -a -q)





