---
layout: post
title:  "Polarion-Arm-环境修复"
description: ""·
date:   2025-06-21 11:20:39 +0800
categories: 折腾笔记
permalink: /Toss-notes/polarion-arm-fix.html
tags: [Polarion,Arm]
---
# 前言
最近换了一台 MAC MINI 用来办公，目前主要工作上主要是 Polarion 的开发，需要在本地安装开发环境，一开始使用 PD 虚拟机安装 Windows 进行开发，但是 Arm64 转译性能比较低，每次启动就要 50S 以上，想着 ALM 就是一个 Java 应用，可以跑在 Linux 上，于是就尝试在 MAC 上安装开发环境，但是 Polarion 的官方文档只提供了 Windows 和 Linux 的安装包，没有提供 MAC 的安装包，但是 Linux 和 Mac 都是 Linux 内核，所以就想着应该可以通用，所以我直接用 Docker 安装了一个虚拟机，用来安装 Polarion 然后提取目录数据挂载宿主机进行开发，现在启动速度 10S 以内，直接提高了 5 倍效率
# 问题描述
## Node.js 兼容性问题
在 ARM64 环境下运行 Polarion 时，遇到了 Node.js 兼容性问题：

```
2025-06-20 12:57:56,179 [Thread-118] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says: /opt/polarion/polarion/plugins/com.polarion.alm.ui_3.22.1/node/bin/node: /opt/polarion/polarion/plugins/com.polarion.alm.ui_3.22.1/node/bin/node: cannot execute binary file
2025-06-20 12:57:56,179 [Thread-119] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer has terminated for some reason. Exit code = 126
```

这是因为 Polarion 内置的 Node.js 是为 x86_64 架构编译的，无法在 ARM64 环境下运行。

### 解决方案
报错信息中提示了无法执行二进制文件，所以我们可以尝试将 Polarion 内置的 Node.js 替换为 ARM64 架构的版本。

在 Polarion 的安装目录下，找到 `plugins/com.polarion.alm.ui_3.22.1/node/` 文件夹，这个就是 Polarion 内置的 Node.js， 在我测试的 21R2 版本下是 10.15.0 将其替换为 ARM64 架构的 Node.js 执行文件即可。

但是我电脑是 MAC MINI，搜索得知 Node.js 16.0.0+ 开始正式支持 Apple Silicon (ARM64)，所以我直接选用了 Node.js 18进行替换。

替换后重启 Polarion，发现新的错误，说 js 找不到
```
2025-06-20 13:45:17,494 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says: node:internal/modules/cjs/loader:1143
2025-06-20 13:45:17,496 [Thread-34] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer has terminated for some reason. Exit code = 1
2025-06-20 13:45:17,496 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says:   throw err;
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says:   ^
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says: 
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says: Error: Cannot find module '/opt/polarion/polarion/plugins/com.polarion.alm.ui_3.22.1/node/bin/highcharts-convert-8.0.3.js'
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says:     at Module._resolveFilename (node:internal/modules/cjs/loader:1140:15)
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says:     at Module._load (node:internal/modules/cjs/loader:981:27)
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says:     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:128:12)
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says:     at node:internal/main/run_main_module:28:49 {
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says:   code: 'MODULE_NOT_FOUND',
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says:   requireStack: []
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says: }
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says: 
2025-06-20 13:45:17,497 [Thread-33] ERROR class com.polarion.alm.server.util.ChartExporterStartup - Chart renderer says: Node.js v18.20.4
2025-06-20 13:45:18,002 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says: node:internal/modules/cjs/loader:1143
2025-06-20 13:45:18,002 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says:   throw err;
2025-06-20 13:45:18,003 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says:   ^
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says: 
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says: Error: Cannot find module '/opt/polarion/polarion/plugins/com.polarion.alm.ui_3.22.1/node/bin/mj-formula-convert.js'
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says:     at Module._resolveFilename (node:internal/modules/cjs/loader:1140:15)
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says:     at Module._load (node:internal/modules/cjs/loader:981:27)
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says:     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:128:12)
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says:     at node:internal/main/run_main_module:28:49 {
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says:   code: 'MODULE_NOT_FOUND',
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says:   requireStack: []
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says: }
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says: 
2025-06-20 13:45:18,004 [Thread-39] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer says: Node.js v18.20.4
2025-06-20 13:45:18,003 [Thread-40] ERROR class com.polarion.alm.server.util.FormulaServerStartup - Formula renderer has terminated for some reason. Exit code = 1
```
赶紧进入原始备份目录对比，发现缺少了 Polarion 需要的特定 JavaScript 文件（如 highcharts-convert-8.0.3.js 和 mj-formula-convert.js）。
此时恢复这些丢失的 js 文件和 node——modules目录就成功恢复了

