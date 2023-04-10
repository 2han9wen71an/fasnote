---
layout: post
title:  "在centos7中，使用apache搭建一个新svn仓库"
date:   2023-04-10 16:53:13 +0800
categories: 折腾笔记
permalink: /Toss-notes/how-to-set-up-a-new-svn-repository-using-apache-on-centos-7.html
tags: ["apache","svn","centos7"]

---

# 安装httpd和subversion

```
sudo yum install httpd subversion mod_dav_svn
```

# 创建SVN仓库

选择一个目录作为仓库的存储位置，这里选择`/var/www/svn`目录，并创建一个新的仓库`myrepo`。

```
sudo mkdir -p /var/www/svn
sudo svnadmin create /var/www/svn/myrepo
```

## 设置权限

```
sudo chown -R apache:apache /var/www/svn
sudo chmod -R 755 /var/www/svn
```

## 配置Apache

创建SVN的Apache配置文件。

```
sudo vi /etc/httpd/conf.d/svn.conf
```

写入以下内容：

```
LoadModule dav_module modules/mod_dav.so
LoadModule dav_svn_module modules/mod_dav_svn.so
<Location /svn>
   DAV svn
   SVNPath /var/www/svn/myrepo
   AuthType Basic
   AuthName "My SVN Repository"
   AuthUserFile /etc/subversion/passwd
   Require valid-user
</Location>
```

修改`AuthUserFile`为认证文件的路径，如果没有则需要创建。

```
sudo htpasswd -c /etc/subversion/passwd username
```

重启Apache服务。

```
sudo systemctl restart httpd
```

现在就可以通过浏览器打开`http://<ip>/svn/myrepo`来访问SVN仓库了。提示输入用户名和密码，输入创建的用户名和密码即可。