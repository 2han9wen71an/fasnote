---
layout: post
title:  "EasyExcel常用操作"
description: "下拉框，冻结，不可编辑以及隐藏"
date:   2022-09-06 +0800
categories: 代码笔记
permalink: /CodeNotes/easyexcel-common-operations.html
tags: [EasyExcel,Java]
---

# 前言

最近工作遇到一个Excel导出需求，需要实现下列几点

- 根据已有数据生产动态表头
- 对比数据前2列锁定，不允许编辑
- 表头和对比数据需要冻结，方便用户操作
- 可以下拉框选择数据

![需求]({{ site.url }}/assets/images/post/Snipaste_2022-09-06_16-01-03.png)

这几个需求很常见，都是基本的Excel操作，特意记录一下

# 依赖

以前导出我都是手动使用原生POI来进行操作，本次使用阿里的EasyExcel

使用Maven引用依赖会自动下载POI相关的依赖，不需要重复引用

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.1.1</version>
</dependency>
```

# 编写代码实现需求

从[官网](https://easyexcel.opensource.alibaba.com/)查询导出示例,改改参数后

## 实现动态表头

```java
	@GetMapping("download")
    public void download(HttpServletResponse response，String projectId) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        String now = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-mm-dd"));
        String fileName = URLEncoder.encode("测试" + now, "UTF-8").replace("+", "%20");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
        List<List<String>> listHead = head();
        EasyExcel.write(response.getOutputStream()).head(head()).sheet("模板").doWrite(data());
    }

	/**
	*动态表头演示
	*/
	private List<List<String>> head() {
        List<List<String>> result = new ArrayList<>();
        List<String> list = new ArrayList<>();
        list.add("类型");
        list.add("控制器名称");
        list.add("E1");
        list.add("E2");
        list.add("E3");
        list.add("E4");
        list.add("OTS1");
        list.add("OTS2");
        list.add("SOP");
        result.add(list);
        return result;
    }

	/**
	*基础数据
	*/
    private List<List<String>> data() {
        List<List<String>> result = new ArrayList<>();
        List<String> list = new ArrayList<>();
        list.add("subFunction");
        list.add("");
        list.add("");
        list.add("");
        list.add("");
        list.add("");
        list.add("");
        list.add("");
        list.add("");
        result.add(list);
        return result;
    }
```

通过上面的代码成功导出Excel，但是此时还只实现了动态表头，现在开始添加下拉框

## 添加下拉框以及隐藏列功能

### 实现SheetWriteHandler过滤器

SheetWriteHandler过滤器（处理器）的作用就是可以让我们自定义单元格的样式，我们常用的是其中的afterSheetCreate()方法，在该方法中，我们可以对当前所在的单元格进行样式的设置，先从百度copy一个模板来

```java
public class UserSheetHandler implements SheetWriteHandler {
    /**
     * 隐藏索引
     */
    @Setter
    @Getter
    private List<Integer> hiddenIndices;
    /**
     * 下拉选择项框 key 列索引，value 为 选项
     */
    private Map<Integer, String[]> mapDropDown;
    /**
     * 下拉选择项框开始行
     */
    private Integer firstRow;
 
    /**
     * 结束行
     */
    private Integer lastRow;
 
    public UserSheetHandler(){
 
    }
    public UserSheetHandler(Map<Integer, String[]> mapDropDown,Integer firstRow,Integer lastRow){
        this.mapDropDown=mapDropDown;
        this.firstRow=firstRow;
        this.lastRow=lastRow;
    }
 
    @Override
    public void beforeSheetCreate(WriteWorkbookHolder writeWorkbookHolder, WriteSheetHolder writeSheetHolder) {}
 
