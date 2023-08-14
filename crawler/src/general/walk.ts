import * as fs from 'fs';
import {MetaDataBlack} from "../metamask_blacklist";

function readFile(file: string) : MetaDataBlack | null {

    if (fs.existsSync(file)) {//判断是否存在此文件
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } else {
        return null
    }
}

export default readFile;