import {sites} from "../sites";
import {DappList} from "../../types";
import axios from "axios";
import {WhiteListToDb} from "./general/db";

async function debank_crawler(){
    const url = sites.DebankApi;
    let dappList: DappList[] = [];

    // const pool = new Pool(PoolData);

    try {
        const response = await axios.get<DebankProtocols[]>(`${url}/v1/protocol/all_list`);
        let resp = response.data;

        for (const dapp of resp) {
            const dappInfo: DappList = {
                site_name: "Debank",
                dapp_name: dapp.name,
                dapp_url: dapp.site_url,
                contract_addr: "",
            };
            dappList.push(dappInfo);
        }

    } catch (error) {
        console.error("Error occurred during Debank scraping:", error);
    }

    await WhiteListToDb(dappList, "Debank")
}

export default debank_crawler;

export interface DebankProtocols {
    id: string;
    chain: string;
    name: string;
    site_url: string;
    logo_url: string;
    has_supported_portfolio: boolean;
    tvl: number;
}