---
layout: post
title: Typecho接入熊掌号附带AMP/MIP简单教程
date: 2018-06-05 19:53:51
updated: 2018-06-05 19:54:35
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - Typecho
  - 熊掌号
---


百度熊掌号简介
-------

> 百度熊掌号是内容和服务提供者入驻百度生态的实名账号，致力于帮助内容和服务提供者方便、快捷、高效地连接百度用户，并充分利用搜索生态开放的优势，获得流量和沉淀用户，实现自身价值的快速增长。  
> 来自于[百度百科](https://baike.baidu.com/item/熊掌号/22190893?fr=aladdin)

在Typecho接入熊掌号之前，你得先去[熊掌号](https://xiongzhang.baidu.com/site/register)申请开通一下。具体填写的信息就是上面页面的那么多，请准备号正面手持身份证的照片。

MIP & AMP
---------

> MIP(Mobile Instant Page - 移动网页加速器)，是一套应用于移动网页的开放性技术标准。通过提供MIP-HTML规范、MIP-JS运行环境以及MIP-Cache页面缓存系统，实现移动网页加速。  
> AMP（Accelerated Mobile Pages）是谷歌的一项开放源代码计划，可在移动设备上快速加载的轻便型网页，旨在使网页在移动设备上快速加载并且看起来非常美观。百度目前可支持AMP提交。

简介如上，想要正常使用AMP和MIP，须现在[百度站长平台](https://ziyuan.baidu.com/)添加好你们的网站。然后选中你的站点进行[MIP & AMP](https://ziyuan.baidu.com/mip/index?site=)设置。  
![搜狗截图18年04月16日2201_1.png](https://lsland.cn/usr/uploads/2018/04/1594418662.png "搜狗截图18年04月16日2201_1.png")

插件
--

**接下来我们就可以用到我们傻瓜式的插件**：

### AMP for Typecho

> A typecho plugin for Google AMP/ Baidu MIP
> 
> 这是款一键生成符合Google AMP/Baidu MIP标准相关页面的插件，开启后可以进一步优化Google、Baidu的搜索结果。

#### 功能

*   生成符合Google AMP/Baidu MIP标准的AMP/MIP页面，并与标准页面建立关联。
*   生成AMP/MIP的SiteMap，及所有ULR的纯文本列表。
*   生成AMP版的首页。
*   后台批量提交URL到Baidu，可选手动或自动。
*   MIP页面完美支持百度熊掌号页面标准，新发表文章自动提交到熊掌号。
*   新增开关：用户决定是否只允许Baidu和Google的爬虫访问MIP/AMP页面。
*   新增插件版本判断。
*   新增自定义MIP/AMP页面样式。
*   新增缓存功能，缓存访问过的MIP/AMP页面，可显著提高性能。

![搜狗截图18年04月16日2127_1.png](https://lsland.cn/usr/uploads/2018/04/2789615105.png "搜狗截图18年04月16日2127_1.png")  
![搜狗截图18年04月16日2128_2_看图王.png](https://lsland.cn/usr/uploads/2018/04/3225435088.png "搜狗截图18年04月16日2128_2_看图王.png")

#### 安装

将文件夹重命名为AMP，拷贝至usr/plugins/下，然后在网站后台->插件处安装

#### 升级方法

请先禁用插件后再升级  
PS:非Markdown编辑器书写的文章由于存在诸多不可预见的情况，生成的AMP/MIP页面可能不能完全符合标准，如果有遇到请及时反馈。

#### 使用说明

*   在插件后台设置默认LOGO和图片，以及选择是否开启SiteMap、AMP首页、自动提交到熊掌号等功能（除自动提交到熊掌号外的功能都**默认开启**）。
*   从百度站长获取接口调用地址、**熊掌号APPID/TOKEN**，填写到插件设置中（使用提交URL功能时需要）。
*   AMP/MIP的页面缓存默认为24小时，可在插件设置页面修改缓存时间。修改文章会**自动更新页面缓存**，重建缓存开关在插件设置页，设置缓存时间的下方。
*   AMP/MIP页面的模板**已独立至templates目录**中，有个性化需要的TX可以自己进一步调整：

**注：**

*   服务器未启用**php-curl扩展**时，后台批量提交URL到Baidu的功能**不可用**。
*   **非HTTPS站点受 amp-list 控件 的src参数限制，AMP首页无法换页，建议关闭生成AMP首页功能。**

> 上面是,emmm插件的介绍，下面简单说一下熊掌号的appid和token设置。如上截图，插件的设置是appid和token，那么找的地方在哪呢？

进入**[熊掌号资源搜索平台](https://ziyuan.baidu.com/xzh/home/index)**，提示登录账号之后，如下图选择**资源提交**！  
**appid**和**token**都同理，**始于 = ，止于 &** ，后面的type不要管！  
![搜狗截图18年04月17日1141_1_看图王.png](https://lsland.cn/usr/uploads/2018/04/4215505437.png "搜狗截图18年04月17日1141_1_看图王.png")

至此，你不光设置好了**熊掌号**，顺带连**amp**和**mip**都搞定了，还节约了一个**百度数据化结构**的插件。是不是很棒棒！？

本地下载：[Typecho-AMP-master.zip](https://lsland.cn/usr/uploads/2018/04/42081381.zip)

GitHub：[Typecho-AMP](https://github.com/holmesian/Typecho-AMP)