---
layout: post
title: 利用Windows PowerShell来批量创建Office 365（各种订阅）用户
date: 2020-02-28 17:40:00
updated: 2020-02-29 17:41:05
status: publish
author: zhangwentian
categories: 
  - 代码笔记
tags: 
  - office365
  - PowerShell
---


本文参考的官方文档:[https://docs.microsoft.com/zh-cn/office365/enterprise/powershell/create-user-accounts-with-office-365-powershell](https://docs.microsoft.com/zh-cn/office365/enterprise/powershell/create-user-accounts-with-office-365-powershell)

首先你的电脑要能运行Windows PowerShell，win10的话，在左下角图标上右键，选择Windows PowerShell（管理员）

步骤 1：安装所需软件

```
Install-Module -Name AzureAD

```

步骤 2：连接到 Office 365 订阅的 Azure AD

```
Connect-AzureAD

```

与用于 Windows PowerShell 的 Microsoft Azure Active Directory 模块连接

步骤 1：安装所需软件

```
Install-Module MSOnline

```

出现提示时选择A

好了，完成上面的环境安装后，我们就可以开始操作了

```
Connect-MsolService

```

这时会让你输入账号密码，注意需要有管理权限的（或者具有创建用户权限的管理员）

[![请输入图片描述](//www.xtboke.cn/usr/uploads/auto_save_image/23a3bab82ac88d6e89f05d606bd13ddb.png)

登陆成功后，我们就能开始操作了
下面是官方给的批量创建用户的命令，我们就按照这个写就好

[![请输入图片描述](//www.xtboke.cn/usr/uploads/auto_save_image/3347b843844ce2b9b420834dc6e1f869.png)
我在这里给出我用的代码

```
Import-Csv -Path "C:\Users\Administrator\Desktop\001.csv" | foreach {New-MsolUser -DisplayName $_.DisplayName -FirstName $_.FirstName -LastName $_.LastName -UserPrincipalName $_.UserPrincipalName -UsageLocation $_.UsageLocation -LicenseAssignment $_.AccountSkuId} | Export-Csv -Path "C:\Users\Administrator\Desktop\NewAccountResults.csv"

```

这个代码大概的意思是，读取的是我桌面（C:UsersAdministratorDesktop）的001.csv这个文件，并将结果记录在桌面（C:UsersAdministratorDesktop）的这个NewAccountResults.csv 文件中，大家在使用的时候可以自行修改这两个路径

为了方便大家，我把我用的csv文件放出来(csv文件不带用户密码，不用担心安全问题)

[](https://www.zxd.win/go/aHR0cHM6Ly9jbG91ZC56eGQud2luL21qai5jc3Y=)[https://cloud.zxd.win/mjj.csv](https://www.zxd.win/go/aHR0cHM6Ly9jbG91ZC56eGQud2luL21qai5jc3Y=)
备用链接:[mjj.csv](https://www.zxd.win/go/aHR0cDovLzEyN2Y3OTI3YzUxOGEzZWQuMzYwd3p3cy5jb20vMjAxOTA1MjcvMS81Y2ViN2QxNTFiMTE0Q0xTVUZGMDAyLmNzdg==)

如果你使用我的csv文件，还需要进行修改一些内容

csv文件由5个部分组成

[![请输入图片描述](//www.xtboke.cn/usr/uploads/auto_save_image/a8f1bd6cc3e63bba05cd0e560aff2333.png)

打开我提供的csv文件，UserPrincipalName（就是用户的登陆邮箱）需要修改一下，把后缀修改为你的域名后缀就可以了
用excel的话，直接按ctrl+h，按下图操作（其中xxxxxxx.com代表你绑定在Office 365的域名）

[![请输入图片描述](//www.xtboke.cn/usr/uploads/auto_save_image/7f93c8badbab0ad176cc6d128e4fd49f.png)

除了UserPrincipalName，你还需要修改LicenseAssignment，就是你要分配给用户什么许可证

我的csv文件里面是这样的

```
microsoft:STANDARDWOFFPACK_STUDENT

```

前面这个microsoft，你需要修改为微软给你的二级域名的前面那部分
例如我的是这个admin@knauniversity.onmicrosoft.com
就需要把microsoft修改为knauniversity（批量修改的方法在前面有，ctrl+h）

后面这个STANDARDWOFFPACK_STUDENT，代表的是学生许可证
如果你想添加教师，就改为STANDARDWOFFPACK_FACULTY

你也可以在Windows PowerShell使用下面这个命令来看你的订阅

```
Get-MsolAccountSku
```

[![请输入图片描述](//www.xtboke.cn/usr/uploads/auto_save_image/ff4b3f56a00bc15fabad07c7e66a6d80.png)
这些都做好了，就可以真正的开始跑脚本了

```
Import-Csv -Path "C:\Users\Administrator\Desktop\001.csv" | foreach {New-MsolUser -DisplayName $_.DisplayName -FirstName $_.FirstName -LastName $_.LastName -UserPrincipalName $_.UserPrincipalName -UsageLocation $_.UsageLocation -LicenseAssignment $_.AccountSkuId} | Export-Csv -Path "C:\Users\Administrator\Desktop\NewAccountResults.csv"

```

这是我用的脚本，具体要修改的地方就两个，在文章开头也说过了，前面那个路径代表你的csv的位置，后面那个路径是储存你创建的用户信息的位置

大概就是这些啦，文章写的还算比较详细吧，所以显得比较冗长，我也是个小白，不足的地方请大家多多指正，谢谢！

这是我跑的成果

[![请输入图片描述](//www.xtboke.cn/usr/uploads/auto_save_image/67e5ea0e658b0b709a4216b123dd7a70.png)
转自:<https://www.zxd.win/16.html>