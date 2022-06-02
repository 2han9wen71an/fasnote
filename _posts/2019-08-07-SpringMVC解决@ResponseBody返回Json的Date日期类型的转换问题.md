---
layout: post
title: SpringMVC解决@ResponseBody返回Json的Date日期类型的转换问题
date: 2019-08-07 19:25:39
updated: 2019-08-07 19:28:41
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
---


 在做这个项目时，我发现后台返回了json字符串形式的日期属性，前台无法获得转换后的日期格式。
 
 即使我已经配置了日期转换器:

    <bean id="conversionService"
    		class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
    		<property name="converters">
    			<set>
    				<bean class="cn.xtboke.util.DateConverter" />
    			</set>
    		</property>
    	</bean>
    package pers.kevin.mvcrest.converter;
     
    import org.springframework.core.convert.converter.Converter;
     
    import java.text.ParseException;
    import java.text.SimpleDateFormat;
    import java.util.Date;
     
    
    public class DateConverter implements Converter<String, Date> {
     
        @Override
        public Date convert(String source) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            dateFormat.setLenient(false);
            try {
                return dateFormat.parse(source);
            } catch (ParseException e) {
                e.printStackTrace();
            }
            return null;
        }
    }
结果前端收到的json字符串还是Long类型：
![请输入图片描述][1]
关于Spring MVC的Stirng和日期转换的，可以使用Converter和Formatter，Converter和Formatter都可以用于将一种对象类型转换成另一种对象类型。
我们现在重点解决关于返回json的时候出现的日期转换问题，@ResponseBody时返回json字符串的日期格式。Date类型属性默认返回一个Long型的时间戳，怎样能够返回自定义的日期格式？

 

经过查阅资料，总于找到了解决方法，需要加入如下配置：
   

    <mvc:annotation-driven>
            <mvc:message-converters>
                <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
                    <property name="objectMapper">
                        <bean class="com.fasterxml.jackson.databind.ObjectMapper">
                            <property name="dateFormat">
                                <bean class="java.text.SimpleDateFormat">
                                    <constructor-arg type="java.lang.String" value="yyyy-MM-dd" />
                                </bean>
                            </property>
                        </bean>
                    </property>
                </bean>
     
            </mvc:message-converters>
     
        </mvc:annotation-driven>
![请输入图片描述][2]
还有就是前端提交日期的json，格式为2018-07-26，日期字段希望能自动填充到后台controller方法的Date对象里。经过查阅资料，解决方法就是：

    Date日期字段加入注解 @DateTimeFormat(pattern = "yyyy-MM-dd")


  [1]: https://img-blog.csdn.net/20180726215058574?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Nja2V2aW5jeWg=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70
  [2]: https://img-blog.csdn.net/2018072621555752?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Nja2V2aW5jeWg=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70