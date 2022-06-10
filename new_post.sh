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
description: ""
date:   ${post_date} +0800
categories: 代码笔记 折腾笔记 生活随笔
permalink: /CodeNotes Toss-notes LifeEssay/${random_addr}.html
tags: [writing]
---

EOF