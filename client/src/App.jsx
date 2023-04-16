import React, { Component } from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from '../components/Login/Login.jsx';
import MainPage from '../components/MainPage/MainPage.jsx';
import Profile from '../components/Profile/Profile.jsx';
// import './App.css';

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
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Login />} history={this.props.history}/>
                    <Route exact path="feed" action={({ params }) => {}} element={<MainPage />} history={this.props.history}/>
                    {/* <Route path="profile/:userId" element={<Profile />} history={this.props.history}/> */}
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;