---
layout: post
title: 服务器通过安装vDDoS开源防护脚本来防御DDOS及CC攻击
date: 2019-12-22 18:35:00
updated: 2020-02-29 16:52:12
status: publish
author: zhangwentian
categories: 
  - 代码笔记
  - 折腾笔记
tags: 
  - 服务器
  - 网站资源
---


前言：在互联网发展迅速的网络时代下，现在每个人都会通过服务器在搭建网站，不管是商用也好，还是学习也好，都会受到来自互联网的非法请求。非法请求又分为很多种，今天我们重点介绍服务器受到DDOS和CC攻击怎么来防御。科普DDoS和CC防御可以百度一下。其实防御都可以通过花钱升级防护来解决，但是很多人都是一些小网站，用更高的金钱来做防护，这显然是不现实的。而vDDoS是一款免费的用来防御和减轻DDOS攻击的脚本。官方更直接说了这是“HTTP(S) DDoS保护反向代理”下面我们来介绍一下安装方法。

一、官方网站
------

[点击进入vDDoS官网](https://vddos.voduy.com/)

二、项目信息
------

1.  1.  vDDoS下载：[https://github.com/duy13/vDDoS-Protection](https://github.com/duy13/vDDoS-Protection)
    2.  SourceForge：[https://sourceforge.net/projects/vddos-protection](https://sourceforge.net/projects/vddos-protection)
    3.  Naxsi模块：[https://github.com/nbs-system/naxsi](https://github.com/nbs-system/naxsi)
    4.  Kyprizel模块：[https://github.com/kyprizel/testcookie-nginx-module](https://github.com/kyprizel/testcookie-nginx-module)
    5.  Nginx软件：[https://github.com/nginx/nginx](https://github.com/nginx/nginx)

三、系统要求
------

*   CentOS服务器5/6/7 x86\_64（[http://centos.org](https://www.centos.org/)）
*   CloudLinux服务器5/6/7 x86\_64（[http://cloudlinux.com](https://cloudlinux.com/)）

    yum -y install epel-release 
    yum -y install curl wget gc gcc gcc-c++ pcre-devel zlib-devel make wget openssl-devel libxml2-devel libxslt-devel gd-devel perl-ExtUtils-Embed GeoIP-devel gperftools gperftools-devel libatomic_ops-devel perl-ExtUtils-Embed gcc automake autoconf apr-util-devel gc gcc gcc-c++ pcre-devel zlib-devel make wget openssl-devel libxml2-devel libxslt-devel gd-devel perl-ExtUtils-Embed GeoIP-devel gperftools gperftools-devel libatomic_ops-devel perl-ExtUtils-Embed

四、安装教程
------

从源代码下载：[https://github.com/duy13/vDDoS-Protection](https://github.com/duy13/vDDoS-Protection)

安装最新版本:（System CentOS 7 x86\_64和vDDoS最新版本）：

    curl -L https://github.com/duy13/vDDoS-Protection/raw/master/latest.sh -o latest.sh
    chmod 700 latest.sh
    bash latest.sh

五、网站防护示例
--------

    # vi /vddos/conf.d/website.conf
    # Website       Listen               Backend                  Cache Security SSL-Prikey   SSL-CRTkey
    default         http://0.0.0.0:80    http://127.0.0.1:8080    no    200      no           no
    your-domain.com http://0.0.0.0:80    http://127.0.0.1:8080    no    200      no           no
    default         https://0.0.0.0:443  https://127.0.0.1:8443   no    307      /vddos/ssl/your-domain.com.pri /vddos/ssl/your-domain.com.crt
    your-domain.com https://0.0.0.0:443  https://127.0.0.1:8443   no    307      /vddos/ssl/your-domain.com.pri /vddos/ssl/your-domain.com.crt
    your-domain.com https://0.0.0.0:4343 https://103.28.249.200:443 yes click    /vddos/ssl/your-domain.com.pri /vddos/ssl/your-domain.com.crt

编辑完成后记得输入:wq来保存website.conf配置文件

六、启动防护
------

    vddos restart

七、配置文件名称解释
----------

*   your-domain.com为你想要保护的域名listen为本地监听IP端口backend为后端IP端口（可以当作为使用CDN或者反代源网站）cache是否进行缓存。
*   security是保护强度 可选no, 307, 200, click, 5s, high, captcha。
*   强度阶梯：no < 307 < 200 < click < 5s < high < captcha。
*   5s类似于Cloudflare的五秒盾。
*   captcha为启用谷歌人机验证码后面会详细说。
*   SSL-Prikey为SSL密匙。
*   SSL-CRTket为SSL证书。

后期博主会发布关于添加白名单和黑名单的教程