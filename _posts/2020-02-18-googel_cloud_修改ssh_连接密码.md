---
layout: post
title: googel cloud 修改ssh 连接密码
date: 2020-02-18 16:45:57
updated: 2020-02-18 16:47:10
status: publish
author: zhangwentian
categories: 
  - 生活随笔
tags: 
  - GCE
  - googel cloud
  - 网站资源
---


**说明：**Google Compute Engine创建的VM实例（以下简称GCE）默认ssh key登陆并禁用了root。开启会降低登陆安全性

开启步骤
----

1.在GCE VM实例列表中，选择“在浏览器窗口中打开”访问实例  
![登陆](https://sixu.life/large/68bb8c6bgy1fvv383e5cdj20sg0b3mxs.jpg "登陆")

2.切换到root账户  
`sudo su`

3.修改SSH配置文件/etc/ssh/sshd\_config  
`vi/etc/ssh/sshd_config`

4.找到`PermitRootLogin`和`PasswordAuthentication`大概在中下的位置，按`i`进入编辑模式

    # Authentication:
    LoginGraceTime 120
    PermitRootLogin yes //默认为no，需要开启root用户访问改为yes
    StrictModes yes 
    # Change to no to disable tunnelled clear text passwords
    PasswordAuthentication yes //默认为no，改为yes开启密码登陆

按`esc`退出编辑模式，输入`:wq`回车保存

5.重启SSH服务

    service sshd restart #centos
    /etc/init.d/ssh restart #debian or Ubuntu

6.设置root账户密码  
`passwd root`  
输入两次密码确认

7.重复第5步操作重启ssh服务生效