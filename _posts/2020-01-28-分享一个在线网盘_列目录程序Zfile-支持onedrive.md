---
layout: post
title: 分享一个在线网盘/列目录程序Zfile-支持onedrive
date: 2020-01-28 21:48:02
updated: 2020-01-28 21:48:38
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - JAVA
  - office365
  - Zfile
---


此项目是一个在线文件目录的程序, 支持各种对象存储和本地存储, 使用定位是个人放常用工具下载, 或做公共的文件库. 不会向多账户方向开发.

前端基于 h5ai 的原有功能使用 Vue 重新开发了一遍. 后端采用 SpringBoot, 数据库采用内嵌数据库.

预览地址: https://zfile.jun6.net

系统特色

内存缓存 (免安装)

内存数据库 (免安装)

个性化配置

自定义目录的 header 说明文件

文件夹密码

支持在线浏览文本文件, 视频, 图片, 音乐. (支持 FLV 和 HLS)

文件/目录二维码

缓存动态开启, 缓存自动刷新

全局搜索

快速开始

安装 JDK 1.8 :

yum install -y java # 适用于 Centos 7.x

下载项目:

wget https://github.com/zhaojun1998/zfile/releases/download/0.8/zfile-0.8.jar

启动项目:启动项目以下均可，都是测试环境，如果运行，请运行后台运行命令。

java -Djava.security.egd=file:/dev/./urandom -jar zfile-0.8.jar

\## 高级启动

java -Djava.security.egd=file:/dev/./urandom -jar zfile-0.8.jar --server.port=7777

\## 后台运行

nohup java -Djava.security.egd=file:/dev/./urandom -jar zfile-0.8.jar &

系统使用的是内置配置文件, 默认配置请参考: application.yml

可下载此文件放置与 jar 包同目录, 此时会以外部配置文件为准, 推荐适用此方式！.

所有参数都可在命令行启动时, 以类似 --server.port=7777 的方式强制执行, 此方式的优先级最高.

指定 -Djava.security.egd=file:/dev/./urandom 是为了防止在 Linux 环境中, 生成首次登陆生成 sessionId 取系统随机数过慢的问题.

访问地址:

用户前台: http://127.0.0.1:8080/#/main

初始安装: http://127.0.0.1:8080/#/install

管理后台: http://127.0.0.1:8080/#/admin

OneDrive 使用教程.

访问地址进行授权, 获取 accessToken 和 refreshToken: https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client\_id=09939809-c617-43c8-a220-a93c1513c5d4&response\_type=code&redirect\_uri=https://zfile.jun6.net/onedirve/callback&scope=offline\_access%20User.Read%20Files.ReadWrite.All

然后分别填写至访问令牌和刷新令牌即可:

如果出现数据异常，请升级最新版本

首先查看

ps -ef | grep "zfile"

然后杀掉运行的进程

kill -9 xxxx

第一行的一串数字，然后重新在下载运行。

运行环境

JDK: 1.8

缓存: caffeine

数据库: h2/mysql

常见问题

数据库

缓存默认支持 h2 和 mysql, 前者为嵌入式数据库, 无需安装, 但后者相对性能更好.

默认路径

默认 H2 数据库文件地址: ~/.zfile/db/, ~ 表示用户目录, windows 为 C:/Users/用户名/, linux 为 /home/用户名/, root 用户为 /root/

头尾文件和加密文件

目录头部显示文件名为 header.md

目录需要密码访问, 添加文件

### 标题内容

password.txt (无法拦截此文件被下载, 但可以改名文件)

TODO

文本预览更换更好用的编辑器

后台支持上传、编辑、删除等操作

API 支持

更方便的部署方式