---
layout: post
title: "Polarion-Arm-环境修复"
description: "修复 Polarion 在 Arm 环境下 JNA 和 Node 的兼容性问题"
date: 2025-06-21 11:20:39 +0800
categories: 折腾笔记
permalink: /Toss-notes/polarion-arm-fix.html
tags: [Polarion,Arm]
---
# 前言

最近换了一台 Mac Mini 用来办公，主要工作是 Polarion 的开发，需要在本地安装开发环境。

## 背景
一开始使用 Parallels Desktop 虚拟机安装 Windows 进行开发，但是 ARM64 转译性能比较低，每次启动就要 50 秒以上。

考虑到 Polarion ALM 本质上是一个 Java 应用，可以运行在 Linux 上，于是尝试在 macOS 上直接安装开发环境。虽然 Polarion 官方文档只提供了 Windows 和 Linux 的安装包，没有提供 macOS 的安装包，但由于 macOS 和 Linux 都是类 Unix 系统，理论上应该可以兼容运行。

## 解决思路
最终采用 Docker 容器的方式安装 Polarion，然后将目录数据挂载到宿主机进行开发。这种方案将启动速度优化到 10 秒以内，效率提升了 5 倍。

## 目录
- [Node.js 兼容性问题](#nodejs-兼容性问题)
- [JNA 问题修复](#jna-问题修复)
- [一键脚本](#一键脚本)
# 问题描述与解决方案

## Node.js 兼容性问题

### 问题现象
在 ARM64 环境下运行 Polarion 时，遇到了 Node.js 兼容性问题：

```bash
2025-06-20 12:57:56,179 [Thread-118] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says: /opt/polarion/polarion/plugins/com.polarion.alm.ui_3.22.1/node/bin/node: cannot execute binary file
2025-06-20 12:57:56,179 [Thread-119] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer has terminated for some reason. Exit code = 126
```

### 问题分析
这是因为 Polarion 内置的 Node.js 是为 x86_64 架构编译的，无法在 ARM64 环境下运行。

### 解决方案

#### 步骤1：替换 Node.js 二进制文件
1. 在 Polarion 安装目录下找到 `plugins/com.polarion.alm.ui_3.22.1/node/` 文件夹
2. 备份原有的 Node.js 文件
3. 下载 ARM64 架构的 Node.js 版本进行替换

**版本选择说明：**
- Polarion 21R2 版本内置的是 Node.js 10.15.0
- Node.js 16.0.0+ 开始正式支持 Apple Silicon (ARM64)
- 推荐使用 Node.js 18.x 版本以获得更好的兼容性

#### 步骤2：处理依赖文件缺失问题
替换 Node.js 后重启 Polarion，可能会遇到新的错误：
```bash
ERROR: Cannot find module '/opt/polarion/polarion/plugins/com.polarion.alm.ui_3.22.1/node/bin/highcharts-convert-8.0.3.js'
ERROR: Cannot find module '/opt/polarion/polarion/plugins/com.polarion.alm.ui_3.22.1/node/bin/mj-formula-convert.js'
```

**问题原因：** 替换 Node.js 时丢失了 Polarion 需要的特定 JavaScript 文件。

**解决方法：**
1. 从备份目录恢复丢失的 JavaScript 文件：
   - `highcharts-convert-8.0.3.js`
   - `mj-formula-convert.js`
2. 恢复 `node_modules` 目录
3. 重启 Polarion 验证修复效果

## JNA 问题修复

### 问题背景
Polarion 的 PureVariant 插件使用了 JNA (Java Native Access) 进行本地调用，但引入的 JNA 版本较低，不支持 ARM64 架构。

根据 [JNA 官方仓库](https://github.com/java-native-access/jna) 的信息，ARM64 支持最低需要 JNA 5.7.0 版本。

### 错误现象
```java
Caused by: com.google.inject.ConfigurationException: Guice configuration errors:
1) No implementation for com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider was bound.
   while locating com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider
```

**核心错误：** PureVariant 插件的 JNA 依赖不支持 ARM64 架构。

### 解决方案

#### 步骤1：下载兼容的 JNA 版本
1. 从 [Maven 中央仓库](https://mvnrepository.com/artifact/net.java.dev.jna/jna) 下载 JNA 5.7.0+ 版本
2. 确保下载的版本包含 ARM64 支持

#### 步骤2：替换 JNA 库文件
1. 备份原有的 JNA jar 文件
2. 将新版本的 JNA jar 文件替换到 Polarion 的 lib 目录
3. 重启 Polarion 服务进行验证

# 一键修复脚本

为了方便其他遇到相同问题的开发者，我编写了一键修复脚本。

## 环境要求
- **适用版本：** Polarion ALM 21R2
- **适用架构：** ARM64 (Apple Silicon)
- **操作系统：** macOS

## 使用方法

### 1. 克隆仓库
```bash
git clone https://github.com/2han9wen71an/Polarion_Arm64_Compatibility.git
cd Polarion_Arm64_Compatibility
```

### 2. 设置执行权限
```bash
chmod +x main.sh
chmod +x node/fix_nodejs_arm64.sh
chmod +x jna/fix_jna_arm64.sh
```

### 3. 执行修复脚本
```bash
# 修复所有问题（Node.js + JNA）
./main.sh all /opt/polarion

# 或者单独修复
./main.sh node /opt/polarion    # 仅修复 Node.js 问题
./main.sh jna /opt/polarion     # 仅修复 JNA 问题
```

## 注意事项
- 执行前请备份 Polarion 安装目录
- 确保 Polarion 服务已停止
- 脚本执行完成后需要重启 Polarion 服务

**仓库地址：** [Polarion_Arm64_Compatibility](https://github.com/2han9wen71an/Polarion_Arm64_Compatibility)
