---
layout: post
title: 撸免费的oracle cloud服务器并使用脚本自动化部署云服务器
date: 2019-09-22 23:33:00
updated: 2019-10-24 13:54:34
status: publish
author: zhangwentian
categories: 
  - 代码笔记
  - 折腾笔记
tags: 
  - oracle
---


前两天甲骨文oracle cloud 开放注册账号能永久免费使用2个1c1g的云服务器,数据库以及其他的服务，看到这个消息自然马上就注册了一个，并选择了韩国服务器作为主地区，以后创立的免费服务器就在韩国了，对于上海来说访问速度很快。由于韩国服务器很快就被撸爆了，一创建就提示out of host capicity,那么有什么自动的办法可以刷到服务器呢？一种最笨的windows下的按键精灵，看文档发现有api和oci-cli两种程序员友好的方式可以用来管理，因此就把使用oci命令行自动化创建服务器的过程记录下来，方便其他要使用脚本创建到可用的用户。

必要条件：
-----

1.手机号 2.信用卡

前2天一张信用卡可以注册多个账号，被mjj们注册的有点多。现在只能一张信用卡注册一个了。

收获云资源
-----

*   2 个 Autonomous Database （自主数据仓库或自主事务处理），每个 Autonomous Database 都有 1 个 OCPU 和 20 GB 存储资源；
*   2 个 Compute VM，每个 Compute VM 有 1⁄8 OCPU 和 1 GB 内存；
*   2 个 Block Volumes，总共 100 GB，最多 5 个免费备份；
*   10 GB Object Storage、10 GB Archive Storage 和每月 50000 个 API 请求；
*   1 个 Load Balancer，10 Mbps 带宽；
*   每月 10 TB 的出站数据传输；
*   5 亿个摄取数据点和 10 亿个服务监测数据点；
*   每月传递 100 万个通知的选项和每月 1000 封电子邮件。
    
    主要步骤
    ----
    

1.  注册oracle cloud账号
2.  建立第一个服务器并记录信息
3.  下载安装oci-cli命令行管理工具
4.  配置oci-cli账号信息，添加api key
5.  使用cli-cli命令自动化脚建立服务器

### 1\. 注册oracle cloud账号

