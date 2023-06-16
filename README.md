# WhiteList
a open source DApp white list for all wallets with sustainable maintaince by community.

1. Formate
jason formate like this:
```
{
"updated": "2023-06-12",
"total": 192,
"repo_url": "https://github.com/Ethereum-Star/WhiteList/whitelist.json",
"data":[
{
  "dapp_name": "uniswap",
  "URL": "https://uniswap.org/",
  "multichain":[
    {
    "contract": "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
    "chain": "mainnet",
    "chain_id": 1
    },
    {
    }
},
{
}
]
}
```

2. Every item will be checked and verified for 3 layers to guarantee the dapp is right and not fake.
3. Providing a bounty to find the wrong items(just open a new PR).
4. We would provide an API endpoint later.

-----------------
1. build individual item schema in a new file.
```
{
  "dapp_name": "uniswap",
  "collect_list": [
        {
          "name": "CoinMarketCap",
          "logo_url":"https://static.debank.com/image/third_party/logo_url/coinmarketcap/f7c62d7fa33dfec3a2d3365792c20f23.png"
        },
        {
          "name": "TokenPocket",
          "logo_url": "https://static.debank.com/image/third_party/logo_url/tp/fbea0946449682d2d511de4c83ce7343.png"
        }
  ]
}
```
2. this file will be an aggregating file for all items.

```
{
  "updated": "2023-06-12",
  "total": 192,
  "repo_item_url": "https://github.com/Ethereum-Star/WhiteList/item_name.json",
  "repo_total_url": "https://github.com/Ethereum-Star/WhiteList/whitelist_total.json"
}
```   

3. Use case: run an endpoint yourself with an updating db, API like this:
```
fetch: https://your.server.api/white_list?dapp_name=uniswap.com
answer: " item schema above ",

fetch: https://your.server.api/white_list?summary=all
answer: " total schema above ",


```
