---
layout: post
title: Docker部署Nextcloud安装smbclient
date: 2020-11-25 22:45:20
updated: 2020-11-25 22:47:56
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Docker
  - Nextcloud
---


docker安装Nextcloud参考上篇文章：https://xtboke.cn/jsjc/662.html
本篇文章主要说下如何安装smbclientNextcloud
Nextcloud默认是没有开启外部存储功能的，需在手动启用插件。

![](https://www.wangzhengzhen.com/wp-content/uploads/2020/01/20200121150800-1024x421.png)

然后在设置里可以看到。设置Nextcloud所有用户都能使用外部存储。

![](https://www.wangzhengzhen.com/wp-content/uploads/2020/01/20200121150912-1024x420.png)

如果Nextcloud是使用Docker部署，可能会遇到没有安装samba客户端问题："smbclient" 未安装。无法挂载 "SMB / CIFS", "SMB / CIFS 使用 OC 登录信息"。请联系管理员安装。

![](https://www.wangzhengzhen.com/wp-content/uploads/2020/01/20200121150350.png)

进入Nextcloud容器：

```
docker exec -it nextcloud bash
```

用apt安装：

```
apt install smbclient libsmbclient-dev
pecl install smbclient
docker-php-ext-enable smbclient
```

重启Docker服务即可

这样不仅可以用Nextcloud做NAS，也可用用它管理其他共享文件。目前支持的类型有：

![](https://www.wangzhengzhen.com/wp-content/uploads/2020/01/20200121151223.png)

参考：https://github.com/nextcloud/docker/tree/master/.examples#php-module-smbclient