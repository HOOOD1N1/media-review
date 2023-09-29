import React, { useContext, createContext, useEffect } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract: reviewContract, isLoading, error } = useContract('0x2A0FeD3EAAba000B2a81aB8e411925B56D11B4DB');
  const { contract } = useContract('0xbf6b5BD3FfA8025e9a8B9164aEe88992DAE83a19');

  // const setUp = async() => {
  //   // if it doesn't work, try
  // const sdk = ThirdwebSDK.fromPrivateKey(
  //   process.env.PRIVATE_KEY, // Your wallet's private key (only required for write operations)
  //   "ethereum",
  //   {
  //     clientId:  process.env.CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
  //     secretKey:  process.env.SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings
  //   },
  // );
  // reviewContract = await sdk.getContract('0x532aF9a2F54AFf41E942816dd33403102F031e70');
  // console.log("Reviewcontract ", reviewContract)
  // }

  // useEffect(() => {
  //   setUp()
  // }, [])

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

  const addReview = async (_movieId, _username, _userId, _reviewText, _reviewGrade, _profile_image) => {
    try {
      
      console.log("Add a new review ");
      console.log("The new review is: " + "reviewContract: " + reviewContract + "movieId: " + _movieId + " _username: " + _username + " _userId: " + _userId + " _reviewText: " + _reviewText + " _reviewGrade: " + _reviewGrade+ " _profile_image: " + _profile_image)
      const data = await reviewContract.call('addReview',
        [_movieId,
        _username, 
        _userId, 
        _reviewText, 
        _reviewGrade, 
        _profile_image
      ])
      console.log("data is ", data)
      if(data === 0 || data === "0"){
        throw new Error("user can't send review again");
      }

      console.log("reviewContract call success", data)
    } catch (error) {
      console.log("reviewContract call failure", error)
    }
  }

  const getAllReviewsOfGivenMovie = async (_movieId) => {
    const campaigns = await reviewContract.call('getAllReviewsOfGivenMovie', [_movieId]);

    const parsedReviews = campaigns.map((review, i) => ({
        username: review.username,
        userId: review.userId,
        userAddress: review.userAddress,
        review_text: review.reviewText,
        review_grade: review.reviewGrade,
        profile_image: review.profile_image,
        pId: i
    }));

    return parsedReviews;
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
        getDonations,
        reviewContract,
        addReview,
        getAllReviewsOfGivenMovie
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);