    @Override
    public void afterSheetCreate(WriteWorkbookHolder writeWorkbookHolder,
                                 WriteSheetHolder writeSheetHolder) {
        Workbook workbook = writeWorkbookHolder.getWorkbook();
        Sheet sheet = workbook.getSheetAt(0);
        //设置下拉框
        dropDown(sheet);
        //设置隐藏列
        hidden(sheet);
    }
    //设置下拉框
    private void dropDown(Sheet sheet){
        if(MapUtils.isEmpty(mapDropDown)){
            return ;
        }
        DataValidationHelper helper = sheet.getDataValidationHelper();
        for (Map.Entry<Integer, String[]> entity : mapDropDown.entrySet()) {
            /***起始行、终止行、起始列、终止列**/
            CellRangeAddressList addressList = new CellRangeAddressList(firstRow, lastRow+firstRow-1, entity.getKey(), entity.getKey());
            /***设置下拉框数据**/
            DataValidationConstraint constraint = helper.createExplicitListConstraint(entity.getValue());
            DataValidation dataValidation = helper.createValidation(constraint, addressList);
            /***处理Excel兼容性问题**/
            if (dataValidation instanceof XSSFDataValidation) {
                dataValidation.setSuppressDropDownArrow(true);
                dataValidation.setShowErrorBox(true);
            } else {
                dataValidation.setSuppressDropDownArrow(false);
            }
            sheet.addValidationData(dataValidation);
        }
    }
 
    /**
     * 设置隐藏列
     * @param sheet
     */
    private void hidden(Sheet sheet){
        if (!CollectionUtils.isEmpty(hiddenIndices))
        {
            // 设置隐藏列
            for (Integer hiddenIndex : hiddenIndices) {
                sheet.setColumnHidden(hiddenIndex, true);
            }
        }
    }
}

```

只需要在构造函数中传入下拉框数据，并且在导出的时候把添加自定义的处理器就可以处理成功，此时调用代码如下

```java
 Map<Integer, String[]> dropdownMap = new HashMap<>();
 dropdownMap.put(0,new String[] {"主控制器", "辅助控制器"});
 EasyExcelFactory.write(response.getOutputStream()).head(head()).registerWriteHandler(new UserSheetHandler(lockMap,1,200)).sheet("模板").doWrite(data());
```

但是这里**firstRow**和**lastRow**是所有下拉列表的通用属性，会导致第三个需求不满足，他需要不可编辑，并且只是纯文本显示，不需要下拉框，所以我们要把它稍微改造一下，用对象来包装它

```java
@Data
public class DropDown {
    public static final Integer DEFAULT_FIRST_ROW = 0;
    public static final Integer DEFAULT_LAST_ROW = 200;
    // 所在列
    private Integer column;
    // 开始行
    private Integer firstRow = DEFAULT_FIRST_ROW;
    // 结束行
    private Integer lastRow = DEFAULT_LAST_ROW;
    // 下拉框数据
    private List<String> data;
}

```

然后把上面的**mapDropDown**改成

```java
/**
* 下拉框值
*/
private List<DropDown> dropDownList;
```

然后把循环从map中获取数据改成循环从自定义的对象获取就好了，这样就能解决下拉框不对的问题  

此时我们已经解决了2个问题，还需要冻结表头已经不可编辑部分表格

## 在过滤器中实现行列冻结

想要实现行列冻结，就需要在afterSheetCreate()方法中进行操作，该方法中有一个writeSheetHolder参数，表示当前写入表格的处理器，我们可以通过该处理器来获取到当前正在操作的sheet，
**实现行列冻结的方法是createFreezePane()，** 该方法有两种调用方式，源码如下：

```javascript
    void createFreezePane(int var1, int var2);
    void createFreezePane(int var1, int var2, int var3, int var4);
```

> 第一种传入两个参数，含义是：
>
> - var1 冻结的列数
> - var2 冻结的行数
>
> 默认从第0行，第0列开始冻结，

> 第二种传入四个参数，含义是：
>
> - var1 冻结的列数
> - var2 冻结的行数
> - var3 冻结后右边第一列的列号
> - var4 冻结后下边第一行的行号 这种方法下冻结会更加的精确，

该方法在afterSheetCreate()下的具体使用如下：

```
@Override
public void afterSheetCreate(WriteWorkbookHolder writeWorkbookHolder, WriteSheetHolder writeSheetHolder) {
    Sheet sheet = writeSheetHolder.getSheet();
    // 冻结表头
    sheet.createFreezePane(0, 1, 0, 1);
    dropDown(sheet);
    hidden(sheet);
}
```

此时我们表头也成功冻结成功，只差最后一步，不可编辑了

## 不可编辑

在POI中对单元格进行操作对应的是Cell，上面我们自定义的**SheetWriteHandler**是EasyExcel提供对Sheet操作的增强，同理肯定对Cell也有增强，那就是**CellWriteHandler**，现在我们来自定义一个，其中**beforeCellCreate**就是在Cell创建之前执行的动作，我们需要在这里初始化一些数据，当然都写在后文的**afterCellCreate**也可以，**afterCellCreate**就是创建好后进行增强

```java
@Slf4j
public class CellHandler implements CellWriteHandler {
    /**
     * 锁定key行，val列
     */
    private Map<Integer, List<Integer>> lockMap;

