// AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navigate,Link } from 'react-router-dom';


//components
import  Home from './Home';
import VotePage from './VotePage';
import Usage from './Usage';

import { backend } from "../declarations/backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../declarations/backend";
import { Principal } from "@dfinity/principal";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/vote" element={<VotePage/>} />
        <Route path="/usage" element={<Usage/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
