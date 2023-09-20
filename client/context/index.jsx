import React, { useContext, createContext } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xaa55C232933515909BfF5C2e79542DB26Eb5AD99');
  // if it doesn't work, try
  // const sdk = ThirdwebSDK.fromPrivateKey(
  //   process.env.PRIVATE_KEY, // Your wallet's private key (only required for write operations)
  //   "ethereum",
  //   {
  //     clientId:  process.env.CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
  //     secretKey:  process.env.SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings
  //   },
  // );
  // const contract = await sdk.getContract("{{contract_address}}");

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      console.log("Last form is ", form.title);
      const data = await contract.call('createCampaign',
        [address, // owner
        form.title, // title
        form.description, // description
        form.target,
        new Date(form.deadline).getTime(), // deadline,
        form.image
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {

    console.log("amount is= ", amount, "  ", typeof(amount))
    console.log('ethers.utils.parseEther= ', typeof(ethers.utils.parseEther(amount)), "  ",ethers.utils.parseEther(amount) )

    const data = await contract.call("donateToCampaign", [pId], { value: ethers.utils.parseEther(String(amount))},);

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);