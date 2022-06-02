---
layout: post
title: MAC下JetBrains全系列软件激活教程
date: 2021-12-14 21:43:16
updated: 2021-12-14 21:43:16
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - MAC
  - JetBrains
---


最新激活方式
------

如果安装过无限试用、修改过 hosts 请先卸载干净旧版本再安装，否需无法激活！

> 以 `WebStorm` 为例

1.  [JetBrains官网](https://www.jetbrains.com/) 下载安装你需要的 IDE，如果下载慢可以在 macwk 搜索 jetbrains。
2.  下载 [Jetbrains.zip](https://macwk.lanzouo.com/i8eElxh573a)，下载后解压，得到 fineagent.jar，将该文件复制到 `/Users/你的用户名/` 文件夹下
3.  打开访达，点击左侧的 `应用程序` 找到 `WebStorm`，在 WebStorm 图标上右键，点击 `显示包内容`
4.  进入 `Contents` 目录，再进入 `bin` 目录，使用文本编辑器打开 `webstorm.vmoptions` 文件
5.  在最后面添加 `-javaagent:/Users/你的用户名/fineagent.jar`，记得修改一下你的用户名。
6.  运行 WebStorm, 选择 `Activate WebStorm`，再点击 `Activation Code`
7.  复制下面的的激活码粘贴到激活窗口的输入框中，点击 `Activate`。可以用到 2099 年！

```
5AYV1D1RE5-eyJsaWNlbnNlSWQiOiI1QVlWMUQxUkU1IiwibGljZW5zZWVOYW1lIjoiaHR0cHM6Ly93d3cuaml3ZWljaGVuZ3podS5jb20iLCJhc3NpZ25lZU5hbWUiOiIiLCJhc3NpZ25lZUVtYWlsIjoiIiwibGljZW5zZVJlc3RyaWN0aW9uIjoiIiwiY2hlY2tDb25jdXJyZW50VXNlIjpmYWxzZSwicHJvZHVjdHMiOlt7ImNvZGUiOiJJSSIsImZhbGxiYWNrRGF0ZSI6IjIwOTktMTItMzEiLCJwYWlkVXBUbyI6IjIwOTktMTItMzEifSx7ImNvZGUiOiJBQyIsImZhbGxiYWNrRGF0ZSI6IjIwOTktMTItMzEiLCJwYWlkVXBUbyI6IjIwOTktMTItMzEifSx7ImNvZGUiOiJEUE4iLCJmYWxsYmFja0RhdGUiOiIyMDk5LTEyLTMxIiwicGFpZFVwVG8iOiIyMDk5LTEyLTMxIn0seyJjb2RlIjoiUFMiLCJmYWxsYmFja0RhdGUiOiIyMDk5LTEyLTMxIiwicGFpZFVwVG8iOiIyMDk5LTEyLTMxIn0seyJjb2RlIjoiR08iLCJmYWxsYmFja0RhdGUiOiIyMDk5LTEyLTMxIiwicGFpZFVwVG8iOiIyMDk5LTEyLTMxIn0seyJjb2RlIjoiRE0iLCJmYWxsYmFja0RhdGUiOiIyMDk5LTEyLTMxIiwicGFpZFVwVG8iOiIyMDk5LTEyLTMxIn0seyJjb2RlIjoiQ0wiLCJmYWxsYmFja0RhdGUiOiIyMDk5LTEyLTMxIiwicGFpZFVwVG8iOiIyMDk5LTEyLTMxIn0seyJjb2RlIjoiUlMwIiwiZmFsbGJhY2tEYXRlIjoiMjA5OS0xMi0zMSIsInBhaWRVcFRvIjoiMjA5OS0xMi0zMSJ9LHsiY29kZSI6IlJDIiwiZmFsbGJhY2tEYXRlIjoiMjA5OS0xMi0zMSIsInBhaWRVcFRvIjoiMjA5OS0xMi0zMSJ9LHsiY29kZSI6IlJEIiwiZmFsbGJhY2tEYXRlIjoiMjA5OS0xMi0zMSIsInBhaWRVcFRvIjoiMjA5OS0xMi0zMSJ9LHsiY29kZSI6IlBDIiwiZmFsbGJhY2tEYXRlIjoiMjA5OS0xMi0zMSIsInBhaWRVcFRvIjoiMjA5OS0xMi0zMSJ9LHsiY29kZSI6IlJNIiwiZmFsbGJhY2tEYXRlIjoiMjA5OS0xMi0zMSIsInBhaWRVcFRvIjoiMjA5OS0xMi0zMSJ9LHsiY29kZSI6IldTIiwiZmFsbGJhY2tEYXRlIjoiMjA5OS0xMi0zMSIsInBhaWRVcFRvIjoiMjA5OS0xMi0zMSJ9LHsiY29kZSI6IkRCIiwiZmFsbGJhY2tEYXRlIjoiMjA5OS0xMi0zMSIsInBhaWRVcFRvIjoiMjA5OS0xMi0zMSJ9LHsiY29kZSI6IkRDIiwiZmFsbGJhY2tEYXRlIjoiMjA5OS0xMi0zMSIsInBhaWRVcFRvIjoiMjA5OS0xMi0zMSJ9LHsiY29kZSI6IlJTVSIsImZhbGxiYWNrRGF0ZSI6IjIwOTktMTItMzEiLCJwYWlkVXBUbyI6IjIwOTktMTItMzEifV0sImhhc2giOiIxMjc5Njg3Ny8wIiwiZ3JhY2VQZXJpb2REYXlzIjo3LCJhdXRvUHJvbG9uZ2F0ZWQiOmZhbHNlLCJpc0F1dG9Qcm9sb25nYXRlZCI6ZmFsc2V9-HNPogO0kWkHCVMnsjmBXUqQt87UPHqdkYqZGveSJtu8hb2V2Yq7gHsHenp4UuEd3jwEwC+YrUIf7U5yDA/56F5Sdn0RLUHZX5DHeQbJPbmYCBsDRT7m8rnmMFOSZn3vwNatvv1cooZbcGOk3Wwxx6bF7XcgaIrmXRcmZMZgv2PZehr0WS1HxNKe3X4nbGP3MwiSbg4ypmxNDrljmgv+Si9QDDwNLDffqeO0Lce0FqEJuMWmvBS42S0aeIYF8IS5bp4+LFKLJ8T7tF40OxKYDurBb9+9c43GZBscM/eLB8Jos66jNGFwgebFUlvhzJKVHZtuc/N8zGeEnTq6K0T/B8w==-MIIDTjCCAjagAwIBAgIBDTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMCAXDTE4MTEwMTEyMjk0NloYDzIwOTkwODA5MDIyNjA3WjAfMR0wGwYDVQQDDBRwcm9kMnktZnJvbS0yMDIwMTAxOTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMK3eyr0+Oys/TwcQO+qYaXWGBmXcEP4fR0bHHzZd/4WNGltXhecM80OWthA38BQRYAJBCKz/dSkO2Kj1H2y+7KB5cIaOiJEyTESfTSgzQdot6laRBU8oxy9mmagI46M8zEEmplPybY4YJj4HOwZiBsMQEMxoTgMDLpuHX6uASoVhSj6koB55lOj4wEgsQBeAMWTAXmTl88ixE179J8aBUkBGpL8w/tZzl9BJXZNF15gPfkS58rw8cdPzXLS0Yym37A2/KKFhfHzJc5KhbaxqYzmkAfTMqPsIqCQ1lQUAqfiPn2gN2I1Z3/cQuEW27M55fXVr2DduQe5DWzYJs85L50CAwEAAaOBmTCBljAJBgNVHRMEAjAAMB0GA1UdDgQWBBQk2hEilvWFQcCTR+gxI0z0wIQC/zBIBgNVHSMEQTA/gBSjnrZIZ0ISNkG9beC5tKBSi5fxs6EcpBowGDEWMBQGA1UEAwwNSmV0UHJvZmlsZSBDQYIJANJssYOyg3nhMBMGA1UdJQQMMAoGCCsGAQUFBwMBMAsGA1UdDwQEAwIFoDANBgkqhkiG9w0BAQsFAAOCAQEAsCQBjO5wttco/Z5cj/o4GBrku8UtBBBVFq4xsBanshTHm4deVxcTvta4aScV0TPKcaLqGqWx8A9v8XXO8dBbCuyXvWZteZ/C2Covg1xXiM99lz7VxqpjVmLdKanZn5u0gQSiYJdcfF+TdbmEIeSOnN/kLXNq2hXdJQK2zk2J25UZqu5EibRtTbdOzw6ZcfwJ8uOntXfsmAhnNICP3Wf/4wR/mwB0Ka4S+JA3IbF5MUmUZ/fjUaFarnin70us+Vxf/sZUi7u67wilvwVV0NAqDpthHUV0NRc4q+yOr2Dt/uCHdy4XRXLJfAv/z9/xBwNZZALNz3EtQL6IeIWWJByl3g==
```

尽情享用吧！


无限重置试用方式
--------

> 无限重置试用方式仅适用于 2021.2.2 及以下版本！！！

### 前面的话

> 永久激活的工具 zhile 的大神已经不再继续开发维护了，此方法一直是跳转到 zhile 的主页，但是经常遇到反馈说目标网站打不开或者不知道怎么安装插件的问题，所以直接转到这个页面并配一下操作图片吧。另外目前只有这种无限重置试用的方法了，`最终和永久激活使用无差异，因为插件是每次运行自动续期的`！支持 JetBrains 系列软件的所有新旧版本的激活！！！MacWk.com 建议大家去 [JetBrains官网](https://www.jetbrains.com/) 下载JetBrains系列工具的官方版，一般情况下载很快的。

此方法也适用于 Windows。

### 背景

Jetbrains 家的产品有一个很良心的地方，他会允许你试用 30 天（这个数字写死在代码里了）以评估是否你真的需要为它而付费。 但很多时候会出现一种情况：IDE 并不能按照我们实际的试用时间来计算。

我举个例子：如果我们开始了试用，然后媳妇生孩子要你回去陪产！陪产时我们并无空闲对IDE试用评估，它依旧算试用时间。（只是举个例子，或许你并没有女朋友）

发现了吗？你未能真的有 30 天来对它进行全面的试用评估，你甚至无法作出是否付费的决定。此时你会想要延长试用时间，然而 Jetbrains 并未提供相关功能，该怎么办？

事实上有一款插件可以实现这个功能，你或许可以用它来重置一下试用时间。但切记不要无休止的一直试用，这并不是这个插件的初衷！

![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-01.jpg)

### 如何安装

> 提供以下两种方法，二选一即可。

1.  插件市场安装：

在 `Settings/Preferences... -> Plugins` 内手动添加第三方插件仓库地址：`https://plugins.zhile.io` 搜索：IDE Eval Reset 插件进行安装。

![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-02.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-03.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-04.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-05.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-06.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-07.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-08.jpg)

1.  手动下载安装：

[点击这个链接(v2.1.14)下载插件的 zip 包](https://macwk.lanzoui.com/iwY9lvf1ckj)（macOS可能会自动解压，切记使用的是 zip 包，不是解压后的文件夹！），然后打开 `Settings/Preferences... -> Plugins` 手动安装插件。

![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-09.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-10.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-11.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-12.jpg)

### 如何使用

一般来说，在 IDE 窗口切出去或切回来时（窗口失去/得到焦点）会触发事件，检测是否长时间（25天）没有重置，给通知让你选择。（初次安装因为无法获取上次重置时间，会直接给予提示）。

您也可以手动唤出插件的主界面：

a. 如果 IDE 没有打开项目，在 Welcome 界面点击 IDE 的菜单：`Get Help -> Eval Reset`

b. 如果 IDE 打开了项目，点击 IDE 的菜单：`Help -> Eval Reset`

唤出的插件主界面中包含了一些显示信息，有 2 个按钮和 1 个勾选项：

-   按钮：`Reload` 用来刷新界面上的显示信息。
-   按钮：`Reset` 点击会询问是否重置试用信息并重启 IDE。选择 Yes 则执行重置操作并重启 IDE 生效，选择 No 则什么也不做。（此为手动重置方式）
-   勾选项：`Auto reset before per restart` 如果勾选了，则自勾选后每次重启/退出 IDE 时会自动重置试用信息，你无需做额外的事情。（此为自动重置方式，推荐此方法！）

![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-13.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-14.jpg)![](https://cdn.macwk.com/public/uploads/_/originals/jetbrains-crack-screen-15.jpg)

### 如何更新

1.  插件更新机制（推荐）：

IDE 会自行检测其自身和所安装插件的更新并给予提示。如果本插件有更新，你会收到提示看到更新日志，自行选择是否更新。

点击 IDE 的 Check for Updates... 菜单手动检测 IDE 和所安装插件的更新。如果本插件有更新，你会收到提示看到更新日志，自行选择是否更新。

插件更新可能会需要重启IDE。

1.  手动更新：

从本页面下载最新的插件 zip 包安装更新。插件更新需要重启IDE。

### 一些说明

市场付费插件的试用信息也会一并重置。

MyBatisCodeHelperPro 插件有两个版本如下，功能完全相同，安装时须看清楚！

-   [MyBatisCodeHelperPro](https://plugins.jetbrains.com/plugin/14522-mybatiscodehelperpro-marketplace-edition-) (Marketplace Edition)，`可重置`！
-   [MyBatisCodeHelperPro](https://plugins.jetbrains.com/plugin/9837-mybatiscodehelperpro)，`不可重置`！

对于某些付费插件（如: Iedis 2, MinBatis）来说，你可能需要去取掉 javaagent 配置（如果有）后重启IDE：

-   如果IDE没有打开项目，在 Welcome 界面点击菜单：Configure -> Edit Custom VM Options... -> 移除 -javaagent: 开头的行。
-   如果IDE打开了项目，点击菜单：Help -> Edit Custom VM Options... -> 移除 -javaagent: 开头的行。

重置需要重启IDE生效！

重置后并不弹出 Licenses 对话框让你选择输入 License 或试用，这和之前的重置脚本/插件不同（省去这烦人的一步）。

如果长达 25 天不曾有任何重置动作，IDE 会有通知询问你是否进行重置。

如果勾选：Auto reset before per restart ，重置是静默无感知的。

简单来说：勾选了 Auto reset before per restart 则无需再管，一劳永逸。

### 开源信息

插件是学习研究项目，源代码是开放的。源码仓库地址：[Gitee](https://gitee.com/pengzhile/ide-eval-resetter)。

如果你有更好的想法，欢迎给我提 Pull Request 来共同研究完善。

插件源码使用：GPL-2.0开源协议发布。

插件使用 PHP 编写，毕竟 PHP 是世界上最好的编程语言！

### 支持的产品

-   IntelliJ IDEA
-   AppCode
-   CLion
-   DataGrip
-   GoLand
-   PhpStorm
-   PyCharm
-   Rider
-   RubyMine
-   WebStorm

[点我查看原文链接](https://zhile.io/2020/11/18/jetbrains-eval-reset-da33a93d.html)

转自：https://www.macwk.com/article/jetbrains-crackJetBrains