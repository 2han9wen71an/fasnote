---
layout: post
title: 极简 GoogleDrive、OneDrive 目录列表程序 - ShareList
date: 2020-02-08 21:39:43
updated: 2020-02-08 21:42:08
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - office365
  - GoogleDrive
  - ShareList
---


![请输入图片描述][1]

简介
--

> ShareList 是一个易用的网盘工具，支持快速挂载 GoogleDrive、OneDrive ，可通过插件扩展功能。

*   用途：使用GoogleDrive 或 OneDrive分享出的文件夹ID，即可挂载成网盘。无需账号。。
*   特性：不占服务器空间；可挂载多个GD、OD目录；直链下载；在线预览（图片、视频、音频）

项目地址：[https://github.com/reruin/sharelist](https://github.com/reruin/sharelist)

![](https://ae01.alicdn.com/kf/Ub11d71a5b1574693920fe63881fb1556d.png)

安装
--

1.  下载源码：[【下载源码】](https://github.com/reruin/sharelist "【下载源码】")
    
2.  安装：  
    **Shell安装**
    

*   Shell
    
        bash install.sh
    
*   远程安装 / Netinstall
    
        wget --no-check-certificate -qO-  https://raw.githubusercontent.com/reruin/sharelist/master/netinstall.sh | bash
    
*   更新 / Update
    
        bash update.sh
    
    **Docker安装**
    

    docker build -t yourname/sharelist .
    
    docker run -d -v /etc/sharelist:/app/cache -p 33001:33001 --name="sharelist" yourname/sharelist

OR

    docker-compose up

访问 `http://localhost:33001` WebDAV 目录 `http://localhost:33001/webdav`

使用
--

#### 挂载GoogleDrive

*   使用分享ID挂载，由plugins/drive.gd.js插件实现。
    
        挂载标示：gd
        挂载内容：分享的文件ID
    
*   使用官方API挂载，由plugins/drive.gd.api.js插件实现。
    
        挂载标示：gda
        挂载内容：
        文件(夹)id->应用ID|应用机钥|回调地址|refresh_token
        文件(夹)id->应用ID|应用机钥
        文件(夹)id
        /
    

ShareList会根据填写的挂载内容的不同形式，自动开启挂载向导，按指示操作即可。

_特别提示：若不填写应用ID|应用机钥，向导将使用 `QuickStart` 生成匿名应用，在授权验证过程中会出现`This app isn\'t verified.`，请依次点击`Advanced` > `Go to {Project Name} (unsafe)`.即可出现正常的交互问询页面。_

#### 挂载OneDrive

*   使用分享ID挂载，由drive.od插件实现。
    
        挂载标示：od
        挂载内容：分享的文件ID。
    
*   使用官方API挂载，由drive.od.api插件实现。
    
        挂载标示：oda
        挂载内容：
          OneDrive路径->应用ID|应用机钥|回调地址|refresh_token
          OneDrive路径
          /
    

ShareList会根据填写的挂载内容，自动开启挂载向导，按指示操作即可。  
对于不符合OneDrive安全要求的域名，将采用中转方式验证，[查看中转页面](https://github.com/reruin/reruin.github.io/blob/master/redirect/onedrive.html "查看中转页面")。

*   挂载OneDrive For Business，由drive.odb插件实现。
    
        挂载标示：odb
        挂载内容：分享的url
    

#### 挂载本地文件

*   由drive.fs插件实现。
    
        挂载标示：fs
        挂载内容：文件路径。
    

**注意：**统一使用unix风格路径，例如 windows D盘 为 `/d/`。

#### 挂载GitHub

由drive.github插件实现，用于访问GitHub代码库。

    挂载标示：github
    挂载内容：
      username
      username/repo

注意：仅用于浏览，不支持 `git clone` 等git操作。

#### 挂载蓝奏云

由plugins/drive.lanzou.js插件实现。提供对蓝奏云的访问支持。

    挂载标示：lanzou
    挂载路径：
      folderId
      password@folderId

**注意**：folderId是分享链接中bxxxxxx部分。插件为 mp4/jpg 等禁止上传的格式提供解析支持，只需在文件名后附加txt后缀即可。以mp4为例，将xxx.mp4命名为xxx.mp4.txt后再上传，插件将自动解析为mp4文件。

#### 挂载h5ai

由drive.h5ai插件实现，用于访问h5ai目录程序。

    挂载标示：h5ai
    挂载路径：http地址

例如： `h5ai:https://larsjung.de/h5ai/demo/`

#### 挂载WebDAV

由drive.webdav插件实现，用于访问WebDAV服务。

    挂载标示：webdav
    挂载路径：
      https://webdavserver.com:1222/path
      https://username:password@webdavserver.com:1222/path
      https://username:password@webdavserver.com:1222/?acceptRanges=none

注意：若服务端不支持断点续传，需追加`acceptRanges=none`

#### 虚拟目录

在需创建虚拟目录处新建目录名`.d.ln`文件。 其内容为挂载标识:挂载路径。  
指向本地`/root`的建虚拟目录

    fs:/root

指向GoogleDrive的某个共享文件夹虚拟目录

    gd:0BwfTxffUGy_GNF9KQ25Xd0xxxxxxx

系统内置了一种单文件虚拟目录系统，使用yaml构建，以sld作为后缀保存。参考[example/ShareListDrive.sld](https://github.com/reruin/sharelist/blob/master/example/sharelist_drive.sld "example/ShareListDrive.sld")。

#### 虚拟文件

与虚拟目录类似，目标指向具体文件。  
在需创建虚拟文件处新建文件名`.后缀名.ln`文件。 其内容为`挂载标识:挂载路径`。 如：创建一个`ubuntu_18.iso`的虚拟文件，请参考[example/linkTo\_download\_ubuntu\_18.iso.ln](https://github.com/reruin/sharelist/blob/master/example "example/linkTo_download_ubuntu_18.iso.ln")。

#### 目录加密

在需加密目录内新建 `.passwd` 文件，type为验证方式，data为验证内容。  
目前只支持用户名密码对加密（由auth.basic插件实现）。 例如：

    type: basic
    data:
      - user1:111111
      - user2:aaaaaa

user1用户可使用密码111111验证，user2用户可使用密码aaaaaa验证。请参考[example/secret\_folder/.passwd](https://github.com/reruin/sharelist/blob/master/example "example/secret_folder/.passwd")。

#### 流量中转

后台管理，常规设置，将中转（包括预览）设为启用即可实现中转代理。

#### 忽略文件类型

后台管理，常规设置，忽略文件类型可定义忽略的文件类型。例如忽略图片：jpg,png,gif,webp,bmp,jpeg。

#### 显示README

后台管理，常规设置，将显示README.md内容设为启用，当前目录包含README.md时，将自动显示在页面。

#### 文件预览

后台管理，常规设置，将详情预览设为启用即可对特定文件进行预览。目前支持：

#### 文档类

由[preview.document](https://github.com/reruin/sharelist/blob/master/plugins/drive.document.js "preview.document")插件实现，可预览md、word、ppt、excel。

#### 多媒体

由[preview.media](https://github.com/reruin/sharelist/blob/master/plugins/drive.media.js "preview.media")插件实现，可预览图片、音频、视频提供。

#### Torrent

由[preview.torrent](https://github.com/reruin/sharelist/blob/master/plugins/drive.torrent.js "preview.torrent")插件实现，为种子文件提供在线预览。

[1]: https://ae01.alicdn.com/kf/Ufa2f9a5ccd7b4de392b01e1618f28635g.png