    /**
     * 样式类
     */
    private CellStyle cellStyle;

    /**
     * 锁定和隐藏 指定列的单元格
     *
     * @param lockMap 锁定的行与列索引集合映射
     */
    public CellHandler(Map<Integer, List<Integer>> lockMap) {
        this.lockMap = lockMap;
    }

    @Override
    public void beforeCellCreate(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Row row,
        Head head, Integer integer, Integer integer1, Boolean aBoolean) {
        // 创建一个样式，用于锁定单元格
        cellStyle = writeSheetHolder.getSheet().getWorkbook().createCellStyle();
        cellStyle.setAlignment(HorizontalAlignment.CENTER);
    }

    /**
     *
     * @param writeSheetHolder
     * @param writeTableHolder
     * @param cell 当前单元格
     * @param head 表头
     * @param integer 当前行
     * @param aBoolean 是否是表头
     */
    @Override
    public void afterCellCreate(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Cell cell,
        Head head, Integer integer, Boolean aBoolean) {
        if (MapUtils.isEmpty(lockMap)) {
            return;
        }
        // 拿到所在行
        int rowIndex = cell.getRowIndex();
        // 拿到所在列
        int columnIndex = cell.getColumnIndex();
        // 验证是否满足条件
        if (lockMap.containsKey(rowIndex) && lockMap.get(rowIndex).contains(columnIndex)) {
            writeSheetHolder.getSheet().protectSheet("");
            // 设置锁定单元格
            cellStyle.setLocked(true);
            log.info("单元格:行{}，列{},已锁定", rowIndex, columnIndex);
        } else {
            // 非锁定单元格 必须手动设置为 false
            cellStyle.setLocked(false);
            log.info("单元格:行{}，列{},未锁定", rowIndex, columnIndex);
        }
        // 填充单元格样式
        cell.setCellStyle(cellStyle);
    }

}
```

此时调用方还需要把这个新增的数据处理器加进去

```java
 // 下拉数据
 Map<Integer, String[]> dropdownMap = new HashMap<>();
 dropdownMap.put(0,new String[] {"主控制器", "辅助控制器"});
 // 锁定第二行的第1,2列数据，让其不可编辑
 Map<Integer, List<Integer>> lockMap = Map.of(1, List.of(0, 1));
 EasyExcelFactory.write(response.getOutputStream()).head(head()).registerWriteHandler(new UserSheetHandler(lockMap,1,200)).registerWriteHandler(new CellHandler(lockMap)).sheet("模板").doWrite(data());
```

然后此时我们再次进行测试，发现完美实现需求，但是会引入一个新问题，上面解锁 **cellStyle.setLocked(false);**只会解锁当前Excel中的数据，当我们新增数据，需要把Excel解锁，这个时候加锁的数据就会失效，我还没找到更好的办法-_-

# 后记

采用**createExplicitListConstraint** 进行设置枚举下拉，存在很大弊端，数据过多会导致无法显示,修复后所有的下拉框都会被删除.。  

下面提供一个解决办法，通过将下拉数据存于隐藏的sheet中，通过excel中的公式进行设置，这样问题就得到解决。

## 关键代码

```JAVA
public class SheetHandler implements SheetWriteHandler {
    /**
     * 隐藏索引
     */
    @Setter
    @Getter
    private List<Integer> hiddenIndices;
    /**
     * 下拉框值
     */
    private List<DropDown> dropDownList;

    public SheetHandler(List<DropDown> dropDownList) {
        this.dropDownList = dropDownList;
    }

    @Override
    public void beforeSheetCreate(WriteWorkbookHolder writeWorkbookHolder, WriteSheetHolder writeSheetHolder) {

    }

