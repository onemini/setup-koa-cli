#!/usr/bin/env node
import fs from "fs"
import { execa } from "execa"
import chalk from "chalk"
const createLog = (type) => (content) => console.log(chalk[type](content));
const success = createLog("green");
const errorLog = createLog("red");
import createIndexTemplate from "./createIndexTemplate.js"
import createPackageTemplate from "./createPackageTemplate.js"
import question from "./question/index.js"
import { createConfig } from "./config.js"

const answer = await question();

function getRootPath() {
    return `./${answer.packageName}`;
}

// 删除目录
function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path)
    }
}

async function create () {
    const basePath = getRootPath();
    console.log(basePath);
    if (fs.existsSync(basePath)) {
        errorLog("同名文件已经存在");
        return false;
    }

    const config = createConfig(answer);

    // 1. 创建文件夹 ->
    console.log(chalk.blue(`创建文件夹 -> ${config.packageName}`));
    fs.mkdirSync(`${basePath}`);
    try {
        // 2. 创建入口文件 -> index.js
        console.log(chalk.blue(`创建入口文件 -> index.js`));
        fs.writeFileSync(`${basePath}/index.js`, createIndexTemplate(config));
        // 3. 创建package.json
        console.log(chalk.blue(`创建package.json`));
        fs.writeFileSync(`${basePath}/package.json`, createPackageTemplate(config));
        // 4. 安装依赖
        console.log(chalk.blue(`安装依赖`));
        await execa("yarn", ["install"], {
            cwd: `${basePath}`,
            stdio: 'inherit'
        });
        success(`
        恭喜！！！小项目创建完毕
        -----------------------------------------------
        ***********************************************
        
        
        cd ${basePath}
        
        npm run serve
        
        
        ===============================================
        `)
    } catch (error) {
        console.log(error);
         //   删除目录及文件
      delDir(basePath);
      errorLog("创建失败！");
    }
}

create();