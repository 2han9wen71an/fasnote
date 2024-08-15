---
layout: post
title:  "Spring-Native踩坑并使用Docker部署"
description: ""
date:   2024-08-14 16:52:45 +0800
categories: 代码笔记
permalink: /CodeNotes/1F12D412.html
tags: [spring native docker]
---

# 前言
最近有一个小项目，没有历史包裹，直接使用最新的spring native进行构建。
在打包的时候，遇到了很多坑，虽然打包成功，但是在运行时，还是报错，特此写一篇文章记录下来。
# 首先是项目配置
我这边使用的是最新的spring-boot版本3.3.2
```xml
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.2</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
```
由于项目中使用了AWS的S3 SDK，所以需要添加依赖
```xml
 <dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-s3</artifactId>
    <version>1.12.767</version>
</dependency>
```
# 遇到的问题
## 本地打包成二进制启动报错
### AWS SDK报错
```
    Caused by: java.lang.ExceptionInInitializerError: null
    at com.amazonaws.util.VersionInfoUtils.userAgent(VersionInfoUtils.java:142) ~[na:na]
    at com.amazonaws.util.VersionInfoUtils.initializeUserAgent(VersionInfoUtils.java:137) ~[na:na]
    at com.amazonaws.util.VersionInfoUtils.getUserAgent(VersionInfoUtils.java:100) ~[na:na]
    at com.amazonaws.internal.EC2ResourceFetcher.<clinit>(EC2ResourceFetcher.java:44) ~[awsnativedemo:na]
    at java.base@20.0.2/java.lang.Class.ensureInitialized(DynamicHub.java:579) ~[awsnativedemo:na]
    at com.amazonaws.auth.InstanceMetadataServiceCredentialsFetcher.<init>(InstanceMetadataServiceCredentialsFetcher.java:37) ~[na:na]
    at com.amazonaws.auth.InstanceProfileCredentialsProvider.<init>(InstanceProfileCredentialsProvider.java:111) ~[na:na]
    at com.amazonaws.auth.InstanceProfileCredentialsProvider.<init>(InstanceProfileCredentialsProvider.java:91) ~[na:na]
    at com.amazonaws.auth.InstanceProfileCredentialsProvider.<init>(InstanceProfileCredentialsProvider.java:75) ~[na:na]
    at com.amazonaws.auth.InstanceProfileCredentialsProvider.<clinit>(InstanceProfileCredentialsProvider.java:58) ~[na:na]
    at com.amazonaws.auth.EC2ContainerCredentialsProviderWrapper.initializeProvider(EC2ContainerCredentialsProviderWrapper.java:64) ~[na:na]
    at com.amazonaws.auth.EC2ContainerCredentialsProviderWrapper.<init>(EC2ContainerCredentialsProviderWrapper.java:53) ~[na:na]
    at com.amazonaws.auth.DefaultAWSCredentialsProviderChain.<init>(DefaultAWSCredentialsProviderChain.java:49) ~[awsnativedemo:na]
    at com.amazonaws.auth.DefaultAWSCredentialsProviderChain.<clinit>(DefaultAWSCredentialsProviderChain.java:43) ~[awsnativedemo:na]
    at java.base@20.0.2/java.lang.Class.ensureInitialized(DynamicHub.java:579) ~[awsnativedemo:na]
    at com.amazonaws.services.s3.AmazonS3ClientBuilder.standard(AmazonS3ClientBuilder.java:46) ~[awsnativedemo:na]
    at com.example.awsnativedemo.S3ClientConfig.s3Client(S3ClientConfig.kt:19) ~[awsnativedemo:na]
    at com.example.awsnativedemo.S3ClientConfig$$SpringCGLIB$$0.CGLIB$s3Client$0(<generated>) ~[awsnativedemo:na]
    at com.example.awsnativedemo.S3ClientConfig$$SpringCGLIB$$2.invoke(<generated>) ~[awsnativedemo:na]
    at org.springframework.cglib.proxy.MethodProxy.invokeSuper(MethodProxy.java:258) ~[awsnativedemo:6.0.12]
    at org.springframework.context.annotation.ConfigurationClassEnhancer$BeanMethodInterceptor.intercept(ConfigurationClassEnhancer.java:331) ~[na:na]
    at com.example.awsnativedemo.S3ClientConfig$$SpringCGLIB$$0.s3Client(<generated>) ~[awsnativedemo:na]
    at com.example.awsnativedemo.S3ClientConfig__BeanDefinitions.lambda$getSClientInstanceSupplier$1(S3ClientConfig__BeanDefinitions.java:37) ~[na:na]
    at org.springframework.util.function.ThrowingFunction.apply(ThrowingFunction.java:63) ~[awsnativedemo:6.0.12]
    at org.springframework.util.function.ThrowingFunction.apply(ThrowingFunction.java:51) ~[awsnativedemo:6.0.12]
    at org.springframework.beans.factory.aot.BeanInstanceSupplier.lambda$withGenerator$0(BeanInstanceSupplier.java:167) ~[na:na]
    at org.springframework.util.function.ThrowingBiFunction.apply(ThrowingBiFunction.java:68) ~[awsnativedemo:6.0.12]
    at org.springframework.util.function.ThrowingBiFunction.apply(ThrowingBiFunction.java:54) ~[awsnativedemo:6.0.12]
    at org.springframework.beans.factory.aot.BeanInstanceSupplier.lambda$get$2(BeanInstanceSupplier.java:202) ~[na:na]
    at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:58) ~[awsnativedemo:6.0.12]
    at org.springframework.util.function.ThrowingSupplier.get(ThrowingSupplier.java:46) ~[awsnativedemo:6.0.12]
    at org.springframework.beans.factory.aot.BeanInstanceSupplier.invokeBeanSupplier(BeanInstanceSupplier.java:214) ~[na:na]
    at org.springframework.beans.factory.aot.BeanInstanceSupplier.get(BeanInstanceSupplier.java:202) ~[na:na]
    at org.springframework.beans.factory.support.DefaultListableBeanFactory.obtainInstanceFromSupplier(DefaultListableBeanFactory.java:947) ~[awsnativedemo:6.0.12]
    at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.obtainFromSupplier(AbstractAutowireCapableBeanFactory.java:1214) ~[awsnativedemo:6.0.12]
            ... 34 common frames omitted
    Caused by: java.lang.IllegalArgumentException: null
    at com.amazonaws.internal.config.InternalConfig.loadfrom(InternalConfig.java:260) ~[na:na]
    at com.amazonaws.internal.config.InternalConfig.load(InternalConfig.java:274) ~[na:na]
    at com.amazonaws.internal.config.InternalConfig$Factory.<clinit>(InternalConfig.java:347) ~[na:na]
            ... 69 common frames omitted
```
参考AWS的issue[InternalConfig throws exception in runtime with native application](https://github.com/aws/aws-sdk-java/issues/3035)，解决方法如下：
```java
    package com.amazonaws.http.conn;

    import com.amazonaws.services.s3.internal.AWSS3V4Signer;
    import org.springframework.aot.hint.ExecutableMode;
    import org.springframework.aot.hint.RuntimeHints;
    import org.springframework.aot.hint.RuntimeHintsRegistrar;
    import org.springframework.core.io.ClassPathResource;
    
    import java.util.HashSet;
    
    public class ApplicationRuntimeHints implements RuntimeHintsRegistrar {
    
        @Override
        public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
            hints.resources().registerResource(new ClassPathResource("com/amazonaws/internal/config/awssdk_config_default.json"));
            hints.resources().registerResource(new ClassPathResource("com/amazonaws/partitions/endpoints.json"));
            hints.resources().registerResource(new ClassPathResource("com/amazonaws/sdk/versionInfo.properties"));
    
    
            hints.resources().registerResource(new ClassPathResource("org/joda/time/tz/data/ZoneInfoMap"));
    
            for (var constructor : HashSet.class.getDeclaredConstructors()) {
                hints.reflection().registerConstructor(constructor, ExecutableMode.INVOKE);
            }
            for (var constructor : AWSS3V4Signer.class.getDeclaredConstructors()) {
                hints.reflection().registerConstructor(constructor, ExecutableMode.INVOKE);
            }
    
            hints.proxies().registerJdkProxy(org.apache.http.conn.HttpClientConnectionManager.class,
                    org.apache.http.pool.ConnPoolControl.class,com.amazonaws.http.conn.Wrapped.class);
    
    
            hints.proxies().registerJdkProxy(org.apache.http.conn.ConnectionRequest.class,com.amazonaws.http.conn.Wrapped.class);
        }
    }

```
这里要注意，`com.amazonaws.http.conn.Wrapped` 是私有接口，所以我这个类的包名和`com.amazonaws.http.conn.Wrapped`的包名要一致。
### Mybatis-plus报错
解决办法参考[SpringBoot3支持问题](https://github.com/baomidou/mybatis-plus/issues/5527)
```java
    import com.baomidou.mybatisplus.annotation.IEnum;
    import com.baomidou.mybatisplus.core.MybatisParameterHandler;
    import com.baomidou.mybatisplus.core.MybatisXMLLanguageDriver;
    import com.baomidou.mybatisplus.core.conditions.AbstractWrapper;
    import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
    import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
    import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
    import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
    import com.baomidou.mybatisplus.core.handlers.CompositeEnumTypeHandler;
    import com.baomidou.mybatisplus.core.handlers.MybatisEnumTypeHandler;
    import com.baomidou.mybatisplus.core.toolkit.support.SFunction;
    import com.baomidou.mybatisplus.core.toolkit.support.SerializedLambda;
    import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
    import com.baomidou.mybatisplus.extension.handlers.GsonTypeHandler;
    import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
    import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
    import org.apache.commons.logging.LogFactory;
    import org.apache.ibatis.annotations.DeleteProvider;
    import org.apache.ibatis.annotations.InsertProvider;
    import org.apache.ibatis.annotations.SelectProvider;
    import org.apache.ibatis.annotations.UpdateProvider;
    import org.apache.ibatis.cache.decorators.FifoCache;
    import org.apache.ibatis.cache.decorators.LruCache;
    import org.apache.ibatis.cache.decorators.SoftCache;
    import org.apache.ibatis.cache.decorators.WeakCache;
    import org.apache.ibatis.cache.impl.PerpetualCache;
    import org.apache.ibatis.executor.Executor;
    import org.apache.ibatis.executor.parameter.ParameterHandler;
    import org.apache.ibatis.executor.resultset.ResultSetHandler;
    import org.apache.ibatis.executor.statement.BaseStatementHandler;
    import org.apache.ibatis.executor.statement.RoutingStatementHandler;
    import org.apache.ibatis.executor.statement.StatementHandler;
    import org.apache.ibatis.javassist.util.proxy.ProxyFactory;
    import org.apache.ibatis.javassist.util.proxy.RuntimeSupport;
    import org.apache.ibatis.logging.Log;
    import org.apache.ibatis.logging.commons.JakartaCommonsLoggingImpl;
    import org.apache.ibatis.logging.jdk14.Jdk14LoggingImpl;
    import org.apache.ibatis.logging.log4j2.Log4j2Impl;
    import org.apache.ibatis.logging.nologging.NoLoggingImpl;
    import org.apache.ibatis.logging.slf4j.Slf4jImpl;
    import org.apache.ibatis.logging.stdout.StdOutImpl;
    import org.apache.ibatis.mapping.BoundSql;
    import org.apache.ibatis.reflection.TypeParameterResolver;
    import org.apache.ibatis.scripting.defaults.RawLanguageDriver;
    import org.apache.ibatis.scripting.xmltags.XMLLanguageDriver;
    import org.apache.ibatis.session.SqlSessionFactory;
    import org.mybatis.spring.SqlSessionFactoryBean;
    import org.mybatis.spring.SqlSessionTemplate;
    import org.mybatis.spring.mapper.MapperFactoryBean;
    import org.mybatis.spring.mapper.MapperScannerConfigurer;
    import org.springframework.aot.hint.MemberCategory;
    import org.springframework.aot.hint.RuntimeHints;
    import org.springframework.aot.hint.RuntimeHintsRegistrar;
    import org.springframework.beans.PropertyValue;
    import org.springframework.beans.factory.BeanFactory;
    import org.springframework.beans.factory.BeanFactoryAware;
    import org.springframework.beans.factory.aot.BeanFactoryInitializationAotContribution;
    import org.springframework.beans.factory.aot.BeanFactoryInitializationAotProcessor;
    import org.springframework.beans.factory.aot.BeanRegistrationExcludeFilter;
    import org.springframework.beans.factory.config.*;
    import org.springframework.beans.factory.support.MergedBeanDefinitionPostProcessor;
    import org.springframework.beans.factory.support.RegisteredBean;
    import org.springframework.beans.factory.support.RootBeanDefinition;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.context.annotation.ImportRuntimeHints;
    import org.springframework.core.ResolvableType;
    import org.springframework.util.ClassUtils;
    import org.springframework.util.ReflectionUtils;
    
    import java.lang.annotation.Annotation;
    import java.lang.reflect.Method;
    import java.lang.reflect.ParameterizedType;
    import java.lang.reflect.Type;
    import java.util.ArrayList;
    import java.util.HashMap;
    import java.util.HashSet;
    import java.util.Map;
    import java.util.Set;
    import java.util.TreeSet;
    import java.util.function.Function;
    import java.util.stream.Collectors;
    import java.util.stream.Stream;
    
    /**
     * This configuration will move to mybatis-spring-native.
     */
    @Configuration(proxyBeanMethods = false)
    @ImportRuntimeHints(MyBatisNativeConfiguration.MyBaitsRuntimeHintsRegistrar.class)
    public class MyBatisNativeConfiguration {
    
        @Bean
        MyBatisBeanFactoryInitializationAotProcessor myBatisBeanFactoryInitializationAotProcessor() {
            return new MyBatisBeanFactoryInitializationAotProcessor();
        }
    
        @Bean
        static MyBatisMapperFactoryBeanPostProcessor myBatisMapperFactoryBeanPostProcessor() {
            return new MyBatisMapperFactoryBeanPostProcessor();
        }
    
        static class MyBaitsRuntimeHintsRegistrar implements RuntimeHintsRegistrar {
    
            @Override
            public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
                Stream.of(RawLanguageDriver.class,
                        // TODO 增加了MybatisXMLLanguageDriver.class
                        XMLLanguageDriver.class, MybatisXMLLanguageDriver.class,
                        RuntimeSupport.class,
                        ProxyFactory.class,
                        Slf4jImpl.class,
                        Log.class,
                        JakartaCommonsLoggingImpl.class,
                        Log4j2Impl.class,
                        Jdk14LoggingImpl.class,
                        StdOutImpl.class,
                        NoLoggingImpl.class,
                        SqlSessionFactory.class,
                        PerpetualCache.class,
                        FifoCache.class,
                        LruCache.class,
                        SoftCache.class,
                        WeakCache.class,
                        //TODO 增加了MybatisSqlSessionFactoryBean.class
                        SqlSessionFactoryBean.class, MybatisSqlSessionFactoryBean.class,
                        ArrayList.class,
                        HashMap.class,
                        TreeSet.class,
                        HashSet.class
                ).forEach(x -> hints.reflection().registerType(x, MemberCategory.values()));
                Stream.of(
                        "org/apache/ibatis/builder/xml/*.dtd",
                        "org/apache/ibatis/builder/xml/*.xsd"
                ).forEach(hints.resources()::registerPattern);
    
                hints.serialization().registerType(SerializedLambda.class);
                hints.serialization().registerType(SFunction.class);
                hints.serialization().registerType(java.lang.invoke.SerializedLambda.class);
                hints.reflection().registerType(SFunction.class);
                hints.reflection().registerType(SerializedLambda.class);
                hints.reflection().registerType(java.lang.invoke.SerializedLambda.class);
    
                hints.proxies().registerJdkProxy(StatementHandler.class);
                hints.proxies().registerJdkProxy(Executor.class);
                hints.proxies().registerJdkProxy(ResultSetHandler.class);
                hints.proxies().registerJdkProxy(ParameterHandler.class);
    
                //        hints.reflection().registerType(MybatisPlusInterceptor.class);
                hints.reflection().registerType(AbstractWrapper.class, MemberCategory.values());
                hints.reflection().registerType(LambdaQueryWrapper.class, MemberCategory.values());
                hints.reflection().registerType(LambdaUpdateWrapper.class, MemberCategory.values());
                hints.reflection().registerType(UpdateWrapper.class, MemberCategory.values());
                hints.reflection().registerType(QueryWrapper.class, MemberCategory.values());
    
                hints.reflection().registerType(BoundSql.class, MemberCategory.DECLARED_FIELDS);
                hints.reflection().registerType(RoutingStatementHandler.class, MemberCategory.DECLARED_FIELDS);
                hints.reflection().registerType(BaseStatementHandler.class, MemberCategory.DECLARED_FIELDS);
                hints.reflection().registerType(MybatisParameterHandler.class, MemberCategory.DECLARED_FIELDS);
    
    
                hints.reflection().registerType(IEnum.class, MemberCategory.INVOKE_PUBLIC_METHODS);
                // register typeHandler
                hints.reflection().registerType(CompositeEnumTypeHandler.class, MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS);
                hints.reflection().registerType(FastjsonTypeHandler.class, MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS);
                hints.reflection().registerType(GsonTypeHandler.class, MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS);
                hints.reflection().registerType(JacksonTypeHandler.class, MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS);
                hints.reflection().registerType(MybatisEnumTypeHandler.class, MemberCategory.INVOKE_PUBLIC_CONSTRUCTORS);
            }
        }
    
        static class MyBatisBeanFactoryInitializationAotProcessor
                implements BeanFactoryInitializationAotProcessor, BeanRegistrationExcludeFilter {
    
            private final Set<Class<?>> excludeClasses = new HashSet<>();
    
            MyBatisBeanFactoryInitializationAotProcessor() {
                excludeClasses.add(MapperScannerConfigurer.class);
            }
    
            @Override
            public boolean isExcludedFromAotProcessing(RegisteredBean registeredBean) {
                return excludeClasses.contains(registeredBean.getBeanClass());
            }
    
            @Override
            public BeanFactoryInitializationAotContribution processAheadOfTime(ConfigurableListableBeanFactory beanFactory) {
                String[] beanNames = beanFactory.getBeanNamesForType(MapperFactoryBean.class);
                if (beanNames.length == 0) {
                    return null;
                }
                return (context, code) -> {
                    RuntimeHints hints = context.getRuntimeHints();
                    for (String beanName : beanNames) {
                        BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanName.substring(1));
                        PropertyValue mapperInterface = beanDefinition.getPropertyValues().getPropertyValue("mapperInterface");
                        if (mapperInterface != null && mapperInterface.getValue() != null) {
                            Class<?> mapperInterfaceType = (Class<?>) mapperInterface.getValue();
                            if (mapperInterfaceType != null) {
                                registerReflectionTypeIfNecessary(mapperInterfaceType, hints);
                                hints.proxies().registerJdkProxy(mapperInterfaceType);
                                hints.resources()
                                        .registerPattern(mapperInterfaceType.getName().replace('.', '/').concat(".xml"));
                                registerMapperRelationships(mapperInterfaceType, hints);
                            }
                        }
                    }
                };
            }
    
            private void registerMapperRelationships(Class<?> mapperInterfaceType, RuntimeHints hints) {
                Method[] methods = ReflectionUtils.getAllDeclaredMethods(mapperInterfaceType);
                for (Method method : methods) {
                    if (method.getDeclaringClass() != Object.class) {
                        ReflectionUtils.makeAccessible(method);
                        registerSqlProviderTypes(method, hints, SelectProvider.class, SelectProvider::value, SelectProvider::type);
                        registerSqlProviderTypes(method, hints, InsertProvider.class, InsertProvider::value, InsertProvider::type);
                        registerSqlProviderTypes(method, hints, UpdateProvider.class, UpdateProvider::value, UpdateProvider::type);
                        registerSqlProviderTypes(method, hints, DeleteProvider.class, DeleteProvider::value, DeleteProvider::type);
                        Class<?> returnType = MyBatisMapperTypeUtils.resolveReturnClass(mapperInterfaceType, method);
                        registerReflectionTypeIfNecessary(returnType, hints);
                        MyBatisMapperTypeUtils.resolveParameterClasses(mapperInterfaceType, method)
                                .forEach(x -> registerReflectionTypeIfNecessary(x, hints));
                    }
                }
            }
    
            @SafeVarargs
            private <T extends Annotation> void registerSqlProviderTypes(
                    Method method, RuntimeHints hints, Class<T> annotationType, Function<T, Class<?>>... providerTypeResolvers) {
                for (T annotation : method.getAnnotationsByType(annotationType)) {
                    for (Function<T, Class<?>> providerTypeResolver : providerTypeResolvers) {
                        registerReflectionTypeIfNecessary(providerTypeResolver.apply(annotation), hints);
                    }
                }
            }
    
            private void registerReflectionTypeIfNecessary(Class<?> type, RuntimeHints hints) {
                if (!type.isPrimitive() && !type.getName().startsWith("java")) {
                    hints.reflection().registerType(type, MemberCategory.values());
                }
            }
    
        }
    
        static class MyBatisMapperTypeUtils {
            private MyBatisMapperTypeUtils() {
                // NOP
            }
    
            static Class<?> resolveReturnClass(Class<?> mapperInterface, Method method) {
                Type resolvedReturnType = TypeParameterResolver.resolveReturnType(method, mapperInterface);
                return typeToClass(resolvedReturnType, method.getReturnType());
            }
    
            static Set<Class<?>> resolveParameterClasses(Class<?> mapperInterface, Method method) {
                return Stream.of(TypeParameterResolver.resolveParamTypes(method, mapperInterface))
                        .map(x -> typeToClass(x, x instanceof Class ? (Class<?>) x : Object.class)).collect(Collectors.toSet());
            }
    
            private static Class<?> typeToClass(Type src, Class<?> fallback) {
                Class<?> result = null;
                if (src instanceof Class<?>) {
                    if (((Class<?>) src).isArray()) {
                        result = ((Class<?>) src).getComponentType();
                    } else {
                        result = (Class<?>) src;
                    }
                } else if (src instanceof ParameterizedType) {
                    ParameterizedType parameterizedType = (ParameterizedType) src;
                    int index = (parameterizedType.getRawType() instanceof Class
                            && Map.class.isAssignableFrom((Class<?>) parameterizedType.getRawType())
                            && parameterizedType.getActualTypeArguments().length > 1) ? 1 : 0;
                    Type actualType = parameterizedType.getActualTypeArguments()[index];
                    result = typeToClass(actualType, fallback);
                }
                if (result == null) {
                    result = fallback;
                }
                return result;
            }
    
        }
    
        static class MyBatisMapperFactoryBeanPostProcessor implements MergedBeanDefinitionPostProcessor, BeanFactoryAware {
    
            private static final org.apache.commons.logging.Log LOG = LogFactory.getLog(
                    MyBatisMapperFactoryBeanPostProcessor.class);
    
            private static final String MAPPER_FACTORY_BEAN = "org.mybatis.spring.mapper.MapperFactoryBean";
    
            private ConfigurableBeanFactory beanFactory;
    
            @Override
            public void setBeanFactory(BeanFactory beanFactory) {
                this.beanFactory = (ConfigurableBeanFactory) beanFactory;
            }
    
            @Override
            public void postProcessMergedBeanDefinition(RootBeanDefinition beanDefinition, Class<?> beanType, String beanName) {
                if (ClassUtils.isPresent(MAPPER_FACTORY_BEAN, this.beanFactory.getBeanClassLoader())) {
                    resolveMapperFactoryBeanTypeIfNecessary(beanDefinition);
                }
            }
    
            private void resolveMapperFactoryBeanTypeIfNecessary(RootBeanDefinition beanDefinition) {
                if (!beanDefinition.hasBeanClass() || !MapperFactoryBean.class.isAssignableFrom(beanDefinition.getBeanClass())) {
                    return;
                }
                if (beanDefinition.getResolvableType().hasUnresolvableGenerics()) {
                    Class<?> mapperInterface = getMapperInterface(beanDefinition);
                    if (mapperInterface != null) {
                        // Exposes a generic type information to context for prevent early initializing
                        ConstructorArgumentValues constructorArgumentValues = new ConstructorArgumentValues();
                        constructorArgumentValues.addGenericArgumentValue(mapperInterface);
                        beanDefinition.setConstructorArgumentValues(constructorArgumentValues);
                        beanDefinition.setTargetType(ResolvableType.forClassWithGenerics(beanDefinition.getBeanClass(), mapperInterface));
                        beanDefinition.getPropertyValues().addPropertyValue(
                                "sqlSessionTemplate", new RuntimeBeanReference(SqlSessionTemplate.class));
                    }
                }
            }
    
            private Class<?> getMapperInterface(RootBeanDefinition beanDefinition) {
                try {
                    return (Class<?>) beanDefinition.getPropertyValues().get("mapperInterface");
                } catch (Exception e) {
                    LOG.debug("Fail getting mapper interface type.", e);
                    return null;
                }
            }
    
        }
    }

```
这里我项目没有使用Lambda表达式，所以没有修复Lambda表达式相关的问题。至此依赖都已解决。
# 打包运行报错
## 直接使用spring-boot打包运行
命令行运行 `mvn clean package -Pnative` 后,构建成native镜像 `mvn spring-boot:build-image`，然后运行 `docker run -it --rm -v ./logs/:/workspace/logs/   --name my-app my-app:0.0.1-SNAPSHOT`

由于项目使用了日志框架LogBack,用于自定义日志等级格式，此时启动时会报错，报错信息如下：
```
Logging system failed to initialize using configuration from 'null'
java.lang.IllegalStateException: Logback configuration error detected: 
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_info] - openFile(logs/application-info.log,true) call failed. java.io.FileNotFoundException: logs/application-info.log (Permission denied)
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_error] - openFile(logs/application-error.log,true) call failed. java.io.FileNotFoundException: logs/application-error.log (Permission denied)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.reportConfigurationErrorsIfNecessary(LogbackLoggingSystem.java:282)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.initializeFromAotGeneratedArtifactsIfPossible(LogbackLoggingSystem.java:218)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.initialize(LogbackLoggingSystem.java:192)
        at org.springframework.boot.context.logging.LoggingApplicationListener.initializeSystem(LoggingApplicationListener.java:332)
        at org.springframework.boot.context.logging.LoggingApplicationListener.initialize(LoggingApplicationListener.java:298)
        at org.springframework.boot.context.logging.LoggingApplicationListener.onApplicationEnvironmentPreparedEvent(LoggingApplicationListener.java:246)
        at org.springframework.boot.context.logging.LoggingApplicationListener.onApplicationEvent(LoggingApplicationListener.java:223)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:185)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:178)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:156)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:138)
        at org.springframework.boot.context.event.EventPublishingRunListener.multicastInitialEvent(EventPublishingRunListener.java:136)
        at org.springframework.boot.context.event.EventPublishingRunListener.environmentPrepared(EventPublishingRunListener.java:81)
        at org.springframework.boot.SpringApplicationRunListeners.lambda$environmentPrepared$2(SpringApplicationRunListeners.java:64)
        at java.base@21.0.2/java.lang.Iterable.forEach(Iterable.java:75)
        at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:118)
        at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:112)
        at org.springframework.boot.SpringApplicationRunListeners.environmentPrepared(SpringApplicationRunListeners.java:63)
        at org.springframework.boot.SpringApplication.prepareEnvironment(SpringApplication.java:370)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:330)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1363)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1352)
        at com.hozon.filestorage.FileStorageApplication.main(FileStorageApplication.java:35)
        at java.base@21.0.2/java.lang.invoke.LambdaForm$DMH/sa346b79c.invokeStaticInit(LambdaForm$DMH)
        Suppressed: java.io.FileNotFoundException: logs/application-info.log (Permission denied)
                at java.base@21.0.2/java.io.FileOutputStream.open0(Native Method)
                at java.base@21.0.2/java.io.FileOutputStream.open(FileOutputStream.java:289)
                at java.base@21.0.2/java.io.FileOutputStream.<init>(FileOutputStream.java:230)
                at ch.qos.logback.core.recovery.ResilientFileOutputStream.<init>(ResilientFileOutputStream.java:26)
                at ch.qos.logback.core.FileAppender.openFile(FileAppender.java:206)
                at ch.qos.logback.core.FileAppender.start(FileAppender.java:126)
                at ch.qos.logback.core.rolling.RollingFileAppender.start(RollingFileAppender.java:103)
                at ch.qos.logback.core.model.processor.AppenderModelHandler.postHandle(AppenderModelHandler.java:84)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:257)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:253)
                at ch.qos.logback.core.model.processor.DefaultProcessor.traversalLoop(DefaultProcessor.java:90)
                at ch.qos.logback.core.model.processor.DefaultProcessor.process(DefaultProcessor.java:106)
                at ch.qos.logback.core.joran.GenericXMLConfigurator.processModel(GenericXMLConfigurator.java:216)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.processModel(SpringBootJoranConfigurator.java:133)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.configureUsingAotGeneratedArtifacts(SpringBootJoranConfigurator.java:126)
                at org.springframework.boot.logging.logback.LogbackLoggingSystem.initializeFromAotGeneratedArtifactsIfPossible(LogbackLoggingSystem.java:216)
                ... 22 more
        Suppressed: java.io.FileNotFoundException: logs/application-error.log (Permission denied)
                at java.base@21.0.2/java.io.FileOutputStream.open0(Native Method)
                at java.base@21.0.2/java.io.FileOutputStream.open(FileOutputStream.java:289)
                at java.base@21.0.2/java.io.FileOutputStream.<init>(FileOutputStream.java:230)
                at ch.qos.logback.core.recovery.ResilientFileOutputStream.<init>(ResilientFileOutputStream.java:26)
                at ch.qos.logback.core.FileAppender.openFile(FileAppender.java:206)
                at ch.qos.logback.core.FileAppender.start(FileAppender.java:126)
                at ch.qos.logback.core.rolling.RollingFileAppender.start(RollingFileAppender.java:103)
                at ch.qos.logback.core.model.processor.AppenderModelHandler.postHandle(AppenderModelHandler.java:84)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:257)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:253)
                at ch.qos.logback.core.model.processor.DefaultProcessor.traversalLoop(DefaultProcessor.java:90)
                at ch.qos.logback.core.model.processor.DefaultProcessor.process(DefaultProcessor.java:106)
                at ch.qos.logback.core.joran.GenericXMLConfigurator.processModel(GenericXMLConfigurator.java:216)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.processModel(SpringBootJoranConfigurator.java:133)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.configureUsingAotGeneratedArtifacts(SpringBootJoranConfigurator.java:126)
                at org.springframework.boot.logging.logback.LogbackLoggingSystem.initializeFromAotGeneratedArtifactsIfPossible(LogbackLoggingSystem.java:216)
                ... 22 more
Application run failed
java.lang.IllegalStateException: java.lang.IllegalStateException: Logback configuration error detected: 
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_info] - openFile(logs/application-info.log,true) call failed. java.io.FileNotFoundException: logs/application-info.log (Permission denied)
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_error] - openFile(logs/application-error.log,true) call failed. java.io.FileNotFoundException: logs/application-error.log (Permission denied)
        at org.springframework.boot.context.logging.LoggingApplicationListener.initializeSystem(LoggingApplicationListener.java:347)
        at org.springframework.boot.context.logging.LoggingApplicationListener.initialize(LoggingApplicationListener.java:298)
        at org.springframework.boot.context.logging.LoggingApplicationListener.onApplicationEnvironmentPreparedEvent(LoggingApplicationListener.java:246)
        at org.springframework.boot.context.logging.LoggingApplicationListener.onApplicationEvent(LoggingApplicationListener.java:223)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:185)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:178)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:156)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:138)
        at org.springframework.boot.context.event.EventPublishingRunListener.multicastInitialEvent(EventPublishingRunListener.java:136)
        at org.springframework.boot.context.event.EventPublishingRunListener.environmentPrepared(EventPublishingRunListener.java:81)
        at org.springframework.boot.SpringApplicationRunListeners.lambda$environmentPrepared$2(SpringApplicationRunListeners.java:64)
        at java.base@21.0.2/java.lang.Iterable.forEach(Iterable.java:75)
        at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:118)
        at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:112)
        at org.springframework.boot.SpringApplicationRunListeners.environmentPrepared(SpringApplicationRunListeners.java:63)
        at org.springframework.boot.SpringApplication.prepareEnvironment(SpringApplication.java:370)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:330)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1363)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1352)
        at com.hozon.filestorage.FileStorageApplication.main(FileStorageApplication.java:35)
        at java.base@21.0.2/java.lang.invoke.LambdaForm$DMH/sa346b79c.invokeStaticInit(LambdaForm$DMH)
Caused by: java.lang.IllegalStateException: Logback configuration error detected: 
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_info] - openFile(logs/application-info.log,true) call failed. java.io.FileNotFoundException: logs/application-info.log (Permission denied)
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_error] - openFile(logs/application-error.log,true) call failed. java.io.FileNotFoundException: logs/application-error.log (Permission denied)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.reportConfigurationErrorsIfNecessary(LogbackLoggingSystem.java:282)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.initializeFromAotGeneratedArtifactsIfPossible(LogbackLoggingSystem.java:218)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.initialize(LogbackLoggingSystem.java:192)
        at org.springframework.boot.context.logging.LoggingApplicationListener.initializeSystem(LoggingApplicationListener.java:332)
        ... 20 more
        Suppressed: java.io.FileNotFoundException: logs/application-info.log (Permission denied)
                at java.base@21.0.2/java.io.FileOutputStream.open0(Native Method)
                at java.base@21.0.2/java.io.FileOutputStream.open(FileOutputStream.java:289)
                at java.base@21.0.2/java.io.FileOutputStream.<init>(FileOutputStream.java:230)
                at ch.qos.logback.core.recovery.ResilientFileOutputStream.<init>(ResilientFileOutputStream.java:26)
                at ch.qos.logback.core.FileAppender.openFile(FileAppender.java:206)
                at ch.qos.logback.core.FileAppender.start(FileAppender.java:126)
                at ch.qos.logback.core.rolling.RollingFileAppender.start(RollingFileAppender.java:103)
                at ch.qos.logback.core.model.processor.AppenderModelHandler.postHandle(AppenderModelHandler.java:84)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:257)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:253)
                at ch.qos.logback.core.model.processor.DefaultProcessor.traversalLoop(DefaultProcessor.java:90)
                at ch.qos.logback.core.model.processor.DefaultProcessor.process(DefaultProcessor.java:106)
                at ch.qos.logback.core.joran.GenericXMLConfigurator.processModel(GenericXMLConfigurator.java:216)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.processModel(SpringBootJoranConfigurator.java:133)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.configureUsingAotGeneratedArtifacts(SpringBootJoranConfigurator.java:126)
                at org.springframework.boot.logging.logback.LogbackLoggingSystem.initializeFromAotGeneratedArtifactsIfPossible(LogbackLoggingSystem.java:216)
                ... 22 more
        Suppressed: java.io.FileNotFoundException: logs/application-error.log (Permission denied)
                at java.base@21.0.2/java.io.FileOutputStream.open0(Native Method)
                at java.base@21.0.2/java.io.FileOutputStream.open(FileOutputStream.java:289)
                at java.base@21.0.2/java.io.FileOutputStream.<init>(FileOutputStream.java:230)
                at ch.qos.logback.core.recovery.ResilientFileOutputStream.<init>(ResilientFileOutputStream.java:26)
                at ch.qos.logback.core.FileAppender.openFile(FileAppender.java:206)
                at ch.qos.logback.core.FileAppender.start(FileAppender.java:126)
                at ch.qos.logback.core.rolling.RollingFileAppender.start(RollingFileAppender.java:103)
                at ch.qos.logback.core.model.processor.AppenderModelHandler.postHandle(AppenderModelHandler.java:84)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:257)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:253)
                at ch.qos.logback.core.model.processor.DefaultProcessor.traversalLoop(DefaultProcessor.java:90)
                at ch.qos.logback.core.model.processor.DefaultProcessor.process(DefaultProcessor.java:106)
                at ch.qos.logback.core.joran.GenericXMLConfigurator.processModel(GenericXMLConfigurator.java:216)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.processModel(SpringBootJoranConfigurator.java:133)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.configureUsingAotGeneratedArtifacts(SpringBootJoranConfigurator.java:126)
                at org.springframework.boot.logging.logback.LogbackLoggingSystem.initializeFromAotGeneratedArtifactsIfPossible(LogbackLoggingSystem.java:216)
                ... 22 more
Exception in thread "main" java.lang.IllegalStateException: java.lang.IllegalStateException: Logback configuration error detected: 
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_info] - openFile(logs/application-info.log,true) call failed. java.io.FileNotFoundException: logs/application-info.log (Permission denied)
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_error] - openFile(logs/application-error.log,true) call failed. java.io.FileNotFoundException: logs/application-error.log (Permission denied)
        at org.springframework.boot.context.logging.LoggingApplicationListener.initializeSystem(LoggingApplicationListener.java:347)
        at org.springframework.boot.context.logging.LoggingApplicationListener.initialize(LoggingApplicationListener.java:298)
        at org.springframework.boot.context.logging.LoggingApplicationListener.onApplicationEnvironmentPreparedEvent(LoggingApplicationListener.java:246)
        at org.springframework.boot.context.logging.LoggingApplicationListener.onApplicationEvent(LoggingApplicationListener.java:223)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:185)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:178)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:156)
        at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:138)
        at org.springframework.boot.context.event.EventPublishingRunListener.multicastInitialEvent(EventPublishingRunListener.java:136)
        at org.springframework.boot.context.event.EventPublishingRunListener.environmentPrepared(EventPublishingRunListener.java:81)
        at org.springframework.boot.SpringApplicationRunListeners.lambda$environmentPrepared$2(SpringApplicationRunListeners.java:64)
        at java.base@21.0.2/java.lang.Iterable.forEach(Iterable.java:75)
        at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:118)
        at org.springframework.boot.SpringApplicationRunListeners.doWithListeners(SpringApplicationRunListeners.java:112)
        at org.springframework.boot.SpringApplicationRunListeners.environmentPrepared(SpringApplicationRunListeners.java:63)
        at org.springframework.boot.SpringApplication.prepareEnvironment(SpringApplication.java:370)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:330)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1363)
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1352)
        at com.hozon.filestorage.FileStorageApplication.main(FileStorageApplication.java:35)
        at java.base@21.0.2/java.lang.invoke.LambdaForm$DMH/sa346b79c.invokeStaticInit(LambdaForm$DMH)
Caused by: java.lang.IllegalStateException: Logback configuration error detected: 
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_info] - openFile(logs/application-info.log,true) call failed. java.io.FileNotFoundException: logs/application-info.log (Permission denied)
ERROR in ch.qos.logback.core.rolling.RollingFileAppender[file_error] - openFile(logs/application-error.log,true) call failed. java.io.FileNotFoundException: logs/application-error.log (Permission denied)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.reportConfigurationErrorsIfNecessary(LogbackLoggingSystem.java:282)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.initializeFromAotGeneratedArtifactsIfPossible(LogbackLoggingSystem.java:218)
        at org.springframework.boot.logging.logback.LogbackLoggingSystem.initialize(LogbackLoggingSystem.java:192)
        at org.springframework.boot.context.logging.LoggingApplicationListener.initializeSystem(LoggingApplicationListener.java:332)
        ... 20 more
        Suppressed: java.io.FileNotFoundException: logs/application-info.log (Permission denied)
                at java.base@21.0.2/java.io.FileOutputStream.open0(Native Method)
                at java.base@21.0.2/java.io.FileOutputStream.open(FileOutputStream.java:289)
                at java.base@21.0.2/java.io.FileOutputStream.<init>(FileOutputStream.java:230)
                at ch.qos.logback.core.recovery.ResilientFileOutputStream.<init>(ResilientFileOutputStream.java:26)
                at ch.qos.logback.core.FileAppender.openFile(FileAppender.java:206)
                at ch.qos.logback.core.FileAppender.start(FileAppender.java:126)
                at ch.qos.logback.core.rolling.RollingFileAppender.start(RollingFileAppender.java:103)
                at ch.qos.logback.core.model.processor.AppenderModelHandler.postHandle(AppenderModelHandler.java:84)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:257)
                at ch.qos.logback.core.model.processor.DefaultProcessor.secondPhaseTraverse(DefaultProcessor.java:253)
                at ch.qos.logback.core.model.processor.DefaultProcessor.traversalLoop(DefaultProcessor.java:90)
                at ch.qos.logback.core.model.processor.DefaultProcessor.process(DefaultProcessor.java:106)
                at ch.qos.logback.core.joran.GenericXMLConfigurator.processModel(GenericXMLConfigurator.java:216)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.processModel(SpringBootJoranConfigurator.java:133)
                at org.springframework.boot.logging.logback.SpringBootJoranConfigurator.configureUsingAotGeneratedArtifacts(SpringBootJoranConfigurator.java:126)
                at org.springframework.boot.logging.logback.LogbackLoggingSystem.initializeFromAotGeneratedArtifactsIfPossible(LogbackLoggingSystem.java:216)
                ... 22 more
        Suppressed: java.io.FileNotFoundException: logs/application-error.log (Permission denied)
                at java.base@21.0.2/java.io.FileOutputStream.open0(Native Method)
                at java.base@21.0.2/java.io.FileOutputStream.open(FileOutputStream.java:289)
```
这里一直提示权限不够，尝试修改文件权限为777后依旧无法解决，最后通过自定义Dockerfile文件手动打包解决
## 创建Dockerfile文件
```dockerfile
    FROM alpine
    ENV TZ Asia/Shanghai
    RUN apk -U upgrade && apk add tzdata && cp /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone
    EXPOSE 8080
    COPY target/app app
    RUN apk add libc6-compat
    CMD ["/app"]
```
这里使用了Alpine镜像，并安装`tzdata`和`libc6-compat`，设置时区为Asia/Shanghai。
注意这里的`libc6-compat`是必需的，如果不安装，可能会出现应用启动失败，提示`no-such-file-or-directory`，当然，你也可以选择使用其他镜像。
## 构建镜像
```bash
    docker build -t my-app:0.0.1-SNAPSHOT .
```
此时再次执行
```bash
    docker run -it --rm -v ./logs/:/workspace/logs/   --name my-app my-app:0.0.1-SNAPSHOT
```
运行成功，日志文件生成在`./logs/`目录下，可以查看日志文件内容。