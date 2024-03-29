---
layout: post
title:  "swagger实现类似ResponseBodyAdvice的功能"
description: "在使用Spring MVC定义rest接口的时候，需要对返回值进行统一封装，我们通常会定义code、message、以及一个泛型的data，有时候泛型参数过长，会导致controller 方法返回值很长，我借助Spring的ResponseBodyAdvice来做统一应答拦截，但是，swagger只会读取实际的方法返回类型作为应答。 如何使用swagger来实现类似ResponseBodyAdvice的功能呢？"
date:   2023-04-07 21:41:41 +0800
categories: 代码笔记
permalink: /CodeNotes/swagger-ResponseBodyAdvice.html
tags: ["Swagger","Spring","Spring MVC"]
---

## 需求描述

在使用`Spring MVC`定义rest接口的时候，需要对返回值进行统一封装，我们通常会定义code、message、以及一个泛型的data，有时候泛型参数过长，会导致controller 方法返回值很长，我借助Spring的`ResponseBodyAdvice`来做统一应答拦截，但是，swagger只会读取实际的方法返回类型作为应答。 如何使用`swagger`来实现类似`ResponseBodyAdvice`的功能呢？

## Spring实现统一返回定义

### 通用返回状态定义

```java
@Getter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum RestState implements Stateful {
    /**
     * 正常应答
     */
    OK(200, "ok"),
    /**
     * 参数解析异常
     */
    BAD_REQUEST(400, "参数解析失败"),
    /**
     * 未授权
     */
    UNAUTHORIZED(401, "认证失败"),
    /**
     * 禁止访问
     */
    FORBIDDEN(403, "禁止访问"),
    /**
     * 方法不支持
     */
    METHOD_NOT_ALLOWED(405, "Http方法不支持"),
    /**
     * 未被接受的
     */
    NOT_ACCEPTABLE(406, "未被接受"),
    /**
     * 不支持媒体类型
     */
    UNSUPPORTED_MEDIA_TYPE(415, "媒体类型不支持"),
    /**
     * 内部错误 需要额外指定错误消息
     */
    INTERNAL_SERVER_ERROR(500, "系统错误"),
    /**
     * 网关错误
     */
    BAD_GATEWAY(502, "网关错误"),
    /**
     * 服务不可用
     */
    SERVICE_UNAVAILABLE(503, "服务不可用");

    /**
     * 状态码
     */
    int code;
    /**
     * 默认业务信息
     */
    String message;

    /**
     * 根据给定错误码获取{@link RestState}
     * @param code         错误码
     * @param defaultState 若未获取到默认状态
     * @return {@link RestState}
     */
    public static RestState getOrDefault(int code, RestState defaultState) {
        return Optional.ofNullable(Enumerable.get(RestState.class, code)).orElse(defaultState);
    }
}
```

### 通用返回实体定义

```java
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder(access = AccessLevel.PROTECTED)
@ApiModel(description = "Rest响应信息")
@AllArgsConstructor
@NoArgsConstructor
public class RestResponse<T> {
    /**
     * 状态码
     */
    @ApiModelProperty(value = "响应码", example = "200")
    Integer code;
    /**
     * 业务消息
     */
    @ApiModelProperty(value = "业务消息", example = "ok")
    String message;
    /**
     * debug消息
     */
    @ApiModelProperty("开发调试消息")
    String developerMessage;
    /**
     * 业务实体
     */
    @ApiModelProperty("业务数据")
    T data;

    /**
     * 正常应答
     * @param data 应答实体
     * @param <T>  实体类型
     * @return {@link RestResponse}
     */
    public static <T> RestResponse<T> ok(T data) {
        return RestResponse.ok(data, null);
    }

    /**
     * 正常应答
     * @param message 应答消息
     * @return {@link RestResponse}
     */
    public static RestResponse<Void> ok(String message) {
        return RestResponse.ok(null, message);
    }

    /**
     * 正常应答
     * @param data    应答实体
     * @param message 应答消息
     * @param <T>     实体类型
     * @return {@link RestResponse}
     */
    public static <T> RestResponse<T> ok(T data, String message) {
        return RestState.OK.response(data, message);
    }

    /**
     * 应答码是否是200
     * @return true/false
     */
    @Transient
    public boolean isOk() {
        return Objects.equals(this.code, RestState.OK.getCode());
    }
}
```

