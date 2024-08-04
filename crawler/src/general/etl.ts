import simpleGit from "simple-git";
import {tmpdir} from "os";
import {join} from "path";

// 从git仓库提取，加载并转换为目标数据
async function gitETL(url: string, walk: (repoDir: string) => Array<string>, push: (list: Array<string>) => Promise<void>): Promise<string>{
    const git = simpleGit();
    const tempDir = tmpdir();
    const repoDir = join(tempDir, String(Math.random()));
    try {
        await git.clone(url, repoDir, undefined, async () => {
            console.log('Repository cloned successfully!');
            console.log(repoDir)
            const obj = walk(repoDir)
            if (obj.length > 0){
                await push(obj)
            }
        });

        return repoDir;
    } catch (error) {
        console.error('Error while cloning repository:', error);
        return "";
    }
}

export default gitETL;