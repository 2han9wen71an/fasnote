---
layout: post
title: PHP,Js,Ajax实现多图片上传
date: 2018-02-28 10:16:00
updated: 2018-03-02 23:02:51
status: publish
author: zhangwentian
categories: 
  - 折腾笔记
tags: 
  - 网站资源
---


## 引入JS 
## HTML 上传图片

## CSS 

```
.btn {
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    -ms-border-radius:3px;
    -o-border-radius:3px;
    border-radius:3px;
    background-color:#0cc;
    color:#fff;
    display:inline-block;
    height:28px;
    line-height:28px;
    text-align:center;
    width:72px;
    transition:background-color .2s linear 0s;
    border:none;
    cursor:pointer;
    margin:0 0 20px
}
.btn:hover {
    background-color:#f55;
    text-decoration:none
}
.ul\_pics li {
    position:relative;
    float:left;
    margin:5px;
    width:calc(100% / 6 - 10px);
    border:1px solid #ddd;
    text-align:center;
}
.ul\_pics li img {
    max-width:100%;
    max-height:100%;
}
.ul\_pics li p {
    position:absolute;
    bottom:0;
    overflow:hidden;
    margin:0;
    width:100%;
    background:#ddd;
    color:#fff;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.progress {
    position:absolute;
    top:45%;
    left:2%;
    margin:0;
    width:96%;
    background:#fff;
}
.bar {
    display:block;
    width:0;
    height:20px;
    background-color:#03A9F4;
}
.percent {
    position:absolute;
    top:0;
    left:45%;
    display:inline-block;
    color:#F44336;
    line-height:20px;
}
@media (max-width: 900px) {
    .ul\_pics li {
        width:calc(100% / 4 - 10px);
    }
}
@media (max-width: 600px) {
    .ul\_pics li {
        width:calc(100% / 3 - 10px);
    }
}
```
## JS 
```
<?php
//判断内容页是否360收录
function haoso($url) {
	$url='https://www.so.com/s?a=index&q='.$url;
	$curl=curl\_init();
	curl\_setopt($curl,CURLOPT\_URL,$url);
	curl\_setopt($curl,CURLOPT\_RETURNTRANSFER,1);
	$rs=curl\_exec($curl);
	curl\_close($curl);
	if(!strpos($rs,'找不到')) {
		return 1;
	} else {
		return 0;
	}
}
function logurlhaoso($id) {
	$url=Url::log($id);
	if(haoso($url)==1) {
		echo "<a style=\\"color:#1EA83A;
		\\" rel=\\"external nofollow\\" title=\\"点击查看！\\" target=\\"\_blank\\" href=\\"https://www.so.com/s?a=index&q=$url\\">\[360已收录\]</a>";
	} else {
		echo "<a style=\\"color:red;
		\\" rel=\\"external nofollow\\" title=\\"点击提交收录！\\" target=\\"\_blank\\" href=\\"http://info.so.com/site\_submit.html\\">\[360未收录\]</a>";}}
		?>
```