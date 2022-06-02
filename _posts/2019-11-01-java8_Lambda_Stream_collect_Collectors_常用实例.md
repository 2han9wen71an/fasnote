---
layout: post
title: java8 Lambda Stream collect Collectors 常用实例
date: 2019-11-01 10:34:19
updated: 2019-11-01 10:35:13
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
---


优雅的将一个对象的集合转化成另一个对象的集合

    List<OrderDetail> orderDetailList = orderDetailService.listOrderDetails();
    List<CartDTO> cartDTOList = orderDetailList.stream()
                    .map(e -> new CartDTO(e.getProductId(), e.getProductQuantity()))
                    .collect(Collectors.toList());
    

交集 (list1 + list2)

    List<T> intersect = list1.stream()
                             .filter(list2::contains)
                             .collect(Collectors.toList());
    

差集

    //(list1 - list2)
    List<String> reduce1 = list1.stream().filter(item -> !list2.contains(item)).collect(toList());
    
    //(list2 - list1)
    List<String> reduce2 = list2.stream().filter(item -> !list1.contains(item)).collect(toList());
    

并集

    //使用并行流 
    List<String> listAll = list1.parallelStream().collect(toList());
    List<String> listAll2 = list2.parallelStream().collect(toList());
    listAll.addAll(listAll2);
    

去重并集

    List<String> listAllDistinct = listAll.stream()
    .distinct().collect(toList());
    

从List中过滤出一个元素

    User match = users.stream()
    .filter((user) -> user.getId() == 1).findAny().get();
    

Map集合转 List

    List<Person> list = map.entrySet().stream().sorted(Comparator.comparing(e -> e.getKey()))
    		.map(e -> new Person(e.getKey(), e.getValue())).collect(Collectors.toList());
    		
    List<Person> list = map.entrySet().stream().sorted(Comparator.comparing(Map.Entry::getValue)).map(e -> new Person(e.getKey(), e.getValue())).collect(Collectors.toList());
    
    List<Person> list = map.entrySet().stream().sorted(Map.Entry.comparingByKey()).map(e -> new Person(e.getKey(), e.getValue())).collect(Collectors.toList());
    

Collectors toList

    streamArr.collect(Collectors.toList());
    List<Integer> collectList = Stream.of(1, 2, 3, 4)
            .collect(Collectors.toList());
    System.out.println("collectList: " + collectList);
    // 打印结果 collectList: [1, 2, 3, 4]
    

Collectors toMap

    map value 为对象 student
    Map<Integer, Student> map = list.stream().collect(Collectors.toMap(Student::getId, student -> student));
    // 遍历打印结果
    map.forEach((key, value) -> {
        System.out.println("key: " + key + "    value: " + value);
    });
    map value 为对象中的属性
    Map<Integer, String> map = list.stream().collect(Collectors.toMap(Student::getId, Student::getName));
    map.forEach((key, value) -> {
        System.out.println("key: " + key + "    value: " + value);
    });
    

List集合转 Map

    /*使用Collectors.toMap形式*/
    Map result = peopleList.stream().collect(Collectors.toMap(p -> p.name, p -> p.age, (k1, k2) -> k1));
    //其中Collectors.toMap方法的第三个参数为键值重复处理策略，如果不传入第三个参数，当有相同的键时，会抛出一个IlleageStateException。
    //或者
    Map<Integer, String> result1 = list.stream().collect(Collectors.toMap(Hosting::getId, Hosting::getName));
    //List<People> -> Map<String,Object>
    List<People> peopleList = new ArrayList<>();
    peopleList.add(new People("test1", "111"));
    peopleList.add(new People("test2", "222"));
    Map result = peopleList.stream().collect(HashMap::new,(map,p)->map.put(p.name,p.age),Map::putAll);
    

List 转 Map<Integer,Apple>

    /**
     * List<Apple> -> Map<Integer,Apple>
     * 需要注意的是：
     * toMap 如果集合对象有重复的key，会报错Duplicate key ....
     *  apple1,apple12的id都为1。
     *  可以用 (k1,k2)->k1 来设置，如果有重复的key,则保留key1,舍弃key2
     */
    Map<Integer, Apple> appleMap = appleList.stream().collect(Collectors.toMap(Apple::getId, a -> a,(k1, k2) -> k1));
    

List 转 List<Map<String,Object>>

    List<Map<String,Object>> personToMap = peopleList.stream().map((p) -> {
        Map<String, Object> map = new HashMap<>();
        map.put("name", p.name);
        map.put("age", p.age);
        return map;
    }).collect(Collectors.toList());
    //或者
    List<Map<String,Object>> personToMap = peopleList.stream().collect(ArrayList::new, (list, p) -> {
       Map<String, Object> map = new HashMap<>();
        map.put("name", p.name);
        map.put("age", p.age);
        list.add(map);
    }, List::addAll);
    

