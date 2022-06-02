---
layout: post
title: 腾讯云centos执行yum安装失败
date: 2020-12-25 10:11:58
updated: 2020-12-25 10:11:58
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - 腾讯云
  - yum
  - 运维
---


#起因
今天准备在服务器安装[哪吒探针][1],发现docker安装失败(服务器访问国外docker太慢超时)
![QQ图片20201225100651.png][2]
然后想到宝塔后台可以一键安装docker,就立马登录宝塔安装docker,发现docker是安装成功了,但是启动不了
![QQ图片20201225100805.png][3]
又跑去看docker的安装日志,发现宝塔的一键脚本会调用很多yum安装各种依赖,但是报错了
![QQ图片20201225100944.png][4]
#解决
腾讯云服务器使用yum安装部分依赖会出现类似如下错误：

```
pv-1.4.6-1.el7.x86_64.rpm FAILED
http://mirrors.tencentyun.com/epel/7/x86_64/p/pv-1.4.6-1.el7.x86_64.rpm: [Errno 14] curl#6 - "Could not resolve host: mirrors.tencentyun.com; Name or service not known"| 0 B --:--:-- ETA
Trying other mirror.

Error downloading packages:
pv-1.4.6-1.el7.x86_64: [Errno 256] No more mirrors to try.

ERROR: install appnode-agent failed: exit status 1
```

这是由于腾讯云自带的软件源配置有错误导致的（好无语），可将系统软件源改为阿里云镜像，请参考：
<http://mirrors.aliyun.com/help/centos>

一个命令替换：

```
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-`rpm -q --qf "%{version}" centos-release`.repo
```

然后将无效的软件源删除，使用以下命令做备份：

```
mv /etc/yum.repos.d/CentOS-Epel.repo /etc/yum.repos.d/CentOS-Epel.repo.bak
```

最后执行下命令更新缓存：

```
yum makecache
```


  [1]: https://github.com/naiba/nezha
  [2]: https://www.xtboke.cn/upload/2020/12/2651845327.png
  [3]: https://www.xtboke.cn/upload/2020/12/4056866902.png
  [4]: https://www.xtboke.cn/upload/2020/12/2229509166.png