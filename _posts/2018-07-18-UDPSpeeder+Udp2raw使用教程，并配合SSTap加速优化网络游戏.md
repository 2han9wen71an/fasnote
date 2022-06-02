---
layout: post
title: UDPSpeeder+Udp2raw使用教程，并配合SSTap加速优化网络游戏
date: 2018-07-18 11:57:00
updated: 2018-07-18 11:58:07
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - UDPSpeeder
  - Udp2raw
---


**说明：**`UDPSpeeder`很早前博客就介绍过，是一个双边网络加速工具，本身是加速`UDP`流量，但也可以加速`TCP`/`UDP`/`ICMP`，而网络游戏也是走的`UDP`，我们可以用来配合`SSTap`来最大改善我们的游戏体验，近期作者发布`windows`版本客户端，使用更加方便了，这里就大概的讲下方法。

简介
--

`UDPspeeder`作用是给`udp`流量加冗余和纠错(`RS code`)，牺牲一定的流量(通常可小于`0.5`倍)，让网络达到接近零丢包。 可以单独加速`udp`，或配合`V皮N`加速全流量(`tcp`/`udp`/`icmp`)。 最佳的适用场景是加速游戏，也可加速在线视频和网页浏览。

`udp2raw`不是加速器，只是一个帮助你绕过`UDP`限制的工具，作用是把`udp`流量混淆成`tcp`流量，可以突破`udp`流量限制或`Udp QOS`，极大提升稳定性。可以配合`kcptun`加速`tcp`，或配合`UDPspeeder`加速`udp`，防止各种限速断流。

说明
--

这里分别说下`Udp2raw`配置和`UDPSpeeder`配置，及其串联使用方法。且`Udp2raw`和`UDPspeeder`不配合`V皮N`的情况下只能转发`UDP`。对于`55R`等来讲，转发`UDP`的同时也需要转发`TCP`，不然`UDP`功能无法使用，这里会配合`tinyPortMapper`一起使用。

本文只讲结合`SSTap`的玩法，也适用`55R`，还有更多玩法可以去下面留的`Github`项目地址进行研究，有问题请去`Issues`栏提问，作者很热情，会很快回答你。

配置Udp2raw
---------

