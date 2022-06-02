---
layout: post
title: Typecho基础seo优化自定义文章描述与关键词
date: 2020-03-28 01:59:17
updated: 2020-03-28 01:59:17
status: publish
author: zhangwentian
categories: 
  - 代码笔记
  - 折腾笔记
tags: 
  - Typecho
  - seo
---


SEO就基础的就是TDK了（title description keywords 的缩写，是三个定义标签，中文译为：标题、描述、关键词），TDK就是用来给搜索引擎看的信息。

Typecho的T就是文章标题，D是截取文章开头的文字，K是文章标签，DK的设置明显不是那么太合理，描述过于死板，标签当关键词很不合理。

不过Typecho可以通过一些操作，使用文章自定义字段功能设置描述与关键词。步骤如下

1，屏蔽默认输出的关键词与描述
把模板`header.php`文件中的`<?php $this->header(); ?>`改为`<?php $this->header('keywords=&description='); ?>`

2，为文章强制设置两个字段
在模板`functions.php`文件中添加如下代码

```
function themeFields($layout) {
    $description = new Typecho_Widget_Helper_Form_Element_Text('description', NULL, NULL, _t('描述'), _t('简单一句话描述'));$description->input->setAttribute('class', 'text w-100');
    $layout->addItem($description);
    $keyword = new Typecho_Widget_Helper_Form_Element_Text('keyword', NULL, NULL, _t('产品关键词'), _t('多个关键词用英文下逗号隔开'));$keyword->input->setAttribute('class', 'text w-100');
    $layout->addItem($keyword);
}

```

3，让自定义的字段变成文章描述与关键词
在模板`header.php`文件中添加如下代码即可

```
<meta name="description" content="<?php $d=$this->fields->description;if(empty($d) || !$this->is('single')){if($this->getDescription()){echo $this->getDescription();}}else{ echo $d;};?>" />
<meta name="keywords" content="<?php $k=$this->fields->keyword;if(empty($k) || !$this->is('single')){echo $this->keywords();}else{ echo $k;};?>" />
```

这样写好后，在文章页时如果存在自定义字段就会用自定义字段的描述与关键词，否则就是默认模式。