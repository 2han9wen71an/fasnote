---
layout: post
title: 在Java8的foreach()中使用return/break/continue
date: 2020-09-07 15:37:50
updated: 2020-09-07 15:38:54
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
  - Lambda表达式
---


今天使用lambda表达式处理集合时，发现对return、break以及continue的使用有点迷惑，于是自己动手测试了一下，才发现在使用foreach()处理集合时不能使用break和continue这两个方法，也就是说不能按照普通的for循环遍历集合时那样根据条件来中止遍历，而如果要实现在普通for循环中的效果时，可以使用return来达到，也就是说如果你在一个方法的lambda表达式中使用return时，这个方法是不会返回的，而只是执行下一次遍历，看如下的测试代码：

```
List<String> list = Arrays.asList("123", "45634", "7892", "abch", "sdfhrthj", "mvkd");list.stream().forEach(e ->{	if(e.length() >= 5){		return;	}	System.out.println(e);});
```

上述代码的输出结果是如下图所示：


可以看出return起到的作用和continue是相同的。

想知道这是为什么，在[Stack Overflow](http://stackoverflow.com/questions/23996454/terminate-or-break-java-8-stream-loop)中找到一个答案，主要是说foreach()不是一个循环，不是设计为可以用break以及continue来中止的操作。

----------------------------------------------------------------------------------------------------------

针对问题：

1、foreach()循环操作元素时，是否会退出lambda表达式，如下图所示：

![](https://img-blog.csdn.net/20170115155958309)

不管你遍历到哪个集合中的元素，上图都会停在第一行程序中而不会发生跳转，所以是不会停止lambda表达式的执行的。

相关文章：

-   [Java8のforEachを使った繰り返し処理について](http://www.task-notes.com/entry/20150422/1429671600)