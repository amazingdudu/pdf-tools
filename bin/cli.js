#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;
const PDFTools = require('../src/index');

// 版本号
program.version('1.0.0');

// 合并PDF命令
program
    .command('merge <files...>')
    .description('合并多个PDF文件')
    .option('-o, --output <path>', '输出文件路径', 'merged-output.pdf')
    .action(async (files, options) => {
        try {
            console.log(chalk.blue('开始合并PDF文件...'));
            
            // 验证输入文件是否存在
            for (const file of files) {
                try {
                    await fs.access(file);
                } catch (error) {
                    console.error(chalk.red(`错误: 文件 "${file}" 不存在`));
                    process.exit(1);
                }
            }

            // 执行合并
            const result = await PDFTools.mergePDFs(files, options.output);
            console.log(chalk.green('✓ PDF文件合并成功！'));
            console.log(chalk.gray(`输出文件: ${result.outputPath}`));
        } catch (error) {
            console.error(chalk.red('错误:', error.message));
            process.exit(1);
        }
    });

// 分割PDF命令
program
    .command('split <file>')
    .description('分割PDF文件')
    .option('-o, --output <directory>', '输出目录', 'split-output')
    .option('-r, --ranges <ranges>', '页面范围 (例如: "1-2,3-4")')
    .action(async (file, options) => {
        try {
            console.log(chalk.blue('开始分割PDF文件...'));

            // 验证输入文件是否存在
            try {
                await fs.access(file);
            } catch (error) {
                console.error(chalk.red(`错误: 文件 "${file}" 不存在`));
                process.exit(1);
            }

            // 创建输出目录
            try {
                await fs.mkdir(options.output, { recursive: true });
            } catch (error) {
                console.error(chalk.red(`错误: 无法创建输出目录 "${options.output}"`));
                process.exit(1);
            }

            // 处理页面范围
            let pageRanges = null;
            if (options.ranges) {
                pageRanges = options.ranges.split(',').map(range => {
                    const [start, end] = range.split('-').map(Number);
                    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
                        console.error(chalk.red('错误: 无效的页面范围'));
                        process.exit(1);
                    }
                    return [start, end];
                });
            }

            // 执行分割
            const result = await PDFTools.splitPDF(file, options.output, pageRanges);
            console.log(chalk.green('✓ PDF文件分割成功！'));
            console.log(chalk.gray(`输出目录: ${result.outputDirectory}`));
        } catch (error) {
            console.error(chalk.red('错误:', error.message));
            process.exit(1);
        }
    });

// 解析命令行参数
program.parse(process.argv);
