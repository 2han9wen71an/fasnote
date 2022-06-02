---
layout: post
title: macos和windows双系统时间不一致
date: 2019-04-09 10:22:25
updated: 2019-04-09 10:26:12
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - MAC
  - 黑苹果
---


最近再弄黑苹果，装好后发现2个系统的时间不一致，趴远景发现几个解决方法，现在记录一下

第一种
---

强行修改时间，每次切换系统要 该一次；
折中，修改时区为：国际标准时间；
补充：其中一个系统，修改时区为，国际标准时间后，问题解决；

第二种
---
WIN+x 选择管理员模式进入CMD
执行以下命令：

    Reg add HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1

第三种
---
在MAC的终端运行

    sudo sh -c "$(curl -kfsSL https://raw.githubusercontent.com/hieplpvip/LocalTime-Toggle/master/fix_time_osx.sh)"

第四种
---
百度找时间补丁，本站不提供下载