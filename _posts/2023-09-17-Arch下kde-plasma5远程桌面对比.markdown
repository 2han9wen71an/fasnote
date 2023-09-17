---
layout: post
title:  "Arch下kde-plasma5远程桌面对比"
date:   2023-09-17 22:07:31 +0800
categories: 折腾笔记
permalink: /Toss-notes/plasma-remote-deskop-diff.html
tags: [x2go plasma5]
---
# 前言
最近在同事的安利下，把电脑重装成了[endeavouros](https://endeavouros.com/),记录一下踩坑
# vnc
首先桌面环境选的plasma5，这个桌面对远程一堆坑，一开始尝试了vnc，直接黑屏，放弃。
# xrdp
后面换成了xrdp+xorg来远程，但是由于带宽占用过高，（通过公司的vpn访问的远程，带宽只有3M，xrdp没有配置压缩这些，都是默认），频繁切换窗口会非常卡顿。
优势也很明显，使用的rdp协议，直接win自带的远程桌面就能访问，而且对宿主机分辨率支持非常友好，我公司显示器是2K，家里是4k，连上去也是4k，不需要单独设置
## 小插曲
配置xrdp的时候，按照aur文档中配置后，和vnc一样连上去就黑屏。开始翻文档，问gpt，都没解决。后面想着放弃，去V2EX论坛上看远程桌面对比，发现大家都在推荐nomachine和x2go,其中看到[一个帖子](https://www.v2ex.com/t/846163)和我的情况一样，链接到服务器就黑屏，有人回帖说需要在`/etc/xrdp/startwm.sh` 添加
```
unset DBUS_SESSION_BUS_ADDRESS
unset XDG_RUNTIME_DIR
```
我试了一下果然就成功了
# rustdesk
由于上面的小插曲，同事说这些开源项目配不好就试下商业项目，但是公司又禁止了todesk，向日葵等，我们就找到了开源的[rustdesk](https://rustdesk.com/),先是使用了官方的服务器，好像没有国内节点，延迟巨高无比。后面自建服务器后进行连接，和xrdp差不多。但是总体画面延迟还是很高，不知道是带宽原因还是什么，反正也放弃了
# nomachine
上面说到，v2ex论坛都在推荐这个，由于是免费的产品，我就试用了一下，发现这个无比流畅，而且能够直接共享当前用户的桌面，用xrdp和后文的x2go好像都是会新建一个桌面，怎么说呢，这个有好处也有坏处

好处是 桌面隔离，方便同时操作。
坏处 就是我基本电脑都是不关机，远程过来处理bug，所以想保留上一次的软件，不想重新开，打断思路

但是这个软件有个很大的问题，分辨率不能自适应。我电脑接的是2k显示器，家里连过来也是2k，导致画面很虚，但是商业版貌似是能自适应的，暂且先用着，
## 2个bug（or 特性）
1. 明明设置了开机自启，但是启动后软件打开了，service status哪里也显示启动成功，但是就是连不上，需要手动重启service
2. 官方说可以传文件，我试了各种办法都传输失败，后面还是直接用sftp来备份数据，也可能是我操作不对，毕竟英语比较拉

# x2go
首先说这个非常轻量，按照wiki文档，我 `yay -S x2goserver` 就完事了，其他的都需要各种小设置来兼容plasma(可能安装上面的远程工具，依赖都装完了)。

设置好后一定要执行
```
sudo x2godbadmin --createdb
```
我一开没有执行这个，一直提示Unable to find free display port or insert new session into database

然后大坑就来了，x2goclient官方不支持kde5,不过最新[文档](https://wiki.x2go.org/doku.php/doc:de-compat)把kd5变成了下划线，说有人成功了，我立马google搜索如何操作，基本都是说手动设置桌面启动命令就好，填写`startplasma-x11 `。

我单独填写这个，和上面vnc和xrdp一样，连上去就是黑屏。然后又开始翻文档，社区，主要分为2派，一派是n卡的问题（我的显示是A2000，不是很常规），另一派说使用桌面环境出现黑屏，则可能是`D-Bus`未正确初始化造成的。一些桌面环境(例如 KDE Plasma) 可能会从之前的会话中恢复应用程序和窗口，所以结果是只缺失了 "`plasmashell`"。

由于N卡的我没看到解决方案，就尝试解决D-Bus的问题，使用
```
dbus-launch kstart5 plasmashell
```
或者
```
dbus-launch startplasma-x11
```
都能正常进入桌面，但是窗口操作栏丢失了，突然想到上面解决xrdp的时候，我就在wiki文档中见到了`D-Bus`这个关键字，就死马当活马医，组合一下命令，变成了这样
```
dbus-launch /usr/lib/plasma-dbus-run-session-if-needed startplasma-x11
```
然后就成功进入桌面了，而且x2go可以支持全屏和自定义分辨率，我体验下来和win的远程桌面非常接近。
但是目前还是有一个问题，就是我主桌面开启了火狐等，在这边就不能启动火狐了，而且我自己装了vscode,idea等也打不开，但是wps可以打开，不知道为什么。希望后面能解决把

# 总结
 nomachine = x2go > rustdesk = xrdp > vnc
