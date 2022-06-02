---
layout: post
title: Centos7安装Python3并安装Requests的方法
date: 2020-02-29 17:43:00
updated: 2020-02-29 17:49:16
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Linux
  - Centos
  - Python3
---


#前言
由于centos7原本就安装了Python2，而且这个Python2不能被删除，因为有很多系统命令，比如yum都要用到。

[root@VM_105_217_centos Python-3.6.2]# python
Python 2.7.5 (default, Aug  4 2017, 00:39:18)
[GCC 4.8.5 20150623 (Red Hat 4.8.5-16)] on linux2
Type "help", "copyright", "credits" or "license" for more information.

输入Python命令，查看可以得知是Python2.7.5版本

输入

which python

可以查看位置，一般是位于/usr/bin/python目录下。

下面介绍安装Python3的方法
##安装python3

首先安装依赖包
---

    yum -y groupinstall "Development tools" yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel

然后根据自己需求下载不同版本的Python3，我下载的是Python3.6.2

    wget https://www.python.org/ftp/python/3.6.2/Python-3.6.2.tar.xz

如果速度不够快，可以直接去官网下载，利用WinSCP等软件传到服务器上指定位置，我的存放目录是/usr/local/python3，使用命令：

    mkdir /usr/local/python3

建立一个空文件夹

然后解压压缩包，进入该目录，安装Python3

    tar -xvJf  Python-3.6.2.tar.xz
    cd Python-3.6.2
    ./configure --prefix=/usr/local/python3
    make && make install

最后创建软链接

    ln -s /usr/local/python3/bin/python3 /usr/bin/python3
    ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3

在命令行中输入python3测试

![](//www.xtboke.cn/usr/uploads/auto_save_image/6857112614626596463386a6d8ece46d.png)
##安装Requests
1、安装epel扩展源："sudo yum install epel-release"
![请输入图片描述][1]

2、安装python-pip："sudo yum install python-pip"
![请输入图片描述][2]

3、升级pip："sudo pip install --upgrade pip"
![请输入图片描述][3]

4、安装requests包："sudo pip install requests"
![请输入图片描述][4]

5、清除cache："sudo yum clean all" 


  [1]: https://img-blog.csdn.net/20170603143954571?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdHJiMzMxNjE3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center
  [2]: https://img-blog.csdn.net/20170603144428260?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdHJiMzMxNjE3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center
  [3]: https://img-blog.csdn.net/20170603145208234?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdHJiMzMxNjE3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center
  [4]: https://img-blog.csdn.net/20170603145704099?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdHJiMzMxNjE3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center