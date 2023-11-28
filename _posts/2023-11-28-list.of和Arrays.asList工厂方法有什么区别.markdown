---
layout: post
title:  "在Java中，list.of和Arrays.asList工厂方法有什么区别？"
description: "Java 提供了几种创建集合的便捷方法，包括 List.of() 和 Arrays.asList()。虽然这两种方法都能让您轻松创建集合，但它们也表现出一些关键区别。在本文中，我们将探讨 Java 中 List.of() 和 Arrays.asList() 之间的差异，重点介绍它们的不同行为、用例和影响。最后，您将清楚地了解何时使用这两种方法以及它们之间的区别。"
date:   2023-11-28 15:47:37 +0800
categories: 代码笔记
permalink: /CodeNotes/list-of-vs-arrays-aslist.html
tags: [java list]
---

## 前言
Java 提供了几种创建集合的便捷方法，包括 List.of() 和 Arrays.asList()。
虽然这两种方法都能让您轻松创建集合，但它们也表现出一些关键区别。
在本文中，我们将探讨 Java 中 List.of() 和 Arrays.asList() 之间的差异，重点介绍它们的不同行为、用例和影响。
最后，您将清楚地了解何时使用这两种方法以及它们之间的区别。
## List.of()
List.of() 是 Java 9 中引入的工厂方法，可创建包含指定元素的不可变集合。下面是一些需要注意的要点：

* 不变性：List.of()生成的集合是不可变的，这意味着创建后不能修改其大小和元素。
* 固定大小：List.of() 创建的集合大小固定，不支持添加或删除元素。
* 空值：List.of()不允许包含空元素。如果尝试添加空值，将会抛出 NullPointerException 异常。
* 例如

```java
List<String> immutable_list = List.of("apple", "banana", "orange");
```

## Arrays.asList()

Arrays.asList() 是 Java 早期版本中就有的方法，它提供了一种方便的方法来创建一个由指定数组支持的固定大小的集合。
让我们来看看它的特点：

* 可修改性Arrays.asList()生成的集合是可修改的，你只能更新其元素，而不能更新其结构。
* 由数组支持：集合由原始数组支持，因此集合元素的任何更改都会影响底层数组，反之亦然。
* 固定大小限制：虽然可修改，但由 Arrays.asList() 返回的集合的大小是固定的，阻止结构性修改，例如添加或删除元素。
* 空值与 List.of() 不同，Arrays.asList() 允许元素为空。
* 例如

```java
List<String> mutable_list = Arrays.asList("red", "green", "blue", null);
```

## 使用案例：

现在我们了解 List.of() 和 Arrays.asList() 之间的区别，让我们来探讨一下它们各自的用例：

## List.of()：

当你需要一个具有固定元素集的不可变集合时，这种方法是理想的选择。它能确保数据完整性，防止意外修改。

```java
import java.util.List;

public class ListOfExample {
    public static void main(String[] args) {
        String[] colorsArray = { "Red", "Green", "Blue" };
        List<String> colors = List.of(colorsArray);

        colorsArray[0] = "Yellow";

        // Accessing elements in the original array
        System.out.println(colors.get(0).equals(colorsArray[0])); // Output: false
        System.out.println(colors.get(1).equals(colorsArray[1])); // Output: true
        System.out.println(colors.get(2).equals(colorsArray[2])); // Output: true
    }
}
```

在上面的示例中，List.of() 用于创建一个不可变的颜色集合。任何通过添加或删除元素来修改集合的尝试都会导致异常抛出。

## Arrays.asList()：

当您需要一个由指定数组支持的固定大小（可序列化）集合时，请使用此方法。对返回集合的任何更改都会写入原始数组。

```java
import java.util.Arrays;
import java.util.List;

public class ArraysAsListExample {
    public static void main(String[] args) {
        String[] colorsArray = {"Red", "Green", "Blue"};
        List<String> colors = Arrays.asList(colorsArray);
        
        // Modifying the list (and array)
        colors.set(0, "Yellow");

        // Accessing elements in the original array
        System.out.println(colors.get(0).equals(colorsArray[0])); // Output: true
        System.out.println(colors.get(1).equals(colorsArray[1])); // Output: true
        System.out.println(colors.get(2).equals(colorsArray[2])); // Output: true
    }
}
```

## 结论
list.of() 和 Arrays.asList() 都可以创建固定大小的不可变集合，但它们有一些重要的区别。

List.of() 适用于创建固定大小的不可变集合，而 Arrays.asList() 适用于创建固定大小的可修改集合。

通过比较每种方法的特点、用例和影响，您可以在具体需求选择合适的工厂方法做出更合理的决定。