    @Override
    public void afterSheetCreate(WriteWorkbookHolder writeWorkbookHolder, WriteSheetHolder writeSheetHolder) {
        Sheet sheet = writeSheetHolder.getSheet();
        // 冻结表头
        sheet.createFreezePane(0, 1, 0, 1);
        dropDown(sheet);
        hidden(sheet);
    }

    private void dropDown(Sheet sheet) {
        if (CollectionUtils.isEmpty(dropDownList)) {
            return;
        }
        DataValidationHelper helper = sheet.getDataValidationHelper();
        String hiddenName = "hidden";
        Workbook workbook = sheet.getWorkbook();
        Sheet hidden = workbook.getSheet(hiddenName);
        for (DropDown dropDown : dropDownList) {
            /*** 起始行、终止行、起始列、终止列 **/
            Integer firstRow = dropDown.getFirstRow();
            Integer column = dropDown.getColumn();
            CellRangeAddressList addressList =
                new CellRangeAddressList(firstRow, dropDown.getLastRow() + firstRow - 1, column, column);
            // 1.获取excel列名
            String excelLine = getExcelLine(column);
            // 2.循环赋值
            List<String> data = dropDown.getData();
            for (int i = 0, length = data.size(); i < length; i++) {
                // 3:表示你开始的行数 3表示 你开始的列数
                Row row = hidden.getRow(i);
                if (row == null) {
                    row = hidden.createRow(i);
                }
                row.createCell(column).setCellValue(data.get(i));
            }
            // 4. =hidden!$H:$1:$H$50 sheet为hidden的 H1列开始H50行数据获取下拉数组
            String refers = "=" + hiddenName + "!$" + excelLine + "$1:$" + excelLine + "$" + (data.size() + 1);
            // 5 将刚才设置的sheet引用到你的下拉列表中
            DataValidationConstraint constraint = helper.createFormulaListConstraint(refers);
            DataValidation dataValidation = helper.createValidation(constraint, addressList);
            sheet.addValidationData(dataValidation);
        }
        // 设置列为隐藏
        int hiddenIndex = workbook.getSheetIndex(hiddenName);
        if (!workbook.isSheetHidden(hiddenIndex)) {
            workbook.setSheetHidden(hiddenIndex, true);
        }
    }

    /**
     * 返回excel列标A-Z-AA-ZZ
     *
     * @param num 列数
     * @return java.lang.String
     */
    public static String getExcelLine(int num) {
        String line = "";
        int first = num / 26;
        int second = num % 26;
        if (first > 0) {
            line = (char)('A' + first - 1) + "";
        }
        line += (char)('A' + second) + "";
        return line;
    }

    /**
     * 设置隐藏列
     *
     * @param sheet
     */
    private void hidden(Sheet sheet) {
        if (!CollectionUtils.isEmpty(hiddenIndices)) {
            // 设置隐藏列
            for (Integer hiddenIndex : hiddenIndices) {
                sheet.setColumnHidden(hiddenIndex, true);
            }
        }
    }
}

```

## 调用

```java
ExcelWriter excelWriter = EasyExcelFactory.write(response.getOutputStream()).build();
WriteSheet hidden = EasyExcelFactory.writerSheet(1, "hidden").build();
WriteSheet sheet1 =
    EasyExcelFactory.writerSheet(0, "计划表").head(listHead).registerWriteHandler(new CellHandler(lockMap))
    .registerWriteHandler(new SheetHandler(dropDownList)).build();
List<List<String>> dataList = data();
excelWriter.write(dataList, hidden).write(dataList, sheet1);
excelWriter.finish();
```

# 参考

- [EasyExcel官网](https://easyexcel.opensource.alibaba.com/docs/current/quickstart/write#示例代码-1)
- [EasyExcel下拉列表无法显示](https://www.wslhome.top/articles/2022/02/24/1645664626098.html)
- [easyExcel 锁定单元格、隐藏列、下拉选项]([http://www.ateng.vip/archives/easyexcel%E9%94%81%E5%AE%9A%E5%8D%95%E5%85%83%E6%A0%BC%E9%9A%90%E8%97%8F%E5%88%97%E4%B8%8B%E6%8B%89%E9%80%89%E9%A1%B9md](http://www.ateng.vip/archives/easyexcel锁定单元格隐藏列下拉选项md))