**1、VPS服务器配置**  
首先需要在`VPS`上下载服务端并解压`Udp2raw`，地址：[点击进入](https://github.com/wangyu-/udp2raw-tunnel/releases)，使用命令：

    #目前最新版本20180225.0，如果以后有更新的话，方法基本一样
    wget https://github.com/wangyu-/udp2raw-tunnel/releases/download/20180225.0/udp2raw_binaries.tar.gz
    tar zxvf udp2raw_binaries.tar.gz

此时假设你服务器`ip`为`44.55.66.77`，有一个服务监听在`udp 7777`端口上，比如`55R`，运行如下命令：

    ./udp2raw_amd64 -s -l0.0.0.0:4096 -r 127.0.0.1:7777  -a -k "passwd" --raw-mode faketcp

会输出如下界面：  
![请输入图片描述](https://www.moerats.com/usr/picture/js_sstap(1).png "请输入图片描述")  
如果关闭`SSH`客户端，`Udp2raw`会停止运行，建议配合`nohup`或`screen`保持后台运行，查看教程：[使用screen来实现多任务不断线操作命令](https://www.moerats.com/archives/142/)。

**2、Win客户端配置**  
首先下载并安装`winpcap`，地址：`https://www.winpcap.org/install/default.htm`。  
也可使用`npcap`，据说性能更好一些，但是安装时一定要把"开启`winpcap`的兼容模式"打勾。地址：[https://nmap.org/npcap/](https://nmap.org/npcap/)。

下载`Udp2raw`客户端并解压，地址：[点击进入](https://github.com/wangyu-/udp2raw-multiplatform/releases)。建议解压后直接放到`C`盘`C:\Users\Administrator`文件夹。

然后点击`Win+R`，然后输入`cmd`，运行命令：

    udp2raw_mp_nolibnet.exe -c -l0.0.0.0:3333  -r44.55.66.77:4096 -k "passwd" --raw-mode easy-faketcp
    #如果你的udp2raw文件在其它盘，比如D盘的xx文件夹，则需要先运行命令
    cd /d d:\xx

然后别关掉`CMD`界面。

这时候基本就算完成了。 现在在`Windows`上访问本机的`3333`即相当于访问`VPS`的`7777`端口，通过`udp2raw`的所有流量都会被混淆成`tcp`。

配置UDPSpeeder
------------

其实方法和`Udp2raw`差不多，这里就不仔细讲了，只说个大概。

**1、VPS服务器配置**  
先下载`UDPSpeeder`服务端并解压，下载地址：[点击进入](https://github.com/wangyu-/UDPspeeder/releases)，使用命令：

    #目前最新编译好的二进制文件版本20180522.0
    wget https://github.com/wangyu-/UDPspeeder/releases/download/20180522.0/speederv2_binaries.tar.gz
    tar zxvf speederv2_binaries.tar.gz

此时假设你服务器`ip`为`44.55.66.77`，有一个服务监听在`udp 7777`端口上，比如`55R`，运行如下命令：

    #此为游戏场景的推荐设置
    ./speederv2_amd64 -s -l0.0.0.0:4096 -r127.0.0.1:7777   -k "passwd"  -f2:4 --timeout 1
    

会输出如下界面：  
![请输入图片描述](https://www.moerats.com/usr/picture/js_sstap(2).png "请输入图片描述")  
如果关闭`SSH`客户端，`UDPSpeeder`会停止运行，同样建议配合`nohup`或`screen`保持后台运行，更多推荐配置查看：[点击查看](https://github.com/wangyu-/UDPspeeder/wiki/%E6%8E%A8%E8%8D%90%E8%AE%BE%E7%BD%AE)。

**2、Win客户端配置**  
客户端下载地址和上面一样，[点击进入](https://github.com/wangyu-/UDPspeeder/releases)。下载`speederv2_windows.zip`文件，并解压到`C`盘`C:\Users\Administrator`文件夹。

然后点击`Win+R`，然后输入`cmd`，运行命令：

    speederv2.exe -c -l0.0.0.0:3333 -r44.55.66.77:4096 -k "passwd"  -f2:4 --timeout 1

然后别关掉`CMD`界面。

UDPSpeeder+Udp2raw串联
--------------------

本文所讲的方法就是使用`UDPSpeeder`+`Udp2raw`串联配合`SSTap`加速优化网游，这里就大概的讲下方法。

**1、VPS服务器配置**

    #分别下载UDPSpeeder和Udp2raw服务端文件
    wget https://github.com/wangyu-/udp2raw-tunnel/releases/download/20180225.0/udp2raw_binaries.tar.gz
    wget https://github.com/wangyu-/UDPspeeder/releases/download/20180522.0/speederv2_binaries.tar.gz
    tar zxvf speederv2_binaries.tar.gz
    tar zxvf udp2raw_binaries.tar.gz

假设你服务器`ip`为`44.55.66.77`，有一个服务监听在`udp 7777`端口上，比如`55R`，运行如下命令：

    #监听端口填对，其它端口不一定要依次挨着，只要首尾对应就行
    ./speederv2_amd64 -s -l127.0.0.1:7776  -r127.0.0.1:7777 --mode 0 -f2:4 --timeout 1
    ./udp2raw_amd64 -s -l0.0.0.1:7775 -r127.0.0.1:7776 -k "passwd" --raw-mode faketcp -a
    

请使用`Screen`后台运行。

**2、Win客户端配置**  
`UDPSpeeder`和`Udp2raw`客户端文件下载：[UDPSpeeder](https://github.com/wangyu-/UDPspeeder/releases)、[Udp2raw](https://github.com/wangyu-/udp2raw-multiplatform/releases)，下载后都解压到`C`盘`C:\Users\Administrator`文件夹。

然后点击`Win+R`，然后输入`cmd`，运行命令：

    udp2raw_mp_nolibnet.exe -c -l127.0.0.1:7774 -r44.55.66.77:7775 -k "passwd" --raw-mode faketcp
    speederv2.exe -c -l0.0.0.0:7773 -r127.0.0.1:7774 --mode 0 -f2:4 --timeout 1
    

可以双开`CMD`界面分别运行`2`条命令。

TCP端口转发
-------

只转发`UDP`在`55R`上是用不了`UDP`功能，这里还需要转发下`TCP`，在`VPS`上先安装`BBR`加速`TCP`。

    #使用秋水的脚本
    wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh && chmod +x bbr.sh && ./bbr.sh
    

然后在电脑上下载`Win`版`tinyPortMapper`，下载地址：[点击查看](https://github.com/wangyu-/tinyPortMapper/releases)，下载`tinymapper_windows.zip`然后解压到`C`盘`C:\Users\Administrator`文件夹。

依然点击`Win+R`，然后输入`cmd`，运行命令：

    #使用本地的7773端口转发服务器的7777端口，记得转发的TCP的端口和上面的UDP端口一致。
    tinymapper.exe -l0.0.0.0:7773 -r44.55.66.77:7777 -t
    

好了，这里差不多配置完了，差不多总共需要开`2`个`SSH`窗口，`3`个`CMD`窗口。

配置SSTap
-------

首先查看使用教程：[SSTap：可以用SS来进行海外游戏加速的工具](https://www.moerats.com/archives/185)，记得`55R`服务器`IP`填`127.0.0.1`，端口填转的端口，比如本文的`7773`，其他参数一模一样。  
![请输入图片描述](https://www.moerats.com/usr/picture/js_sstap(3).png "请输入图片描述")

相关链接
----

*   **UDPspeeder项目地址：**[https://github.com/wangyu-/UDPspeeder](https://github.com/wangyu-/UDPspeeder)
*   **Udp2raw项目地址：**[https://github.com/wangyu-/udp2raw-tunnel](https://github.com/wangyu-/udp2raw-tunnel)
*   **tinymapper项目地址：**[https://github.com/wangyu-/tinyPortMapper](https://github.com/wangyu-/tinyPortMapper)

* * *