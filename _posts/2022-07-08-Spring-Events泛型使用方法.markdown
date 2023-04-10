---
layout: post
title:  "Spring-Events泛型使用方法"

date:   2022-07-08 11:24:24 +0800
categories: 代码笔记
permalink: /CodeNotes/spring-event.html
tags: [Java,Spring]
---
## 引言

**发布-订阅模式**作为一种解耦业务的常用手段，在分布式系统中通常结合消息队列组件实现。然而**单体系统**中，实现发布订阅模式则需要一个**应用程序内部的事件总线**，比如前端Vue中用一个全局的Vue对象来做事件总线，后端拿Java来说，比较常用的是**Spring Events**，这里简记一下Spring Events的原理和用法。

## 从类型擦除说起

**泛型**，作为Java1.5之后一个常用特性，是消灭重复代码一大利器。但泛型其实是语法糖，在**编译期解糖即擦除了类型信息**，比如一个ArrayList<String>和ArrayList<Integer>的真正类型在运行期其实是**完全一样**的。

不过泛型类型擦除与今天的主题Spring Events有什么关系呢？试想一下，一个事件总线上，一定是会有**不同类型的事件**发生的，不同的事件类型有一些共性。如果是定义不带泛型的事件（类似UpdateUserEvent，DeleteProductEvent这样），必定出现大量雷同的代码；但如果定义了一个通用的**带泛型的事件类型**，比如像下面这样的MutationEvent，由于类型擦除的存在，会导致**Event无法按照真正的内部对象类型来分发事件**：

```
import lombok.Getter;

public class MutationEvent<T> {

    @Getter
    private T source;

    @Getter
    private MutationType type; // Created / Updated / Deleted

    public MutationEvent(T data，MutationType type) {
        this.source = data;
        this.type = type;
    }
}
```

用传统的方式如何实现按事件类型监听Event呢？下面是一个典型的例子：

```
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;

public class MyEventHandler implements ApplicationListener<ContextClosedEvent> {
    @Override
    public void onApplicationEvent(ContextClosedEvent event) {
        // do something when application closed
    }
}
```

这里监听了一个 **ContextClosedEvent** 来**在Spring容器销毁时做一些资源释放的工作**，实现一个**ApplicationListener**接口，指定监听特定类型的事件。于是当ContextClosedEvent发生时，Spring就会调用实现注册好的MyEventHandler的onApplicationEvent方法，实现发布订阅。

在Spring4.2之后，Spring Events有很多改进和新功能，比如**注解方式注册监听器，泛型支持，事务支持**等等。于是我们可以利用这点来解决上面所说的泛型类型擦除问题，用一种新的方式来实现发布订阅。

## 进化: 带泛型的Spring Events

因为类型擦除的存在，我们不能指望上面定义的MutationEvent可以按照真正的类型 (T) 分发到不同的监听器上，但新版本的Spring提供了一个巧妙的办法，把**真正的类型带到运行期** —— 实现 **ResolvableTypeProvider 接口**。我们稍微改造一下刚才的MutationEvent类，让MutationEvent可以按照 T 的真正类型来分发到EventListener中：

```
import lombok.Getter;
import org.springframework.core.ResolvableType;
import org.springframework.core.ResolvableTypeProvider;

public class MutationEvent<T> implements ResolvableTypeProvider {

    @Getter
    private T source;

    @Getter
    private MutationType type; // Created / Updated / Deleted

    public MutationEvent(T data，MutationType type) {
        this.source = data;
        this.type = type;
    }

    @Override
    public ResolvableType getResolvableType() {
        return ResolvableType.forClassWithGenerics(getClass(),
                ResolvableType.forInstance(source));
    }
}
```

这里我们调用了ResolvableType.forClassWithGenerics，然后用source这个真正的T类型对象实例的类型，来返回给Spring事件分发器，这样真正的类型就在运行期被动态塞入分发器了。Spring实现Event分发的源码在**ApplicationListenerMethodAdapter.java的processEvent方法**中，其中**调用resolveArguments时就会调用event的getResolvableType方法**来作为分发判断条件之一。这里截取了Spring源码中对于事件分发的关键代码之一：

```
// org.springframework.context.event.ApplicationListenerMethodAdapter
public void processEvent(ApplicationEvent event) {
  // resolveArguments里调用 getResolvableType(event);
  Object[] args = resolveArguments(event); 
  if (shouldHandle(event，args)) {
    Object result = doInvoke(args);
    if (result != null) {
      handleResult(result);
    }
    else {
      logger.trace("No result object given - no result to handle");
    }
  }
}
```

除了泛型支持以外，**还有@EventListener注解**的支持，无需再配置繁琐的xml了，处理事件的代码可以是这样的：

```
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import us.zoom.web.calendar.core.event.MutationEvent;

@Component
public class UserDataChangedHandler {

    @EventListener
    public void userDataChanged(MutationEvent<User> event) {
      // business logic ...
    }
}
```

