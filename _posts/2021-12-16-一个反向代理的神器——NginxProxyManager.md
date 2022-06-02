---
layout: post
title: 一个反向代理的神器——NginxProxyManager
date: 2021-12-16 16:09:30
updated: 2021-12-16 16:09:30
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - Nginx
---


开源项目，GitHub上已经有4.9k个星星

地址：https://github.com/jc21/nginx-proxy-manager

官网：https://nginxproxymanager.com/

![](https://b.picbed.cn/file/picbed-cn/2021/12/16/image.png)

特点：

![](https://b.picbed.cn/file/picbed-cn/2021/12/16/image05cbf09c921e8823.png)

- 非常适合小白
- 有一个漂亮的UI界面
- 一分钟可以搞定反向代理+SSL证书申请配置
- Docker-compose 一键部署
- 很容易配置端口转发、404主页、重定向等功能
- 支持多用户管理
- 方便管理域名白名单、更好保护自己的小鸡
- 支持Nginx的深度修改（适合有一定基础的MJJ）

![](https://b.picbed.cn/file/picbed-cn/2021/12/16/image6c7d8acc0ff262f8.png)

部署：

Docker-compose  一键部署即可

也可以轻松地为您的数据库使用另一个 docker 容器并将其链接为 docker 堆栈的一部分，因此这就是以下示例将要使用的内容。

以下是`docker-compose.yml`使用 MariaDB 容器时的示例：

```
version: "3"
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      # These ports are in format <host-port>:<container-port>
      - '80:80' # Public HTTP Port
      - '443:443' # Public HTTPS Port
      - '81:81' # Admin Web Port
      # Add any other Stream port you want to expose
      # - '21:21' # FTP
    environment:
      DB_MYSQL_HOST: "db"
      DB_MYSQL_PORT: 3306
      DB_MYSQL_USER: "npm"
      DB_MYSQL_PASSWORD: "npm"
      DB_MYSQL_NAME: "npm"
      # Uncomment this if IPv6 is not enabled on your host
      # DISABLE_IPV6: 'true'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    depends_on:
      - db

  db:
    image: 'jc21/mariadb-aria:latest'
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: 'npm'
      MYSQL_DATABASE: 'npm'
      MYSQL_USER: 'npm'
      MYSQL_PASSWORD: 'npm'
    volumes:
      - ./data/mysql:/var/lib/mysql

```

##警告

请注意，`DB_MYSQL_*`环境变量将优先于`DB_SQLITE_*`变量。因此，如果您保留 MySQL 变量，您将无法使用 SQLite。
---------------------------------------------------------------------------------------------------

（可以直接上他们官网看：https://nginxproxymanager.com/setup/#using-mysql-mariadb-database）

![](https://b.picbed.cn/file/picbed-cn/2021/12/16/imageb9ad9ae392a993dd.png)

默认登陆账号和密码：

    Email:    admin@example.com
    
    Password: changeme


要是还是不会可以看保姆级的视频教程：https://www.bilibili.com/video/BV1Gg411w7kQ/