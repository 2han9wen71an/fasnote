---
layout: post
title: Spring AOP + PageHelper分页
date: 2019-08-01 16:10:04
updated: 2019-08-01 16:12:12
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
  - PageHelper
---


 1. 增加依赖配置

    ```java
    <dependency>
      <groupId>org.aspectj</groupId>
      <artifactId>aspectjweaver</artifactId>
      <version>1.6.11</version>
    </dependency>
    
    <dependency>
      <groupId>org.aspectj</groupId>
      <artifactId>aspectjrt</artifactId>
      <version>1.6.11</version>
    </dependency>
    //增加pagehelper
    
    <dependency>
      <groupId>com.github.pagehelper</groupId>
      <artifactId>pagehelper</artifactId>
      <version>4.1.0</version>
    </dependency>
    ```

    

 2. 增加配置

    ```
    <context:component-scan base-package="com.example.controller"/>
    
       <!-- 启动对@AspectJ注解的支持 -->
       <aop:aspectj-autoproxy/>
    
    
       <!--启动springmvc注解-->
       <mvc:annotation-driven content-negotiation-manager="contentNegotiationManager" />
    ```

    

 3. 增加注解

    ```
    @Target({ElementType.PARAMETER, ElementType.METHOD})
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    public @interface EnablePaging {
        String value()  default "";
    }
    ```

    

 4. 增加AOP文件。
  这里约定最后两个参数是pageNum 和pageSize

  ```
  @Aspect
  @Component
  @Slf4j
  public class PageAop {
  
     @Pointcut("@annotation(com.example.annotation.EnablePaging)")
      public void serviceAspect(){
          log.info("serviceAspect");
      }
  
      @Before("serviceAspect()")
      public  void doBefore(JoinPoint joinPoint) {
          log.info("doBefore");
      }
  
   
  
  
      @Around(value = "serviceAspect()")
      public Object doAround(ProceedingJoinPoint point) throws  Throwable{
          log.info("doAround ");
          Object[] args = point.getArgs();
          Integer pageNum = 1;
          Integer pageSize = 10;
          if(args.length >= 2){
              pageNum = (Integer)args[args.length -2];
              pageSize = (Integer)args[args.length - 1];
          }
          PageHelper.startPage(pageNum, pageSize);
          return  point.proceed(args);
      }
  
   
  
  }
  ```

  

 5. Controller层

    ```
    @RequestMapping(value = "queryLogs")
      @EnablePaging
      @ResponseBody
      public  ServerResponse<PageInfo> queryLogs(HttpServletResponse response,
                                                        @RequestParam(value = "pageNum",defaultValue = "1") int pageNum,
                                                        @RequestParam(value = "pageSize",defaultValue = "10")int pageSize){
          List<Log> list =  iLogService.queryList(pageNum, pageSize);
          PageInfo pageInfo = new PageInfo(list);
          return ServerResponse.createBySuccess(pageInfo);
      }
    ```

    