**@EventListener**注解有两个参数: **classes，condition**。classes用于指定监听类型， 这里没有声明则默认监听MutationEvent，另外condition是用**SpringEL来通过表达式动态过滤事件**，个人感觉比较鸡肋，用了泛型事件之后，同一大类的事件不太可能会有重复的事件监听逻辑，过滤完全可以在代码里面做，比SpringEL不知道快到哪里去了。静态类型语言就该有静态类型的样子，尽量不要整那么多动态的东西，性能差还不好调试。不扯远了，Publish一个事件的代码是这样的:

```
@Autowired
private ApplicationEventPublisher publisher;

// in some method
publisher.publishEvent(new MutationEvent<>(newUser，MutationType.CREATE));
publisher.publishEvent(new MutationEvent<>(deletedUser，MutationType.DELETE));
```

在**publishEvent**这一行，IDEA会有一个**小耳机夹着豆子**的图标，告诉你这是一个Event，点一下会自动识别定位到事件监听器的方法里面，还是很好用的。

#### 灵魂拷问: 为什么需要发布订阅模式 ?

至此，我们已经利用Spring实现了一个最简单的发布订阅， 也许会有同学想问，为什么要搞这么复杂，这些EventHandler业务逻辑**直接写在数据库操作语句之后**不行么？要回答这个问题，我们先总结一下这些**EventHandler的使用场景**

- 数据变化之后**清除缓存** (这是一种比较常见的缓存更新方式，简单可靠，只有在清除失败，或数据库主从同步间隙被脏读才有可能出现缓存脏数据)
- **发送消息**告诉下游系统，比如往消息队列推送消息
- **更细粒度但无关核心逻辑的切面操作**，比如**异步任务的触发，监控，审计**等等。因为Event的**参数可以任意改变，比AOP的切面编程更加灵活**
- 对数据变化的**反应式处理**，实现更加**Reactive**的逻辑，例如实现**长活事务Sagas**，分布式事务**发起，协调，补偿**等等 (Sagas类似乐观锁的思路，在事务失败时补偿，而不是2PC/3PC/TCC这种悲观锁思维的分布式事务)

这些用法都有一个共同点，**与核心业务关系不密切，而且具备一定的普适性**。比如**更新用户信息**可能在**多处业务代码中**都会有，而UserService**不应该**依赖诸如CacheService，NotificationService这些组件，因此用一个EventHub来解耦这类逻辑再适合不过了。牢记**单一职责原则**，知道一个类该干什么不该干什么，是OOP的关键点之一。另外不直接用**观察者模式**，而是引入一个带有**事件中心的发布订阅模式**，也是为了让事件**产生者和消费者再次解耦**，否则事件的**广播，过滤**等等操作就比较麻烦了。

## 事务和异步化处理

Spring4.2对Spring Events的增强中，还有对事务的支持 **@TransactionalEventListener** ，这个注解可以用于配置在何时执行EventHandler，如果没有事务的话，默认不执行任何监听器，除非**fallbackExecutor**置为true，有4个阶段可以声明事件监听器，这用来做数据库的**事务监控**非常合适。

- BEFORE_COMMIT
- AFTER_COMMIT
- AFTER_ROLLBACK
- AFTER_COMPLETION

阅读Spring源码可以看出它只是**解耦了同步调用**，比如在事务中publish一个event，但是在**处理逻辑中抛异常，会导致整个事务回滚**，因此很多场景中我们需要对Event处理**异步化**。传统的方式则是预先定义一个线程池，提交任务等待调度即可，或者也可以**用@Async注解**，直接加到EventListener上面实现异步化。

```
@Async
@EventListener
public void userDataChanged(MutationEvent<User> event) {
}
```

@Async的本质也是一个预定义的线程池，在使用@Async之前，需要在**SpringBoot启动类或配置类添加@EnableAsync注解，最好再自定义一个线程池**，比如下面这样的：

```
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.stereotype.Component;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import java.util.*;
import java.util.concurrent.*;

@Component
public class MyAsyncConfigurer implements AsyncConfigurer {
 
    @Override
    public Executor getAsyncExecutor() {
        ExecutorService taskThreadPool = new ThreadPoolExecutor(
                8，32，300，TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(5000)，
                new ThreadFactoryBuilder().setNameFormat("my-task-%d").build(),
                new ThreadPoolExecutor.CallerRunsPolicy());
        return taskThreadPool;
    }
 
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new MyAsyncExceptionHandler();
    }
}
```

## 结语

写这篇杂技文章的原因是看到某些历史代码存在大量重复或类似的Spring Events逻辑，上百个Event类的定义，然后还有一个巨长的**数千行EventHelper.java文件**。虽然笔者之前没有使用过，但任何人一看到这样的代码，感觉就不是优雅的解决方案。于是看了一些文档和源码，在另一个项目中用泛型Event和更统一的事件处理逻辑，让类似的逻辑更清晰了一些。Java生态圈**即使发展缓慢，新的技术也层出不穷，也不乏非常值得学习的东西**，小到几个注解，大到新的框架和平台。**不做安居一隅因循守旧的开发者**.

参考链接:

- <https://www.baeldung.com/spring-events>
- <https://spring.io/blog/2015/02/11/better-application-events-in-spring-framework-4-2>

本文转自:<https://code2life.top/2019/10/31/0046-spring-event/>