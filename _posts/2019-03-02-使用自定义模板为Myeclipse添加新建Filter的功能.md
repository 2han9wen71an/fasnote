---
layout: post
title: 使用自定义模板为Myeclipse添加新建Filter的功能
date: 2019-03-02 10:49:00
updated: 2020-02-29 16:54:03
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - JAVA
  - eclipse
---


第一步：单击windowpreference菜单项，在打开的窗口中，依次展开Java、Editor、Templates列表项，然后在打开的Templates面板中，单击【New】按钮
使用这个模板非常简单，只要要新建一个class，然后将里面的内容全部删除，接着在其中输入“filter”，就会显示提示信息。

过滤器filter模板

    package ${enclosing_package};    
    import java.io.IOException;   
    import javax.servlet.FilterChain;   
    import javax.servlet.FilterConfig;   
    import javax.servlet.ServletException;   
    import javax.servlet.ServletRequest;   
    import javax.servlet.ServletResponse;   
    import javax.servlet.Filter;    
    import javax.servlet.http.HttpServletRequest;   
    import javax.servlet.http.HttpServletResponse;   
    import javax.servlet.http.HttpSession;       
    public class ${primary_type_name} implements Filter {      
         
        public ${primary_type_name}(){           
            super();          
        }        
         
        private FilterConfig filterConfig;  
        public void init(FilterConfig filterConfig) throws ServletException {           
            this.filterConfig = filterConfig;           
        }       
         
        public void doFilter(ServletRequest req, ServletResponse resp, FilterChain filterChain){  
             
            try{      
            HttpServletRequest request = (HttpServletRequest) req;               
            HttpServletResponse response = (HttpServletResponse) resp;              
            HttpSession session = request.getSession();  
             
            // 这里放到达目的地前(进入)处理代码                               
            filterChain.doFilter(req,resp);                               
            // 这里放到达目的地(离开)的处理代码    
             
            } catch (IOException e){               
                e.printStackTrace();                
            } catch (ServletException e){              
                e.printStackTrace();              
            }           
        }       
         
        public void destroy(){            
                     
        }  
    } 

第二步：创建web.xml中生成过滤器相应的模板。单击windowpreference菜单项，在 打开的窗口中，依次展开MyEclipse、XML、XML Templates列表项，然后在打开的Templates面板中，单击【New】按钮。


filter xml配置模板

    <filter>
        <filter-name></filter-name>
        <filter-class></filter-class>
        <init-param>
            <param-name></param-name>
            <param-value></param-value>
        </init-param>
    </filter>
        <filter-mapping>
            <filter-name></filter-name>
            <url-pattern></url-pattern>
    </filter-mapping>  