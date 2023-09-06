import { Route, Routes } from "react-router-dom";
import App from "./Menu/App";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Item from "./Item/Item";
import Sell from "./Menu/Sell/Sell";

export default function Main() {


    return( 
        <Routes>
            <Route path={"/Register"} element={<Register />}>
            </Route>
            <Route path={"/Login"} element={<Login />}>
            </Route>
            <Route path={"/Menu"}  element={<App />}>                 
            </Route>
            <Route path={"Menu/sell"} element={<Sell />} /> 
            <Route path="/Item/:id" element={<Item/>}>
            </Route>
        </Routes>
    )
}