---
layout: post
title: Ubuntu升级软件和ubuntu升级系统的命令
date: 2019-07-27 21:50:00
updated: 2020-02-29 16:52:42
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Linux
---


    sudo apt-get update: 升级安装包相关的命令,刷新可安装的软件列表(但是不做任何实际的安装动作)
    
    sudo apt-get upgrade: 进行安装包的更新(软件版本的升级)
    
    sudo apt-get dist-upgrade: 进行系统版本的升级(Ubuntu版本的升级)
    
    sudo do-release-upgrade: Ubuntu官方推荐的系统升级方式,若加参数-d还可以升级到开发版本,但会不稳定
    
    sudo apt-get autoclean: 清理旧版本的软件缓存
    
    sudo apt-get clean: 清理所有软件缓存
    
    sudo apt-get autoremove: 删除系统不再使用的孤立软件

 

删除不用的老旧内核
---------

Linux 中 /boot 是存放系统启动文件的地方，安装 ubuntu 时单独分区给 200M 足够，但是系统内核更新后，老的内核依然保存在 /boot 分区内，几次升级后，就会提示 /boot 空间不足。
我们只要删掉老的内核，将空间释放出来就可以了。
先查看已安装的内核版本

    dpkg --get-selections |grep linux

能看到已经安装的版本，其中带image的一般就是旧版本
deinstall代表是已经删除的旧版本
install是还没有删除的旧版本内核​​

    uname -r

查看当前内核版本
sudo apt-get remove linux-image-xxxx

删除旧版本内核，xxx为内核版本号
 

 1. 删除软件

方法一、如果你知道要删除软件的具体名称，可以使用

    sudo apt-get remove --purge 软件名称

  

    sudo apt-get autoremove --purge 软件名称

方法二、如果不知道要删除软件的具体名称，可以使用

    dpkg --get-selections | grep ‘软件相关名称’

    sudo apt-get purge 一个带core的package，如果没有带core的package，则是情况而定。123

 1. 清理残留数据

    dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P 