import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Circle from "../components/Circle";
import LeftRoutes from "../components/LeftRoutes";
import Photo from "../components/Photo";
import Video from "../components/Video";
import Call from "../components/Call";
import Likes from "../components/Likes";
import Search from "../components/Search";
import ProtectedRoute from "../components/ProtectedRoute";
const { default: Forget } = require("../pages/Forget");
const { default: Home } = require("../pages/Home");
const { default: Login } = require("../pages/Login");
const { default: Logout } = require("../pages/Logout");
const { default: Message } = require("../pages/Message");
const { default: Register } = require("../pages/Register");
const { default: SplashScreen } = require("../pages/SplashScreen");
const { default: Artificialintelligence } = require("../pages/Artificialintelligence");

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <SplashScreen/>
            },
            {
                path : "home",
                element : (
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                ),
                children : [
                    {
                        path : ':userId',
                        element : <Message/>
                    },
                    {
                        path : 'left',
                        element : <LeftRoutes/>
                    },
                    {
                        path : 'photo',
                        element : <Photo/>
                    },
                    {
                        path : 'video',
                        element : <Video/>
                    },
                    {
                        path : 'call',
                        element : <Call/>
                    },
                    {
                        path : 'likes',
                        element : <Likes/>
                    },
                    {
                        path : 'search',
                        element : <Search/>
                    },
                    
                ]
            },
            {
                path : "circle",
                element : (
                    <ProtectedRoute>
                        <Circle/>
                    </ProtectedRoute>
                )
            },
            {
                path : "register",
                element : <Register/>
            },
            {
                path : 'login',
                element : <Login/>
            },
            {
                path : 'logout',
                element : (
                    <ProtectedRoute>
                        <Logout/>
                    </ProtectedRoute>
                )
            },
            {
                path : 'forgot-password',
                element : <Forget/>
            },
            {
                path : "chat",
                element : (
                    <ProtectedRoute>
                        <Home/>
                    </ProtectedRoute>
                ),
                children : [
                    {
                        path : ':userId',
                        element : <Message/>
                    }
                ]
            },
        
            {
                path : "AiCategory",
                element : (
                    <ProtectedRoute>
                        <Artificialintelligence/>
                    </ProtectedRoute>
                ),
                children : [
                    {
                        path : ':userId',
                        element : <Message/>
                    }
                ]
            }
        ]
    }
]
)

export default router
