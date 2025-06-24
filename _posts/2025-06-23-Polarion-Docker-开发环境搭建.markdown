---
layout: post
title:  "Polarion-Docker-开发环境搭建"
description: "使用 Dokcer 部署 Polarion不同版本进行开发"
date:   2025-06-23 13:49:45 +0800
categories: 代码笔记 折腾笔记 生活随笔
permalink: /Toss-notes/polarion-docker-dev.html
tags: [polarion,docker,dev]
---
# 前言
上篇文章提到，我最近主要进行 Polarion 的开发，经常需要切换不同的 Polarion 版本，但是 Polarion 不支持多版本共存，我这里使用 Docker 来搭建开发环境，方便进行版本切换
# Polarion Dockerfile
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
这个文件主要是用来构建 Polarion 的 Docker 镜像的，它会自动检测并解压 Polarion 安装包，然后进行安装，最后设置入口点为 pl_starter.sh，这个脚本会启动 Polarion 服务

# Polarion 启动脚本
```bash
#! /bin/bash

# 设置时区为中国上海
export TZ=Asia/Shanghai
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
echo "Asia/Shanghai" > /etc/timezone

# PostgreSQL 端口配置
POSTGRES_PORT=5434

sudo -u postgres /usr/lib/postgresql/14/bin/pg_ctl -D /opt/polarion/data/postgres-data -l /opt/polarion/data/postgres-data/log.out -o "-p $POSTGRES_PORT" start
service apache2 start

FILE="/opt/polarion/etc/polarion.properties"

OTHER_PARAMS=(
    "com.siemens.polarion.rest.enabled=true"
    "com.siemens.polarion.rest.swaggerUi.enabled=true"
    "com.siemens.polarion.rest.cors.allowedOrigins=*"
    "com.polarion.platform.internalPG=polarion:polarion@localhost:$POSTGRES_PORT"
)

if [[ -n "$ALLOWED_HOSTS" ]]; then
    TomcatServiceRequestSafeListedHosts="TomcatService.request.safeListedHosts=$ALLOWED_HOSTS"
elif [[ "$#" -gt 0 ]]; then
    TomcatServiceRequestSafeListedHostsValues=$(printf "%s," "$@")
    TomcatServiceRequestSafeListedHosts="TomcatService.request.safeListedHosts=${TomcatServiceRequestSafeListedHostsValues%,}" # Removes the trailing comma
else
    echo "No values provided for TomcatService.request.safeListedHosts. Exiting"
    exit 1
fi

PARAMS=(
    "$TomcatServiceRequestSafeListedHosts"
    "${OTHER_PARAMS[@]}"
)

sed -i '/^# End property file$/d' "$FILE"

add_or_update_param() {
    local param="$1"
    local param_name=$(echo "$param" | cut -d '=' -f 1)
    
    if grep -q "^$param_name=" "$FILE"; then
        sed -i "/^$param_name=/c\\$param" "$FILE"
    else
        echo "$param" >> "$FILE"
    fi
}

for param in "${PARAMS[@]}"; do
    add_or_update_param "$param"
done
echo "# End property file" >> "$FILE"

echo "Polarion Properties Updated Successfully."
# 默认不启动Polarion服务，需要手动启动
#service polarion start

wait
tail -f /dev/null
```
这个脚本主要是用来启动 Polarion 的依赖服务的，它会设置时区，启动 PostgreSQL 服务，然后启动 Apache 服务，最后更新 Polarion 的配置文件

# 开发环境设置
当你使用 Docker 构建好镜像后，此时 Polarion 的文件都在容器里面，你需要手动执行 cp 命令把 Polarion 的文件复制到宿主机上，然后在宿主机上进行开发，但是当你每次修改了代码后，都需要重新复制文件到容器中，非常麻烦，所以我们可以使用 Docker 的 volumes 功能，把 Polarion 的文件目录挂载到宿主机上，这样你就可以在宿主机上直接修改文件了，修改后直接刷新浏览器即可看到效果

另外你每次都需要进入容器才可以重启 Polarion 服务，也非常麻烦，所以我们可以使用 Docker 的 exec 功能，直接在宿主机上执行命令重启 Polarion 服务
这些操作我都封装成了一个 sh 脚本，方便使用

仓库地址: (Polarion_Docker_Development_Environment)[https://github.com/2han9wen71an/Polarion_Docker_Development_Environment]

## 执行
```
git clone https://github.com/2han9wen71an/Polarion_Docker_Development_Environment.git
cd Polarion_Docker_Development_Environment
chmod +x setup_polarion_dev_env.sh
./setup_polarion_dev_env.sh
```
这个脚本会帮你完成以下操作：
✅ 一键配置完整的开发环境
✅ 自动处理卷挂载和权限问题
✅ 针对PostgreSQL的特殊权限要求进行优化
✅ 全局别名系统 - 可在任何目录使用简短命令
✅ 自动检测shell类型并配置别名
✅ 提供完整的开发工作流程指导

