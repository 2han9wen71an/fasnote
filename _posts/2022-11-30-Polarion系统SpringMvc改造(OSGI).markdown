---
layout: post
title:  "Polarion系统SpringMvc改造(OSGI)"
description: "调整Polarion系统自带的Mvc用于支持OSGI动态扫描"
date:   2022-11-30 16:19:55 +0800
categories: 代码笔记
permalink: /CodeNotes/Polarion-SpringMvc.html
tags: [Spring,OSGI,Polarion]
---

# 前言

上一篇文章聊到如何调整Spring Core，来使在OSGI环境下支持Bean扫描，但是当你如果需要用作Web开发中，新建一个插件,引入**web-mvc**插件，并在web.xml中配置好Spring  **DispatcherServlet**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE web-app
      PUBLIC "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
      "http://java.sun.com/dtd/web-app_2_3.dtd">
<web-app>
	<servlet>
		<servlet-name>SpringMVC</servlet-name>
		<servlet-class>
			org.springframework.web.servlet.DispatcherServlet
		</servlet-class>
		<init-param>
			<param-name>contextClass</param-name>
			<!--使用Java配置 -->
			<param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
		</init-param>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<!--指定DispatcherServlet配置类 -->
			<param-value>com.fasnote.polarion.spring.web.WebAppConfig</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<servlet-mapping>
		<servlet-name>SpringMVC</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>
	<filter>
		<filter-name>DoAsFilter</filter-name>
		<filter-class>com.polarion.portal.tomcat.servlets.DoAsFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>DoAsFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>

	<security-constraint>
		<web-resource-collection>
			<web-resource-name>All</web-resource-name>
			<url-pattern>/*</url-pattern>
		</web-resource-collection>
		<auth-constraint>
			<role-name>user</role-name>
		</auth-constraint>
	</security-constraint>

	<login-config>
		<auth-method>FORM</auth-method>
		<realm-name>PolarionRealm</realm-name>
		<form-login-config>
			<form-login-page>/login/login</form-login-page>
			<form-error-page>/login/error</form-error-page>
		</form-login-config>
	</login-config>

</web-app>

```

然后在**WebAppConfig**配置**@Configuration，@ComponentScan，@EnableWebMvc**这几个注解

编写好Controller，兴高采烈的启动polarion来访问你这个web接口，却发现**报404了**，这是为何呢？请让我娓娓道来

![image-20221130164136907]({{ site.url }}\assets\images\post\image-20221130164136907.png)

# 临时修复

很简单，直接在WebAppConfig配置类中，用@Bean注解手动注册controller，然后重新启动，访问接口，发现能正常返回，这又是为何呢？

![image-20221130164209105]({{ site.url }}\assets\images\post\image-20221130164209105.png)

上篇文章不是已经解决Bean自动扫描的问题了吗？![image-20221130164041646]({{ site.url }}\assets\images\post\image-20221130164041646.png)



# 原因

这个问题的原因已经很清晰明了了，就是bean对象没有扫描成功，那我们就再次查看Spring对于bean扫描的机制

## 初识问题

在xml中我们定义的配置类为**AnnotationConfigApplicationContext**，所以我们进去查看，发现在他的构造函数中定义了类扫描器是**ClassPathBeanDefinitionScanner**，我们再次进入查看

![image-20221130165823557]({{ site.url }}\assets\images\post\image-20221130165823557.png)

找寻scan方法的调用，最终又会到**PathMatchingResourcePatternResolver**这个类，通过调用这个类的**getResources(String locationPattern)**方法来寻找class

不知道你有没有细看我上篇文章，咋又回到这个类了？因为上一篇文章我定位到这个类后，一直定位到**findPathMatchingResources**方法，发现**equinoxResolveMethod**这个解析器为空，导致资源一直添加失败，所以我就导入了**org.eclipse.core.runtime.FileLocator**这个类到Core项目中，发现就能正常解决扫描问题

而这次有什么不同呢？他只是在Web环境，通过**DispatcherServlet**来自动创建的上下文（Spring MVC的启动流程我就不帮大家复习了，感兴趣的可以自己搜搜），而我测试用例是手动创建的，难道问题在这里？？？

## 定位真相

其实不是这样的

![image-20221130173509766]({{ site.url }}\assets\images\post\image-20221130173509766.png)

其实在获取资源文件就为空了，而**上次是资源文件地址是OSGI格式的，普通模式又匹配不上，被跳过了**。

那我们就定位到**getResources**方法究竟在干嘛，最终我们可以找到实际是执行的是**doFindAllClassPathResources**方法，在这个方法中，获取类加载器然后读取路径下的文件，但是这里使用类加载器是当前插件调用的类加载器，而在上篇文章中，我们只是单纯的测试用例，并没有与Polarion执行起来，所以没有检查到这个问题

![这里getClassLoader其实Spring还有封装，感兴趣的可以自己去看一下]({{ site.url }}\assets\images\post\image-20221130173938911.png)

这里附上getClassLoader的调用栈，用的是**DefaultResourceLoader**的默认构造，而他的classLoader是获取当前线程类加载器

![image-20221130175652970]({{ site.url }}\assets\images\post\image-20221130175652970.png)

![image-20221130175537304]({{ site.url }}\assets\images\post\image-20221130175537304.png)

你此时的类加载器是Tomcat执行的，正常情况下这样当然没问题，但是Polarion是OSGI架构，所以又对Tomcat进行了二次封装，此时你的类加载器是加载不到原始资源文件的，现在问题定位到了，那就开始解决

# 解决

鉴于文章篇幅，我就不在讲解如何替换这个类加载器了，由于上下文都是Spring自动创建的，我们只能从入口下手

也就是自定义一个DispatcherServlet，然后在这里调整类加载器

新建一个**OSGIDispatcherServlet**

```java
import javax.servlet.ServletConfig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import com.polarion.core.util.eclipse.BundleHelper;

public class OSGIDispatcherServlet extends DispatcherServlet {
    private static final long serialVersionUID = 1087751639087716802L;
    private static final Logger log = LoggerFactory.getLogger(OSGIDispatcherServlet.class);

    @Override
    protected WebApplicationContext initWebApplicationContext() {
        ServletConfig servletConfig = getServletConfig();
        String bundleName = servletConfig.getInitParameter("bundleName");
        log.warn("从InitParameter中获取到bundleName的值为:{}", bundleName);
        ClassLoader bundleClassLoader = BundleHelper.getBundleClassLoader(bundleName);
        log.warn("获取到的ClassLoader为:{}", bundleClassLoader);
        Thread.currentThread().setContextClassLoader(bundleClassLoader);
        return super.initWebApplicationContext();
    }
}
```

这里**BundleHelper**这个类是由polarion提供的，可以通过bundleId来获取bundle，你也可以替换成

**org.eclipse.core.runtime.Platform**这个类，通过调用它的**Platform.getBundle(bundleId)**方法，拿到bundle后手动获取classLoader也是一样的

调整web.xml放入bundleName参数

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE web-app
      PUBLIC "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
      "http://java.sun.com/dtd/web-app_2_3.dtd">
<web-app>
	<servlet>
		<servlet-name>SpringMVC</servlet-name>
		<servlet-class>
			org.springframework.web.servlet.DispatcherServlet
		</servlet-class>
		<init-param>
			<param-name>contextClass</param-name>
			<!--使用Java配置 -->
			<param-value>org.springframework.web.context.support.AnnotationConfigWebApplicationContext</param-value>
		</init-param>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<!--指定DispatcherServlet配置类 -->
			<param-value>com.fasnote.polarion.spring.web.WebAppConfig</param-value>
		</init-param>
        <init-param>
			<param-name>bundleName</param-name>
			<param-value>com.fasnote.polarion.spring.web</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<servlet-mapping>
		<servlet-name>SpringMVC</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>
	<filter>
		<filter-name>DoAsFilter</filter-name>
		<filter-class>com.polarion.portal.tomcat.servlets.DoAsFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>DoAsFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>

	<security-constraint>
		<web-resource-collection>
			<web-resource-name>All</web-resource-name>
			<url-pattern>/*</url-pattern>
		</web-resource-collection>
		<auth-constraint>
			<role-name>user</role-name>
		</auth-constraint>
	</security-constraint>

	<login-config>
		<auth-method>FORM</auth-method>
		<realm-name>PolarionRealm</realm-name>
		<form-login-config>
			<form-login-page>/login/login</form-login-page>
			<form-error-page>/login/error</form-error-page>
		</form-login-config>
	</login-config>

</web-app>

```

运行查看

![image-20221130173855627]({{ site.url }}\assets\images\post\image-20221130173855627.png)



这样就能正常进行web开发了