### 通用返回值拦截定义

```java
@RestControllerAdvice
public class GlobalResponseBodyAdvice implements ResponseBodyAdvice<Object> {
    /**
     * 需要忽略的controller
     */
    private static final Set<String> IGNORE_CLASSES = Collections.unmodifiableSet(
        new HashSet<>(
            Arrays.asList(
                "springfox.documentation.swagger.web.ApiResourceController",
                "springfox.documentation.swagger2.web.Swagger2ControllerWebMvc"
            )
        )
    );

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // 不对swagger的rest接口做包装
        if (IGNORE_CLASSES.contains(returnType.getDeclaringClass().getName())) {
            return false;
        }

        return
            // 本身就是RestResponse或子类
            !returnType.getParameterType().isAssignableFrom(RestResponse.class)
                // void返回类型 一般文件下载
                && void.class != returnType.getParameterType();
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        // 自动添加包装
        return RestResponse.ok(body);
    }
}
```

## Swagger2插件处理通用返回拦截

### maven配置文件

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>

<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>swagger-bootstrap-ui</artifactId>
    <version>1.9.6</version>
</dependency>

<dependency>
    <groupId>com.spring4all</groupId>
    <artifactId>swagger-spring-boot-starter</artifactId>
    <version>1.9.1.RELEASE</version>
    <exclusions>
        <exclusion>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
        </exclusion>
        <exclusion>
            <groupId>io.swagger</groupId>
            <artifactId>swagger-models</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

### swagger配置类

```java
@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@EnableSwagger2Doc
@EnableSwaggerBootstrapUI
public class SwaggerConfiguration implements OperationBuilderPlugin, OperationModelsProviderPlugin {
    private TypeNameExtractor typeNameExtractor;
    private TypeResolver resolver;
    @Override
    public boolean supports(DocumentationType delimiter) {
        return true;
    }
/**
     * 添加响应包装的model，为了能够和responseMessages映射
     *
     * @see SwaggerConfiguration#apply(springfox.documentation.spi.service.contexts.OperationContext)
     */
    @Override
    public void apply(RequestMappingContext context) {
        if (Result.class.equals(context.getReturnType().getErasedType())) {
            return;
        }
        // 注册统一包装类型
        ResolvedType returnType = resolver.resolve(Result.class, context.alternateFor(context.getReturnType()));
        context.operationModelsBuilder().addReturn(returnType);
    }

    /**
     * 由于配置了spring的bodyAdvice，swagger是检测不出来最外层的包装。
     * 所以此配置增加最外层响应的包装
     */
    @Override
    public void apply(OperationContext context) {
        if (Result.class.equals(context.getReturnType().getErasedType())) {
            return;
        }
        ResolvedType returnType = resolver.resolve(Result.class, context.alternateFor(context.getReturnType()));

        ModelContext modelContext = ModelContext.returnValue(
                context.getGroupName(),
                returnType,
                context.getDocumentationType(),
                context.getAlternateTypeProvider(),
                context.getGenericsNamingStrategy(),
                context.getIgnorableParameterTypes());

        ResponseMessage built = new ResponseMessageBuilder()
                .code(ResponseMessagesReader.httpStatusCode(context))
                .message(ResponseMessagesReader.message(context))
                .responseModel(modelRefFactory(modelContext, typeNameExtractor).apply(returnType))
                .build();

        context.operationBuilder().responseMessages(newHashSet(built));
    }
}
```

至此就完成了Swagger2的参数配置

## Swagger3插件处理通用返回拦截

