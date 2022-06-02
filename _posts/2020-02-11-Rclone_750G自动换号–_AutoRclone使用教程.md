---
layout: post
title: Rclone 750G自动换号– AutoRclone使用教程
date: 2020-02-11 00:29:45
updated: 2020-02-11 00:31:35
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - GoogleDrive
  - Rclone
  - AutoRclone
---


博主经常看到有人在论坛或者QQ/Telegram群组发问

怎么快速拷贝1000T资源到我的Google Drive？

必须是Rclone/AutoRclone啊！一直不想写关于AutoRclone的（中文）教程，因为其一直处于测试阶段，如果后面代码有大的更新那么前面的教程对于后面的人来说就是一个误导。但是现在应该不会有大的更新了，而且这么长时间的测试发现如果没有一个详细的教程的话，会让很多不会程序的小白错过这么好的工具 :)

AutoRclone是一个用Python写的小程序的集合，其

- 学习了folderclone利用service accounts来替代普通Google账号进行拷贝/上传；
- 通过rclone rc来做到对Rclone任务的监、控；
- 还可以用Google Groups的形式对成百上千的service accounts进行管理。

从而方便快速地

- 从本地到 Team Drive，
- 从公共分享目录到 Team Drive，
- 再或者从 Team Drive 到 Team Drive。

其食用方法极其简单！

## 步骤 1 下载代码

首先不管你是哪个操作系统，需要安装Python。对于Linux和Windows分别用以下方式安装相关脚本
**Linux**: 安装screen，git和最新的Rclone。如果是Debian/Ubuntu，直接输入以下命令

    sudo apt-get install screen git && curl https://rclone.org/install.sh | sudo bash

然后从Github下载代码并安装相关Python依赖包

    sudo git clone https://github.com/xyou365/AutoRclone && cd AutoRclone && sudo pip3 install -r requirements.txt

