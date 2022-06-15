---
layout: post
title:  "修复feign-Response只能读一次问题"
date:   2022-06-15 14:01:28 +0800
categories: 代码笔记
permalink: /CodeNotes/fix-feign-response.html
tags: [feign]
---
### 前言

spring cloud 对feign调用对返回值做了包装处理，通过一些列Decoder来处理feign访问的返回值。
具体流程 从**SynchronousMethodHandler**中的**decoder**开始会经历如下几个**decoder**：

```java
OptionalDecoder -> ResponseEntityDecoder -> SpringDecoder
```

可以在 FeignClientsConfiguration 看到有对上面三个decoder的定义，有兴趣的可以自行阅读源码。
<!--more-->
### feign返回值拦截 + response只能读取一次处理

feign返回值拦截只需要自定义一个coder，替换 FeignClientsConfiguration 中的 decoder定义即可，具体代码如下：
配置自定义decoder：

```java
@Component
@Slf4j
public class FeignResponseDecoder extends SpringDecoder {
    @Autowired
    private ObjectMapper objectMapper;

    public FeignResponseDecoder(ObjectFactory<HttpMessageConverters> messageConverters) {
        super(messageConverters);
    }

    @Override
    public Object decode(Response response, Type type) throws IOException, FeignException {
        Reader reader = response.body().asReader(StandardCharsets.UTF_8);
        String json = Util.toString(reader);
        RespVo<?> respVo = getResult(json, type);
        if (Objects.isNull(respVo)) {
            String url = response.request().url();
            log.info(url + "不是标准返回对象,不进行校验处理");
            // 由于response中的body只能读取一次，所以最后需要把body回写，再重新生成response传递到下一个decoder
            return super.decode(response.toBuilder().body(json, StandardCharsets.UTF_8).build(), type);
        }
        int resultCode = respVo.getResultCode();
        if (!ResultEnum.SUCCESS.getCode().equals(resultCode)) {
            String resultStr = respVo.getResultStr();
            log.warn("远程调用方法失败,{}", objectMapper.writeValueAsString(respVo));
            throw new OmsException(resultCode, resultStr);
        }
        return respVo;
    }

    /**
     * 获取标准返回值
     *
     * @param json json数据
     * @param type 用于确认参数泛型
     * @return 不是respvo对象,返回null,否则转为respvo对象
     * @throws IOException
     */
    private RespVo<?> getResult(String json, Type type) throws IOException {
        if (type instanceof ParameterizedType) {
            ParameterizedType clazz = (ParameterizedType)type;
            if (RespVo.class.equals(clazz.getRawType())) {
                JavaType javaType = objectMapper.constructType(type);
                return objectMapper.readValue(json, javaType);
            }
        }
        try {
            return objectMapper.readValue(json, RespVo.class);
        } catch (Exception e) {
            return null;
        }
    }

}

```


