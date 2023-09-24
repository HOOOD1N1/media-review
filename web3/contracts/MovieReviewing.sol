// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MovieReviewing {
    struct Movie {
        string name;
        uint256 movieId;
        uint256 voteCount;
    }

    struct Review {
        string username;
        uint8 userId;
        address userAddress;
        string reviewText;
        uint8 reviewGrade;
        string profile_image;
    }

    Movie[] public movies;
    mapping(uint256 => Review[]) public reviews;
    address owner;


    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    constructor() {
        owner = msg.sender;
    }

    function addReview(uint256 _movieId, string memory _username, uint8 _userId, string memory _reviewText, uint8 _reviewGrade, string memory _profile_image) public returns (bool) {
        for(uint i = 0; i < reviews[_movieId].length;  i++) {
        if(reviews[_movieId][i].userId == _userId)
          return false;
        }
        Review memory newReview;
        newReview.username = _username;
        newReview.userId = _userId;
        newReview.reviewText = _reviewText;
        newReview.reviewGrade = _reviewGrade;
        newReview.profile_image = _profile_image;
        newReview.userAddress = msg.sender;

        reviews[_movieId].push(newReview);
        return true;
        
    }

    function getAllReviewsOfGivenMovie(uint256 _movieId) public view returns (Review[] memory){
        return reviews[_movieId];
    }

}