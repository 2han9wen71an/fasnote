---
layout: post
title:  "Polarion系统Spring改造(OSGI)"
description: "调整Polarion系统自带的Spring用于支持OSGI动态扫描"
date:   2022-11-29 11:25:11 +0800
categories: 代码笔记
permalink: /CodeNotes/Polarion-Spring.html
tags: [Spring,OSGI,Polarion]
---

# 非Polarion系统准备Spring环境

## Spring全家桶Jar包下载

下载所有依赖可以参考这篇文章[使用mvn命令，下载工程的所有依赖软件包](https://www.fasnote.com/CodeNotes/mvn-copy-dependencies.html) 

这里附上一份pom.xml文件供大家使用

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.fasnote</groupId>
    <artifactId>jarDownLoad</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <!--你需要下载的jar包.-->
        <dependency>
		  <groupId>org.springframework</groupId>
		  <artifactId>spring-webmvc</artifactId>
		  <version>5.2.10.RELEASE</version>
		</dependency>
    </dependencies>
</project>
```

当然你也可以手动下载Spring相关的Jar包到本地

## 转换Jar包到OSGI Bundle

### 单个转换

这部分直接参考这篇文章[使用eclipse将非OSGi jar转换成OSGi的Bundle](https://www.fasnote.com/%E4%BB%A3%E7%A0%81%E7%AC%94%E8%AE%B0/%E4%BD%BF%E7%94%A8eclipse%E5%B0%86%E9%9D%9EOSGi_jar%E8%BD%AC%E6%8D%A2%E6%88%90OSGi%E7%9A%84Bundle.html)

把所有Spring的Jar包转换成OSGI Bundle后，我们需要对**core包**进行单独的配置，见后文

### 统一打包

新建一个全新插件，然后把上面所有的Jar包拖到Runtime中的ClassPath中，最后在Exported Packages中把所有的包都选择导出

![image-20221130155810196]({{ site.url }}\assets\images\post\image-20221130155810196.png)

# 修复在OSGI环境下自动扫描失效

## 自己编译的Core项目

打开**Core项目**，进入**META-INF目录下的MANIFEST.MF**文件
然后转到Dependencies栏，在Imported Packages下选择Add，添加**org.eclipse.core.runtime**

如果没有org.eclipse.core.runtime，请先检查Eclipse有没有正确配置OSGI环境

## Polarion 21版本以后自带的Spring包改造

找到**\polarion\plugins\org.springframework.spring-core_XX.RELEASE.jar**包，使用解压缩软件打开，进入到**META-INF目录下的MANIFEST.MF**文件，添加一行

```
Import-Package: org.osgi.framework;version="1.9.0"
```

保存提示文件被修改，点击确认就行，注意MANIFEST.MF的最后一行为空，不然会标红，但是貌似不影响使用

---

为什么要引入这个包呢？因为Spring扫描资源是由**PathMatchingResourcePatternResolver**类实现的，它对OSGI环境的支持就是在静态代码块中，利用当前类的类加载器读取这个包下的**FileLocator**类，然后反射调用**resolve**方法查询Class类，附上部分代码

```java
public class PathMatchingResourcePatternResolver implements ResourcePatternResolver {

	private static final Log logger = LogFactory.getLog(PathMatchingResourcePatternResolver.class);

	@Nullable
	private static Method equinoxResolveMethod;

	static {
		try {
			// Detect Equinox OSGi (e.g. on WebSphere 6.1)
			Class<?> fileLocatorClass = ClassUtils.forName("org.eclipse.core.runtime.FileLocator",
					PathMatchingResourcePatternResolver.class.getClassLoader());
			equinoxResolveMethod = fileLocatorClass.getMethod("resolve", URL.class);
			logger.trace("Found Equinox FileLocator for OSGi bundle URL resolution");
		}
		catch (Throwable ex) {
			equinoxResolveMethod = null;
		}
	}
	\\省略
}
```

如果不引入这个包，后续就不能使用自动扫描，只能手动在配置类中用@Bean注解来标识

# 测试

新建一个com.fasnote.test项目，用于测试在其他项目创建上下文，在Dependencies栏中，引入你所编译的spring-context包

主测试类

```java
import static org.junit.Assert.assertNotNull;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class AppContextTest {
	@Test
	public void testGetAppContext() {
		AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext();
		applicationContext.register(AppConfig.class);
		applicationContext.refresh();
		TestBean bean = applicationContext.getBean(TestBean.class);
		assertNotNull(bean);
		System.out.println(bean.hello());
	}
}
```

配置类

```java
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.ComponentScan;

@Configurable
@ComponentScan
public class AppConfig {

}
```

测试bean

```java
import org.springframework.stereotype.Component;

@Component
public class TestBean {
	public String hello() {
		return "Hello,Spring";
	}
}

```

结果![image-20221130154911472]({{ site.url }}\assets\images\post\image-20221130154911472.png)
