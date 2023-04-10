---
layout: post
title:  "EasyExcel中文文件名下载踩坑"

date:   2022-06-30 17:30:08 +0800
categories: 折腾笔记
permalink: /Toss-notes/easyExcel-chinese_download.html
tags: [EasyExcel]
---
# 前言

最近在使用阿里的EasyExcel进行Excel协同,需要把系统的数据导出为Excel,按照官网示例一顿copy,
本地打包测试运行,一切正常,提交发布测试后泡了杯茶回来,测试小姐姐跑过来说她电脑下载下来的文件名称乱码

我心里一万个cnm飞过,我刚刚才测试过,一起正常啊,就问她内容对不对?用的什么浏览器,回答是safari

好吧,我不配拥有高贵的MAC,跑去她电脑看问题,发现如她所说,真乱码..

# 排查
坐在位置上开始沉思,开始审计代码,参考官网的示例
```java
    /**
     * 文件下载（失败了会返回一个有部分数据的Excel）
     * <p>
     * 1. 创建excel对应的实体对象 参照{@link DownloadData}
     * <p>
     * 2. 设置返回的 参数
     * <p>
     * 3. 直接写，这里注意，finish的时候会自动关闭OutputStream,当然你外面再关闭流问题不大
     */
    @GetMapping("download")
    public void download(HttpServletResponse response) throws IOException {
        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        response.setContentType("application/vnd.ms-excel");
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
        String fileName = URLEncoder.encode("测试", "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        EasyExcel.write(response.getOutputStream(), DownloadData.class).sheet("模板").doWrite(data());
    }
```

这里的```URLEncoder.encode("测试", "UTF-8")```明明把中文转码了,为何她那边还是乱码呢?
Google搜索*URLEncoder.encode*这个方法,发现它只是把字符转换为*unicode编码*,用于传输
## Unicode
>Unicode，统一码联盟官方中文名称为统一码[1]，是计算机科学领域的业界标准。它整理、编码了世界上大部分的文字系统，使得电脑可以用更为简单的方式来呈现和处理文字。

看到这里大家应该知道原因了,我们在Header中只设置了转码后的文件名,没有设置文件名的具体编码.
由于不同浏览器解析Unicode不同,导致文件名不一致,我使用google浏览器会直接解码Unicode为UTF-8, 所以正常输出

#解决方案
> 使用谷歌浏览器，导出excel的文件名是正常的；使用safari浏览器，导出的文件名是unicode编码格式的。使用如下方式可以解决：

```java
response.setHeader("Content-Disposition", "attachment;filename*=utf-8''"
                    + URLEncoder.encode(fileName, "UTF-8") + ".xlsx");
```
这里在*attachment;filename*后面加入=utf-8',强制指定格式,使浏览器正常解码就行