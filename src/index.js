const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

class PDFTools {
    /**
     * 合并多个PDF文件
     * @param {string[]} inputPaths - PDF文件路径数组
     * @param {string} outputPath - 输出文件路径
     * @returns {Promise<void>}
     */
    static async mergePDFs(inputPaths, outputPath) {
        try {
            // 创建一个新的PDF文档
            const mergedPdf = await PDFDocument.create();

            // 处理每个输入的PDF文件
            for (const path of inputPaths) {
                const pdfBytes = await fs.readFile(path);
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            // 保存合并后的PDF
            const mergedPdfBytes = await mergedPdf.save();
            await fs.writeFile(outputPath, mergedPdfBytes);
            
            return {
                success: true,
                message: 'PDF files merged successfully',
                outputPath
            };
        } catch (error) {
            throw new Error(`Error merging PDFs: ${error.message}`);
        }
    }

    /**
     * 分割PDF文件
     * @param {string} inputPath - 输入PDF文件路径
     * @param {string} outputDirectory - 输出目录路径
     * @param {number[]} [pageRanges] - 可选的页面范围数组，每个元素为 [startPage, endPage]
     * @returns {Promise<void>}
     */
    static async splitPDF(inputPath, outputDirectory, pageRanges = null) {
        try {
            const pdfBytes = await fs.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const totalPages = pdfDoc.getPageCount();

            // 如果没有指定页面范围，则每页生成一个PDF
            if (!pageRanges) {
                for (let i = 0; i < totalPages; i++) {
                    const newPdf = await PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                    newPdf.addPage(copiedPage);
                    
                    const newPdfBytes = await newPdf.save();
                    await fs.writeFile(`${outputDirectory}/page_${i + 1}.pdf`, newPdfBytes);
                }

                return {
                    success: true,
                    message: `PDF split into ${totalPages} individual pages`,
                    outputDirectory
                };
            }

            // 按指定范围分割
            let fileIndex = 1;
            for (const [start, end] of pageRanges) {
                if (start < 1 || end > totalPages) {
                    throw new Error('Invalid page range');
                }

                const newPdf = await PDFDocument.create();
                const pageIndices = Array.from(
                    { length: end - start + 1 },
                    (_, i) => start - 1 + i
                );
                const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
                copiedPages.forEach(page => newPdf.addPage(page));

                const newPdfBytes = await newPdf.save();
                await fs.writeFile(
                    `${outputDirectory}/split_${fileIndex}_pages_${start}-${end}.pdf`,
                    newPdfBytes
                );
                fileIndex++;
            }

            return {
                success: true,
                message: `PDF split into ${pageRanges.length} files according to specified ranges`,
                outputDirectory
            };
        } catch (error) {
            throw new Error(`Error splitting PDF: ${error.message}`);
        }
    }
}

module.exports = PDFTools;
