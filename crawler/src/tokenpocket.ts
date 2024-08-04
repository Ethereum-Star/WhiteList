import simpleGit from 'simple-git';
import { tmpdir } from 'os';
import { join } from 'path';
import {sites} from "../sites";
import fs from 'fs';
import path from 'path';

async function walkTokenPocket() {
    const git = simpleGit();
    const tempDir = tmpdir();
    const repoDir = join(tempDir, String(Math.random()));
    try {
        await git.clone(sites.TokenPocketApi, repoDir, undefined, async () =>{
            console.log(repoDir)

            const jsonFiles = await walkRepo(repoDir, "info.json")

            for (let i = 0; i < jsonFiles.length; i++) {
                console.log(jsonFiles[i])
            }
        });
        console.log('Repository cloned successfully!');
    } catch (error) {
        console.error('Error while cloning repository:', error);
    }
}

async function walkRepo(dir: string, targetFile: string):Promise<string[]>{
    const foundFiles: string[] = [];

    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            foundFiles.push(...(await walkRepo(filePath, targetFile)));
        } else if (file.includes(targetFile)) {
            foundFiles.push(filePath);
        }
    }

    return foundFiles;
}


// ******************************************************
// WIP: 仅实现将代码下载至临时文件及遍历，并未对遍历结果进行处理提取
// ******************************************************
walkTokenPocket();

export default walkTokenPocket;