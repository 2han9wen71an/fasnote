---
layout: post
title:  "metersphere开发部署文档"
description: ""
date:   2024-12-24 17:05:18 +0800
categories: 代码笔记
permalink: /CodeNotes/metersphere-dev.html
tags: [metersphere]
---

# 开发环境搭建
## 中间件搭建
使用`docker-compose`启动，这里mysql配置文件需要从官网帮助文档下载并放入指定位置,主要是忽略大小写，这里提供一个示例
```
[mysqld]
datadir=/var/lib/mysql

default-storage-engine=INNODB
character_set_server=utf8mb4
lower_case_table_names=1
performance_schema=off
table_open_cache=128
transaction_isolation=READ-COMMITTED
max_connections=1000
max_connect_errors=6000
max_allowed_packet=64M
innodb_file_per_table=1
innodb_buffer_pool_size=512M
innodb_flush_method=O_DIRECT
innodb_lock_wait_timeout=1800

server-id=1
log-bin=mysql-bin
expire_logs_days = 2
binlog_format=mixed

character-set-client-handshake = FALSE
character-set-server=utf8mb4
collation-server=utf8mb4_general_ci
init_connect='SET default_collation_for_utf8mb4=utf8mb4_general_ci'

sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

skip-name-resolve

[mysql]
default-character-set=utf8mb4

[mysql.server]
default-character-set=utf8mb4
```
```yaml
version: "3.8"

services:
  db:
    image: mysql:8.0.33
    environment:
      - MYSQL_ROOT_PASSWORD=Password123@mysql
      - MYSQL_DATABASE=metersphere_dev
    ports:
      - "3306:3306"
    networks:
      - metersphere
    volumes:
      - /opt/metersphere/conf/mysql.conf:/etc/mysql/conf.d/my.cnf
      - mysql-data:/var/lib/mysql
    restart: unless-stopped

  redis:
    image: redis:7.2.4-alpine
    environment:
      - REDIS_PASSWORD=Password123@redis
    command: ["redis-server", "--requirepass", "${REDIS_PASSWORD}"]
    networks:
      - metersphere
    ports:
      - "6379:6379"
    restart: unless-stopped

  kafka:
    image: apache/kafka:3.7.0
    networks:
      - metersphere
    ports:
      - "9092:9092"
    restart: unless-stopped

  minio:
    image: minio/minio
    environment:
      - MINIO_ACCESS_KEY=admin
      - MINIO_SECRET_KEY=Password123@minio
    networks:
      - metersphere
    command: server /data --address ":9000" --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - files:/data
    restart: unless-stopped

networks:
  app_network:
    driver: bridge
  metersphere: { }

volumes:
  mysql-data:
  files:

```

# 打包部署
## 打包脚本
使用`build_docker.sh`可以按模块来打包并进行构建镜像，默认构建的镜像名为`模块名称:git分支名称`。
构建好镜像后需要手动进行推送`docker push 10.6.132.102:31443/metersphere/system-setting:v2.10`

```bash
#!/bin/bash

# 配置，根据实际情况修改
IMAGE_PREFIX='10.6.132.102:31443/metersphere'
WORKSPACE=$(pwd)

# 获取当前 Git 分支名称
GIT_BRANCH=$(git symbolic-ref --short HEAD)

# 可用库（模块）
libraries=('framework/eureka' 'framework/gateway' 'api-test' 'performance-test' 'project-management' 'report-stat' 'system-setting' 'test-track' 'workstation')

# 特殊处理的模块
special_libraries=('framework/eureka' 'framework/gateway')

# 打包 JAR 文件
build_jar() {
    local module_name=$1
    echo "Building JAR for module: $module_name"
    cd $module_name

    # 清理并打包
    mvn clean package -DskipTests
    if [ $? -ne 0 ]; then
        echo "Error: Maven build failed for module: $module_name"
        exit 1
    fi

    if [[ " ${special_libraries[@]} " =~ " ${module_name} " ]]; then
        mkdir -p ./target/dependency && (cd ./target/dependency; jar -xf ../*.jar)
    else
        mkdir -p ./backend/target/dependency && (cd ./backend/target/dependency; jar -xf ../*.jar)
    fi

    if [ $? -ne 0 ]; then
        echo "Error: Failed to extract JAR file in module: $module_name"
        exit 1
    fi
}

# 打包单个模块的 Docker 镜像
build_module() {
    local module_name=$1
    local image_name=${module_name#*/}
    echo "Building Docker image for module: $module_name"
    docker build -t $IMAGE_PREFIX/$image_name:$GIT_BRANCH .

    if [ $? -ne 0 ]; then
        echo "Error: Docker build failed for module: $module_name"
        exit 1
    fi
}

# 显示菜单并获取用户选择
show_menu() {
    echo "Available modules:"
    for i in "${!libraries[@]}"; do
        echo "$((i+1)). ${libraries[i]}"
    done
    echo "Enter the numbers of the modules to build (comma-separated, e.g., 1,2,3):"
    read -r selections
}

# 主程序
show_menu

IFS=',' read -ra selected_indices <<< "$selections"

for index in "${selected_indices[@]}"; do
    if [[ "$index" =~ ^[0-9]+$ ]] && [ "$index" -ge 1 ] && [ "$index" -le "${#libraries[@]}" ]; then
        module=${libraries[$((index-1))]}
        build_jar "$module"
        build_module "$module"
    else
        echo "Invalid selection: $index"
    fi
done
```
# 部署
## allinone方式
进入服务器停止旧的容器
```shell
msctl stop system-setting
# 这里首次可能不是私服的镜像地址，需要按照实际情况修改
docker rmi 10.6.132.102:31443/metersphere/system-setting:v2.10
```
删除旧的容器后重新加载
```shell
msctl reload
```

## 微服务方式
目前测试环境网络使用host模式启动，需修改`docker-compose.yml`文件来挂载到宿主机，否则无法访问。

删除`docker-compose-base.yml`中关于network的配置
```yaml
 #networks:
      #  ms-network:
      #    driver: bridge
      #    ipam:
      #      driver: default
      #      config:
      #        - subnet: ${MS_DOCKER_SUBNET}
```
重启容器
```shell
docker stop test-track
docker rm test-track
docker rmi 10.6.132.102:31443/metersphere/test-track:v2.10
msctl up -d test-track
```
