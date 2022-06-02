---
layout: post
title: 在Java8的Consumer中抛出异常
date: 2021-03-01 11:58:38
updated: 2021-03-01 11:58:38
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
---


最近在实现公司内部一个通用svn数据工具类,其中有段代码是拿到当前更新后的数据进行下一步操作,用的是java8的Consumer实现的,代码如下:

    public void save(final DTO dto, final Consumer<List<T>> cons) throws Exception

这段代码一开始并没有什么问题,但是投入生产后发现有些异常数据导致服务器报错了,但是前台还是返回操作成功,debug查看后发现是异常被调用方吃掉了,原因了原生Consumer不支持异常抛出,只能内部处理,接到反馈后,自己测试确实能复现,查看Consumer源码发现原生确实不支持抛出,查阅网络资料,发现只能重写一个Consumer方法,特此记录一下
```
    @FunctionalInterface
    public interface Consumer<T> {
    
        /**
         * Performs this operation on the given argument.
         *
         * @param t the input argument
         */
        void accept(T t);//并没有异常处理
    
        /**
         * Returns a composed {@code Consumer} that performs, in sequence, this
         * operation followed by the {@code after} operation. If performing either
         * operation throws an exception, it is relayed to the caller of the
         * composed operation.  If performing this operation throws an exception,
         * the {@code after} operation will not be performed.
         *
         * @param after the operation to perform after this operation
         * @return a composed {@code Consumer} that performs in sequence this
         * operation followed by the {@code after} operation
         * @throws NullPointerException if {@code after} is null
         */
        default Consumer<T> andThen(Consumer<? super T> after) {
            Objects.requireNonNull(after);
            return (T t) -> { accept(t); after.accept(t); };
        }
    }
```
解决方法:

 1. 新建一个ThrowingConsumer.class文件
```

    import java.util.function.Consumer;
    
    /**
     * @ClassName: ThrowingConsumer
     * @Description: 重写Java8的Consumer中的异常抛出
     * @author:Erwin.Zhang
     * @date: 2021-03-01 10:59:19
     */
    @FunctionalInterface
    public interface ThrowingConsumer<T> extends Consumer<T> {
    
        @Override
        default void accept(final T e) {
            try {
                accept0(e);
            } catch (Throwable ex) {
                Throwing.sneakyThrow(ex);
            }
        }
    
        void accept0(T e) throws Throwable;
    
    }
```
 2. 新建一个处理异常的Throwing.class
```
    import java.util.function.Consumer;
    
    import javax.validation.constraints.NotNull;
    
    /**
     * @ClassName: Throwing
     * @Description: 在Java8的Consumer中抛出异常
     * @author:Erwin.Zhang
     * @date: 2021-03-01 10:58:31
     */
    public class Throwing {
        private Throwing() {}
    
        @NotNull
        public static <T> Consumer<T> rethrow(@NotNull final ThrowingConsumer<T> consumer) {
            return consumer;
        }
    
        /**
         * The compiler sees the signature with the throws T inferred to a RuntimeException type, so it allows the unchecked
         * exception to propagate.
         *
         * http://www.baeldung.com/java-sneaky-throws
         */
        @SuppressWarnings("unchecked")
        @NotNull
        public static <E extends Throwable> void sneakyThrow(@NotNull final Throwable ex) throws E {
            throw (E)ex;
        }
    }
```
 3. 使用方法
```
    import java.io.IOException;
    import java.util.Arrays;
    
    import org.junit.Rule;
    import org.junit.Test;
    import org.junit.rules.ExpectedException;
    
    /**
     * @ClassName: ThrowingTest
     * @Description: 测试异常抛出
     * @author:Erwin.Zhang
     * @date: 2021-03-01 11:00:38
     */
    public class ThrowingTest {
        @Rule
        public ExpectedException thrown = ExpectedException.none();
    
        @Test
        public void testRethrow() {
            thrown.expect(IOException.class);
            thrown.expectMessage("i=3");
    
            Arrays.asList(1, 2, 3).forEach(rethrow(e -> {
                int i = e;
                if (i == 3) {
                    throw new IOException("i=" + i);
                }
            }));
        }
    
        @Test(expected = IOException.class)
        public void testSneakyThrow() {
            Throwing.sneakyThrow(new IOException());
        }
    
        @Test
        public void testThrowingConsumer() {
            thrown.expect(IOException.class);
            thrown.expectMessage("i=3");
    
            Arrays.asList(1, 2, 3).forEach((ThrowingConsumer<Integer>)e -> {
                int i = e;
                if (i == 3) {
                    throw new IOException("i=" + i);
                }
            });
        }
    
    }
```
