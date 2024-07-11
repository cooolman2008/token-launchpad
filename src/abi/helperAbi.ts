export const helperAbi = [
    {
      "inputs":[
        
      ],
      "name":"getLauncherDetails",
      "outputs":[
        {
          "components":[
            {
              "internalType":"uint256",
              "name":"ethCost",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"safuCost",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"promoCostEth",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"promoCostSafu",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"minLiq",
              "type":"uint256"
            },
            {
              "internalType":"address",
              "name":"bridge",
              "type":"address"
            }
          ],
          "internalType":"struct IHelper.LauncherDetails",
          "name":"",
          "type":"tuple"
        }
      ],
      "stateMutability":"view",
      "type":"function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getLaunches",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs":[
        {
          "internalType":"address",
          "name":"_token",
          "type":"address"
        }
      ],
      "name":"launchPresale",
      "outputs":[
        
      ],
      "stateMutability":"nonpayable",
      "type":"function"
    },
    {
      "inputs":[
        {
          "internalType":"address",
          "name":"_token",
          "type":"address"
        },
        {
          "internalType":"uint256",
          "name":"times",
          "type":"uint256"
        }
      ],
      "name":"promoteToken",
      "outputs":[
        
      ],
      "stateMutability":"payable",
      "type":"function"
    }
  ] as const;