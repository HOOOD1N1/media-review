import React from "react";
import './index.css';
import ReactDOM from 'react-dom';
import {createRoot} from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Login from "../components/Login/Login"
import MainPage from '../components/MainPage/MainPage';
import Profile from '../components/Profile/Profile';
import App from "./App";

ReactDOM.render(<App/>, document.getElementById('root'));