由于代码基本与`swagger2`差不多，我就只粘部分差异代码

### maven配置文件

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>3.0.0</version>
</dependency>
```

### swagger配置类

```java
@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@EnableSwagger2Doc
@EnableSwaggerBootstrapUI
public class SwaggerConfiguration implements OperationBuilderPlugin, OperationModelsProviderPlugin {
    TypeResolver typeResolver;
    SchemaPluginsManager schemaPluginsManager;
    DocumentationPluginsManager documentationPluginsManager;
    ModelSpecificationFactory modelSpecificationFactory;
    @Override
    public boolean supports(DocumentationType delimiter) {
        return true;
    }
/**
     * 添加响应包装的model，为了能够和responseMessages映射
     *
     * @see SwaggerConfiguration#apply(springfox.documentation.spi.service.contexts.OperationContext)
     */
    @Override
    public void apply(RequestMappingContext context) {
        if (Result.class.equals(context.getReturnType().getErasedType())) {
            return;
        }
        // 注册统一包装类型
        ResolvedType returnType = resolver.resolve(Result.class, context.alternateFor(context.getReturnType()));
        context.operationModelsBuilder().addReturn(returnType);
    }

    /**
     * 由于配置了spring的bodyAdvice，swagger是检测不出来最外层的包装。
     * 所以此配置增加最外层响应的包装
     */
    @Override
    public void apply(OperationContext context) {
        if (Result.class.equals(context.getReturnType().getErasedType())) {
            return;
        }
        ResolvedType returnType = resolver.resolve(Result.class, context.alternateFor(context.getReturnType()));
        int httpStatusCode = ResponseMessagesReader.httpStatusCode(context);
        String message = ResponseMessagesReader.message(context);
        ResponseContext responseContext = new ResponseContext(context.getDocumentationContext(), context);
        ViewProviderPlugin viewProvider =
            this.schemaPluginsManager.viewProvider(
                context.getDocumentationContext().getDocumentationType());
        if (!isVoid(returnType)) {
            ModelContext modelContext = context.operationModelsBuilder()
                .addReturn(returnType, viewProvider.viewFor(context));

            Set<MediaType> produces = new HashSet<>(context.produces());
            if (produces.isEmpty()) {
                produces.add(MediaType.ALL);
            }
            produces
                .forEach(mediaType ->
                    responseContext.responseBuilder()
                        .representation(mediaType)
                        .apply(r ->
                            r.model(m ->
                                m.copyOf(this.modelSpecificationFactory.create(modelContext, returnType))
                            )
                        )
                );
        }

        responseContext.responseBuilder().description(message).code(String.valueOf(httpStatusCode));
        context.operationBuilder()
            .responses(Collections.singleton(this.documentationPluginsManager.response(responseContext)));
    }
}
```

## 测试

### 接口代码

```
@RestController
@RequestMapping("/test")
@Api(tags = "测试")
public static class TestController {
    @Data
    @ApiModel
    @Accessors(chain = true)
    static class Person {
        @ApiModelProperty("姓名")
        String name;
        @ApiModelProperty("年龄")
        Integer age;
    }

    @GetMapping
    @ApiOperation("get")
    public Person get() {
        return new Person().setName("张三").setAge(10);
    }

    @PutMapping
    @ApiOperation("put")
    public RestResponse<Boolean> update() {
        return RestResponse.ok(true);
    }
}
```

### 测试结果

- get方法 自动添加统一应答包装

![get]({{ site.url }}\assets\images\post\get.png)

- put方法 使用默认返回

![put]({{ site.url }}\assets\images\post\put.png)
### 参考文献
 - [Swagger统一应答类型处理](https://www.xiehai.zone/2022-07-04-swagger-common-response.html)
 - [定义swagger通用接口文档](https://dongmaxiang.cn/posts/%E5%AE%9A%E4%B9%89swagger%E9%80%9A%E7%94%A8%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3)