字典查询和数据转换 toMap时，如果value为null,会报空指针异常  
解决办法一：

    Map<String, List<Dict>> resultMaps = Arrays.stream(dictTypes)
    .collect(Collectors.toMap(i -> i, i -> Optional.ofNullable(dictMap.get(i)).orElse(new ArrayList<>()), (k1, k2) -> k2));
    

解决办法二：

    Map<String, List<Dict>> resultMaps = Arrays.stream(dictTypes)
    .filter(i -> dictMap.get(i) != null).collect(Collectors.toMap(i -> i, dictMap::get, (k1, k2) -> k2));
    

解决办法三：

    Map<String, String> memberMap = list.stream().collect(HashMap::new, (m,v)->
        m.put(v.getId(), v.getImgPath()),HashMap::putAll);
    System.out.println(memberMap);
    

解决办法四：

    Map<String, String> memberMap = new HashMap<>();
    list.forEach((answer) -> memberMap.put(answer.getId(), answer.getImgPath()));
    System.out.println(memberMap);
    
    Map<String, String> memberMap = new HashMap<>();
    for (Member member : list) {
        memberMap.put(member.getId(), member.getImgPath());
    }
    

假设有一个User实体类，有方法getId(),getName(),getAge()等方法，现在想要将User类型的流收集到一个Map中，示例如下：

    Stream<User> userStream = Stream.of(new User(0, "张三", 18), new User(1, "张四", 19), new User(2, "张五", 19), new User(3, "老张", 50));
    
    Map<Integer, User> userMap = userSteam.collect(Collectors.toMap(User::getId, item -> item));
    

假设要得到按年龄分组的Map<Integer,List>,可以按这样写：

    Map<Integer, List<User>> ageMap = userStream.collect(Collectors.toMap(User::getAge, Collections::singletonList, (a, b) -> {
                List<User> resultList = new ArrayList<>(a);
                resultList.addAll(b);
                return resultList;
            }));
    
    Map<Integer, String> map = persons
        .stream()
        .collect(Collectors.toMap(
            p -> p.age,
            p -> p.name,
            (name1, name2) -> name1 + ";" + name2));
    
    System.out.println(map);
    // {18=Max, 23=Peter;Pamela, 12=David}
    

Map 转 另一个Map

    //示例1 Map<String, List<String>> 转 Map<String,User>
    Map<String,List<String>> map = new HashMap<>();
    map.put("java", Arrays.asList("1.7", "1.8"));
    map.entrySet().stream();
    
    @Getter
    @Setter
    @AllArgsConstructor
    public static class User{
        private List<String> versions;
    }
    
    Map<String, User> collect = map.entrySet().stream()
                    .collect(Collectors.toMap(
                            item -> item.getKey(),
                            item -> new User(item.getValue())));
    
    //示例2 Map<String,Integer>  转 Map<String,Double>
    Map<String, Integer> pointsByName = new HashMap<>();
    Map<String, Integer> maxPointsByName = new HashMap<>();
    
    Map<String, Double> gradesByName = pointsByName.entrySet().stream()
            .map(entry -> new AbstractMap.SimpleImmutableEntry<>(
                    entry.getKey(), ((double) entry.getValue() /
                            maxPointsByName.get(entry.getKey())) * 100d))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    

List<String> 转String

    //java8 String.join 方式  
    List<String> webs = Arrays.asList("voidcc.com", "voidmvn.com", "voidtool.com");
    //webs 必须是List<String>
    String allwebs = String.join(",", webs);
    System.out.println(allwebs);
    
    //stream 
    List<String> webs = Arrays.asList("voidcc.com", "voidmvn.com", "voidtool.com");
    String allwebs = webs.stream().collect(Collectors.joining(","));
    System.out.println(allwebs);
    
    

Collectors toSet

    Set<String> result = Stream.of("aa", "bb", "cc", "aa").collect(HashSet::new, HashSet::add, HashSet::addAll);
    //Collectors类中已经预定义好了toList，toSet，toMap，toCollection等方便使用的方法，所以以上代码还可以简化如下：
    Set<String> result2 = Stream.of("aa", "bb", "cc", "aa").collect(Collectors.toSet());
    
    Set<Integer> collectSet = Stream.of(1, 2, 3, 4).collect(Collectors.toSet());
    System.out.println("collectSet: " + collectSet);
    // 打印结果 collectSet: [1, 2, 3, 4]
    
    Stack stack1 = stream.collect(Collectors.toCollection(Stack::new));
    // collect toString
    String str = stream.collect(Collectors.joining()).toString();
    

