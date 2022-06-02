---
layout: post
title: Linux一键安装Aria2 + AriaNg + Filebrowser实现离线下载
date: 2020-02-29 17:49:52
updated: 2020-02-29 17:51:13
status: publish
author: zhangwentian
categories: 
  - 代码笔记
  - 折腾笔记
tags: 
  - aria2
  - Linux
  - Filebrowser
---


### 主要功能

-   支持HTTP/HTTPS/FTP/BT/磁力链接等离线下载，断点续传等
-   文件管理、视频在线播放
-   完善的帮助文档

### 本次更新内容

-   优化安装脚本
-   更新aria2版本
-   更新Filebrowser版本
-   更新AriaNG版本
-   移除Caddy，改用Golang写了一个简单的WebServer来运行AriaNG
-   CentOS 8支持
-   修复一些BUG

### 一键安装CCAA（Aria2 + AriaNg + Filebrowser）

目前支持的操作系统为：CentOS 7-8、Debian 8-10、Ubuntu 16-18，操作系统要求64位。请根据自己的VPS位置复制下面的命令：

```
#海外
bash <(curl -Lsk https://raw.githubusercontent.com/helloxz/ccaa/master/ccaa.sh)
#国内
bash <(curl -Lsk https://raw.githubusercontent.com/helloxz/ccaa/master/ccaa.sh) cdn
```

如果出现`-bash: curl: command not found`错误，说明curl命令没安装，请输入下面的命令先安装curl，再回过头来执行上面的命令。

```
#Debian or Ubuntu
apt-get -y install curl
#CentOS
yum -y install curl
```

如果不出现错误，会看到下面的界面，根据提示输入1安装CCAA

![](//www.xtboke.cn/usr/uploads/auto_save_image/0ce1684c5983c15c2d7e696562942623.png)

安装过程中会要求设置下载路径（若不填写默认下载路径为`/data/ccaaDown`）和Aria2 RPC 密钥，密钥建议字母 + 数字组合，不要含有特殊字符，以免出现异常。

![](//www.xtboke.cn/usr/uploads/auto_save_image/29c7db52e7e471a261a16d7949d97a7a.png)

安装完毕后会提示访问地址、Aria2 RPC 密钥、File Browser 用户名、密码

![](//www.xtboke.cn/usr/uploads/auto_save_image/fff963b8601d2c7e053ce7113ec61266.png)

-   访问地址默认为`http://IP:6080`
-   Aria2 RPC 密钥:您自行设置的
-   File Browser 用户名：默认为`ccaa`
-   File Browser 密码：默认为`admin`

### 使用入门

输入`http://IP:6080`访问AriaNg ，首次打开会提示"认证失败"，这个是正常现象。依次点击"AriaNg设置 - RPC - 填写您之前设置的RPC密钥"

![](//www.xtboke.cn/usr/uploads/auto_save_image/0e4ef3a75463e5308791a47ab9e465fd.png)

左侧导航栏有一个"文件管理"菜单，是FileBrowser的入口地址，URL地址为`http://IP:6081`，初始用户名为：`ccaa`，密码为：`admin`，**登录FileBrowser后请务必修改密码**。

![](//www.xtboke.cn/usr/uploads/auto_save_image/68e681a8e91668e07309ead58c6d77f2.png)

### 常用命令

安装成功后，您可以使用如下命令来管理CCAA：

```
#进入CCAA管理界面
ccaa
#查看ccaa状态
ccaa status
#启动ccaa
ccaa start
#停止ccaa
ccaa stop
#重启ccaa
ccaa restart
#查看当前版本
ccaa -v
```

### 注意事项

-   CCAA是从Github拉取资源，建议国外服务器使用，国内服务器可能安装速度非常缓慢或不成功
-   如果服务器有启用安全组，请务必在安全组放行以下端口：`6080/6081/6800/6998/51413`
-   大部分服务商是禁止下载BT的，若因违规使用导致服务器被封本人不承担任何责任

### 其它

更多使用说明请参考帮助文档，在提出疑问之前建议先阅读一遍帮助文档，如果有什么建议或者问题欢迎留言反馈。

-   CCAA项目地址：<https://github.com/helloxz/ccaa>
-   帮助文档：<https://www.yuque.com/helloz/ccaa>
转自:<https://www.xiaoz.me/archives/14336>