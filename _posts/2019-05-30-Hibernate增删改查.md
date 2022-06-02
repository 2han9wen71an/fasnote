---
layout: post
title: Hibernate增删改查
date: 2019-05-30 17:04:55
updated: 2019-05-30 17:06:09
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
  - Hibernate
  - sql
  - hql
---


最近在学习Hibernate，把基本的语法用博客记录下来，免得以后忘记

    一  增加
    
    getSession().save(entity)
    
    二  删除
    
    1 String hql = " DELETE FROM Student dm WHERE  dm.id = ? ";
    this.delete(hql,stu.getId());
    
    2 Transaction trans=session.beginTransaction(); 　　
    String hql=”delete from User user where user.age=18”;
     　　
    Query queryupdate=session.createQuery(hql); 　　int ret=queryupdate.executeUpdate(); 　　
    trans.commit();
    
     
    
    三  修改
    
    1 getSession().update(entity);
    
     
    
    2 Transaction trans=session.beginTransaction(); 　　
    String hql=”update User user set user.age=20 where user.age=18”;
     　　
    Query queryupdate=session.createQuery(hql); 　　int ret=queryupdate.executeUpdate(); 　　
    trans.commit();
    
     
    
    四  查询
    
    1 String sql_0 = "from Teacher s";
    List listTea = createQuery(sql_0).list();
    
    2 List list=session.createQuery(“select user.name from User user ”).list();
     　　for(int i=0）{
    
    System.out.println(list.get(i));
    
    }
    
    五 查询通用语句
    
    public Query createQuery(String queryString, Object... values) {
      Query query = getSession().createQuery(queryString);
      if (values != null) {
       for (int i = 0; i < values.length; i++) {
        query.setParameter(i, values[i]);
       }
      }
      return query;
     }