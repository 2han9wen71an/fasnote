---
layout: post
title: 使用eclipse将非OSGi jar转换成OSGi的Bundle
date: 2021-06-16 18:07:08
updated: 2021-06-16 18:07:08
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - OSGI
---


建立转换的project
------------

测试环境: JDK 1.8, Eclipse 4.4.2

打开Eclipse, `File`-> `New` -> `Project` -> `Plug-in Development` -> `Plug-in from Existing JAR Archives`

然后选择你想要制作成bundle的jar包, 然后输入一些plugin的信息如作者等.记得不要勾选`Unzip the JAR archive into the project`,即不要解压Jar包.

然后导出并安装到OSGi运行环境即可.

导出成bundle
--------------------------------------------------------------------------------------------------------------------------------------------------------------

右键项目 -> `Expor` -> `Plug-in Development` -> `Deployable plug-ins and fragment`. 即可.这时bundle就制作成了.然后安装到相应的OSGi环境即可.
