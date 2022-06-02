---
layout: post
title: 配置 DNS 自动发现服务实现局域网内 Windows/Office 无干预自动激活
date: 2020-02-27 17:28:00
updated: 2020-02-29 17:32:33
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - windows
  - Office
---


背景
--

此前介绍过《[如何使用 U 盘安装并激活正版微软 Win7/Win10 等操作系统和 Office](https://www.xtboke.cn/303.html)》和《[KMS 激活 Windows/Office 原理及搭建方法](https://www.xtboke.cn/224.html)》，已经相对较好地解决了系统激活问题，但是还存在一个问题就是，对于不熟悉命令行的人来说，记住几行激活命令难度有点大，特别是需要激活的电脑特别多时，很劳心费力，所以思考如何让系统或 Office 安装后可以自动激活。

方案
--

### 思路

在配置 KMS 时，微软有提到可以[配置 DNS SRV 记录](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/dn502531(v%3Dws.11))，让系统或 Office 可以自动找到 KMS 服务器，并进行激活。

在这里有个坑，对于常接触域名管理的人来说，很容易将此 DNS 理解为域名 DNS（管理），所以会到域名解析里添加了一堆 SRV 记录，结果发现怎么配置都无法让系统识别到。这是因为系统根本就不会去找你域名的解析，实际上这里的 DNS 是指**给你电脑提供解析服务的 DNS**，例如 114.114.114.114、8.8.8.8 等等，而在域名解析里修改 SRV 记录**不会作用**到本地通过 DNS 查找记录。

找到问题的根源了那么解决方法就很简单了，**就是给本地局域网提供解析服务的内网 DNS 添加 SRV 记录（外网估计是不行的）**，这个 DNS 可以是路由器（基于 OpenWRT）提供，也可以自己电脑搭建一个，DNSmasq、Bind、windows server 等等软件系统都可以实现。

### 方法

以 DNSmasq 为例，一般基于 OpenWRT 的路由都会默认安装好，Linux 系统也可以直接安装：

    # CentOS
    yum install dnsmasq -y
    # Ubuntu
    apt install dnsmasq -y

其他配置不多说，主要说下配置 SRV，在 DNSmasq 配置文件 `/etc/dnsmasq.conf`（默认）或 `/etc/dnsmasq.d/`目录下新建文件直接添加一行：

    srv-host=_vlmcs._tcp.lan,192.168.1.1,1688,0,100

然后重启 DNSmasq 使配置生效即可。

**SRV 记录格式说明**

    srv-host=_vlmcs._tcp.lan,192.168.1.1,1688,0,100

`srv-host=`\_vlmcs`.`\_tcp.域名`,`KMS 服务器地址`,`KMS 端口`,`优先度`,`权重

其中：

*   **srv-host** 是 DNSmasq SRV 记录的固定参数；
*   **\_vlmcs** 是 KMS 固定的服务名，不能改；
*   **\_tcp** 是值走的 TCP 协议，不能改；
*   **.域名** 可选配置，一般为方便解析管理会添加上域名，如 `.lan` 或 `.vircloud.net` 等等；
*   **KMS 服务器地址** 和 **KMS 端口** 是指提供激活服务的 KMS 地址和端口，对于路由器来说一般就是网关地址 `192.168.1.1` 和 `1688` 了；
*   **优先级** 在有多个记录时使用，值越小，优先级越高；
*   **权重** 在有多个记录时使用，权重数值越高，优先级越高。

### 验证

在客户端验证一下解析结果：

    [d:\~]$ nslookup -type=srv _vlmcs._tcp.vircloud.net
    服务器:  vircloud.net
    Address:  192.168.100.1
    
    _vlmcs._tcp.vircloud.net    SRV service location:
          priority       = 0
          weight         = 100
          port           = 1688
          svr hostname   = kms.vircloud.net
    kms.vircloud.net    internet address = 192.168.100.1
    

再验证一下激活效果（Windows 或 Office 会自动进行，限安装的版本为 VL 批量激活版）：

    [C:\Program Files\Microsoft Office\Office16]$ cscript ospp.vbs /act
    Microsoft (R) Windows Script Host Version 5.812
    版权所有(C) Microsoft Corporation。保留所有权利。
    
    ---Processing--------------------------
    ---------------------------------------
    Installed product key detected - attempting to activate the following product:
    SKU ID: 
    LICENSE NAME: Office 16, Office16ProPlusVL_KMS_Client edition
    LICENSE DESCRIPTION: Office 16, VOLUME_KMSCLIENT channel
    Last 5 characters of installed product key: WFG99
    <Product activation successful>
    ---------------------------------------
    ---------------------------------------
    ---Exiting-----------------------------
    
    [C:\Program Files\Microsoft Office\Office16]$ cscript ospp.vbs /dstatus
    Microsoft (R) Windows Script Host Version 5.812
    版权所有(C) Microsoft Corporation。保留所有权利。
    
    ---Processing--------------------------
    ---------------------------------------
    PRODUCT ID: 
    SKU ID: 
    LICENSE NAME: Office 16, Office16ProPlusVL_KMS_Client edition
    LICENSE DESCRIPTION: Office 16, VOLUME_KMSCLIENT channel
    BETA EXPIRATION: 1601/1/1
    LICENSE STATUS:  ---LICENSED--- 
    REMAINING GRACE: 180 days  (259200 minute(s) before expiring)
    Last 5 characters of installed product key: WFG99
    Activation Type Configuration: ALL
        KMS machine name from DNS: kms.vircloud.net:1688
        Activation Interval: 120 minutes
        Renewal Interval: 10080 minutes
        KMS host caching: Enabled
    ---------------------------------------
    ---------------------------------------
    ---Exiting-----------------------------
    
    [C:\Program Files\Microsoft Office\Office16]$ slmgr /ato
    
    正在激活 Windows(R), EnterpriseS edition
    (*-*-*-*-*)...
    成功地激活了产品
    
    [C:\Program Files\Microsoft Office\Office16]$ slmgr /dlv
    
    软件授权服务器版本：10.0.17763.1039
    
    名称: Windows(R), Enterprises edition
    描述: Windows(R) Operating System, VOLUME-KMSCLIENT channel 
    激活 ID: *-*-*-*-*
    应用程序 ID: *-*-*-*-* 
    扩展 PID： *-*-*-*-*-*-*-*
    产品密钥通道: Volume:GVLK
    安装 ID： *
    部分产品密钥: J462D 
    许可证状态: 已授权
    批量激活过期: 259197 分钟(180天）
    剩余 Windows 重置计数: 1001 
    剩余 SKU 重置计数: 1001 
    信任时间:2020/2/27 11:48:43 
    已配置的激活类型：全部
    
    最新激活信息
    密钥管理服务客户端信息
        客户端计算机 ID (CMID): *-*-*-*-*
        来自 DNS 的 KMS 计算机名称: kms.vircloud.net:1688
        KMS 计算机 IP 地址: 192.168.100.1
        KMS 计算扩展的 PID: *-*-*-*-*-*-*.*-*
        激活时间间隔: 120 分钟 
        续订间隔：10080 分钟
        已启用 KMS 主机缓存
    

可以看到 Office 和 WIndows 都识别到了 DNS 配置的自动发现服务：**KMS machine name from DNS: kms.vircloud.net:1688** 和 **来自 DNS 的 KMS 计算机名称: kms.vircloud.net:1688**

问答
--

问：激活时出现 `错误: 0xC004F069 在运行 Microsoft Windows 非核心版本的计算机上，运行”slui.exe 0x2a 0xC004F069″以显示错误文本。`错误。  
答：系统关键文件或配置被修改了，可以试试如下方法：

\-- 仅支持 VL 版本激活；

\--- 以管理员身份打开命令行窗口，执行 `slmgr.vbs -rearm` 然后重启；

\---- 上述处理后问题还是存在，则执行：  
\---- 打开“注册表编辑器”，定位到 `HKEY_LOCAL_MACHINE/SOFTWARE/Microsoft/Windows NT/CurrentVersion/SoftwareProtectionPlatform`，将 `SkipRearm` 的十六进制值修改为 `1`，然后重启；