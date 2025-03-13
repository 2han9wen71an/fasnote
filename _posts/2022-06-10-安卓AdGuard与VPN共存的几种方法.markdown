---
layout: post
title:  "安卓AdGuard与VPN共存的几种方法"
date:   2022-06-10 16:09:06 +0800
categories: 折腾笔记
permalink: /Toss-notes/adguard-vpn-coexist.html
tags: [AdGuard]
status: private
---

## root通用共存（推荐）

* 需要 root 权限
* 对所有 VPN 软件适用
* 可随时关闭 AdGuard 或 VPN 软件

1. 在 AdGuard 的`设置>网络>过滤方式`中选择`本地 HTTP 代理`并开启`自动（需要根权限）`注意：如果弹出 root 授权窗口请点击确认。

![修改代理方式]({{ site.url }}/assets/images/post/IMG_20200812_024952_hu865b9c78a8.png)

2. 在 AdGuard 内的`应用管理>你的VPN软件名字`找到`通过 AdGuard 路由应用流量。`并将其关闭。

![关闭对vpn软件的代理* ]({{ site.url }}/assets/images/post/IMG_20200812_025412_hu4750d675e8.png)

3. 打开你的 VPN 软件即可。

## 通过 AdGuard 转发网络流量至代理（无需ROOT权限）

* 无需 root 权限
* 需要代理软件支持在不开启VPN的情况下开启本地 socks4/5 或 http 代理

1. 在 AdGuard 内的`应用管理>你的VPN软件名字`找到`通过 AdGuard 路由应用流量。`并将其关闭。

![关闭对vpn软件的代理]({{ site.url }}/assets/images/post/IMG_20200812_030452_hu550e4bf9f4.png)

2. 将代理软件设置为仅代理模式（在Clash中为关闭`自动路由系统流量`）

![设置为仅代理]({{ site.url }}/assets/images/post/IMG_20200812_030636_hu817a570636.png)

3. 在 AdGuard 的`设置>网络>代理`中添加代理，`代理主机`统一为 127.0.0.1

| 软件名           | 默认协议 | 默认代理端口 |
| ---------------- | -------- | ------------ |
| Shadowsocks      | SOCKS5   | 1080         |
| ShadowsocksRb    | SOCKS5   | 1080         |
| Clash            | SOCKS5   | 7891         |
| V2RayNG (1.4.0+) | SOCKS5   | 10808        |
| SagerNet         | SOCKS5   | 2080         |

> 注意:
>
> 1. Clash的实际端口以配置文件为准，这里的7891只是用的比较多的端口，2.1.1版本后可在覆写设置内修改端口
> 2. V2RayNG在1.4.0之后才支持仅代理模式请注意版本
> 3. SSR用户请使用支持仅代理模式的[shadowsocksRb](https://github.com/shadowsocksRb/shadowsocksRb-android)
     、[Clash](https://github.com/Kr328/ClashForAndroid)或[SagerNet](https://github.com/SagerNet/SagerNet)

![添加代理]({{ site.url }}/assets/images/post/IMG_20200812_031129_hubb415e3a3c.png)

> 注意:
>
> 1. AdGuard内的`检查连接`功能并不能作为判断代理是否工作的依据，请使用浏览器打开对应网页（如：谷歌搜索、维基百科）进行测试
> 2. 如果遇到谷歌全家桶不走代理的情况，请在AdGuard的应用管理将对应软件的`通过AdGuard路由应用流量`选项打开

4. 使用无污染的DNS，防止因DNS污染导致无法正常访问网站

* 可以在AdGuard内的`设置`\>`DNS`\>`选择DNS服务器`\>`添加自定义DNS服务器`中填写解析结果没有被污染的DNS服务器，也可以在AdGuard内的`设置`\>`DNS`\>`选择DNS服务器`
  \>`推荐的DNS提供商`中进行选择（当然这些DNS服务器均架设在境外，在中国大陆使用速度不佳）

* 如果你使用的是`Clash`，那么可以在Clash中的`设置`\>`覆写`（需要Clash版本2.1.1+）中启用内置的DNS服务器。

![Clash启用内置DNS服务器]({{ site.url }}/assets/images/post/Screenshot_20210726013320_hudd13.png)

然后在AdGuard内的`设置`\>`DNS`\>`选择DNS服务器`\>`添加自定义DNS服务器`中填写Clash的内置DNS服务器。

![填写Clash内置DNS服务器]({{ site.url }}/assets/images/post/Screenshot_20210726013402_huc40c.png)

转自:<https://www.adgk.net/posts/52/>