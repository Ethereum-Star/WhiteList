import {sites} from "../sites";
import {DappList} from "../../types";
import axios from "axios";
import {ToDb} from "./general/db";

async function defiLlama_crawler(){
    const url = sites.DefiLlama;
    let dappList: DappList[] = [];

    // const pool = new Pool(PoolData);

    try {
        const response = await axios.get<DefillmaProtocols[]>(`${url}/protocols`);
        let resp = response.data;

        for (const dapp of resp) {
            const dappInfo: DappList = {
                site_name: "DefiLlma",
                dapp_name: dapp.name,
                dapp_url: dapp.address,
                contract_addr: "",
            };
            dappList.push(dappInfo);
        }

    } catch (error) {
        console.error("Error occurred during DefiLlama scraping:", error);
    }

    await ToDb(dappList, "DefiLlama")
}

export default defiLlama_crawler;

interface DefillmaProtocols {
    id: string;
    name: string;
    address?: any;
    symbol: string;
    url: string;
    description: string;
    chain: string;
    logo: string;
    audits: string;
    audit_note?: any;
    gecko_id?: any;
    cmcId?: any;
    category: string;
    chains: string[];
    module: string;
    twitter: string;
    forkedFrom: any[];
    oracles: any[];
    listedAt: number;
    slug: string;
    tvl: number;
    change_1h: number;
    change_1d: number;
    change_7d: number;
}