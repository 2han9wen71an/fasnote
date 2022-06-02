---
layout: post
title: DigitalOcean搭建SSR并启用BBR//锐速加速
date: 2018-06-18 13:27:00
updated: 2020-06-19 10:39:51
status: private
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Linux
  - 富强
---

#前因 

因为博主的国际TX云到期了，而昨晚一个朋友又送了我一个DigitalOcean 50美刀的优惠券，所以果断冲了5美刀入坑

服务器请选择Ubuntu 14 64位
-------------------

然后食用FunctionClub的\`SSR-Bash-Python\` wget -q -N --no-check-certificate https://raw.githubusercontent.com/FunctionClub/SSR-Bash-Python/master/install.sh && bash install.sh 然后SSR就搭建好了

三种常用加速器简介
---------

1.`锐速serverspeeder`是出现较早的收费的网络加速服务，其母公司是`Lotsever`，现在已经不能够进行新注册用户，且已经停止了运维，所以现在我们能够使用的都是破解版的锐速，有一种鞠躬尽瘁死而后已的感觉\_(:з」∠)\_  
2.`BBR` ([https://github.com/google/bbr)](https://github.com/google/bbr)) 是Google在2016年9月份发布的一个拥塞控制算法，用来加速网络传输TCP协议。BBR可以以一定速度不断评估多个路由的吞吐量和往返流量时间，得出遍历网络需要的时间。由此其实现了以网络可处理的速度发送流量，比原始版本的TCP协议中的算法效率更高。  
3.`魔改BBR`也就是基于BBR的源码，由网络上的各个大神修改部分参数等内容来实现比原版BBR更加强劲的效果。

魔改BBR安装与配置
----------

在网上发现了由[千影](https://www.94ish.net/)制作发布的脚本([https://github.com/chiakge/Li...](https://github.com/chiakge/Linux-NetSpeed))，非常强大，能够基本实现“一键安装配置各种常见加速器”，我先放一张截图，大家来感受下：  
![Linux-NetSpeed](https://static.segmentfault.com/v-5b237ef9/global/img/squares.svg "Linux-NetSpeed")  
我决定在我的Digital Ocean服务器上安装配置BBR魔改服务。然后实际上我们并不能直接通过此脚本安装BBR内核（BBR魔改内核），因为要使用此服务，必须使用指定的Linux内核。

### 查看目前的Linux内核版本

用putty输入命令：

    lsb_release -a

![lsb](https://static.segmentfault.com/v-5b237ef9/global/img/squares.svg "lsb")  
看到目前系统的内核是Ubuntu 16.04.3 LTS。如果这个时候我们直接使用上面的脚本安装BBR，则会提示内核不支持。

我们在这个网站查看可用的内核：[查看BBR可用内核](https://raw.githubusercontent.com/0oVicero0/serverSpeeder_kernel/master/serverSpeeder.txt)  
看到其实Ubuntu可用的内核有很多，我挑一个最新的：Ubuntu 16.04/4.4.0-47，如下图  
![可用内核](https://static.segmentfault.com/v-5b237ef9/global/img/squares.svg "可用内核")

### 更改内核版本

由于Digital Ocean不允许用户直接在控制面板更改内核，如图：  
![不能更改内核](https://static.segmentfault.com/v-5b237ef9/global/img/squares.svg "不能更改内核")  
我们需要编辑GRUB来允许动态管理：用vi命令编辑文件，注意不会用vi命令的先百度一下用法，简单说就是先用方向键移动光标到待修改或插入的位置，然后点击`i`键进入插入模式，这时候可以进行插入字符或删除字符的操作，操作后按Esc键退出插入模式，键入`:wq`进行保存并退出

    # vi /etc/default/grub

插入或更改如下内容：

> GRUB\_DEFAULT=saved  
> GRUB\_SAVEDEFAULT=true  
> GRUB\_DISABLE\_SUBMENU=y

然后我们用`#`注释掉DigitalOcean-specific的Grub文件内容：

    # vi /etc/default/grub.d/50-cloudimg-settings.cfg