排序

    //按照自然顺序进行排序 如果要自定义排序sorted 传入自定义的 Comparator
    list.stream()
        .sorted()
        .filter((s) -> s.startsWith("a"))
        .forEach(System.out::println);
    
    //对象排序比较 请重写对象的equals()和hashCode()方法
    list.sorted((a, b) -> b.compareTo(a))
    
    Collections.sort(names, (a, b) -> b.compareTo(a));
    

比较

    Comparator<Person> comparator = (p1, p2) -> p1.firstName.compareTo(p2.firstName);
    
    Person p1 = new Person("John", "Doe");
    Person p2 = new Person("Alice", "Wonderland");
    
    comparator.compare(p1, p2);             // > 0
    comparator.reversed().compare(p1, p2);  // < 0
    

Collectors groupingBy 分组

    Map<Integer, List<User>> ageMap2 = userStream
    .collect(Collectors.groupingBy(User::getAge));
    

对集合按照多个属性分组  
将多个字段拼接成一个新字段，然后再使用groupBy分组

    Map<String, List<EntryDeliveryDetailywk>> detailmap = details.stream()
    .collect(Collectors.groupingBy(this::fetchGroupKey));
    
    private String fetchGroupKey(EntryDeliveryDetailywk detail){
            return detail.getSkuId().toString() 
            + detail.getItemsName() 
            + detail.getWarehouseId().toString()   
            + detail.getSupplierId().toString();
        }
    

groupingBy 分组后操作  
//Collectors中还提供了一些对分组后的元素进行downStream处理的方法：  
//counting方法返回所收集元素的总数；  
//summing方法会对元素求和；  
//maxBy和minBy会接受一个比较器，求最大值，最小值；  
//mapping函数会应用到downstream结果上，并需要和其他函数配合使用；

    Map<Integer, Long> sexCount = userStream.collect(Collectors.groupingBy(User::getSex,Collectors.counting()));
    
    Map<Integer, Integer> ageCount = userStream.collect(Collectors.groupingBy(User::getSex,Collectors.summingInt(User::getAge)));
    
    Map<Integer, Optional<User>> ageMax =  userStream.collect(Collectors.groupingBy(User::getSex,Collectors.maxBy(Comparator.comparing(User::getAge))));
    
    Map<Integer, List<String>> nameMap =  userStream.collect(Collectors.groupingBy(User::getSex,Collectors.mapping(User::getName,Collectors.toList())));
    

groupingBy 根据年龄来分组：

    Map<Integer, List> peopleByAge = peoples.stream()
    .filter(p -> p.age > 12).collect(Collectors.groupingBy(p -> p.age, Collectors.toList()));
    

groupingBy 根据年龄分组，年龄对应的键值List存储的为Person的姓名:

    Map<Integer, List> peopleByAge = people.stream()
    .collect(Collectors.groupingBy(p -> p.age, Collectors.mapping((Person p) -> p.name, Collectors.toList())));
    //mapping即为对各组进行投影操作，和Stream的map方法基本一致。
    

groupingBy 根据姓名分组，获取每个姓名下人的年龄总和:

    Map sumAgeByName = peoples.stream().collect(Collectors.groupingBy(p -> p.name, Collectors.reducing(0, (Person p) -> p.age, Integer::sum)));
    /* 或者使用summingInt方法 */
    sumAgeByName = peoples.stream().collect(Collectors.groupingBy(p -> p.name, Collectors.summingInt((Person p) -> p.age)));
    

groupingBy Boolean分组:

    Map<Boolean, List<Integer>> collectGroup = Stream.of(1, 2, 3, 4)
                .collect(Collectors.groupingBy(it -> it > 3));
    System.out.println("collectGroup : " + collectGroup);
    // 打印结果
    // collectGroup : {false=[1, 2, 3], true=[4]}
    

groupingBy 按年龄分组

    Map<Integer, List<Person>> personsByAge = persons.stream().collect(Collectors.groupingBy(p -> p.age));
    personsByAge.forEach((age, p) -> System.out.format("age %s: %s\n", age, p));
    // age 18: [Max]
    // age 23: [Peter, Pamela]
    // age 12: [David]
    

Map.merge() 类似于分组之后sum

     Map<String, Integer> studentScoreMap2 = new HashMap<>();
            studentScoreList.forEach(studentScore -> studentScoreMap2.merge(
              studentScore.getStuName(),
              studentScore.getScore(),
              Integer::sum));
    

Collectors partitioningBy  
Collectors中还提供了partitioningBy方法，接受一个Predicate函数，该函数返回boolean值，用于将内容分为两组。假设User实体中包含性别信息getSex()，可以按如下写法将userStream按性别分组：

    Map<Boolean, List<User>> sexMap = userStream
    .collect(Collectors.partitioningBy(item -> item.getSex() > 0));
    

