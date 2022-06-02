---
layout: post
title: Open GApps各版本差异
date: 2019-01-12 14:46:54
updated: 2019-01-12 14:49:18
status: publish
author: zhangwentian
categories: 
  - 生活随笔
tags: 
  - Android
---


OpenGApps有几个不同的版本，super、stock、full、mini、micro、nano、pico，很多人不知道差别是什么，这里说明一下

 

 - **super**

包含了所有 GApps ，像韩语日语中文拼音中文注音输入法等。（请注意：如果你是用的是基于原生的 ROM ，本版本会替换相机，通讯录等等所有有关应用）。体积1G左右，如果System分区剩余空间不够，就会刷入失败。

 - **stock**

类似于 Google Pixel 出厂内置的 GApps ，相比 super 版少了其他语种的输入法以及 Google 地球等。（请注意：如果你是用的是基于原生的 ROM ，本版本会替换相机，通讯录等等所有有关应用）。体积820M~840M左右，如果System分区剩余空间不够，就会刷入失败。

 - **full**

与 stock 版所包含的内容相同，但此版本不会替换手机原本的应用。体积670~690M左右，如果System分区剩余空间不够，就会刷入失败。

 - **mini**

包含基础的 Google 服务框架，以及一些影响力较大的 GApps ，相比 full 版去掉了 Docs 等应用。体积370M~390M左右，如果System分区剩余空间不够，就会刷入失败。

 - **micro**

包含基础的 Google 服务框架和 Gmail 等常见 GApps。体积190~210M左右，如果System分区剩余空间不够，就会刷入失败。

 - **nano**

包含基础的 Google 服务框架，但不会有其他 不必要的 GApps。体积160M~180M左右，如果System分区剩余空间不够，就会刷入失败。

 - **pico**

包含最迷你的 Google 服务框架，但由于框架并非完整，部分 GApps 可能无法运行。体积110~120M左右，如果System分区剩余空间不够，就会刷入失败。

 

以上关于体积的描述，指的是arm64设备、android7.1~8.1系统。第三方原生ROM的System空间会更大一点，但仍需谨慎选择Super、Stock和full版本版本。因此，选择谷歌服务包的版本不能任性，要量力而为！