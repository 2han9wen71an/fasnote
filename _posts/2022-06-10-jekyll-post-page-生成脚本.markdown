---
layout: post
title:  "jekyll-post-page-生成脚本"
date:   2022-06-10 11:23:38 +0800
categories: 折腾笔记
permalink: /Toss-notes/jekyll-post-page.html
tags: [jekyll]
---
脚本功能：

1. md 文件创建
2. md 头内容生成
3. 生成随机短地址作为permalink，以便为每个page实现固定地址

<!-- more -->
脚本内容：

```
#!/usr/bin/env bash

DIR="${0%/*}"

title=`echo $@ | sed 's/[ ][ ]*/-/g'`
post_date=`date  +"%Y-%m-%d %T"`
post_name="`date "+%Y-%m-%d"`-${title}.markdown"
random_addr=`openssl rand -hex 8 | md5 | cut -c1-8`

cat > ${DIR}/../_posts/${post_name} << EOF
---
layout: post
title:  "${title}"

date:   ${post_date} +0800
categories: default
permalink: /posts/${random_addr}.html
tags: [writing]
---

EOF


```

使用方法：

```
./new_post.sh <the new page name>
```

脚本原作者:<https://hxysayhi.com/blog/posts/65e8b919/>