如果里面有任何内容则在该行的前面加上一个`#`。最后我的文件内容变成：

    # Cloud Image specific Grub settings for Generic Cloud Images
    # CLOUD_IMG: This file was created/modified by the Cloud Image build process
    
    # Set the recordfail timeout
    #GRUB_RECORDFAIL_TIMEOUT=0
    
    # Do not wait on grub prompt
    #GRUB_TIMEOUT=0
    
    # Set the default commandline
    #GRUB_CMDLINE_LINUX_DEFAULT="console=tty1 console=ttyS0"
    
    # Set the grub console type
    #GRUB_TERMINAL=console
    # CLOUD_IMG: This file was created/modified by the Cloud Image build process
    # For Cloud Image compatability
    #GRUB_PRELOAD_MODULES="multiboot serial usb usb_keyboard"

然后重新生成一个 grub.cfg 文件：

    # export GRUB_CONFIG=`sudo find /boot -name "grub.cfg"`
    # update-grub

我们可以看看现在我们已经安装的可供选择的内核有哪些：

    # grep 'menuentry ' $GRUB_CONFIG | cut -f 2 -d "'" | nl -v 0

显示：

> 0 Ubuntu, with Linux 4.4.0-116-generic  
> 1 Ubuntu, with Linux 4.4.0-116-generic (recovery mode)  
> 2 Ubuntu, with Linux 4.4.0-112-generic  
> 3 Ubuntu, with Linux 4.4.0-112-generic (recovery mode)

发现里面并没有我们想要的4.4.0-47版本。  
那么我们需要下载并安装新的内核：

    # apt-get update
    # apt-cache search --names-only linux-image

将会列出所有可以安装的内核，我们在其中找到我们想要的：  
![可安装的内核](https://static.segmentfault.com/v-5b237ef9/global/img/squares.svg "可安装的内核")  
安装内核kernel和头文件headers file：

    # apt-get install linux-image-4.4.0-47-generic linux-headers-4.4.0-47-generic

等待一会儿，安装完成。  
再次执行：

    # grep 'menuentry ' $GRUB_CONFIG | cut -f 2 -d "'" | nl -v 0

发现现在的可用内核有：

> 0 Ubuntu, with Linux 4.4.0-116-generic  
> 1 Ubuntu, with Linux 4.4.0-116-generic (recovery mode)  
> 2 Ubuntu, with Linux 4.4.0-112-generic  
> 3 Ubuntu, with Linux 4.4.0-112-generic (recovery mode)  
> 4 Ubuntu, with Linux 4.4.0-47-generic  
> 5 Ubuntu, with Linux 4.4.0-47-generic (recovery mode)

我们需要启用编号为4的内核：

    # grub-set-default 4

之后根据提示重启服务器，或者用命令重启：

    # reboot

至此内核替换完毕！

### 安装并运行魔改BBR服务

在putty输入命令：

    wget -N --no-check-certificate "https://raw.githubusercontent.com/chiakge/Linux-NetSpeed/master/tcp.sh" && chmod +x tcp.sh && ./tcp.sh

出现本文开头的图片：  
![Linux-NetSpeed](https://static.segmentfault.com/v-5b237ef9/global/img/squares.svg "Linux-NetSpeed")  
输入数字`1`，回车安装BBR内核，根据提示安装并重启VPS后，再进入这个脚本输入数字`4`，启用BBR魔改版加速。

下面我们开启ss服务后，妈妈就再也不用担心我们看视频卡顿啦！各位小朋友注意科学使用各视频网站哦（比如Tumblr明明只是我们看风景美图的轻博客网站啊，咦我为什么要强调这个 (ˉ▽￣～)）

* * *

其他名气不大的加速器收集：

1.  Net-Speeder
2.  FinalSpeed
3.  KCP
4.  UDPspeeder
5.  TCPEdge
6.  FlashTCP

**参考链接&鸣谢：**

1.  [谷歌BBR加速网络传输协议TCP新算法，没有最快只有更快！](http://tech.it168.com/a2017/0823/3165/000003165998.shtml)
2.  [DigitalOcean Ubuntu 更换为锐速可用的内核](https://liyuans.com/archives/digitalocean-ubuntu-kernal-change.html)
3.  [BBR+BBR魔改+Lotsever(锐速)一键脚本 for Centos/Debian/Ubuntu](https://www.moerats.com/archives/387/)