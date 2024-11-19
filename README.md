# PDF Tools

一个用于 PDF 文件合并和分割的 Node.js 工具库。

## 功能特点

- PDF 文件合并：将多个 PDF 文件合并为一个文件
- PDF 文件分割：
  - 将 PDF 文件分割成单独的页面
  - 按指定页面范围分割 PDF 文件
- 命令行界面：支持通过命令行操作

## 安装

```bash
# 安装依赖
npm install

# 全局安装（可选，用于命令行使用）
npm install -g .
```

## 命令行使用

安装后，你可以使用 `pdf-tools` 命令来操作 PDF 文件：

### 合并 PDF 文件

```bash
# 基本用法
pdf-tools merge file1.pdf file2.pdf

# 指定输出文件
pdf-tools merge -o output.pdf file1.pdf file2.pdf file3.pdf
```

### 分割 PDF 文件

```bash
# 将每页分割为单独的文件
pdf-tools split input.pdf

# 指定输出目录
pdf-tools split -o output-dir input.pdf

# 按页面范围分割
pdf-tools split -r "1-2,3-4" input.pdf
```

## 编程接口使用

### 合并 PDF 文件

```javascript
const PDFTools = require('./src/index');

// 合并多个PDF文件
await PDFTools.mergePDFs(
    ['path/to/file1.pdf', 'path/to/file2.pdf'],
    'path/to/output.pdf'
);
```

### 分割 PDF 文件

1. 将每页分割为单独的文件：

```javascript
// 将PDF的每一页分割为单独的文件
await PDFTools.splitPDF(
    'path/to/input.pdf',
    'path/to/output/directory'
);
```

2. 按指定范围分割：

```javascript
// 按指定页面范围分割PDF
await PDFTools.splitPDF(
    'path/to/input.pdf',
    'path/to/output/directory',
    [[1, 2], [3, 4]] // 将页面1-2分为一个文件，3-4分为另一个文件
);
```

## API 文档

### mergePDFs(inputPaths, outputPath)

合并多个 PDF 文件。

- `inputPaths`: string[] - 输入PDF文件路径数组
- `outputPath`: string - 输出文件路径
- 返回: Promise<Object> - 包含操作结果的对象

### splitPDF(inputPath, outputDirectory, pageRanges?)

分割 PDF 文件。

- `inputPath`: string - 输入PDF文件路径
- `outputDirectory`: string - 输出目录路径
- `pageRanges`: number[][] (可选) - 页面范围数组，每个元素为 [startPage, endPage]
- 返回: Promise<Object> - 包含操作结果的对象

## 示例

查看 `example.js` 文件获取完整的使用示例。

## 依赖

- pdf-lib: ^1.17.1
- commander: ^11.0.0
- chalk: ^4.1.2

## 许可证

MIT
