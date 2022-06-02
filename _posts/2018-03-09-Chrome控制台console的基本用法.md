---
layout: post
title: Chrome控制台console的基本用法
date: 2018-03-09 17:04:00
updated: 2018-03-09 17:13:10
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
---


 大家都有用过各种类型的浏览器，每种浏览器都有自己的特色，本人拙见，在我用过的浏览器当中，我是最喜欢Chrome的，因为它对于调试脚本及前端设计调试都有它比其它浏览器有过之而无不及的地方。可能大家对console.log会有一定的了解，心里难免会想调试的时候用alert不就行了，干嘛还要用console.log这么一长串的字符串来替代alert输出信息呢，下面我就介绍一些调试的入门技巧，让你爱上console.log
目前控制台方法和属性有：

    ["$$", "$x", "dir", "dirxml", "keys", "values", "profile", "profileEnd", "monitorEvents", "unmonitorEvents", "inspect", "copy", "clear", "getEventListeners", "undebug", "monitor", "unmonitor", "table", "$0", "$1", "$2", "$3", "$4", "$_"]

下面我们来一一介绍一下各个方法主要的用途。

一般情况下我们用来输入信息的方法主要是用到如下四个

1、console.log 用于输出普通信息

2、console.info 用于输出提示性信息

3、console.error用于输出错误信息

4、console.warn用于输出警示信息

用图来说话



5、console.group输出一组信息的开头

6、console.groupEnd结束一组输出信息

看你需求选择不同的输出方法来使用，如果上述四个方法再配合group和groupEnd方法来一起使用就可以输入各种各样的不同形式的输出信息。



哈哈，是不是觉得很神奇呀！

7、console.assert对输入的表达式进行断言，只有表达式为false时，才输出相应的信息到控制台



8、console.count（这个方法非常实用哦）当你想统计代码被执行的次数



9、console.dir(这个方法是我经常使用的 可不知道比for in方便了多少) 直接将该DOM结点以DOM树的结构进行输出，可以详细查对象的方法发展等等



10、console.time 计时开始

11、console.timeEnd  计时结束（看了下面的图你瞬间就感受到它的厉害了）



12、console.profile和console.profileEnd配合一起使用来查看CPU使用相关信息



在Profiles面板里面查看就可以看到cpu相关使用信息



13、console.timeLine和console.timeLineEnd配合一起记录一段时间轴

14、console.trace  堆栈跟踪相关的调试

上述方法只是我个人理解罢了。如果想查看具体API，可以上官方看看，具体地址为：https://developer.chrome.com/devtools/docs/console-api

 

下面介绍一下控制台的一些快捷键

1、方向键盘的上下键，大家一用就知晓。比如用上键就相当于使用上次在控制台的输入符号

2、$_命令返回最近一次表达式执行的结果，功能跟按向上的方向键再回车是一样的



上面的$_需要领悟其奥义才能使用得当，而0 4则代表了最近5个你选择过的DOM节点。

什么意思？在页面右击选择审查元素，然后在弹出来的DOM结点树上面随便点选，这些被点过的节点会被记录下来，而$0会返回最近一次点选的DOM结点，以此类推，$1返回的是上上次点选的DOM节点，最多保存了5个，如果不够5个，则返回undefined。



3、Chrome 控制台中原生支持类jQuery的选择器，也就是说你可以用$加上熟悉的css选择器来选择DOM节点



4、copy通过此命令可以将在控制台获取到的内容复制到剪贴板



（哈哈 刚刚从控制台复制的body里面的html可以任意粘贴到哪 比如记事本  是不是觉得功能很强大）

5、keys和values 前者返回传入对象所有属性名组成的数据，后者返回所有属性值组成的数组



说到这，不免想起console.table方法了



 

 

6、monitor & unmonitor
monitor(function)，它接收一个函数名作为参数，比如function a,每次a被执行了，都会在控制台输出一条信息，里面包含了函数的名称a及执行时所传入的参数。

而unmonitor(function)便是用来停止这一监听。



也就是说在monitor和unmonitor中间的代码，执行的时候会在控制台输出一条信息，里面包含了函数的名称a及执行时所传入的参数。当解除监视（也就是执行unmonitor时）就不再在控制台输出信息了。

$ // 简单理解就是 document.querySelector 而已。
$$ // 简单理解就是 document.querySelectorAll 而已。
$_ // 是上一个表达式的值
$0-$4 // 是最近5个Elements面板选中的DOM元素，待会会讲。
dir // 其实就是 console.dir
keys // 取对象的键名, 返回键名组成的数组
values // 去对象的值, 返回值组成的数组
 

下面看一下console.log的一些技巧

1、重写console.log 改变输出文字的样式



2、利用控制台输出图片



3、指定输出文字的样式



 你在控制台简单操作一遍就知道了，是不是觉得很简单！