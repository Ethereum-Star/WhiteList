import {sites} from "../sites";
import {BlackList} from "../../types";
import {BlackListToDb} from "./general/db";
import gitETL from "./general/etl";
import walk from "./general/walk";

async function metamask_blacklist_crawler() {
    const url = sites.MetaMask + ".git";
    let blackList: BlackList[] = [];

    try {
        await gitETL(url, walkDir, pushToDB)

    } catch (error) {
        console.error("Error occurred during DefiLlama scraping:", error);
    }

    await BlackListToDb(blackList, "MetaMask")
}

export default metamask_blacklist_crawler;


const walkDir = (repoDir: string): Array<string> => {
    const v = walk(repoDir + '/src/config.json')

    if (v != null) {
        const ret = new Array<string>()
        for (let i = 0; i < v.blacklist.length; i++) {
            ret.push(v.blacklist[i])
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

export interface MetaDataBlack {
    version: number;
    tolerance: number;
    fuzzylist: string[];
    whitelist: string[];
    blacklist: string[];
}

