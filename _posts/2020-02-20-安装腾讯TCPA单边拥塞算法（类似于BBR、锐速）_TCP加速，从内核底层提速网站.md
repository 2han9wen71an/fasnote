---
layout: post
title: 安装腾讯TCPA单边拥塞算法（类似于BBR、锐速） TCP加速，从内核底层提速网站
date: 2020-02-20 10:39:00
updated: 2020-02-20 11:10:53
status: publish
author: zhangwentian
categories: 
  - 代码笔记
  - 折腾笔记
tags: 
  - 腾讯
  - JAVA
  - Linux
  - TCP加速
---


简介
--

#### 项目

腾讯TCPA，由腾讯TEG操作系统组研发，基于RHEL7.4源码，定制化的TCPA。

![](https://ae01.alicdn.com/kf/U7c8c4043df33475a84a82c52682a606fG.png)

#### 团队

腾讯TEG操作系统组, 2010年成立，专业的内核团队,维护研发腾讯内部linux操作系统tlinux,保证百万级server高效稳定运行， 为腾讯业务提供有力支撑。

#### 优势

TCPA启用后，小文件比BBR能提升40%以上，大文件比BBR能提升5%~10%。TCPA的优势在于小文件的性能提升。程序默认仅加速80、443、8080端口，更适用于建站场景，可自行增加端口。

对于建站用户来说，TCPA更适合，但是你如果用于看视频等大带宽的应用，还是BBR PLUS更适合。

#### TX自评

> BBR算法相比标准的TCP的cubic算法，性能提升明显。小文件差异不大；大文件的下载性能明显，约35%左右。  
> TCPA的启用，外加系统参数优化后， 大小文件均比标准的TCP提升40%以上。  
> TCPA的启用，外加系统参数优化后，小文件比BBR能提升40%以上，大文件比BBR能提升5%~10%。

更多内容：`https://linux.qq.com/?p=224` （已无法打开）

#### 效果

![](https://ae01.alicdn.com/kf/U0440be3c93504108941cb6bd7f557d0dV.png)

###### BBR PLUS

![](https://ae01.alicdn.com/kf/U884659ab790e412aaec844f44388c95cg.png)

![](https://ae01.alicdn.com/kf/Uab254361f19947afbc453e67651a7544f.gif)

![](https://ae01.alicdn.com/kf/U381bd7ad7537402e849f31c0fbd0d238n.gif)

###### 腾讯TCPA

![](https://ae01.alicdn.com/kf/U983bbe8bddfd4853978b6e28b461093f6.png)

![](https://ae01.alicdn.com/kf/Uc206adc2ab6741159e48dcb1b7cc6302Z.gif)

![](https://ae01.alicdn.com/kf/U220d680ad5b640fa98974d047f566033d.png)

安装
--

#### 环境要求

系统 CentOS 7 以上  
Boot 分区不小于 500M (太小可能导致安装内核失败)

#### 安装操作

这里找到两种安装方式：

*   手动安装

1.  安装依赖
    
        yum -y install net-tools
    
2.  安装内核
    
        wget https://d.kxxzz.com/sh/kernel-3.10.0-693.5.2.tcpa06.tl2.x86_64.rpm
        rpm -ivh kernel-3.10.0-693.5.2.tcpa06.tl2.x86_64.rpm --force
    
3.  重启系统
    
        reboot
    
4.  下载主程序
    
        wget https://d.kxxzz.com/sh/tcpa_packets_180619_1151.tar.bz2
    
5.  开始安装
    
        tar jxvf tcpa_packets_180619_1151.tar.bz2
        cd tcpa_packets
        sh install.sh
    
6.  新增TCPA加速端口
    
        vim /usr/local/storage/tcpav2/start.sh
    
    第46行后添加
    
        # $BINDIR/$CTLAPP access add tip $ip tport 自定义端口
    
7.  启动TCPA
    
        cd /usr/local/storage/tcpav2
        sh start.sh
    

\*查看是否开启成功

    lsmod|grep tcpa

\*卸载

    cd /usr/local/storage/tcpav2
    sh uninstall.sh

*   一键安装

来kxxzz的一键安装脚本

    wget https://d.kxxzz.com/sh/tcpa.sh
    sh tcpa.sh

来自lijian的一键安装脚本

    wget http://down.08mb.com/tcp_opz/tcpa/tcpa.sh
    sh tcpa.sh