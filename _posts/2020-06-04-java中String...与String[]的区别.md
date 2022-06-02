---
layout: post
title: java中String...与String[]的区别
date: 2020-06-04 10:03:28
updated: 2020-06-04 10:20:55
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
---


#前言:
方法参数的类型后面三个点(String…)，是从Java 5开始，Java语言对方法参数支持一种新写法，叫可变长度参数列表，其语法就是类型后跟…，表示此处接受的参数为0到多个Object类型的对象，或者是一个Object[]。
#例子

    public class Test003 {  
          
        private Test003(){  
            test();  
            test(new String[]{"aaa","bbb"});  
            test("ccc");  
        }  
          
        private void test(){  
            System.out.println("test");   
        }  
          
        private void test(String...strings){  
            for(String str:strings){  
                System.out.print(str + ", ");  
            }  
            System.out.println();  
        }  
          
        /*private void test(String[] strings){ 
            System.out.println(3); 
             
        }*/  
          
        public static void main(String[] args) {  
            new Test003();  
        }  
      
    } 

我们有一个方法叫做test(String…strings)，那么你还可以写方法test()，但你不能写test(String[] strings)，这样会出编译错误，系统提示出现重复的方法。
在使用的时候，对于test(String…strings)，你可以直接用test()去调用，标示没有参数，也可以用去test(“aaa”)，也可以用test(new String[]{“aaa”,”bbb”})。
另外如果既有test(String…strings)函数，又有test()函数，我们在调用test()时，会优先使用test()函数。只有当没有test()函数式，我们调用test()，程序才会走test(String…strings)。