---
layout: post
title: kangle环境liunx一键安装脚本
date: 2018-05-09 08:41:00
updated: 2018-05-10 08:52:05
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - 一键
  - 网站资源
---


CentOS5.x/6.x用以下一键脚本
====================

**1.kangle官方脚本**
----------------

linux下easypanel版本安装及升级  
(集成了kangle web 服务器和mysql,仅支持centos 5和centos 6)  
执行下面的命令即可，安装程序将自动安装或者升级。

```yum -y install wget;wget http://download.kangleweb.com/easypanel/ep.sh -O ep.sh;sh ep.sh```

运行上面的安装shell,会自动安装kangle,easypanel,proftpd,mysql,安装完后打开**http://ip:3312/admin/**登录才能完成最后的安装。  
**注：初始安装登陆帐号： admin  密码： kangle**  
注：centos系统下easypanel集成的php默认装的是php53，语言模块里显示的php52其实是php53版本；如果需要php5217版本，请点下面的链接查看安装教程  
  
easypanel虚拟主机控制面板功能列表  
easypanel linux版 php-5.2.17插件(集成zend和ioncube)  
详细的安装、使用请查看：[https://www.kanglesoft.com/thread-7268-1-1.html](https://www.kangleweb.com/thread-7268-1-1.html)  
**说明：**linux下，easypanel已集成安装php-5.3 。  
          为满足用户使用php-5.2.17的需要，开发easypanel  linux版php-5.2.17插件。  
  
**安装完成后，使用方法:**  
管理面板网址:  http://服务器ip:3312/admin/  
独立网站管理:  http://服务器ip:3312/vhost/  
  
**硬件要求**  
除启动操作系统外，空闲的内存在64M以上，空闲的磁盘空间在100M以上  
**【说明】Easypanel 可安装在VPS 上面**

**2.彩虹脚本**
----------

请复制以下指令到ssh连接软件粘贴执行

```yum -y install wget;wget http://kangle.odata.cc/start;sh start```

**脚本简介：**  
本脚本是可以一键安装Kangle+Easypanel+Mysql集合脚本。  
脚本本身集成：PHP5.2、PHP5.3、PHP5.4、PHP5.5、PHP5.6、PHP7.0、MYSQL5.6（Kangle官方为5.1已经过时）  
支持前台用户任意切换PHP5.2-7.0以适应网站程序  
  
**特点：**  
安装包内PHP套件以及Kangle套件均已本地化，达到最佳连接速度。  
Kangle-3.5.8（小河修改版-支持自定义错误页）  
可选安装Kangle商业版破解补丁  
独家拥有PHP5.2-5.3打dos补丁  
独家支持EP前台自由切换PHP7.0  
独家预先设置各PHP版本PHP.ini安全问题  
独家自动更新MySQL5.1至MySQL5.6  
独家自动/手动更新PHPmyadmin至官网PHP5.3专用最新版  
安装前可自定义数据库密码，避免安装完成后再设置的麻烦  
  
**更新说明：**  
修复了之前一键脚本的各种问题；增加自定义数据库密码；优化了安装菜单显示

注：如果要搭建秒赞网请选择Kangle3.4.8稳定版，3.5.8最新版会有无法自动运行的问题。

安装过程中如果服务器解析不了域名的情况**，**请先更换服务器的DNS再安装Kangle。

 **3.狐狸脚本**
-----------

支持系统：CENTOS5.X-6.X 64位系统，脚本本身集成(默认安装PHP5.2-5.3）：PHP5.2、PHP5.3、PHP5.4、PHP5.5、PHP5.6、PHP7.0、MYSQL5.6（Kangle官方PHP5.1已经不支持）支持前台用户任意切换PHP5.2-7.0以适应网站程序。

**\--脚本安全保障声明--**

**狐狸脚本作者本人保证开发此脚本绝对**

**绿色|安全|高效|零后门|零木马|零监控|**

**\--特点--**

安装包内PHP套件以及Kangle套件均已本地化，达到最佳连接速度。  
\-Kangle-3.5.9.5（小河修改版-支持自定义错误页）  
\-独家二开HLPanel  
\-独家增加HLPanel自定义程序标题  
\-集成PHP52-7.0(PHP5.4开始需用户自行安装）  
\-独家拥有PHP5.2-5.3打dos补丁  
\-预先设置各PHP版本PHP.ini安全问题  
\-自动更新MySQL5.1至MySQL5.6  
\-自动更新PHPmyadmin官网PHP5.3专用最新版  
\-预装EPEL YUM源  
\-默认安装PHP5.2-PHP5.3  
\-其他PHP安装可执行指令 **hls -h** 进行查看

```yum -y install wget;wget http://dl.hlshell.com/hlsh && sh hls```

### 自定义错误页说明：

1.  默认页面设置方法:首先写好html代码 然后文件按照路径修改好文件名上传
2.  html文件存在则显示html内容
3.  html文件不存在就显示默认内容
4.  把自己弄好的错误页放在以下路径即可
5.  文件路径:/error\_404.html 或 /vhs/kangle/error/404.html

 **4.小樱脚本**
-----------

#### 脚本简介

本脚本是一键安装Kangle+Easypanel+Mysql的集合脚本。  
脚本本身集成：PHP5.2、PHP5.3、PHP5.4、PHP5.5、PHP5.6、PHP7.0、PHP7.1、PHP7.2、MYSQL5.6  
支持前台用户任意切换PHP5.2-7.2以适应网站程序

#### [](http://kangle.pw/#header-2)脚本特点

安装包内PHP套件以及Kangle套件均已本地化，达到最佳连接速度。  
独家自带Kangle免费商业版  
独家自带防黑功能  
独家禁止安全码登陆后台  
独家自带用户自助泛解析  
独家拥有PHP5.2-5.3打dos补丁  
独家支持EP面板切换PHP5.6修复dos漏洞  
独家预先设置各PHP版本PHP.ini安全问题  
独家自动更新MySQL5.1至MySQL5.6  
一直跟进Kangle,EP官方更新

#### [](http://kangle.pw/#header-3)注意事项

本脚本仅支持CentOS 5/6 64bit系统  
kangle默认账号admin默认密码kangle  
mysql默认账号root默认密码kangle.pw  
默认不开通外网3306 连接数据库请使用localhost

#### [](http://kangle.pw/#header-4)安装卸载

#### Kangle一键安装极速编译安装方式 (安装时间5至10分钟)

```yum -y install wget;wget http://kangle.pw/install;sh install```

#### Kangle卸载命令所有数据都会删除。注意有数据请先备份

```rpm -e kangle```

#### [](http://kangle.pw/#header-5)更新日志

Kangle版本

EP版本

最后更新时间

3.5.12.21

2.6.26

2018/04/13

2018年4月13日  
更新kangle 3.5.12.21。  
2018年4月9日  
更新kangle 3.5.12.20，修复http2下一处BUG，3311磁盘缓存增加硬盘占用百分比显示，安装代码增加dnsmasq缓存功能。  
2018年4月1日  
增加优化EP模板。  
2018年3月28日  
优化脚本，修改默认mysql密码。  
2018年3月25日  
Kangle.pw一键脚本正式上线，增加防黑 禁止安全码登陆 自助泛解析 免费商业版等功能。 

All rights reserved [Hang](https://www.hang666.com/).[感谢小樱提供修复优化脚本支持](http://bbs.itzmx.com/thread-7232-1-1.html).

CentOS7.x用以下一键脚本
================

1.晨曦脚本
------

请复制以下指令进行安装

```bash -c "$(curl http://www.52cx.me/start)"```

授权码1250016455

运行如果出错 只要执行以下命令后再重新安装即可

    yum -y install curl

#### NO.1:安全性

本站脚本承诺三无  
1.绝对没有监控  
2.绝对没有后门  
3.绝对无木马

#### NO.2:特点

支持centOS6.x以及以上  
支持PHP53-PHP7任意切换  
更新PHPmyAdmin为官方最新版  
自定义 403 404 50x 等错误页  
将MYSQL更换为MariaDB以适应PHP7