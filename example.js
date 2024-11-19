const PDFTools = require('./src/index');

async function example() {
    try {
        // 合并PDF示例
        await PDFTools.mergePDFs(
            ['input1.pdf', 'input2.pdf'],
            'merged-output.pdf'
        );
        console.log('PDFs merged successfully!');

        // 分割PDF示例 - 将每页分割为单独的文件
        await PDFTools.splitPDF(
            'merged-output.pdf',
            './split-output'
        );
        console.log('PDF split into individual pages!');

        // 分割PDF示例 - 按指定范围分割
        await PDFTools.splitPDF(
            'merged-output.pdf',
            './split-output-ranges',
            [[1, 2], [3, 4]] // 将页面1-2分为一个文件，3-4分为另一个文件
        );
        console.log('PDF split by ranges!');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

example();
