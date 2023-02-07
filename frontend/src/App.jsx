/*welcome page*/

import { Component } from "react";
import { Routes, Route} from 'react-router-dom';
import Welcome from "./components/Welcome";
import Login from "./components/Login";
// import SignUp from "./components/SignUp";

function App() {
    return (
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route exact path="/login" element={<Login />} />
        {/* <Route exact path="/signup" element={<SignUp />} /> */}
      </Routes>
    );
}

export default App;
