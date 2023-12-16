// AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navigate,Link } from 'react-router-dom';


//components
import  Home from './Home';

import { backend } from "../declarations/backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, createActor } from "../declarations/backend";
import { Principal } from "@dfinity/principal";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        {/* <Route path="/signup" element={<Signup/>} />
        <Route path="/doctorprofile" element={<NavbarProfile />} />
        <Route path="/patientprofile" element={<PatientNavbarProfile />} />
        <Route path="/profile_qr" element={<ScanQR />} />
        <Route path="/doctor_access" element={<DoctorAccess />} />
        <Route path="/patient_logs" element={<PatientAccept />} />
        <Route path="/patient_reports" element={<PatientReports />} />
        <Route path="/patient_qr" element={<PatientScanQR />} /> */}
        {/*<Route path="/patient_add" element={<PatientAdd handleDisconnectWalletClick={handleDisconnectWalletClick} />} />
        <Route path="/patient_contacts" element={<PatientContacts handleDisconnectWalletClick={handleDisconnectWalletClick} />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
