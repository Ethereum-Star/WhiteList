import {ReadBlackListFromDB, ReadWhiteListFromDB} from "../../crawler/src/general/db";

// 返回值：
/*
1: Safe：域名在超过3个社区里列出
2: Normal：域名在超过1个社区里列出
3: Unknown：当后端API查询失败时，无法获得结果
4: Warn：域名未在社区里列出
5: Danger：域名在一些黑名单里
 */
export async function verify_url_level(url: string):Promise<number> {
    const domain = prepare_domain(url);

    const blackCnt = await ReadBlackListFromDB(domain);
    const whiteCnt = await ReadWhiteListFromDB(domain);

    if (blackCnt == null || whiteCnt == null) return 3;
    if (blackCnt > 0) return 5;

    if (whiteCnt >= 3) return 1;
    if (whiteCnt >= 1) return 2;
    return 4;
}


// 从url提取domain
function prepare_domain(url: string):string {
    return  url;
}