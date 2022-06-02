---
layout: post
title: OSGI项目中获取webapp下资源路径
date: 2020-07-20 13:19:02
updated: 2020-07-20 13:22:58
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
  - OSGI
---


#前言
公司系统使用osgi架构,在获取资源配置文件的时候发现拿不到文件,debug后发现路径不对,现在记录一下正确的姿势
#过程
如果想根据给定的文件名称创建一个File实例，你可能会这么写：

    File file = new File(当前类.class.getResource("/webapp/i18n/i18n_zh.json").toURI());

但是在osgi项目中，这种写法会报异常，异常信息是URI scheme is not "file"，原因是osgi中采用的是bundleresources协议的URL，得到的URI中包含了"bundleresource://165xxxxxxxx/"前缀，所以需要将获取到"URI"转成File协议的URL，这里需要用到org.eclipse.core.runtime 这个bundle，然后新的写法如下：

    File file = new File(FileLocator.toFileURL(当前类.class.getResource("/webapp/i18n/i18n_zh.json")).toURI());
