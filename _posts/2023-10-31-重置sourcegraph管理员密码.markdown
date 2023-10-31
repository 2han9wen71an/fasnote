---
layout: post
title:  "重置sourcegraph管理员密码"
date:   2023-10-31 10:39:16 +0800
categories: 折腾笔记
permalink: /Toss-notes/reset_sourcegraph_admin_password.html
tags: [sourcegraph docker]
---

假设您可以访问 Sourcegraph Docker 容器，并且容器名为 `sourcegraph`：

1. 获取管理员帐户的 ID（在大多数情况下应为 1）：

```
docker container exec sourcegraph psql -U postgres sourcegraph -c 'SELECT id, username, passwd FROM users'
```

2. 设置 `$ID` 变量：

```
ID='VALUE'
```

3. 前往  <https://bcrypt-generator.com/> 并生成一个 **Rounds** 设置为 `10` 的哈希值。

4. 设置 `$HASH` 变量（用单引号括起来）：

```
HASH='VALUE'
```

5. 执行 SQL 查询以使用新密码更新 `users` 数据库表：

```
docker container exec sourcegraph psql -U postgres sourcegraph -c "UPDATE users SET passwd_reset_code=NULL, passwd_reset_time=NULL, passwd='${HASH}' WHERE id=${ID};"
```

请根据实际情况替换 `VALUE` 为相应的值，并在执行命令之前确保正确设置了 Docker 容器名称和相关变量。