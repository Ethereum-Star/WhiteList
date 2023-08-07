import { DappList } from "../../../types";
import {Pool} from "pg";
import {PoolData} from "../../../database";

export async function ToDb(dappList: DappList[], src: string){
    const pool = new Pool(PoolData);

    if (dappList.length > 0) {
        const client = await pool.connect();
        try {
            const insertQuery = `INSERT INTO dapp_list(site_name, dapp_name, dapp_url, contract_addr) VALUES($1, $2, $3, $4)`;
            for (const dapp of dappList) {
                await client.query(insertQuery, [
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