---
layout: post
title: 利用 Telegram 收发微信 ——EFB
date: 2019-12-21 11:47:00
updated: 2019-12-21 11:52:45
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - Android
  - Telegram
---


### 1.简介

EH Forwarder Bot（EFB） 是一个可扩展的开源聊天平台隧道 Bot 框架，目前支持在 Telegram 上收发微信、QQ、Facebook Message 信息，支持文字、语音、图片、视频、表情互通，虽有一些功能限制但可用性良好

简单来说，收发原理是：  
**Telegram bot > EFB > 微信网页版 > 微信**  
TG与微信之间并无联系，但使用了 _TG机器人_，_EFB项目_，_微信网页版_，即可实现互通

* * *

以前使用Gcmformojo也是利用微信网页版，但是作者自建第三方APP，优化较差，总是会出现消息无法发送、消息接受延迟，遗漏消息等问题，还需要挂小飞机才行，所以慢慢放弃使用，转向利用TG的EFB

#### 1.1关于TG bot

Telegram Bot是基于Telegram客户端的第三方程序。用户可以通过向Bot发送信息、照片、指令、在线请求等一系列的方式于Bot互动。Bot的所有者通过Bot 的API（Application Programming Interface）访问并请求Telegram Server的信息。可以将Bot理解为一个更加智能的可以接受指令并可以爬取网络信息的微信公众号（或者类比于UI设计没那么好的微信小程序）。

Telegram可以实现诸多实用的功能，包括但不限于：

获取个性化的新闻  
与其它服务结合（收发Gmail邮件，获取Facebook推送， 接受微信消息， 下载 Youtube视频）  
创建在线的商店，发布售卖的物品并进行在线支付  
创建多人游戏（狼人Bot，阿瓦隆Bot）

