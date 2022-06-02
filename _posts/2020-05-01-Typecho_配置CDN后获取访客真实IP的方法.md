---
layout: post
title: Typecho 配置CDN后获取访客真实IP的方法
date: 2020-05-01 00:27:21
updated: 2020-05-01 00:27:21
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - Typecho
  - CDN
---


**简单介绍**
========

网站在配置了CDN进行加速后一般都无法获取访客真实IP，只能获取访问时使用的CDN节点IP。此时会导致一系列问题，比如无法有效过滤广告等垃圾留言和封杀恶意攻击等等。

**解决方法**
========

在Typecho站点根目录里的config.inc.php添加下面这段代码：

```
/**使用CDN后获取访客真实ip*/
if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
  $list = explode(',',$_SERVER['HTTP_X_FORWARDED_FOR']);
  $_SERVER['REMOTE_ADDR'] = $list[0];
}

```

同理,如果使用的是wordpress，将此段代码添加到wp-config.php中即可。