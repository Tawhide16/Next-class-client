import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Authuntication/Footer';
import NavBar from '../Authuntication/NavBar';

const MainLayOut = () => {
    return (
        <div>
            <NavBar></NavBar>
            <div className="min-h-[70vh] px-4 py-6">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayOut;