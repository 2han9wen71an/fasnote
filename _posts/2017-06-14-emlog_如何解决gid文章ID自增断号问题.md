---
layout: post
title: emlog 如何解决gid文章ID自增断号问题
date: 2017-06-14 10:18:00
updated: 2022-06-01 22:40:43
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
---


emlog文章连接使用gid自增号作为文章的ID，但是由于后台有删除文章的功能，一旦删除文章那么gid自增就会出现断号。  
其实断号问题解决很方便，只要在添加文章的时候判断gid之前的有没有断号问题，有的话直接插入，没有的话自增。  
我这里的解决方法是这样的，我把gid自增段顺序读取作为值写入数组，自增段是从1开始的，但是数组键值是0开始的，那么先把数组（$gidarr\[0\]='0'）赋值掉，然后把$gidarr\[\]=gid，然后只要发现$gidarr键和键值不等就是断号了。

找到我们的addlog添加文章和页面函数。路径在include/model/log\_model.php。

修改前: 

```php
/\*\*
\* 添加文章、页面
\*
\* @param array $logData
\* @return int
\*/
function addlog($logData) {
	$kItem = array();
	$dItem = array();
	foreach ($logData as $key => $data) {
		$kItem\[\] = $key;
		$dItem\[\] = $data;
	}
	$field = implode(',', $kItem);
	$values = "'" . implode("','", $dItem) . "'";
	$this->db->query("INSERT INTO " . DB\_PREFIX . "blog ($field) VALUES ($values)");
	$logid = $this->db->insert\_id();
	return $logid;
}
```

修改后:

  ```php
function addlog($logData) {
	$kItem = array();
	$dItem = array();
	foreach ($logData as $key => $data) {
		$kItem\[\] = $key;
		$dItem\[\] = $data;
	}
	$field = implode(',', $kItem);
	$values = "'" . implode("','", $dItem) . "'";
	$gidarr\[0\]='0';
	$res = $this->db->query("SELECT gid From  " . DB\_PREFIX . "blog ORDER BY gid ASC");
	while ($row = $this->db->fetch\_array($res)) {
		$gidarr\[\] = $row\['gid'\];
	}
	foreach($gidarr as $key=>$val) {
		if($key!=$val) {
			$field = 'gid,'.$field;
			$values = "'".$key."',".$values;
			break;
		}
	}
	$this->db->query("INSERT INTO " . DB\_PREFIX . "blog ($field) VALUES ($values)");
	$logid = $this->db->insert\_id();
	return $logid;
}
  ```

通过改变是否需要插入语句添加gid和gid值，来自增或者插入。  
 假如你有多篇文章删除，添加一篇的话，只有从开始的断号，慢慢补全断号。