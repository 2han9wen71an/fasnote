---
layout: post
title: 使用Mover来实现多个OneDrive数据同步
date: 2020-02-25 16:59:00
updated: 2020-02-29 17:16:55
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Mover
  - OneDrive
---


前言
--

手里面有了几个OneDrive的号，有个人号，E5管理号，商业管理号，A1子号，A1P子号，世纪互联子号，可是基本都是空的，也不敢存太多东西，毕竟除了E5是自己注册的，其他的都不太稳，要是能够转存资源就好了，刚好发现了一个比较优秀的网站，可以转存多种主流网盘(注:国外的)，当然也包括OneDrive不同域之间的转存，最重要的是，完全免费，只有一点小限制(后面说)

这个网站之前就是网盘搬家类的，就在去年2019年10月21号，被微软收购了(巨硬有钱任性)，现在用于将云文件迁移到OFFICE365(包括谷歌网盘，亚马逊等)，只进不出，接下来简单介绍一下!


官网地址
----

https://mover.io

账号注册
----

使用任意邮箱即可注册，注册过程会验证邮箱​，需要去邮箱点击验证，电话号码不会验证！
![请输入图片描述][1]

连接器
---

Mover 将十几个云服务提供商、web服务和数据库链接到Office 365，包括OneDrive和SharePoint Online。我们亲切地称这些链接为我们的连接器。

你为什么要用我们的连接器？以下是我们最喜欢的两个理由：

-   快速、方便、安全地将多个用户和大数据量迁移到Microsoft。
-   通过我们基于web的服务复制文件而不是使用桌面同步工具来节省带宽。

Mover支持的源平台还是比较丰富的，比如常见的Amazon S3、Google Drive、DropBox、FTP等，就不一一列举了，大家看下面的截图吧。
![请输入图片描述][2]


使用方法
----

注册成功后，进入网页，务必使用​电脑打开网页，手机打开网页可能会被折叠，导致文件夹打不开，如下图，电脑打开网页和手机打开的网页(手机Chrome已开启桌面版网页)。

![请输入图片描述][3]

### 数据源

数据源基本上 连接器 支持的云服务商都支持！只要授权登录即可！非常方便！

### 目的地

目前仅支持微软家族的存储服务！(不支持世纪互联)

Azure Blob Storage / Office 365 (OneDrive/SharePoint Admin) / OneDrive Consumer / OneDrive for Business (Single User)

![](//www.xtboke.cn/usr/uploads/auto_save_image/a89f9ad559bd99926abbfdfcbf7807f9.png)

### 账号选择？

我的微软的账号，到底选择哪个授权登录呢？其实多试几次就知道了！

OneDrive Consumer  : 普通的微软账号

OneDrive for Business (Single User) ： A1 / A1P / E3 /E5 等商业版账号

Office 365 (OneDrive/SharePoint Admin) ：A1 / A1P / E3 /E5 等商业版全局管理账号以及SharePoint账号

#Mover 数据迁移

### 添加迁移源

每个源的添加方式可能不一样，不过操作起来比较简单，先点击顶部的"Transfer Wizard"建立一个新的传输。再选择选择需要迁移的来源，根据提示完成授权即可。

![](//www.xtboke.cn/usr/uploads/auto_save_image/b323918e356405ad25a62d678aa19f8e.png)

### 选择迁移目标

Mover的主打是将数据迁移到OneDrive，所以支持的目标源全是微软的产品，不支持迁移到其它网盘，如下图。

![](//www.xtboke.cn/usr/uploads/auto_save_image/f4f9d6b413750c41a1aa5a22848e1a44.png)

点击Authorize New Connector根据提示添加一个目标源。

![](//www.xtboke.cn/usr/uploads/auto_save_image/3ed4dd13c2c3cd832a382105f763ac36.png)

### 开始迁移

上面步骤完成后，就可以开始迁移了，可以点击导航栏上面的"Migration Manager"可以查看迁移任务，以及当前的进度和日志等详细情况。

![](//www.xtboke.cn/usr/uploads/auto_save_image/83a1381dab42e219587eab5570de0578.png).

使用缺点
----

1.  团队盘(A1，E5，A1P等等)限制单文件大小15G。
2.  个人盘限制单文件大小10g(我也不知道怎么回事，可能是网站规则限制吧)。
3.  生成的任务删除不了，只能暂停。
4.  只能转存到OneDrive，不能转到其他地方。
5.  无法自动同步更新，只能手动点击。

使用优点
----

1.  免费(不知道什么时候会收费，现在没有)。
2.  不限制网盘数，不限制总流量。
3.  可以自动跳过同目录重复文件。
4.  支持不同域的OneDrive。
5.  官宣是使用的Windows Azure来传输的。
### 总结

Mover支持大部分主流目标源，通过简单的操作即可轻松的将数据迁移到OneDrive，没有流量方面的限制。但Mover无法保障100%完整迁移，目前也仅支持迁移到微软的存储产品。


  [1]: https://www.xtboke.cn/upload/2020/02/1384837684.png
  [2]: https://www.xtboke.cn/upload/2020/02/1436990687.png
  [3]: https://www.xtboke.cn/upload/2020/02/1607980670.png