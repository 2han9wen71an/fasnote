---
layout: post
title: 免费申请永久免费的IBM Cloud Lite 
date: 2020-03-02 17:52:54
updated: 2020-03-02 18:10:56
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - IBM
---


免费用户默认的是轻量应用服务，如果需要功能更多更全的应用服务就需要升级了

![](https://img-blog.csdnimg.cn/20190308110413524.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

一开始我并不准备升级，因为现在是免费，升级后估计是要收费了。后来在查找相关资料时发现升级后也是有免费服务的，而且升级也是比较简单的，主要是要绑定信用卡，虚拟信用卡亦可 

**升级方法：**

将过滤内容删掉后，目录里会出现所有的服务，最上面是特色服务Kubernetes Service，也正是我想使用的

![](https://img-blog.csdnimg.cn/2019030811045497.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

2、点击进入页面，只有升级的按键，说明这项服务只能升级后使用 

![](https://img-blog.csdnimg.cn/20190308110516937.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

下拉页面后看到价目表，有一项免费使用，说明升级后也是可以免费使用的，并不需要收费

![](https://img-blog.csdnimg.cn/20190308110536192.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

3、点击升级，弹出升级页面，需要你输入一些信息，左边的一些说明也解释了免费功能的使用

![](https://img-blog.csdnimg.cn/20190308110553764.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

4、接下来输入信息，真假随便，但得看上去是真的。。。重要的是信用卡信息，假的是不行的，所以只能自己想办法 。

![](https://img-blog.csdnimg.cn/20190308110735748.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

5、填写完成后确认，没有问题的话稍等一会就会弹出成功信息

![](https://img-blog.csdnimg.cn/20190308110752598.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

6、接下来开始尝试创建Kubernetes Service这个服务了，可以看到下图的升级变成创建了，点击创建

![](https://img-blog.csdnimg.cn/20190308110812625.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

这里看到默认的是收费选项，我选择了左边的免费选项 

![](https://img-blog.csdnimg.cn/20190308110832793.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

7、创建完毕后是requested 状态，有时需要人工审核，一般隔天通 

![](https://img-blog.csdnimg.cn/20190308110858925.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

 8、我的这个30分钟好像就搞定了，不过进去看的时候杯具了，貌似只有一个月的使用时间，这就尴尬了，后来一查，原来是这个容器只有一个月的有效器，一个月后注销，只能再创建新的，相当于变相的无限使用

![](https://img-blog.csdnimg.cn/20190308110927287.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0RfZWFzdA==,size_16,color_FFFFFF,t_70)

做到这里我感觉这个实用性倒不是很大了，相对于之前的轻量级应用还不如，毕竟只要一直运行它就不会被删除。看来只能装装科学工具使用了，最近我会再摸索摸索，看看有没有其他好玩的地方.