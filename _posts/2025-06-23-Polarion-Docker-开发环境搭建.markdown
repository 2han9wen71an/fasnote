---
layout: post
title:  "Polarion-Docker-开发环境搭建"
description: "使用 Docker 部署 Polarion 不同版本进行开发，支持多架构和版本切换"
date:   2025-06-23 13:49:45 +0800
categories: 代码笔记 折腾笔记 生活随笔
permalink: /Toss-notes/polarion-docker-dev.html
tags: [polarion,docker,dev,多版本,开发环境]
---

# 目录
- [前言](#前言)
- [前置要求](#前置要求)
- [系统要求](#系统要求)
- [Polarion Dockerfile](#polarion-dockerfile)
- [Polarion 启动脚本](#polarion-启动脚本)
- [开发环境设置](#开发环境设置)
- [使用说明](#使用说明)
- [配置参数详解](#配置参数详解)
- [故障排除](#故障排除)

- [版本兼容性](#版本兼容性)

# 前言

在之前的文章《[Polarion-Arm-环境修复](/Toss-notes/polarion-arm-fix.html)》中，我们解决了 Polarion 在 ARM 环境下的兼容性问题。本文将进一步介绍如何使用 Docker 搭建完整的 Polarion 开发环境。

作为 Polarion 开发者，经常需要在不同版本之间切换进行测试和开发。由于 Polarion 不支持多版本共存，传统的安装方式会带来很多不便。本文介绍的 Docker 方案可以：

- ✅ 支持多个 Polarion 版本并存
- ✅ 快速切换开发环境
- ✅ 支持 x86_64 和 ARM64 多架构
- ✅ 隔离环境，避免版本冲突
- ✅ 便于团队协作和环境复制

# 前置要求

在开始之前，请确保您的系统已安装以下工具：

## 必需软件
- **Docker Desktop** 20.10.0+ 或 **Docker Engine** 20.10.0+
- **Git** 2.0+
- **Bash** 4.0+ (macOS/Linux) 或 **PowerShell** 5.0+ (Windows)

## 安装验证
```bash
# 验证 Docker 安装
docker --version
docker-compose --version

# 验证 Git 安装
git --version
```

## 权限要求
- Docker 运行权限（Linux 用户需要加入 docker 组）
- 文件系统读写权限
- 网络访问权限（用于下载依赖）

# 系统要求

## 硬件要求
- **CPU**: 4 核心以上（推荐 8 核心）
- **内存**: 8GB 以上（推荐 16GB）
- **磁盘空间**: 20GB 以上可用空间
- **网络**: 稳定的互联网连接

## 支持的操作系统
- **Linux**: Ubuntu 18.04+, CentOS 7+, RHEL 7+
- **macOS**: 10.15+ (支持 Intel 和 Apple Silicon)
- **Windows**: Windows 10/11 with WSL2

## 架构支持
- **x86_64** (AMD64)
- **ARM64** (Apple Silicon, ARM 服务器)

> **注意**: ARM64 环境可能需要额外的兼容性修复，详见《[Polarion-Arm-环境修复](/Toss-notes/polarion-arm-fix.html)》。

## Polarion Dockerfile
以下是完整的 Dockerfile，支持多架构构建和动态版本选择：

```dockerfile
# 多架构支持的 Ubuntu 基础镜像
FROM ubuntu:22.04

# 设置构建参数，支持动态版本选择
ARG POLARION_VERSION=""
ARG TARGETARCH
ARG TARGETOS

# 环境变量设置
ENV DEBIAN_FRONTEND=noninteractive
ENV RUNLEVEL=1
ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV TZ=Asia/Shanghai

# 安装基础软件包和时区配置
RUN apt-get -y update && \
    apt-get -y install sudo unzip expect curl wget mc nano iputils-ping net-tools iproute2 gnupg software-properties-common locales file tzdata && \
    locale-gen en_US.UTF-8 && \
    update-locale LANG=en_US.UTF-8 && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /polarion_root

# 复制所有 ZIP 文件和脚本
COPY *.zip ./
COPY pl_starter.sh ./
COPY pl_installer.sh ./
COPY auto_installer.exp ./

# 动态检测和解压 Polarion 安装包
RUN echo "检测 Polarion 安装包..." && \
    # 查找 Polarion ZIP 文件
    if [ -n "$POLARION_VERSION" ]; then \
        echo "查找指定版本: $POLARION_VERSION"; \
        POLARION_ZIP=$(find /polarion_root -name "*${POLARION_VERSION}*linux*.zip" | head -1); \
    fi && \
    # 如果未找到指定版本或未指定版本，查找所有可用版本
    if [ -z "$POLARION_ZIP" ]; then \
        POLARION_ZIP=$(find /polarion_root -name "*Polarion*linux*.zip" -o -name "*polarion*linux*.zip" | sort -V | tail -1); \
    fi && \
    # 检查是否找到安装包
    if [ -z "$POLARION_ZIP" ]; then \
        echo "错误: 未找到任何 Polarion ZIP 安装包"; \
        exit 1; \
    fi && \
    echo "使用安装包: $(basename $POLARION_ZIP)" && \
    # 解压安装包
    echo "解压安装包..." && \
    unzip -q "$POLARION_ZIP" && \
    # 查找解压后的目录
    POLARION_DIR=$(find /polarion_root -maxdepth 1 -type d -name "*Polarion*" | head -1) && \
    if [ -z "$POLARION_DIR" ]; then \
        echo "错误: 解压后未找到 Polarion 目录"; \
        exit 1; \
    fi && \
    echo "Polarion 目录: $POLARION_DIR" && \
    # 标准化目录名
    if [ "$POLARION_DIR" != "/polarion_root/Polarion" ]; then \
        mv "$POLARION_DIR" /polarion_root/Polarion; \
    fi && \
    # 复制安装脚本到正确位置
    cp /polarion_root/pl_installer.sh /polarion_root/Polarion/ && \
    cp /polarion_root/auto_installer.exp /polarion_root/Polarion/ && \
    # 设置执行权限
    chmod +x /polarion_root/pl_starter.sh && \
    chmod +x /polarion_root/Polarion/pl_installer.sh && \
    chmod +x /polarion_root/Polarion/auto_installer.exp && \
    echo "版本检测和准备完成"

# 根据架构安装 OpenJDK 11
RUN echo "当前架构: $TARGETARCH" && \
    if [ "$TARGETARCH" = "amd64" ]; then \
        JDK_ARCH="x64"; \
        JDK_URL="https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.23%2B9/OpenJDK11U-jdk_x64_linux_hotspot_11.0.23_9.tar.gz"; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
        JDK_ARCH="aarch64"; \
        JDK_URL="https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.23%2B9/OpenJDK11U-jdk_aarch64_linux_hotspot_11.0.23_9.tar.gz"; \
    else \
        echo "不支持的架构: $TARGETARCH"; \
        exit 1; \
    fi && \
    echo "下载 JDK for $JDK_ARCH..." && \
    wget --no-check-certificate "$JDK_URL" -O openjdk.tar.gz && \
    mkdir -p /usr/lib/jvm && \
    tar -zxf openjdk.tar.gz -C /usr/lib/jvm && \
    rm openjdk.tar.gz

# 配置 Java 环境
RUN JDK_DIR=$(find /usr/lib/jvm -maxdepth 1 -type d -name "jdk-*" | head -1) && \
    echo "JDK 目录: $JDK_DIR" && \
    update-alternatives --install /usr/bin/java java $JDK_DIR/bin/java 100 && \
    update-alternatives --install /usr/bin/jar jar $JDK_DIR/bin/jar 100 && \
    update-alternatives --install /usr/bin/javac javac $JDK_DIR/bin/javac 100 && \
    update-alternatives --set jar $JDK_DIR/bin/jar && \
    update-alternatives --set javac $JDK_DIR/bin/javac && \
    echo "JAVA_HOME=\"$JDK_DIR\"" >> /etc/environment && \
    echo "JDK_HOME=\"$JDK_DIR\"" >> /etc/environment

# 设置 Java 环境变量
ENV JAVA_HOME=/usr/lib/jvm/jdk-11.0.23+9
ENV JDK_HOME=/usr/lib/jvm/jdk-11.0.23+9

# 动态设置 JAVA_HOME
RUN JDK_DIR=$(find /usr/lib/jvm -maxdepth 1 -type d -name "jdk-*" | head -1) && \
    echo "export JAVA_HOME=$JDK_DIR" >> /etc/bash.bashrc && \
    echo "export JDK_HOME=$JDK_DIR" >> /etc/bash.bashrc && \
    echo "JAVA_HOME and JDK_HOME 已设置为: $JDK_DIR"

# 切换到 Polarion 目录进行安装
WORKDIR /polarion_root/Polarion

# 配置系统服务
RUN printf '#!/bin/sh\nexit 0' > /usr/sbin/policy-rc.d && \
    chmod +x /usr/sbin/policy-rc.d && \
    sed -i "s/^exit 101$/exit 0/" /usr/sbin/policy-rc.d

# 执行 Polarion 安装
RUN ./pl_installer.sh

# 返回根目录
WORKDIR /polarion_root

# 设置 PostgreSQL 路径
ENV PATH="/usr/lib/postgresql/14/bin:${PATH}"

# 设置入口点
ENTRYPOINT ["./pl_starter.sh"]
```

### Dockerfile 功能说明

这个 Dockerfile 实现了以下核心功能：

1. **多架构支持**: 自动检测 x86_64 和 ARM64 架构，下载对应的 JDK 版本
2. **动态版本选择**: 通过 `POLARION_VERSION` 参数指定要安装的 Polarion 版本
3. **自动化安装**: 使用 expect 脚本实现无人值守安装
4. **环境优化**: 预配置时区、语言环境和必要的系统工具

### 相关脚本说明

- **pl_installer.sh**: Polarion 安装脚本，处理安装过程中的交互
- **auto_installer.exp**: Expect 自动化脚本，用于无人值守安装
- **pl_starter.sh**: 容器启动脚本，负责启动相关服务

## Polarion 启动脚本

以下是容器启动时执行的 `pl_starter.sh` 脚本：

```bash
#!/bin/bash

# 设置时区为中国上海
export TZ=Asia/Shanghai
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
echo "Asia/Shanghai" > /etc/timezone

# PostgreSQL 端口配置
POSTGRES_PORT=5434

# 启动 PostgreSQL 服务
sudo -u postgres /usr/lib/postgresql/14/bin/pg_ctl -D /opt/polarion/data/postgres-data -l /opt/polarion/data/postgres-data/log.out -o "-p $POSTGRES_PORT" start

# 启动 Apache 服务
service apache2 start

# Polarion 配置文件路径
FILE="/opt/polarion/etc/polarion.properties"

# 其他配置参数
OTHER_PARAMS=(
    "com.siemens.polarion.rest.enabled=true"
    "com.siemens.polarion.rest.swaggerUi.enabled=true"
    "com.siemens.polarion.rest.cors.allowedOrigins=*"
    "com.polarion.platform.internalPG=polarion:polarion@localhost:$POSTGRES_PORT"
)

# 处理允许的主机列表
if [[ -n "$ALLOWED_HOSTS" ]]; then
    TomcatServiceRequestSafeListedHosts="TomcatService.request.safeListedHosts=$ALLOWED_HOSTS"
elif [[ "$#" -gt 0 ]]; then
    TomcatServiceRequestSafeListedHostsValues=$(printf "%s," "$@")
    TomcatServiceRequestSafeListedHosts="TomcatService.request.safeListedHosts=${TomcatServiceRequestSafeListedHostsValues%,}"
else
    echo "No values provided for TomcatService.request.safeListedHosts. Exiting"
    exit 1
fi

# 合并所有配置参数
PARAMS=(
    "$TomcatServiceRequestSafeListedHosts"
    "${OTHER_PARAMS[@]}"
)

# 移除配置文件末尾标记
sed -i '/^# End property file$/d' "$FILE"

# 添加或更新配置参数的函数
add_or_update_param() {
    local param="$1"
    local param_name=$(echo "$param" | cut -d '=' -f 1)

    if grep -q "^$param_name=" "$FILE"; then
        sed -i "/^$param_name=/c\\$param" "$FILE"
    else
        echo "$param" >> "$FILE"
    fi
}

# 应用所有配置参数
for param in "${PARAMS[@]}"; do
    add_or_update_param "$param"
done
echo "# End property file" >> "$FILE"

echo "Polarion Properties Updated Successfully."

# 默认不自动启动 Polarion 服务，需要手动启动
# service polarion start

# 保持容器运行
wait
tail -f /dev/null
```

### 启动脚本功能说明

这个脚本负责容器启动时的初始化工作：

1. **时区设置**: 配置为中国上海时区
2. **服务启动**: 启动 PostgreSQL 和 Apache 服务
3. **配置更新**: 动态更新 Polarion 配置文件
4. **安全配置**: 设置允许访问的主机列表
5. **REST API**: 启用 REST API 和 Swagger UI
6. **CORS 支持**: 配置跨域访问支持

> **注意**: 脚本默认不自动启动 Polarion 服务，需要手动启动以便进行开发调试。

## 开发环境设置

使用 Docker 构建镜像后，Polarion 文件都在容器内部。为了便于开发，我们需要解决以下问题：

1. **文件同步问题**: 每次修改代码都需要复制文件到容器中
2. **服务管理问题**: 需要进入容器才能重启 Polarion 服务
3. **权限问题**: 容器内外的文件权限不一致

### 解决方案

我们使用 Docker volumes 功能将 Polarion 目录挂载到宿主机，并提供便捷的管理脚本。

**仓库地址**: [Polarion_Docker_Development_Environment](https://github.com/2han9wen71an/Polarion_Docker_Development_Environment)

### 快速开始

```bash
# 克隆开发环境仓库
git clone https://github.com/2han9wen71an/Polarion_Docker_Development_Environment.git
cd Polarion_Docker_Development_Environment

# 设置执行权限
chmod +x setup_polarion_dev_env.sh

# 运行一键配置脚本
./setup_polarion_dev_env.sh
```

### 脚本功能特性

这个一键配置脚本提供以下功能：

- ✅ **完整环境配置**: 自动配置 Docker 开发环境
- ✅ **卷挂载管理**: 自动处理文件挂载和权限问题
- ✅ **PostgreSQL 优化**: 针对数据库的特殊权限要求进行优化
- ✅ **全局别名系统**: 在任何目录都可以使用简短命令
- ✅ **Shell 兼容**: 自动检测 shell 类型并配置别名
- ✅ **工作流指导**: 提供完整的开发工作流程说明

## 使用说明

### 快速开始

#### 1. 运行配置脚本
```bash
# 克隆开发环境仓库
git clone https://github.com/2han9wen71an/Polarion_Docker_Development_Environment.git
cd Polarion_Docker_Development_Environment

# 运行一键配置脚本
./setup_polarion_dev_env.sh
```

#### 2. 重新加载 Shell 配置
```bash
# 根据你的 shell 类型选择
source ~/.zshrc    # 对于 zsh
source ~/.bashrc   # 对于 bash
```

#### 3. 启动服务（推荐使用全局别名）
```bash
# 检查服务状态（可在任何目录执行）
polarion-status

# 启动 PostgreSQL 数据库
postgresql-start

# 启动 Polarion 应用
polarion-start
```

#### 4. 访问 Polarion
打开浏览器访问：http://localhost:8080/polarion

### 脚本功能选项

#### 完整配置
```bash
./setup_polarion_dev_env.sh
```
执行完整的开发环境配置流程：
- 检查 Docker 和镜像
- 清理现有容器
- 配置挂载目录
- 初始化 Polarion 数据
- 修复所有权限问题
- 创建开发容器

#### 仅修复权限
```bash
./setup_polarion_dev_env.sh fix-permissions
```
仅修复现有环境的权限问题，适用于：
- 权限配置出错时
- 升级系统后权限变化
- 手动修改文件后需要重置权限

#### 仅创建全局别名
```bash
./setup_polarion_dev_env.sh create-aliases
```
仅创建全局 shell 别名，适用于：
- 别名丢失或损坏时
- 需要重新配置全局命令时
- 更换 shell 或配置文件时

#### 查看帮助
```bash
./setup_polarion_dev_env.sh help
```

### 全局别名系统

配置完成后，会自动创建全局 shell 别名，让你可以在**任何目录**直接使用简短命令控制容器内的服务：

#### 全局别名列表
- **`polarion-status`** - 检查所有服务状态
- **`polarion-start`** - 启动 Polarion 服务
- **`polarion-stop`** - 停止 Polarion 服务
- **`polarion-restart`** - 重启 Polarion 服务
- **`postgresql-start`** - 启动 PostgreSQL 服务
- **`postgresql-stop`** - 停止 PostgreSQL 服务
- **`polarion-shell`** - 进入容器
- **`polarion-exec`** - 执行容器内命令
- **`polarion-logs`** - 智能日志查看器（支持多种日志类型）

#### 全局别名使用示例
```bash
# 检查服务状态（可在任何目录执行）
polarion-status

# 启动/停止 PostgreSQL
postgresql-start
postgresql-stop

# 启动/停止/重启 Polarion
polarion-start
polarion-stop
polarion-restart

# 进入容器
polarion-shell

# 执行容器内命令
polarion-exec ps aux
polarion-exec tail -f /opt/polarion/data/logs/main/polarion.log

# 查看日志（智能日志查看器）
polarion-logs          # 交互模式，选择日志类型
polarion-logs main     # 查看主日志
polarion-logs error    # 查看错误日志
polarion-logs startup  # 查看启动日志
polarion-logs list     # 列出所有日志文件
```

### 开发工作流程

#### 推荐工作流程（使用全局别名）

1. **启动开发环境**
```bash
./setup_polarion_dev_env.sh
```

2. **重新加载 shell 配置**
```bash
source ~/.zshrc  # 或 source ~/.bashrc
```

3. **检查服务状态（可在任何目录执行）**
```bash
polarion-status
```

4. **启动必要服务**
```bash
postgresql-start
polarion-start
```

5. **开发和调试**
- 在宿主机 `/opt/polarion` 目录中修改文件
- 修改会立即反映到容器中
- 根据需要重启相应服务：`polarion-restart`

6. **停止服务**
```bash
polarion-stop
postgresql-stop
```

#### 传统工作流程（进入容器）

1. **启动开发环境**
```bash
./setup_polarion_dev_env.sh
```

2. **进入容器**
```bash
polarion-shell
```

3. **启动必要服务**
```bash
sudo service postgresql start
sudo service apache2 start
sudo service polarion start
```

4. **开发和调试**
- 在宿主机 `/opt/polarion` 目录中修改文件
- 修改会立即反映到容器中
- 根据需要重启相应服务

5. **停止服务**
```bash
sudo service polarion stop
sudo service apache2 stop
sudo service postgresql stop
```

### 目录结构

#### 宿主机目录
- **配置目录**: `/opt/polarion/etc/`
- **数据目录**: `/opt/polarion/data/`
- **日志目录**: `/opt/polarion/data/logs/`
- **插件目录**: `/opt/polarion/polarion/plugins/`
- **PostgreSQL 数据**: `/opt/polarion/data/postgres-data/`

#### 容器内目录
所有目录都挂载到容器内的 `/opt/polarion/` 对应位置。

## 配置参数详解

### 环境变量

| 变量名 | 描述 | 默认值 | 示例 |
|--------|------|--------|------|
| `ALLOWED_HOSTS` | 允许访问的主机列表 | 无 | `localhost,192.168.1.100` |
| `POSTGRES_PORT` | PostgreSQL 端口 | `5434` | `5432` |
| `TZ` | 时区设置 | `Asia/Shanghai` | `UTC` |
| `POLARION_VERSION` | 构建时指定版本 | 自动检测 | `21R2` |

### 端口映射

| 容器端口 | 服务 | 描述 |
|----------|------|------|
| `8080` | Polarion Web | 主要的 Web 界面端口 |
| `5434` | PostgreSQL | 数据库服务端口 |
| `80` | Apache | HTTP 服务端口 |
| `443` | Apache SSL | HTTPS 服务端口（如果配置） |

### 权限说明

#### PostgreSQL 特殊权限
- PostgreSQL 数据目录权限：**750** (必须)
- PostgreSQL 文件权限：**640**
- 这是 PostgreSQL 的安全要求，不能设置为 777

#### 其他目录权限
- 配置目录：**777** (开发需要)
- 工作空间目录：**777** (开发需要)
- 日志目录：**777** (开发需要)

## 故障排除

### 常见问题及解决方案

#### 1. 容器启动后无法访问 Polarion

**问题**: 容器启动后无法访问 Polarion
```bash
# 检查服务是否已启动
docker exec -it polarion22r1 bash
sudo service postgresql status
sudo service apache2 status
sudo service polarion status
```

**解决方案**:
- 确保所有服务都已启动
- 使用全局别名检查状态：`polarion-status`

#### 2. PostgreSQL 启动失败

**问题**: PostgreSQL 服务启动失败
```bash
# 通常是权限问题，运行权限修复
./setup_polarion_dev_env.sh fix-permissions
```

**解决方案**:
- 检查 PostgreSQL 数据目录权限是否为 750
- 确保 postgres 用户拥有数据目录

#### 3. 修改配置文件后不生效

**问题**: 修改配置文件后不生效
```bash
# 重启相应的服务
docker exec -it polarion22r1 sudo service polarion restart
# 或使用全局别名
polarion-restart
```

#### 4. ARM64 架构兼容性问题

**问题**: 在 Apple Silicon 或 ARM 服务器上运行出错

**解决方案**: 参考《[Polarion-Arm-环境修复](/Toss-notes/polarion-arm-fix.html)》文章中的详细修复步骤：

```bash
# 应用 ARM64 兼容性修复
git clone https://github.com/2han9wen71an/Polarion_Arm64_Compatibility.git
cd Polarion_Arm64_Compatibility
./main.sh all /opt/polarion
```

#### 5. 如何查看日志

**问题**: 需要查看各种日志进行调试
```bash
# 容器日志
docker logs polarion22r1

# Polarion 应用日志
docker exec -it polarion22r1 tail -f /opt/polarion/data/logs/main/polarion.log
# 或使用全局别名
polarion-logs main

# PostgreSQL 日志
docker exec -it polarion22r1 tail -f /opt/polarion/data/postgres-data/log.out

# 智能日志查看器（推荐）
polarion-logs  # 交互模式选择日志类型
```

### 开发提示

1. **文件修改**: 直接在宿主机 `/opt/polarion` 目录中修改文件
2. **配置更改**: 修改配置后记得重启相应服务
3. **插件开发**: 插件文件放在 `/opt/polarion/polarion/plugins/` 目录
4. **数据备份**: 重要数据建议定期备份 `/opt/polarion/data/` 目录
5. **资源管理**: 开发完成后停止服务以释放系统资源

### 故障排除流程

如果遇到问题，按以下顺序排查：

1. **检查 Docker 状态**
```bash
docker ps
docker logs polarion22r1
```

2. **检查权限**
```bash
./setup_polarion_dev_env.sh fix-permissions
```

3. **重新配置环境**
```bash
./setup_polarion_dev_env.sh
```

4. **查看详细日志**
```bash
docker exec -it polarion22r1 bash
tail -f /opt/polarion/data/logs/main/polarion.log
```



## 版本兼容性

### 支持的 Polarion 版本

| Polarion 版本 | 状态 | 备注 |
|---------------|------|------|
| 21R2 | ✅ 完全支持 | 推荐版本，经过充分测试 |
| 22R1 | ✅ 完全支持 | 支持最新功能 |
| 22R2 | ✅ 完全支持 | 最新稳定版本 |
| 20R2 | ⚠️ 部分支持 | 需要额外配置 |
| 更早版本 | ❌ 不支持 | 建议升级到支持版本 |

### 架构兼容性

| 架构 | 状态 | 备注 |
|------|------|------|
| x86_64 (AMD64) | ✅ 完全支持 | 原生支持，性能最佳 |
| ARM64 (Apple Silicon) | ✅ 支持 | 需要兼容性修复，参考 ARM 修复文章 |
| ARM64 (服务器) | ✅ 支持 | 需要兼容性修复 |

### 操作系统兼容性

| 操作系统 | Docker 版本要求 | 状态 |
|----------|-----------------|------|
| Ubuntu 20.04+ | 20.10+ | ✅ 推荐 |
| CentOS 8+ | 20.10+ | ✅ 支持 |
| macOS 11+ | Docker Desktop 4.0+ | ✅ 支持 |
| Windows 10/11 | Docker Desktop 4.0+ with WSL2 | ✅ 支持 |

### 升级注意事项

1. **数据备份**: 升级前务必备份 PostgreSQL 数据和 Polarion 配置
2. **版本兼容**: 检查插件和自定义代码的版本兼容性
3. **测试环境**: 先在测试环境验证升级流程
4. **回滚计划**: 准备回滚方案以防升级失败

---

## 总结

本文介绍了使用 Docker 搭建 Polarion 开发环境的完整方案，包括：

- 🐳 **多架构 Docker 镜像构建**
- 🔧 **自动化安装和配置脚本**
- 📁 **开发环境卷挂载方案**
- 🛠️ **常见问题故障排除**
- ⚡ **性能优化建议**
- 🔄 **版本兼容性说明**

结合《[Polarion-Arm-环境修复](/Toss-notes/polarion-arm-fix.html)》文章中的 ARM 兼容性修复方案，您可以在各种环境下快速搭建稳定的 Polarion 开发环境。

如果您在使用过程中遇到问题，欢迎参考故障排除章节或查看相关仓库的 Issues。