> ——来源：知乎 [@程序员之路](https://zhuanlan.zhihu.com/yonghao)，[原文链接戳此](https://zhuanlan.zhihu.com/p/30450761)

* * *

你可以把Telegram bot理解为QQ群中某些机器人，在群聊中他能实现入群审核、自动回复等，在TG中也是一样的，通过开发者，bot能实现的功能丰富多样，我们的EFB也是利用bot做到多平台间消息同步。  
使用bot并不复杂，由于大量的代码已由作者完善并发布在[Github：ehForwarderBot](https://github.com/blueset/ehForwarderBot)，我们只需在TG软件中创建bot并记录相关的API token等私密信息，再由我们的服务器连接bot就可以使用了

#### 1.2关于微信网页版

由于手机APP及PC桌面版的大量使用，现在已经很少有人使用网页版了  
本项目需要调用微信网页版，**警告如下！警告如下！警告如下！（重要的事说三遍！）**

**微信会对使用第三方客户端登录微信网页版的用户实行封禁，就是无法再使用网页版登录网页版微信！根据经验微信账号较老的用户封禁率似乎不高。**

PS：我的微信号大概是2013年创建的，目前使用EFB近两年无封禁

### 2.能实现的功能及优点

综合考虑微信的功能，对比EFB项目，其功能及优缺点如下：

#### 2.1功能

1.**文字消息的收发**  
2.**图片的收发**  
3.**视频的读取（从tg发视频，对方收到的是文件）**  
4.**语音的接收（从tg发语音，对方收到的是文件）**  
5.**tg表情包支持（tg有很多丰富的静态表情包资源，发到微信客户端上正常显示，但是TG里的动态表情微信无法支持）**，另外注意不要发送涉黄、政治敏感的表情包，避免被微信屏蔽或封禁  
6.**传送文件**  
7.**对方发来的定位信息能显示具体的地址和地图简略信息，但无法打开地图界面**  
8.**公众号信息也能推送，而且TG自带应用内浏览器，也能方便的查看公众号推送的文章**

#### 2.2优点：

1.**消息云同步，文字，语音，图片，视频，发送的链接，文件都可以保存在tg云端**  
2.**消息几乎无延迟，对比Gcmformojo，tg发消息很快，没有卡顿，就像你正常聊tg一样，也几乎没有消息发送失败的情况**  
3.**耗电，明显优于微信毒瘤。tg自带gcm，如果你需要，可以不留tg后台，由gcm拉起通知**  
4.**无需挂梯，以往Gcmformojo有的地区需要挂飞机才能收发，而tg自带一个代理功能，能够正常使用TG即可通过其代理收发微信**  
5.**TG支持的消息功能，将会“镜像”的同步于微信，比如最近TG刚更新的延迟、定时发送消息的功能**

#### 2.3缺点：

1.语音通话、视频通话不支持，原因比较简单，微信利用自身APP实现，当然不能放到TG上实现，但是TG会发送一段文字，如：

> 微信团队: (不支持)

\[Unsupported message, please check your phone.\]

接收到这样的信息请及时打开手机微信查看是否有通话消息，有时还是会遗漏语音通话消息的

2.默认所有消息会通过你创建的TG bot发送给你，也就是你的好友A,B,C的消息都通过一个聊天窗口发送给你，刚开始会比较乱，但是通过TG的群组功能，可实现消息分流，但需要你手动创建群组A，群组B，群组C来分流消息

_\__  
那么，教程开始：

### 3.准备工作

1.一台能访问国外网站的VPS服务器，即要连通Telegram（我目前在用Vultr，相对比较便宜了，目前支持 支付宝、微信直接充值，如果有需要的可以用我的推广链注册：**[https://www.vultr.com/?ref=7262396](https://www.vultr.com/?ref=7262396)**）（它是为了吸引用户，通过分享注册链的方式，如果你用我的链注册并充值10刀，使用30天以上我会收到10刀，算是对我的支持吧~）  
（还有这个注册链：**[https://www.vultr.com/?ref=7927355-4F](https://www.vultr.com/?ref=7927355-4F)**，如果你充值25刀，使用30天，它会送你50刀，我也获得25刀）

2.手机搭建需要Juice ssh，这款软件，链接: [https://pan.baidu.com/s/1bCGWe6](https://pan.baidu.com/s/1bCGWe6) 密码: sm1p  
（手机端的设置具体参考我另外一篇教程靠前部分：链接: [https://pan.baidu.com/s/1E2BvTKdGej0lSlkEwNHO\_g](https://pan.baidu.com/s/1E2BvTKdGej0lSlkEwNHO_g) 提取码: xhg2）

3.windows搭建需要xshell，请自行上网搜索

4.Telegram，主体软件。play商店或去apkpure搜索下载

5.系统使用Ubuntu 18.04 x64

### 4.主体教程

采用[小众软件 青小蛙](https://www.appinn.com/author/qingwa/)的教程：  
[EFB V2 简明安装教程](https://www.appinn.com/efbv2-docker-tutorial/)

由于青小蛙的机器人配置阶段不太完整，综合整理网上配置教程，综合融入到我这篇教程中

#### 4.1配置TG机器人阶段

##### 4.1.1获取 Bot Token

1.在 Telegram 里, 对 @botfather 说话: /newbot  
2.按照要求给 Bot 取名  
3.获取 Bot Token安全原因: Token 必须保密（这串token要记好，**待会要用**）  
4.允许 Bot 读取非指令信息，对 @botfather 说话: /setprivacy, 选择disable  
5.允许将 Bot 添加进群组，对 @botfather 说话: /setjoingroups, 选择enable  
6.允许 Bot 提供指令列表，对 @botfather 说话: /setcommands, 输入以下内容

    help - 显示命令列表.
    link - 将远程会话绑定到 Telegram 群组
    chat - 生成会话头
    recog - 回复语音消息以进行识别
    info - 显示当前 Telegram 聊天的信息.
    unlink_all - 将所有远程会话从 Telegram 群组解绑.
    update_info - 更新群组名称和头像
    extra - 获取更多功能

(复制以上内容一次性发给botfather)

见图：  
!\[1687219337.jpg\]\[1\]

##### 4.1.2获取 Telegram 账户 ID

再和另外一个机器人 @get\_id\_bot 对话（也是搜索得到这个机器人），点击 start 即可获得你的 Telegram ID，一串数字（Chat ID）。

至此，Telegram 的配置完成，我们得到两个重要的数字：token、Telegram ID（**待会要用**）

#### 4.2VPS搭建阶段

鉴于每个人的系统环境不同，无论多么详尽的安装教程都会产生各种各样的问题，而这些问题绝大多数都与 EFB 无关，更多的是系统环境配置问题，所以本着多一事不如少一事的原则，这里使用 docker 安装。而 Docker 能够有效避免不同用户系统环境不同导致的问题。

目前的 Ubuntu 18.04+ 版本更推荐使用 apt 安装，简单快捷：

##### 4.2.1基础环境配置

    apt update
    apt install docker.io
    curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

一行一行复制粘贴，即可完成安装

##### 4.2.2配置 EFB V2

首先创建一个文件夹，这里以 efbv2 为例。  
青小蛙在这里给出了整个efbv2文件夹的目录结构，**注意这并不是代码块**：

├── blueset.telegram  
│ ├── config.yaml  
│ └── tgdata.db \*  
├── blueset.wechat \*  
│ ├── wxpy.pkl \*  
│ └── wxpy\_puid.pkl \*  
├── config.yaml  
└── docker-compose.yml \*\*

标记 _号为自动生成的路径和文件，可以不用管它，_\* 可见最后。

也就是说整个目录里我们需要新建文件进行编辑的只有：  
文件夹：  
1.efbv2  
2.blueset.telegram(1的子目录)  
文件：  
1.config.yaml（efbv2下）  
2.config.yaml（blueset.telegram下）  
其他在运行efb后会自动生成，`mkdir`是新建文件夹语法，`touch`是新建文件，`vim`是编辑文件，编辑文件按i，保存文件用ESC退出编辑模式后:wq

* * *

所以，当你使用xshell或juice ssh连接到你的ubuntu服务器后，在根目录下：

    mkdir efbv2

这样你就在根目录下创建了一个叫efbv2的文件夹  
接下来，使用

    cd efbv2

进入到efbv2这个文件夹中

    touch config.yaml

创建了一个config.yaml的文件

    vim config.yaml

进入编辑器，复制粘贴以下内容：

    master_channel: blueset.telegram
    slave_channels:
    - blueset.wechat
    middlewares:
    - catbaron.sticker2img
    - filter.FilterMiddleware

粘贴完毕后，按ESC键，输入

    :wq

保存该文件

* * *

接下来我们需要创建blueset.telegram文件夹及创建config.yaml文件了，同样，在efbv2这个文件夹下（目前已经在了）

    mkdir blueset.telegram
    touch blueset.telegram/config.yaml

使用cd命令进入blueset.telegram文件夹后使用

    vim config.yaml

复制粘贴并修改以下内容：  
**注意：替换“你的 Telegram User ID”为前面获取到的Telegram ID，替换“Telegram Bot's token”为获取到的token**

    token: "Telegram Bot's token"
    admins:
     - 你的 Telegram User ID

示例如下：

\`token: "ABC1234567890XXXXXXXXXXXX"  
admins:

*   123456789\`

##### 4.2.3运行

由于缀述怎么进入某个目录太繁琐，使用cd命令进入efbv2文件夹后

    touch docker-compose.yml

并用vim命令修改该文件内容

    efbv2:
      image: scavin/docker-efbv2:dev
      container_name: efbv2
      restart: always
      volumes:
        - ./:/root/.ehforwarderbot/profiles/default/ 

同样，ESC，并用“:wq”保存文件后，运行：

    docker-compose up -d

最后，使用下面的命令查看微信登录二维码：

    docker logs efbv2

此时，就会出现二维码了  
（电脑版xshell你可以用微信直接扫，如果你用手机juice ssh，需要缩放界面到很小，二维码才显示得出来，而且你需要截图二维码发到第三方，再用后置摄像头扫，从相册选取会提示版本不够）

#### 5.使用你的EFB机器人

##### 5.1如何分流消息？

efb项目的原理是这样的：  
**Telegram bot > EFB > 微信网页版 > 微信**

所以你搭建成功后，就像前面说的，所有的微信消息都是通过你的机器人发过来 ，消息一多，就很杂乱。  
利用telegram的群组功能，你可以很方便的分流信息：

下面使用一个例子来说明（假设你有一名叫梁AB的好友）  
首先在 Telegram 中创建一个新的群组，就用梁AB这个名字，然后将你的机器人邀请进来，群组创建完毕。

回到你的机器人对话中，将梁AB的微信好友单独作为TG中的聊天对话框，就输入 /link 梁A（不必输全名，机器人会检索含有此关键字的所有好友，然后选择link，选择你刚刚创建的 梁AB 这个群组，成功后，以后这个叫梁AB的好友发来的信息不会在机器人那显示了，而是在这个群组）

我把常聊的几个人单独建了TG群，使消息分流，其余不常用的，使用机器人窗口接收，公众号及群消息也单独建群。

##### 5.2偶尔发现没有消息推送了怎么办？

虽说EFB能保持数月不掉线  
但为延长续航，我用空调狗等APP冻结了微信，但是手机版微信不能长期不上线，有时候手机关机没电太久，也会导致EFB掉线，这时就需要到VPS服务器控制端，手动重启服务器，一般就能重连  
以及尝试再次使用  
docker logs efbv2  
重启EFB  
配合TG机器人里的 /start 命令启动机器人

PS：v2版本我目前只因一次手机关机太久导致掉线

##### 5.3EFB项目TG群在哪里？

中文群组搜索：EFB User's Group加入

##### 5.4 TG代理？

这里提供两个免费的TG群，他们定期发布tg代理直连的信息。这样你就不用挂TI子才能看微信消息了。  
[https://t.me/socks5list](https://t.me/socks5list)

[https://t.me/mtproxyisfree](https://t.me/mtproxyisfree)

或者寻找一些做tg代理推广的群组，机场

_\__  
最后，完结。有什么问题欢迎和我交流，我博客主页有相关联系方式

\[1\]: https://xtboke.cn/upload/2019/12/2960264936.jpg