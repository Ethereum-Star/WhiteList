import {BlackList, DappList} from "../../../types";
import {Pool} from "pg";
import {PoolData} from "../../../database";

export async function WhiteListToDb(dappList: DappList[], src: string){
    const pool = new Pool(PoolData);

    if (dappList.length > 0) {
        const client = await pool.connect();
        try {
            const insertSql = `INSERT INTO dapp_list(site_name, dapp_name, dapp_url, contract_addr) VALUES($1, $2, $3, $4)`;
            for (const dapp of dappList) {
                await client.query(insertSql, [
                    dapp.site_name,
                    dapp.dapp_name,
                    dapp.dapp_url,
                    dapp.contract_addr,
                ]);
            }
            console.log(src + " dapp list inserted successfully!");
        } catch (error) {
            console.error(
                "Error occurred during inserting " + src + " dapp list:",
                error
            );
        } finally {
            client.release();
        }
    }
}

export async function BlackListToDb(blackList: BlackList[], src: string){
    const pool = new Pool(PoolData);

    if (blackList.length > 0) {
        const client = await pool.connect();
        try {
            const insertSql = `INSERT INTO dapp_list_blacklist(site_name, report_site) VALUES($1, $2)`;
            for (const dapp of blackList) {
                await client.query(insertSql, [
                    dapp.site_name,
                    dapp.report_site
                ]);
            }
            console.log(src + " dapp list inserted successfully!");
        } catch (error) {
            console.error(
                "Error occurred during inserting " + src + " dapp list:",
                error
            );
        } finally {
            client.release();
        }
    }
}

// 从白名单数据库中读取域名，返回命中数量
export async function ReadBlackListFromDB(domain: string):Promise<number | null>{
    const pool = new Pool(PoolData);

    const client = await pool.connect();
    try {
        const sql = `select 1 from dapp_list_blacklist where site_name = $1 group by report_site`;
        const ret = await client.query(sql, [
            domain
        ]);

        return ret.rowCount
    } catch (error) {
        console.error(
            "Error occurred during read whitelist:",
            error
        );
        return null
    } finally {
        client.release();
    }
}



// 从黑名单数据库中读取域名，返回命中数量
export async function ReadWhiteListFromDB(domain: string):Promise<number | null>{
    const pool = new Pool(PoolData);

    const client = await pool.connect();
    try {
        const sql = `select 1 from dapp_list where dapp_url = $1 group by site_name`;
        const ret = await client.query(sql, [
            domain
        ]);

        return ret.rowCount
    } catch (error) {
        console.error(
            "Error occurred during read white list:",
            error
        );
        return null
    } finally {
        client.release();
    }
}