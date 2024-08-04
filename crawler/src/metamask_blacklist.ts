import {sites} from "../sites";
import {BlackList} from "../../types";
import {BlackListToDb} from "./general/db";
import gitETL from "./general/etl";
import fs from "fs";

async function metamask_blacklist_crawler() {
    const url = sites.MetaMask + ".git";
    let blackList: BlackList[] = [];

    try {
        await gitETL(url, walkDir, pushToDB)

    } catch (error) {
        console.error("Error occurred during MetaMask scraping:", error);
    }

    await BlackListToDb(blackList, "MetaMask")
}

export default metamask_blacklist_crawler;


const walkDir = (repoDir: string): Array<string> => {
    let json;
    const file = repoDir + '/src/config.json';
    if (fs.existsSync(file)) {//判断是否存在此文件
        json = JSON.parse(fs.readFileSync(file, "utf8"));
    } else {
        json = null
    }

    if (json != null) {
        const ret = new Array<string>()
        for (let i = 0; i < json.blacklist.length; i++) {
            ret.push(json.blacklist[i])
        }
        return ret;
    } else {
        return [];
    }

}

const pushToDB = async (list: Array<string>): Promise<void> => {
    const blackList = new Array(list.length)
    for (let i = 0; i < list.length; i++) {
        blackList[i] = {
            site_name: list[i],
            report_site: "MetaMask_BlackList",
        };
    }

    await BlackListToDb(blackList, "metamask")
}