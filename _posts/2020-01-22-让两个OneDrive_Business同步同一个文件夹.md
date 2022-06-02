---
layout: post
title: 让两个OneDrive Business同步同一个文件夹
date: 2020-01-22 10:36:44
updated: 2020-01-22 10:37:36
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - office365
---


正常来说，两个OneDrive Business 同步同一个文件夹是不可以的，无法成功设置成同一个文件夹，这时需要用到windows 自带的一个文件链接工具mklink

使用管理员运行CMD并运行以下命令：

    mklink /D “第一个Onedrive文件路径\备份文件夹” “第二个文件路径”

第一个是你用来备份他的ONEDRIVE，注意，这里不能直接用根目录，必须在下面路径设置一个文件夹，而且不能预先建立好文件夹，直接运行mklink后，他们帮你建立好这个文件夹，并会出现快捷方式一样的角标，但是这个文件夹任何程序都会认为是一个和原来一样的文件夹，且不会占用空间。

 

第二个是你需要再次备份的ONEDRIVE文件夹