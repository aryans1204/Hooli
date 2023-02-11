/*welcome page*/

import { Component } from "react";
import { Routes, Route} from 'react-router-dom';
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Expenditures from "./components/Expenditures";
import Income from "./components/Income";
import Investments from "./components/Investments";
import Forex from "./components/Forex";
// import PersonalProfile from "./components/PersonalProfile";


function App() {
    return (
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />

        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/expenditures" element={<Expenditures />} />
        <Route exact path="/income" element={<Income />} />
        <Route exact path="/investments" element={<Investments />} />
        <Route exact path="/forex" element={<Forex />} />
        {/* <Route exact path="/profile" element={<PersonalProfile />} /> */}
      </Routes>
    );

}

export default App;
