---
layout: post
title: Java8-Lambda表达式-函数式接口
date: 2020-05-29 14:46:11
updated: 2020-05-29 14:53:12
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
  - Lambda表达式
  - 函数式接口
---


### 1\. Java内置的四大核心函数式接口

    Consumer<T>  消费型接口 消费对象
     void accept(T t);
    Supplier<T>  供给型接口 生成对象
     T get();
    Function<R,T>  函数型接口 指定特定功能
     R apply(T t);
    Predicate<T>  断言型接口 进行条件判断
     boolean test(T t);
#### 1.1. 消费型接口
>void accept(T t);
>Consumer 消费型接口

    // Consumer<T> 消费型接口
     @Test
     public void testConsumer(){
     //此时的（d） 小括号里有参数
     //原因是因为 Consumer接口有参数
     //void accept(T t);
    
     consume(1000,(d)-> System.out.println(d));
     }
     public void consume(Integer n , Consumer<Integer> con){
     //函数接口接收 消费 形参n
     con.accept(n);
     }
#### 1.2. 供给型接口

> Supplier 供给型接口

> T get(); 小括号无参数

    // Supplier<T>  供给型接口
     @Test
     public void testSupplier(){
     //T get(); 小括号无参数
     List<Integer> numList = getNumList(10,() -> (int)(Math.random()*101));
     for ( Integer i: numList
     ) {
     System.out.println(i);
     }
    
     }
     //调用此方法时，第二个参数提供一个数字集合
     public List<Integer> getNumList(int n, Supplier<Integer> sup){
     List<Integer> numList = new ArrayList<>();
    
     for (int i = 0; i < n; i++){
     numList.add(sup.get()); //通过get方法得到数字 存到numList
     }
     return numList;
     }
#### 1.3. 函数型接口

> Function<R,T> 函数型接口 特定功能

    //Function<R,T>  函数型接口 特定功能
     @Test
     public void testFunction(){
     //将字符串转成大写
     String str1 = strHandler("ghslkajh", (s) -> s.toUpperCase());
     System.out.println(str1);
     }
    
     // Function<R,T> 函数型接口
     //定义一个处理字符串功能型接口函数
     public  String strHandler(String str, Function<String,String> fun){
     return fun.apply(str);
     }
#### 1.4. 断言型接口

> Predicate

> boolean test(T t); 返回boolean

    //断言型接口  Predicate<T>
     // boolean test(T t);  返回boolean
     @Test
     public void testPredicate(){
     //返回长度大于3的字符串
     List<String> s1 = strFilter(Arrays.asList("huzhiqi", "adaad", "1231", "414441", "gagsgasg"), (s) -> s.length() > 3);
     System.out.println(s1); //[huzhiqi, adaad, 1231, 414441, gagsgasg]
     //返回包含d的字符串
     List<String> s2 = strFilter(Arrays.asList("huzhiqi", "adaad", "1231", "414441", "gagsgasg"), (s) -> s.contains("d"));
     System.out.println(s2); // [adaad]
     }
     //使用断言型接口过滤字符串
     public List<String> strFilter(List<String> strs, Predicate<String> pred){
     List<String>  list = new ArrayList<>();
     for (String s:strs
     ) {
     //利用断言型接口进行指定功能判断  即一个功能性条件判断
     if(pred.test(s)){
     //过滤功能
     list.add(s);
     }
     }
     return list;
     }