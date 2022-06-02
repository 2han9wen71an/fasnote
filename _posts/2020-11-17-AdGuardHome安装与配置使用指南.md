---
layout: post
title: AdGuardHome安装与配置使用指南
date: 2020-11-17 15:10:00
updated: 2020-11-17 15:13:34
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - AdGuardHome
---


目录
--------------------

- [安装与简介](#%E5%AE%89%E8%A3%85%E4%B8%8E%E7%AE%80%E4%BB%8B "安装与简介")
  - [官方Github仓库](#%E5%AE%98%E6%96%B9Github%E4%BB%93%E5%BA%93 "官方Github仓库")
  - [官方ADH介绍文档](#%E5%AE%98%E6%96%B9ADH%E4%BB%8B%E7%BB%8D%E6%96%87%E6%A1%A3 "官方ADH介绍文档")
  - [官方一键脚本](#%E5%AE%98%E6%96%B9%E4%B8%80%E9%94%AE%E8%84%9A%E6%9C%AC "官方一键脚本")
  - [安装备注](#%E5%AE%89%E8%A3%85%E5%A4%87%E6%B3%A8 "安装备注")
- [配置与设置参考](#%E9%85%8D%E7%BD%AE%E4%B8%8E%E8%AE%BE%E7%BD%AE%E5%8F%82%E8%80%83 "配置与设置参考")
  - [常规设置](#%E5%B8%B8%E8%A7%84%E8%AE%BE%E7%BD%AE "常规设置")
  - [DNS设置](#DNS%E8%AE%BE%E7%BD%AE "DNS设置")
  - [加密设置](#%E5%8A%A0%E5%AF%86%E8%AE%BE%E7%BD%AE "加密设置")
  - [客户端设置/DHCP 设置](#%E5%AE%A2%E6%88%B7%E7%AB%AF%E8%AE%BE%E7%BD%AE/DHCP_%E8%AE%BE%E7%BD%AE "客户端设置/DHCP 设置")
- [过滤器](#%E8%BF%87%E6%BB%A4%E5%99%A8 "过滤器")
  - [DNS封锁清单](#DNS%E5%B0%81%E9%94%81%E6%B8%85%E5%8D%95 "DNS封锁清单")
  - [DNS允许清单](#DNS%E5%85%81%E8%AE%B8%E6%B8%85%E5%8D%95 "DNS允许清单")
  - [DNS 重写](#DNS_%E9%87%8D%E5%86%99 "DNS 重写")
  - [已阻止的服务](#%E5%B7%B2%E9%98%BB%E6%AD%A2%E7%9A%84%E6%9C%8D%E5%8A%A1 "已阻止的服务")
  - [自定义过滤规则](#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%BF%87%E6%BB%A4%E8%A7%84%E5%88%99 "自定义过滤规则")
- [其他Tips](#%E5%85%B6%E4%BB%96Tips "其他Tips")

# 安装与简介

## 官方Github仓库

https://github.com/AdguardTeam/AdGuardHome

## 官方ADH介绍文档

https://adguard.com/zh\_cn/adguard-home/overview.html

## 官方一键脚本

```
curl -sSL https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh
```

## 安装备注

推荐安装在延迟低的机器上（常态使用推荐本地，亚太，海外VPS的话越近越好）开放端口建议为53（常规DNS\)，853（DoT），任意一个未使用端口（DoH）

# 配置与设置参考

## 常规设置

![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115105840.png)![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115105850.png)

## DNS设置

![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115110322.png)![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115110331.png)![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115110338.png)![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115110347.png)![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115110355.png)官方提供的常用DNS列表https://kb.adguard.com/general/dns-providers海外机推荐使用谷歌，阿里，DNSPOD（腾讯），CloudFlare 四家DNS国内机推荐使用114，阿里，DNSPOD（腾讯） 三家DNSEDNS（DNS-ECS）技术常用的支持者是腾讯系DNSPOD和谷歌的DNSGOOGLE其他包括阿里，114，Cloudflare等等DNS均不支持/有残缺EDNS技术可以更加精准的解析并分配最快IP，对于改善使用CDN的网站有极大帮助另外EDNS技术会记录使用者IP，原则上不建议使用DNSPOD等国内厂商CloudFlare因为EDNS会记录IP，但是打着隐私旗号只好不支持如果使用不支持EDNS的DNS，可能造成随机解析比如把香港的请求分配给美国而不是亚太地区，导致延迟和网络连接性增加 

Bootstrap DNS 服务器使用速度快的即可（看Ping）EDNS，DNSSEC建议开启，IPV6看个人，禁用可以有效阻挡部分DNS攻击和错误解析拦截模式默认即可

## 加密设置

![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115110436.png)HTTPS随意端口即可（不要用443等被用过的）TLS建议853，否则可能用不了域名看你自己QUIC基本用不上证书自己申请【安卓使用DoT：在设置中找到私人DNS选项，输入你的DNS域名即可】

## 客户端设置/DHCP 设置

一般无须使用，客户端就是根据IP标记罢了

# 过滤器

## DNS封锁清单

官方提供的足够使用了，也可以自行搜索国人提供的清单，也可以自己编写自己写的话路径参考：/www/wwwroot/XXX.xyz/rules.txt

## DNS允许清单

部分网站可能存在于拦截表，但是你有用时候使用比如各种广告和分析网站

## DNS 重写

类似Host

## 已阻止的服务

一键拦截定向业务，一般人不会用

## 自定义过滤规则

高优先级，跟封锁清单效果一致，可以快速拦截

# 其他Tips

LinuxDNS设置（DNS over 53 port）![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115111103.png)WinDNS设置（DNS over 53 port）![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115111158.png)安卓/Win等平台Chrome DNS设置（DoH）![](https://cdn.000714.xyz/Skyimg/blog2020/master/11/QQ%E5%9B%BE%E7%89%8720201115111925.png)安卓类似道理注意：安卓Chrome优先级大于V2NG和系统（应该），WinChrome优先级小于系统DNS和Netch，其他环境未测试