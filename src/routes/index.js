import React, { Suspense, lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "../components/ProtectedRoute"
import RouteSkeleton from "../components/RouteSkeleton"

const App = lazy(() => import("../App"))
const Circle = lazy(() => import("../components/Circle"))
const LeftRoutes = lazy(() => import("../components/LeftRoutes"))
const Photo = lazy(() => import("../components/Photo"))
const Video = lazy(() => import("../components/Video"))
const Call = lazy(() => import("../components/Call"))
const Likes = lazy(() => import("../components/Likes"))
const Search = lazy(() => import("../components/Search"))
const Forget = lazy(() => import("../pages/Forget"))
const Home = lazy(() => import("../pages/Home"))
const Login = lazy(() => import("../pages/Login"))
const Logout = lazy(() => import("../pages/Logout"))
const Message = lazy(() => import("../pages/Message"))
const Profile = lazy(() => import("../pages/Profile"))
const CreatePost = lazy(() => import("../pages/CreatePost"))
const Register = lazy(() => import("../pages/Register"))
const SplashScreen = lazy(() => import("../pages/SplashScreen"))
const Artificialintelligence = lazy(() => import("../pages/Artificialintelligence"))

const withSuspense = (element) => <Suspense fallback={<RouteSkeleton />}>{element}</Suspense>

const withPrivate = (element) => (
  <ProtectedRoute>
    {element}
  </ProtectedRoute>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<App />),
    children: [
      {
        path: "",
        element: withSuspense(<SplashScreen />),
      },
      {
        path: "home",
        element: withSuspense(withPrivate(<Home />)),
        children: [
          {
            path: ":userId",
            element: withSuspense(<Message />),
          },
          {
            path: "messages",
            element: withSuspense(<Message />),
          },
          {
            path: "left",
            element: withSuspense(<LeftRoutes />),
          },
          {
            path: "photo",
            element: withSuspense(<Photo />),
          },
          {
            path: "video",
            element: withSuspense(<Video />),
          },
          {
            path: "call",
            element: withSuspense(<Call />),
          },
          {
            path: "likes",
            element: withSuspense(<Likes />),
          },
          {
            path: "search",
            element: withSuspense(<Search />),
          },
          {
            path: "profile",
            element: withSuspense(<Profile />),
          },
          {
            path: "post",
            element: withSuspense(<CreatePost />),
          },
        ],
      },
      {
        path: "circle",
        element: withSuspense(withPrivate(<Circle />)),
      },
      {
        path: "register",
        element: withSuspense(<Register />),
      },
      {
        path: "login",
        element: withSuspense(<Login />),
      },
      {
        path: "logout",
        element: withSuspense(withPrivate(<Logout />)),
      },
      {
        path: "forgot-password",
        element: withSuspense(<Forget />),
      },
      {
        path: "chat",
        element: withSuspense(withPrivate(<Home />)),
        children: [
          {
            path: ":userId",
            element: withSuspense(<Message />),
          },
        ],
      },
      {
        path: "AiCategory",
        element: withSuspense(withPrivate(<Artificialintelligence />)),
        children: [
          {
            path: ":userId",
            element: withSuspense(<Message />),
          },
        ],
      },
    ],
  },
])

export default router
