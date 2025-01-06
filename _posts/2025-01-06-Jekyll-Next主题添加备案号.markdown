---
layout: post
title:  "Jekyll-Next主题添加备案号"
date:   2025-01-06 16:17:54 +0800
categories: 折腾笔记
permalink: /Toss-notes/jekyll-next-beian.html
tags: [jekyll next]
---

# 前言
国内域名备案后需要在首页添加备案号，否则会被管局打电话提示被强制注销备案，所以需要添加备案号。

本博客使用Jekyll进行搭建，使用的主题是Jekyll-Next。但是这款移植主题已经很久没有更新了，其实Next主题6.x版本已经添加了备案号的配置项，但是我使用的是5.x版本的主题，所以需要自己手动添加。
# 添加备案号
## 添加配置
在主题的配置文件` _config.yml`中添加备案信息，需要自己手动添加。
```
footer:
  beian: 
    enable: true #为true表示启用
    domains: #备案号的域名和备案号
      - url: xtboke.cn #域名
        strict: true #为true表示严格匹配域名
        icp: "湘ICP备18013761号-1" #备案号
      - url: localhost:4000
        icp: "湘ICP备18013761号-2"
```
我这里是在页脚添加的备案号
由于我使用的是本地预览，所以需要添加localhost:4000的备案号进行测试验证。
这里domains是一个数组，所以可以添加多个域名和备案号,方便你根据不同的域名添加不同的备案号。

## 修改页脚界面
本主题的页脚界面是在`/_includes/_partials/footer.html`文件，我们需要修改这个文件，添加备案号。
原始文件如下：
```
{% raw %}
<div class="copyright" >
  {% assign current = site.time | date: '%Y' %}
  {% assign since = site.since | downcase %}
  &copy; {% if site.since and since != current %} {{ since }} - {% endif %}
  <span itemprop="copyrightYear">{{ current }}</span>
  <span class="with-love">
    <i class="fa fa-{{ site.authoricon }}"></i>
  </span>
  <span class="author" itemprop="copyrightHolder">{{ site.author }}</span>
</div>

{% if site.copyright %}
<div class="powered-by">
  {{ __.footer.powered | replace: '%s', '<a class="theme-link" href="https://jekyllrb.com">Jekyll</a>') }}
</div>

<div class="theme-info">
  {{ __.footer.theme }} -
  <a class="theme-link" href="https://github.com/simpleyyt/jekyll-theme-next">
    NexT.{{ site.scheme }}
  </a>
</div>
{% endif %}
{% endraw %}
```
我们需要在最后添加备案号的代码，如下：
```
{% raw %}
{% if site.footer.beian.enable %}
<div id="beian-info" 
     data-domains="{{ site.footer.beian.domains | jsonify | escape }}"
     data-current-host="{{ '' }}"
></div>
<script>
  const beianDiv = document.getElementById('beian-info');
  const beianConfig = JSON.parse(beianDiv.dataset.domains);;

  // 获取当前浏览器 URL 的 host
  const currentHost = window.location.host;

  // 匹配备案信息
  function getBeianInfo(host, domains) {
    for (const domain of domains) {
      if (domain.strict) {
        // 严格模式：完全匹配
        if (host === domain.url) {
          return domain.icp;
        }
      } else {
        // 非严格模式：匹配一级域名或特定host
        const domainParts = domain.url.split('.');
        const currentParts = host.split('.');
        if (domainParts.length === 1) {
          // 如果配置的域名只有一个部分，如 "localhost"
          if (host === domain.url) {
            return domain.icp;
          }
        } else if (
          domainParts.length >= 2 &&
          currentParts.length >= 2 &&
          domainParts.slice(-2).join('.') === currentParts.slice(-2).join('.')
        ) {
          return domain.icp;
        }
      }
    }
    return null;
  }

  // 获取备案信息
  const beianInfo = getBeianInfo(currentHost, beianConfig);

  // 如果找到备案信息，插入到页面中
  if (beianInfo) {
    document.getElementById("beian-info").innerHTML = `
      <a href="https://beian.miit.gov.cn/" target="_blank">${beianInfo}</a>
    `;
  }
</script>
{% endif %}
{% endraw %}
```
这样就能根据不同的域名展示不同的备案号了。
# 题外
我是因为有多个域名，所以需要添加多个备案号，所以我使用了数组的方式来添加备案号。实际使用中，你也可以使用单个备案号的方式来添加，精简代码，这里给出一个示例：
1. 在 _config.yml 中添加备案信息：
```
footer:
  beian: "京ICP备12345678号"
  beian_url: "https://beian.miit.gov.cn/"
```
2. 在页脚文件中引用配置：

```
{% raw %}
{% if site.footer.beian %}
<div class="beian">
  <a href="{{ site.footer.beian_url }}" target="_blank">{{ site.footer.beian }}</a>
</div>
{% endif %}
{% endraw %}
```
