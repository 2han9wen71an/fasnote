---
layout: post
title: 腾讯云使用Docker搭建Bitwarden并定时备份数据库
date: 2021-03-18 23:06:25
updated: 2021-03-18 23:06:25
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - Docker
  - Bitwarden
---


以前一直在使用lastpass管理密码，最近因为lastpass强制收费。发现[Bitwarden](https://bitwarden.com/)这个密码管理系统，Bitwarden 可以免费使用，付费解锁高级功能，高级版价格 10 美元 / 年。前后端全都开源，如果不想用 Bitwarden 官方服务，可以自己利用 docker 自己部署，免费体验高级版的功能。

因为官方的Bitwarden服务器使用MSSQL数据库 .Net 开发，镜像体积很大，部署官方的docker镜像对配置要求很高，有人用 Rust 实现了 Bitwarden 服务器，项目叫 [Bitwarden_rs](https://github.com/dani-garcia/bitwarden_rs)，并且提供了 Docker 镜像，对服务器配置的要求很低，并且 Docker 镜像体积很小，个人用很合适。下面分享一下用Docker部署Bitwarden_rs后端服务器的过程

准备
--

安装 Docker

在终端中运行下面的命令安装 Docker。

```
#国内daocloud.io镜像快速安装
curl -sSL https://get.daocloud.io/docker | sh
#启动docker
sudo service docker start
```

安装 Docker Compose

Docker Compose 是 Docker 官方编排（Orchestration）项目之一，负责快速在集群中部署分布式应用，本文使用 docker-compose 来管理服务。

```
#国内daocloud.io镜像快速安装
curl -L https://get.daocloud.io/docker/compose/releases/download/1.12.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

你可以通过修改URL中的版本，可以自定义您的需要的版本。

部署
--

```
#在用户主目录创建bitwarden目录
cd ~ && mkdir bitwarden && cd bitwarden
pwd
#确认目录为/home/user/bitwarden
```

在`bitwarden`目录创建`docker-compose.yml`文件

```
vim docker-compose.yml
```

在docker-compose.yml写入一下配置，参考官方[wiki](https://github.com/dani-garcia/bitwarden_rs/wiki/Using-Docker-Compose)

```
version: "3"

services:
  bitwarden:
    image: bitwardenrs/server
    container_name: bitwardenrs
    restart: always
    ports:
        - "127.0.0.1:8000:80" #将8000端口映射到镜像80端口
        - "127.0.0.1:3012:3012"
    volumes:
      - ./bw-data:/data
    environment:
      WEBSOCKET_ENABLED: "true" #开启WebSocket
      SIGNUPS_ALLOWED: "true" #开启注册，自己注册后改成fale
      WEB_VAULT_ENABLED: "true" #web客户端

```

运行服务

```
docker-compose up -d #运行服务
docker-compose down #关闭服务
docker-compose restart #重启服务
```

代理
--

我是通过Nginx代理实例，也可以使用Caddy、Apache等做反向代理，因为我的服务器已经装过LNMP，直接用`lnmp vhost add`就能建立vhost并配置好https，为了安全强烈推荐配置HTTPS，反向代理配置可以参考项目[wiki](https://github.com/dani-garcia/bitwarden_rs/wiki/Proxy-examples)

在你的Nginx插入一下配置

```
        location / {
            proxy_pass http://127.0.0.1:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /notifications/hub {
            proxy_pass http://127.0.0.1:3012;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        location /notifications/hub/negotiate {
            proxy_pass http://127.0.0.1:8000;
        }
        # 加入robots.txt 防止搜索引擎爬虫抓取
        location = /robots.txt {
            root /home/wwwroot/Bitwarden;
        }
```

在vhost目录/home/wwwroot/Bitwarden创建一个robots.txt 文件
写入以下内容禁止搜索引擎爬虫抓取

```
User-agent: *
Disallow: /
```

备份
--

数据无价,设置定时备份数据库。bitwarden-rs的数据库在~/bitwarden/bw-data目录，里面还有密钥文件和网站图标缓存，这些都是可选的，以下脚本只备份数据库。

```
#!/bin/bash
# https://gist.github.com/vitobotta/3a6c53c3693ff77cd0c920d0a541622d#file-bitwarden_rs-backup-sh-L25
export LC_ALL=C

now=$(date +"%Y%m%d-%H%M%S")
parent_dir="/home/<USER>/bitwarden/bw-data"
backups_dir="${parent_dir}/backups"
log_file="${backups_dir}/backup-progress.log.${now}"
tmp_sqlite_backup="backups/db.sqlite3.${now}"
archive="backups/backup.tar.gz.${now}"

error () {
  printf "%s: %s\n" "$(basename "${BASH_SOURCE}")" "${1}" >&2
  exit 1
}

trap 'error "An unexpected error occurred."' ERR

take_backup () {
  cd "${parent_dir}"

  sqlite3 db.sqlite3 ".backup '${tmp_sqlite_backup}'"
  /bin/tar czf "${archive}" "${tmp_sqlite_backup}" attachments

  rm "${tmp_sqlite_backup}"

  find "${backups_dir}/" -type f -mtime +30 -exec rm {} \;
}

printf "\n======================================================================="
printf "\nBitwarden Backup"
printf "\n======================================================================="
printf "\nBackup in progress..."

take_backup 2> "${log_file}"

if [[ -s "${log_file}" ]]
then
  printf "\nBackup failure! Check ${log_file} for more information."
  printf "\n=======================================================================\n\n"
else
  rm "${log_file}"
  printf "...SUCCESS!\n"
  printf "Backup created at ${backups_dir}/backup.tar.gz.${now}"
  printf "\n=======================================================================\n\n"
fi
```

设置定时任务，修改文件 `/etc/crontab`插入一下内容

```
00 1    * * *   root   /home/<USER>/bitwarden/bw-data/backups/bitwarden_rs-backup.sh

```

以上表示，每天凌晨 1 ，root 用户执行一次 bitwarden_rs-backup.sh 脚本。

大功告成
----

注册完账号后，把`SIGNUPS_ALLOWED`选项改成`fale`重启实例关闭注册，
![Bitwarden.png](https://www.hanyibo.com/usr/uploads/2019/11/1003428464.png "Bitwarden.png")
导入lastpass文件
![Import.png](https://www.hanyibo.com/usr/uploads/2019/11/1122373114.png "Import.png")