首先进入 [oracle官网](https://www.oracle.com/cn/cloud/free/),![oracle_start_free](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_start_free.webp) 开始注册，填写邮箱 ![oracle_register_mail](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_register_mail.webp) 地址 ![oracle_register_address](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_register_address.webp) 手机号，需要接受验证码 ![oracle_register_phone](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_register_phone.webp) 信用卡，需要扣费验证 ![oracle_register_creditcard](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_register_creditcard.webp) 注册完成 ![oracle_register_complete](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_register_complete.webp) 按提示一步一步填写自己的内容，推荐使用gmail邮箱。我这里使用的是美国的一个地址，没有可以网上生成，这里由于我注册过了，所以拒绝，如果没注册过就能过。 等待自动跳转到主页注册就完成了。注册过后查看邮箱，会有邮件 ![oracle_check_mail](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_check_mail.webp) 提示正在review，一天过后再收到邮件就是成功了。 ![oracle_register_success](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_register_success.webp)

### 2\. 建立第一个服务器并记录信息

推荐使用chrome谷歌浏览器打开邮件里面的链接。进入控制台 从 ![oracle_control_menu](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_control_menu.webp)进入

创建第一个永久免费服务器信息 右键网页打开chrome控制台，提交 在网络请求中找到instances请求并查看headers详情 ![oracle_auto_info](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_auto_info.webp) 找到如下信息并记录

*   availabilityDomain #跟地区相关，我是韩国
*   compartmentId # 账号相关
*   subnetId #子网络
*   shape #服务器类型，永久免费为VM.Standard.E2.1.Micro，可以不变
*   ssh\_authorized\_keys #这个是服务器的公钥文件
*   imageId #这时系统类型

另外需要用户ocid信息，首先进入用户页面 ![oracle_user_id](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_user_id.webp) 右上角点击进入查看tenancy ocid。 ![oracle_user_id](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_tenancy_id.webp)

用小本本记录下这些信息，后面要用。

### 3\. 下载安装oci命令行管理工具

直接上命令

    
    bash -c "$(curl –L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
    
    
    

一路回车就好了，结束使用下面命令查看安装是否成功

    oci -v
    
    

![oracle_check_oci](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_check_oci.webp)

### 4\. 配置cli账号信息，添加api key

    oci setup config
    
    

![oracle_oci_config](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_oci_config.webp) 接下来需要把公共秘钥传到控制台，回到浏览器，同样进入用户界面查看 ![oracle_add_apikey](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_add_apikey.webp)

添加好后就可以来看看oci命令行工具行不行了。

    oci iam availability-domain list
    

![oracle_oci_list](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_oci_list.webp) 查看配置文件是否正确 ![oracle_oci_config_succe](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_oci_config_succe.webp) 如果没有报错说明配置成功。

### 5\. 使用cli命令自动化脚建立服务器

前面已经配置好了cli，这里就可以使用命令来尝试建立云计算服务器了。

    
    oci compute instance launch --availability-domain JCbl:AP-SEOUL-1-AD-1 --display-name seoul1 --image-id ocid1.image.oc1.ap-seoul-1.aaaaaaaa4e3nhzytej7iwr4qh6aov3d5yxswfek7wzjyd2tpaqtlwt3kmqta --subnet-id ocid1.subnet.oc1.ap-seoul-1.aaaaaaaa...  --shape VM.Standard.E2.1.Micro --assign-public-ip true --metadata '{"ssh_authorized_keys": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC+Sk1M9GX6AOoI1RtK33zaltsuSIGofdtI0sT9YqULEP0zSvrHPh8TEWY7XQdz1TbWcXLG7V0YNZgzUMEr6khI4zRygCU8N5OYX/M3VH36FddD0Jr6HiEkHTECVYdxxvJ7Lq8iCe5VP9IfomphjWTVZfml+jX0deR6gHY3MVblEnwLdhxT61aLOUe8Q1P3m6SWjukpSl9Wk/rf96YQIyw23+lWILWw9TkEhJOXwwV89nvlM11jN4fjh1yl1ax+yRl4BsMfRUrfT8CZ+OhR8qZILKPhsY8ehOZs8TbbWU8G55y/PJS8WjhhP3I0BpETazMZWuY41 zhang"}' --compartment-id ocid1.tenancy.oc1...
    
    
    

这里几个参数多是前面用小本本记录下来的信息

*   availability-domain
*   display-name #云服务器名称，随意,最好不要加这个参数，不然只能创建一个，第二个时名字一样了
*   image-id 前面有记录，我这是centos7的
*   subnet-id 前面有记录
*   shape 永久免费就是这一款VM.Standard.E2.1.Micro
*   assign-public-ip true #是否需要公网ip，当然是true
*   metadata #这里就是添加了一个免登录秘钥，改成你自己的就行
*   compartment-id #前面有记录

运行命令，如果一会儿有输出的话那么就没问题了，接下来就可以定时执行命令创建云服务器了。 ![oracle_auto_500](https://www.bobobk.com/wp-content/uploads/2019/09/oracle_auto_500.webp) 使用crontab定时执行，第二天再来查看是否创建成功就可以了。 首先把命令写成oci.sh的bash脚本

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    alias ic="ibmcloud"
    
    export PATH=/home/name/bin:$PATH
    
    [[ -e "/home/name/lib/oracle-cli/lib/python2.7/site-packages/oci_cli/bin/oci_autocomplete.sh" ]] && source "/home/name/lib/oracle-cli/lib/python2.7/site-packages/oci_cli/bin/oci_autocomplete.sh"
    
    oci compute instance launch --availability-domain JCbl:AP-SEOUL-1-AD-1  --image-id ocid1.image.oc1.ap-seoul-1.aaaaaaaa4e3nhzytej7iwr4qh6aov3d5yxswfek7wzjyd2tpaqtlwt3kmqta --subnet-id ocid1.subnet.oc1.ap-seoul-1.aaaaaaaa...  --shape VM.Standard.E2.1.Micro --assign-public-ip true --metadata '{"ssh_authorized_keys": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC+Sk1M9GX6AOoI1RtK33zaltsuSIGofdtI0sT9YqULEP0zSvrHPh8TEWY7XQdz1TbWcXLG7V0YNZgzUMEr6khI4zRygCU8N5OYX/M3VH36FddD0Jr6HiEkHTECVYdxxvJ7Lq8iCe5VP9IfomphjWTVZfml+jX0deR6gHY3MVblEnwLdhxT61aLOUe8Q1P3m6SWjukpSl9Wk/rf96YQIyw23+lWILWw9TkEhJOXwwV89nvlM11jN4fjh1yl1ax+yRl4BsMfRUrfT8CZ+OhR8qZILKPhsY8ehOZs8TbbWU8G55y/PJS8WjhhP3I0BpETazMZWuY41 zhang"}' --compartment-id ocid1.tenancy.oc1...
    
    
    

    crontab -e
    #
    #*/2 * * * *  /bin/bash /home/name/oci.sh
    #根据需要更改
    #我这里是没两分钟执行一次。，让他自动刷可用的机器
    

总结
--

到这就全部结束了，本文从注册oracle cloud(甲骨文云)开始，到尝试建立vm云服务器，最后从oci命令行工具和rest api中选择了oci来自动创建永久免费服务器，最后使用linux中的crontab定时任务来重复执行创建流程，达到全自动化挂机。最终达到可以在大陆用户热门地区比如韩国和日本创建终身免费服务器的目的。如有问题，可邮件联系博主（如果仔细看过的话应该找得到邮箱，嘿嘿）。

本文转自：https://www.bobobk.com/612.html