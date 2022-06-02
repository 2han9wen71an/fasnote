---
layout: post
title: Date的after()与before()方法的区别
date: 2019-12-19 14:36:53
updated: 2019-12-19 14:38:17
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
---


Date1.after(Date2),当Date1大于Date2时，返回TRUE，当小于等于时，返回false；
即Date2比Date1小的true/false，当Date2日期比Date1小的时候为true，否则为false

Date1.before(Date2)，当Date1小于Date2时，返回TRUE，当大于等于时，返回false；

如果业务数据存在相等的时候，而且相等时也需要做相应的业务判断或处理时，请注意。

如果有这样的需求，在某个日期内的业务check，那么你需要使用：！Date1.after(Date2)![20170607212025634.png][1]


  [1]: https://xtboke.cn/upload/2019/12/701565413.png