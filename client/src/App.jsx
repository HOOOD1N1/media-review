import React, { Component } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { ethers } from 'ethers';
// import * as dotenv from 'dotenv';
import Login from '../components/Login/Login.jsx';
import MainPage from '../components/MainPage/MainPage.jsx';
import Profile from '../components/Profile/Profile.jsx';
import Movie from "../components/Movie/Movie.jsx";
import {ChainId, ThirdwebProvider} from "@thirdweb-dev/react";
import {Sepolia} from '@thirdweb-dev/chains';
import { StateContextProvider } from "../context/index.jsx";
import CreateCampaignPage from "../components/CreateCampaignPage/CreateCampaignPage.jsx";
import CampaignDetailsPage from "../components/CampaignDetailsPage/CampaignDetailsPage.jsx";
// dotenv.config();
import './index.css';
import './App.css';


class App extends Component {

    constructor(props){
        super(props);
        this.state = { loggedIn: "false" };
    }
    changeState(){
        this.setState({loggedIn: "true"});
    }

    render() {
        return (
            <ThirdwebProvider activeChain={Sepolia} signer={new ethers.providers.Web3Provider(window.ethereum).getSigner()}
            clientId={process.env.CLIENT_ID}>
                <BrowserRouter>
                    <StateContextProvider>
                        <Routes>
                            <Route exact path="/" element={<Login />}/>
                            <Route exact path="feed" action={({ params }) => {}} element={<MainPage />} />
                            <Route exact path="profile/:userId" element={<Profile />} />
                            <Route exact path="movies/:movieId" element={<Movie />} />
                            <Route exact path="campaigns/create" element={<CreateCampaignPage />} />
                            <Route exact path="campaign-details/:id" element={<CampaignDetailsPage />} />
                        </Routes>
                    </StateContextProvider>
                </BrowserRouter>
            </ThirdwebProvider>
        );
    }
}

export default App;