## JNA 问题修复
在 polarion 的 purevariant 插件使用了 JNA 进行本地调用，但是引入的 JNA 版本比较低，并没有提供 ARM64 的支持，所以我在  JNA 的源码 https://github.com/java-native-access/jna 的 issue 中找到最低的版本是 5.7.0
### 错误日志
```
	at com.polarion.portal.tomcat.servlets.DoAsFilter.doFilterWithUriNDC(DoAsFilter.java:107) ~[platform.jar:?]
	at com.polarion.portal.tomcat.servlets.DoAsFilter.lambda$0(DoAsFilter.java:83) ~[platform.jar:?]
	at java.security.AccessController.doPrivileged(Native Method) ~[?:?]
	at javax.security.auth.Subject.doAs(Subject.java:423) [?:?]
	at com.polarion.platform.internal.security.SubjectNDC.doAs(SubjectNDC.java:69) [platform.jar:?]
	at com.polarion.portal.tomcat.servlets.DoAsFilter.doFilterHttpRequest(DoAsFilter.java:82) [platform.jar:?]
	at com.polarion.portal.tomcat.servlets.DoAsFilter.doFilterRequest(DoAsFilter.java:69) [platform.jar:?]
	at com.polarion.portal.tomcat.servlets.DoAsFilter.doFilter(DoAsFilter.java:59) [platform.jar:?]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189) [catalina.jar:9.0.53]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162) [catalina.jar:9.0.53]
	at com.polarion.portal.tomcat.servlets.SecurityCheckFilter.doFilter(SecurityCheckFilter.java:46) [portal-tomcat.jar:?]
	at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:189) [catalina.jar:9.0.53]
	at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:162) [catalina.jar:9.0.53]
	at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:197) [catalina.jar:9.0.53]
	at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:97) [catalina.jar:9.0.53]
	at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:659) [catalina.jar:9.0.53]
	at com.polarion.platform.security.auth.PolarionAuthenticator.invokeInternal(PolarionAuthenticator.java:248) [platform.jar:?]
	at com.polarion.platform.security.auth.PolarionAuthenticator.invoke(PolarionAuthenticator.java:242) [platform.jar:?]
	at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:135) [catalina.jar:9.0.53]
	at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92) [catalina.jar:9.0.53]
	at org.apache.catalina.authenticator.SingleSignOn.invoke(SingleSignOn.java:312) [catalina.jar:9.0.53]
	at com.polarion.platform.session.PolarionLocalSingleSignOn.invoke(PolarionLocalSingleSignOn.java:164) [platform.jar:?]
	at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:78) [catalina.jar:9.0.53]
	at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:357) [catalina.jar:9.0.53]
	at org.apache.coyote.ajp.AjpProcessor.service(AjpProcessor.java:433) [tomcat-coyote.jar:9.0.53]
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65) [tomcat-coyote.jar:9.0.53]
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:893) [tomcat-coyote.jar:9.0.53]
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1726) [tomcat-coyote.jar:9.0.53]
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49) [tomcat-coyote.jar:9.0.53]
	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191) [tomcat-util.jar:9.0.53]
	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659) [tomcat-util.jar:9.0.53]
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61) [tomcat-util.jar:9.0.53]
	at java.lang.Thread.run(Thread.java:829) [?:?]
Caused by: org.apache.hivemind.ApplicationRuntimeException: Error building service com.polarion.platform.alm.tracker.variantManagementService: Failure invoking constructor for class com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService: Guice configuration errors:

1) No implementation for com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider was bound.
  while locating com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider
    for parameter 0 at com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService.setProvider(VariantManagementService.java:103)
  at com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService.setProvider(VariantManagementService.java:103)
  while locating com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService

1 error
	at org.apache.hivemind.impl.InvokeFactoryServiceConstructor.constructCoreServiceImplementation(InvokeFactoryServiceConstructor.java:66) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.impl.servicemodel.AbstractServiceModelImpl.constructCoreServiceImplementation(AbstractServiceModelImpl.java:108) ~[polarion-hivemind.jar:?]
	at org.apache.hivemind.impl.servicemodel.AbstractServiceModelImpl.constructNewServiceImplementation(AbstractServiceModelImpl.java:157) ~[polarion-hivemind.jar:?]
	... 78 more
Caused by: org.apache.hivemind.ApplicationRuntimeException: Error building service com.polarion.platform.alm.tracker.variantManagementService: Failure invoking constructor for class com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService: Guice configuration errors:

1) No implementation for com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider was bound.
  while locating com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider
    for parameter 0 at com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService.setProvider(VariantManagementService.java:103)
  at com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService.setProvider(VariantManagementService.java:103)
  while locating com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService

1 error
	at org.apache.hivemind.service.impl.BuilderFactoryLogic.createService(BuilderFactoryLogic.java:87) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.service.impl.BuilderFactory.createCoreServiceImplementation(BuilderFactory.java:42) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.impl.InvokeFactoryServiceConstructor.constructCoreServiceImplementation(InvokeFactoryServiceConstructor.java:62) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.impl.servicemodel.AbstractServiceModelImpl.constructCoreServiceImplementation(AbstractServiceModelImpl.java:108) ~[polarion-hivemind.jar:?]
	at org.apache.hivemind.impl.servicemodel.AbstractServiceModelImpl.constructNewServiceImplementation(AbstractServiceModelImpl.java:157) ~[polarion-hivemind.jar:?]
	... 78 more
Caused by: org.apache.hivemind.ApplicationRuntimeException: Failure invoking constructor for class com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService: Guice configuration errors:

1) No implementation for com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider was bound.
  while locating com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider
    for parameter 0 at com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService.setProvider(VariantManagementService.java:103)
  at com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService.setProvider(VariantManagementService.java:103)
  while locating com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService

1 error
	at org.apache.hivemind.util.ConstructorUtils.invoke(ConstructorUtils.java:145) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.service.impl.BuilderFactoryLogic.instantiateConstructorAutowiredInstance(BuilderFactoryLogic.java:191) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.service.impl.BuilderFactoryLogic.instantiateCoreServiceInstance(BuilderFactoryLogic.java:106) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.service.impl.BuilderFactoryLogic.createService(BuilderFactoryLogic.java:75) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.service.impl.BuilderFactory.createCoreServiceImplementation(BuilderFactory.java:42) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.impl.InvokeFactoryServiceConstructor.constructCoreServiceImplementation(InvokeFactoryServiceConstructor.java:62) ~[hivemind-1.1.1.jar:?]
	at org.apache.hivemind.impl.servicemodel.AbstractServiceModelImpl.constructCoreServiceImplementation(AbstractServiceModelImpl.java:108) ~[polarion-hivemind.jar:?]
	at org.apache.hivemind.impl.servicemodel.AbstractServiceModelImpl.constructNewServiceImplementation(AbstractServiceModelImpl.java:157) ~[polarion-hivemind.jar:?]
	... 78 more
Caused by: com.google.inject.ConfigurationException: Guice configuration errors:

1) No implementation for com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider was bound.
  while locating com.polarion.alm.tracker.spi.variantmanagement.IVariantManagementProvider
    for parameter 0 at com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService.setProvider(VariantManagementService.java:103)
  at com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService.setProvider(VariantManagementService.java:103)
  while locating com.polarion.alm.tracker.internal.variantmanagement.VariantManagementService

1 error
	at com.google.inject.internal.InjectorImpl.getMembersInjector(InjectorImpl.java:952) ~[guice-3.0.jar:?]
	at com.google.inject.internal.InjectorImpl.getMembersInjector(InjectorImpl.java:957) ~[guice-3.0.jar:?]
	at com.google.inject.internal.InjectorImpl.injectMembers(InjectorImpl.java:943) ~[guice-3.0.jar:?]
```

### 解决方案
和 Node 解决方案差不多，我们从 maven 中心仓库下载兼容的版本进行替换，重启 Polarion 进行验证测试

# 一键脚本
如果有遇到同样问题的小伙伴，直接使用我编写的一键脚本进行修复即可，我的 ALM 版本是21R2

仓库路径：https://github.com/2han9wen71an/Polarion_Arm64_Compatibility

## 执行
```
git clone https://github.com/2han9wen71an/Polarion_Arm64_Compatibility.git
cd Polarion_Arm64_Compatibility
chmod +x main.sh
chmod +x node/fix_nodejs_arm64.sh
chmod +x jna/fix_jna_arm64.sh
./main.sh all /opt/polarion
```