**Windows**: 安装最新的[Rclone](https://rclone.org/downloads/)，直接从Github下载[AutoRclone](https://github.com/xyou365/AutoRclone)后在Windows的cmd或PowerShell中切换到AutoRclone的目录，输入以下命令安装相关Python依赖包

    pip3 install -r requirements.txt

以下步骤如果输入python3没有反应，请输入python或者py3

以下所有步骤由于需要用到谷歌服务，请确保cmd或者vps能够富强

## 步骤 2 生成service accounts

首先[开启Drive API](https://developers.google.com/drive/api/v3/quickstart/python)并将credentials.json保存到你的AutoRclone目录下面

开启Drive API

![Drive API](https://img.vim-cn.com/46/a41db9c3b2b25ef86f5c55db3778544d854580.jpg)

然后分三种情况

如果你之前没创建过项目, 直接运行

    python3 gen_sa_accounts.py --quick-setup 5

- 创建6个项目（项目0到项目5）
- 开启相关的服务
- 创建600个service accounts（6个项目，每个项目100个）
- 将600个service accounts的授权文件下载到accounts文件夹下面

如果你已经有N个项目，现需要创建新的项目并在新的项目中创建service accounts，直接运行

    python3 gen_sa_accounts.py --quick-setup 2 --new-only

- 额外创建2个项目（项目N+1到项目N+2）
- 开启相关的服务
- 创建200个service accounts（2个项目，每个项目100个）
- 将200个service accounts的授权文件下载到accounts文件夹下面

如果你想用已有的项目来创建service accounts（不创建新的项目），直接运行

    python3 gen_sa_accounts.py --quick-setup -1

*注意这会覆盖掉已有的service accounts*
顺利完成后，AutoRclone文件下面的accounts文件夹下会有很多的json文件。

## 步骤 3 可选：将service accounts加入Google Groups

为了方便管理service accounts，也是为了让我们的Team Drive可以容纳更多的service accounts，我们这里用到了Google Groups。

> [Official limits to the members of Team Drive](https://support.google.com/a/answer/7338880?hl=en) (Limit for individuals and groups directly added as members is 600).

**对于G Suite管理员**

1. 按照[官方步骤](https://developers.google.com/admin-sdk/directory/v1/quickstart/python)开启Directory API，将生成的json文件保存到credentials文件下。
2. 在[控制面版](https://support.google.com/a/answer/33343?hl=en)里面创建一个群组，创建好你会获得一个类似域名邮箱的地址[[email&#160;protected]](/cdn-cgi/l/email-protection)
3. 利用API将service accounts加入Google Groups

    python3 add_to_google_group.py -g [[email&#160;protected]](/cdn-cgi/l/email-protection)

*如果想看参数的具体含义，直接运行`python3 add_to_google_group.py -h`*

**对于普通Google账号**
直接创建一个[Google Group](https://groups.google.com/)然后手动地将service accounts对应的邮箱地址（可以在json认证文件中找到）挨个加进去。但每次只能加10个，每24小时只能加100个。

## 步骤 4 将service accounts或者Google Groups加入到Team Drive

*- 如果你没有Team Drive，那可以找朋友帮你开一个或者去买一个，实在不嫌弃也可以留言找博主开一个*
*- 如果你已经在完成了步骤2中的用Google Groups来管理service accounts，那么直接将Google Groups地址[[email&#160;protected]](/cdn-cgi/l/email-protection)或者[[email&#160;protected]](/cdn-cgi/l/email-protection)glegroups.com加入你的源Team Drive（tdsrc）和目标Team Drive（tddst）*
*- 如果你在步骤2中没有生成并保存credentials.json那么再做一遍*

将service accounts加入到源Team Drive

    python3 add_to_team_drive.py -d SharedTeamDriveSrcID

将service accounts加入到目标Team Drive

    python3 add_to_team_drive.py -d SharedTeamDriveDstID

## 步骤 5 开始拷贝/上传

*准备工作都做好了，以后你只需要将项目文件夹拷贝到任何地方，进行此拷贝/上传步骤就可以啦*

**拷贝**

    python3 rclone_sa_magic.py -s SourceID -d DestinationID -dp DestinationPathName -b 1 -e 600

- 如果想看参数的具体含义，直接运行`python3 rclone_sa_magic.py -h`
- 特别地，如果想多开，请用`-p`参数给不同的复制任务指定不同的端口
- 如果发现拷贝内容明显少于源Team Drive里面的内容，那么你可能碰到[Bug](https://forum.rclone.org/t/rclone-cannot-see-all-files-folder-in-public-shared-folder/12351)了，请给上运行参数再加上`--disable_list_r`
- 如果你一开始就碰到了

Failed to rc: connection failed: Post [http://localhost](http://localhost):5572/core/stats: dial tcp :5572: connectex: No connection could be made because the target machine actively refused it.
那么可能是权限或者路径导致Rclone任务都没跑起来，请观察日志文件`log_rclone.txt`，并结合如下简单命令检查出原因`rclone --config rclone.conf size --disable ListR src001:`，`rclone --config rclone.conf size --disable ListR dst001:`

**上传**

    python3 rclone_sa_magic.py -sp YourLocalPath -d DestinationID -dp DestinationPathName -b 1 -e 600

拷贝截图

![拷贝](https://img.vim-cn.com/da/53a0885e8334e42cea145d840487cd6532fe2f.jpg)

不出意外应该就可以跑起来了。每个service account的总的时间消耗是校验时间+拷贝时间，如果你的拷贝任务比较大的话建议将其（按文件夹）稍微拆分，挨个或者并行完成，这样能极大减小每次切换service accounts后不必要的校验时间。另外关于拷贝速度，API调用限制了每秒不超过10次调用，每次拷贝固定数量的文件数目，所以如果你的任务中的文件比较小的话，拷贝速度可能是每秒几百MB，文件都比较大的话，拷贝速度可能是几十GB/s。

## 一些 Q & A

Q. 怎么检查是否拷贝完全？发现丢文件了？

A. 拷贝完请做以下检查

    rclone --config rclone.conf size src001:源路径
    rclone --config rclone.conf size dst001:目标路径

如果发现目标盘比源盘体积还要大，那么对目标盘进行去重；如果发现目标盘比源盘少文件了，那么再拷贝一次；如果还是少，那么就是**源盘里面的有重复文件**了，直接对其进行去重复。去重命令：

    rclone --config rclone.conf dedupe dst001:源路径
    rclone --config rclone.conf dedupe src001:目标路径