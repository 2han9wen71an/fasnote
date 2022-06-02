---
layout: post
title: 轻松编译Openwrt固件支持V2ray和Trojan-上篇
date: 2020-03-01 23:18:00
updated: 2020-03-11 16:20:44
status: private
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - 富强
  - 路由器
  - Openwrt
---


不管是硬改路由器，还是刷固件，都是很有意思的事，我之前刷的最多的是来自华硕的 Merlin 梅林改版或原版，现在发现有些科学上网工具跟不上了。
目前比较稳定翻的方式大概只有 V2ray 和 Trojan，路由器系统现在也就 Openwrt 能都支持。这个开源固件的优势是插件够多，支持机型也多，还可以根据需要自己编译。
说到编译大家可能都以为是程序员干的活，其实一般人也可以干，站在别人的肩膀上嘛。跟着我的流程走一遍，你会发现普通功能需求确实很容易就编译实现了。

除了 openwrt 官方的源码，还有其他人的修改源，如 lean 和 Lienol 的。
项目开源地址：
<https://github.com/coolsnowwolf/lede>
<https://github.com/Lienol/openwrt>

### 系统安装

开发者是推荐系统 Ubuntu x64，如果是以前还要另外分区安装 Linux 系统，不然就跑虚拟机，还是比较麻烦的。但现在，win10 现在直接可以安装 Linux 环境了，非常简单：

1.  打开控制面板 --> 程序与功能，点击左侧边栏的启用或关闭 Windows 功能选项，在弹出的窗口中勾选适用于 Linux 的 Windows 子系统，最后点击确定（可能需要重启）。
2.  打开 Microsoft Store，搜索 Ubuntu，推荐选择 18.04 点击安装。（商店中可用的发行版有 Ubuntu、openSUSE、SUSE Linux Enterprise Server、Debian 以及 Kali Linux 等。也同时安装多个发行版，它们的数据都是独立的，互不影响，只要 C 盘够大。）
3.  等待下载安装完成。注意 C 盘剩余空间至少 30 GB 以上，不然编译几次就可能会出现空间不足了。
4.  进入开始菜单，找到 Ubuntu 打开即可运行。记得设置的密码。

如何卸载安装的 Linux 系统？在 win10 里快捷键 Win+R 运行 `cmd`，输入命令：

```
wslconfig /l  #查询安装版本
wslconfig /u Ubuntu-18.04  #卸载上面查询到的安装 Linux 版本
```

Linux

Copy

### 软件环境

#### 更改源地址

因为国内网络的问题，所以要修改下系统源地址，我选择阿里的源。

```
sudo vim /etc/apt/sources.list
```

Linux

Copy

输入密码，进入编辑文档，键盘输入 `i`，可将原始地址链接加 # 注销掉，在最后复制添加阿里的源。

> deb <http://mirrors.aliyun.com/ubuntu/> bionic main restricted universe multiverse
> deb <http://mirrors.aliyun.com/ubuntu/> bionic-security main restricted universe multiverse
> deb <http://mirrors.aliyun.com/ubuntu/> bionic-updates main restricted universe multiverse
> deb <http://mirrors.aliyun.com/ubuntu/> bionic-proposed main restricted universe multiverse
> deb <http://mirrors.aliyun.com/ubuntu/> bionic-backports main restricted universe multiverse
> deb-src <http://mirrors.aliyun.com/ubuntu/> bionic main restricted universe multiverse
> deb-src <http://mirrors.aliyun.com/ubuntu/> bionic-security main restricted universe multiverse
> deb-src <http://mirrors.aliyun.com/ubuntu/> bionic-updates main restricted universe multiverse
> deb-src <http://mirrors.aliyun.com/ubuntu/> bionic-proposed main restricted universe multiverse
> deb-src <http://mirrors.aliyun.com/ubuntu/> bionic-backports main restricted universe multiverse

按 `ESC` 键退出，输入 `:wq` 保存退出。
实际上在 win10 里不用上面这么麻烦，直接搜索 `sources.list`，找到 `etc/apt/` 目录下的，用熟悉的编辑器修改就好了。

#### 更新和安装依赖包

```
sudo apt-get update

sudo apt-get -y install build-essential asciidoc binutils bzip2 gawk gettext git libncurses5-dev libz-dev patch unzip zlib1g-dev lib32gcc1 libc6-dev-i386 subversion flex uglifyjs git-core gcc-multilib p7zip p7zip-full msmtp libssl-dev texinfo libglib2.0-dev xmlto qemu-utils upx libelf-dev autoconf automake libtool autopoint device-tree-compiler
```


#### 下载源码

不要使用 root 用户下载：

```
git clone https://github.com/coolsnowwolf/lede
或者，如果 C 盘空间够大也可以都下了试试看
git clone https://github.com/Lienol/openwrt
```


更新下载时可能需要科学上网，这也是一个悖论啊，我刷路由是为了能翻，而现在编译固件时就得翻，所以只能自己想办法了。所以，还有个办法就是不要在本地编译，买个海外 VPS，安装系统后编译。
下载完成后可以用 everything 软件直接搜索 lede 或 openwrt 文件夹，一般位于：
`C:\Users\win10系统用户名\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu18.04onWindows_71fndgsc\LocalState\rootfs\home\harry用户名\lede`
AppData 为系统默认隐藏文件夹，开启显示隐藏文件夹后才可看到。

至此，准备工作已经完成，可以进行固件编译了。