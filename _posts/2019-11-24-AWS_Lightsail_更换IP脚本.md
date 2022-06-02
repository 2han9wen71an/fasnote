---
layout: post
title: AWS Lightsail 更换IP脚本
date: 2019-11-24 00:29:17
updated: 2019-11-24 00:29:40
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
---


*   删除旧静态IP
*   获取新静态IP
*   绑定新静态IP
*   解析CloudFlare的域名IP为新的IP

![](https://dl.wxlost.com/2019/03/001.jpg)

申请 AWS key
----------

前往 [https://console.aws.amazon.com/iam/home?region=us-east-2#/security\_credential](https://console.aws.amazon.com/iam/home?region=us-east-2#/security_credential) 获取即可

申请 CloudFlare API
-----------------

前往 [https://www.cloudflare.com](https://www.cloudflare.com/a/login) 登陆后,右上角选择 `My profile`,最下面的`Global API Key`

安装AWS组件
-------

    #Ubuntu_Debian
    apt update -y
    apt install python-pip wget -y
    pip install awscli --upgrade

    #Centos
    yum update -y
    yum install python-pip wget -y
    pip install awscli --upgrade

获取脚本
----

    wget https://dl.wxlost.com/2019/01/aws.sh && chmod +x aws.sh

编辑 aws.sh 内的参数后.运行脚本

    bash aws.sh default

脚本后缀 default 为变量.以备后续添加多个机器调用

其他问题
----

[官方文档](https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-linux.html)  
本人出现debian下aws无法执行.所以手动添加环境

    export PATH=~/.local/bin:$PATH

内容写入`~/.bash_profile`  
然后读取

    source ~/.bash_profile

    #查看设置是否成功
    aws --version

现存的问题.

同一地区存在2个及以上的机器.会导致脚本过滤出多个IP…能力有限.无法分割识别….有大佬帮助下么….

截至2019年6月4日 脚本使用正常.

如果不能用.请检查自己的aws环境,尤其是aws的机器名字是否变了.静态IP地址是否存在多个名字一样的.请手动删除多余的静态IP

本人测试正常,朋友测试也正常.

感谢支持