可以看到Java8的分组功能相当强大，当然你还可以完成更复杂的功能。另外Collectors中还存在一个类似groupingBy的方法：partitioningBy，它们的区别是partitioningBy为键值为Boolean类型的groupingBy，这种情况下它比groupingBy更有效率。  
partitioningBy 将数字的Stream分解成奇数集合和偶数集合。

    Map<Boolean, List<Integer>> collectParti = Stream.of(1, 2, 3, 4)
                .collect(Collectors.partitioningBy(it -> it % 2 == 0));
    System.out.println("collectParti : " + collectParti);
    // 打印结果
    // collectParti : {false=[1, 3], true=[2, 4]}
    

Collectors joining  
Collectors.joining 收集Stream中的值，该方法可以方便地将Stream得到一个字符串。joining函数接受三个参数，分别表示允（用以分隔元素）、前缀和后缀:

    String names = peoples.stream().map(p->p.name).collect(Collectors.joining(","))
    
    String strJoin = Stream.of("1", "2", "3", "4")
            .collect(Collectors.joining(",", "[", "]"));
    System.out.println("strJoin: " + strJoin);
    // 打印结果
    // strJoin: [1,2,3,4]
    
    //字符串连接
    String phrase = persons
        .stream()
        .filter(p -> p.age >= 18)
        .map(p -> p.name)
        .collect(Collectors.joining(" and ", "In Germany ", " are of legal age."));
    System.out.println(phrase);
    // In Germany Max and Peter and Pamela are of legal age.
    

组合 Collectors:

    Map<Boolean, Long> partiCount = Stream.of(1, 2, 3, 4)
            .collect(Collectors.partitioningBy(it -> it.intValue() % 2 == 0,
                    Collectors.counting()));
    System.out.println("partiCount: " + partiCount);
    // 打印结果
    // partiCount: {false=2, true=2}
    

Collectors分别提供了求平均值averaging、总数couting、最小值minBy、最大值maxBy、求和suming等操作。但是假如你希望将流中结果聚合为一个总和、平均值、最大值、最小值，那么Collectors.summarizing(Int/Long/Double)就是为你准备的，它可以一次行获取前面的所有结果，其返回值为(Int/Long/Double)SummaryStatistics。

    DoubleSummaryStatistics dss = people.collect(Collectors.summarizingDouble((Person p)->p.age));
    double average=dss.getAverage();
    double max=dss.getMax();
    double min=dss.getMin();
    double sum=dss.getSum();
    double count=dss.getCount();
    
    IntSummaryStatistics ageSummary = persons
            .stream()
            .collect(Collectors.summarizingInt(p -> p.age));
    
    System.out.println(ageSummary);
    // IntSummaryStatistics{count=4, sum=76, min=12, average=19.000000, max=23}
    

使用collect可以将Stream转换成值。maxBy和minBy允许用户按照某个特定的顺序生成一个值。  
averagingDouble:求平均值，Stream的元素类型为double  
averagingInt:求平均值，Stream的元素类型为int  
averagingLong:求平均值，Stream的元素类型为long  
counting:Stream的元素个数  
maxBy:在指定条件下的，Stream的最大元素  
minBy:在指定条件下的，Stream的最小元素  
reducing: reduce操作  
summarizingDouble:统计Stream的数据(double)状态，其中包括count，min，max，sum和平均。  
summarizingInt:统计Stream的数据(int)状态，其中包括count，min，max，sum和平均。  
summarizingLong:统计Stream的数据(long)状态，其中包括count，min，max，sum和平均。  
summingDouble:求和，Stream的元素类型为double  
summingInt:求和，Stream的元素类型为int  
summingLong:求和，Stream的元素类型为long

    Optional<Integer> collectMaxBy = Stream.of(1, 2, 3, 4)
                .collect(Collectors.maxBy(Comparator.comparingInt(o -> o)));
    System.out.println("collectMaxBy:" + collectMaxBy.get());
    // 打印结果
    // collectMaxBy:4
    

Collectors averagingInt  
计算集合的平均年龄

    Double averageAge = persons
        .stream()
        .collect(Collectors.averagingInt(p -> p.age));
    
    System.out.println(averageAge);     // 19.0
    

自定义 Collector

    Collector<Person, StringJoiner, String> personNameCollector =
        Collector.of(
            () -> new StringJoiner(" | "),          // supplier
            (j, p) -> j.add(p.name.toUpperCase()),  // accumulator
            (j1, j2) -> j1.merge(j2),               // combiner
            StringJoiner::toString);                // finisher
    
    String names = persons
        .stream()
        .collect(personNameCollector);
    
    System.out.println(names);  // MAX | PETER | PAMELA | DAVID
    

!\[20181129134929981.png\]\[1\] \[1\]: https://xtboke.cn/upload/2019/11/4099920483.png