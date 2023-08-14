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
            const insertSql = `INSERT INTO dapp_list(site_name, dapp_name, dapp_url, contract_addr) VALUES($1, $2, $3, $4)`;
            for (const dapp of blackList) {
                await client.query(insertSql, [
                    dapp.site_name,
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