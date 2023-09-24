import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';

const ReviewStateContext = createContext();

export const ReviewStateContextProvider = ({ children }) => {
    const { contract } = useContract('0x2A0FeD3EAAba000B2a81aB8e411925B56D11B4DB');

    const address = useAddress();
    const connect = useMetamask();
    
    const addReview = async (_movieId, _username, _userId, _reviewText, _reviewGrade, _profile_image) => {
        try {
          console.log("Add a new review ");
          const data = await contract.call('addReview',
            [_movieId,
            _username, 
            _userId, 
            _reviewText, 
            _reviewGrade, 
            _profile_image
          ])
          if(data === 0 || data === "0"){
            throw new Error("user can't send review again");
          }
    
          console.log("contract call success", data)
        } catch (error) {
          console.log("contract call failure", error)
        }
      }
    
      const getAllReviewsOfGivenMovie = async (_movieId) => {
        const campaigns = await contract.call('getAllReviewsOfGivenMovie', [_movieId]);
    
        const parsedReviews = campaigns.map((review, i) => ({
            username: review.username,
            userId: review.userId,
            userAddress: review.userAddress,
            reviewText: review.reviewText,
            reviewGrade: review.reviewGrade,
            profile_image: review.profile_image,
            pId: i
        }));
    
        return parsedReviews;
      }
    
      return (
        <ReviewStateContext.Provider
          value={{ 
            address,
            contract,
            connect,
            addReview,
            getAllReviewsOfGivenMovie,
          }}
        >
          {children}
        </ReviewStateContext.Provider>
      )
    }
    
    export const useReviewStateContextProvider = () => useContext(ReviewStateContext);