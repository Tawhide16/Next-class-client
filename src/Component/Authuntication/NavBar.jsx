import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Provider/AuthProvider';
import { Tooltip } from 'react-tooltip';
import { FaHome, FaUserAlt } from 'react-icons/fa';
import { MdBookmarkAdded, MdOutlineKingBed, MdPermContactCalendar } from 'react-icons/md';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { FaInfoCircle, FaEnvelope } from "react-icons/fa";

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [theme, setTheme] = useState('light');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    // Toggle theme light/dark & save in localStorage
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Load theme from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) setTheme(savedTheme);
        else {
            // check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }, []);

    // Apply theme class to body
    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
    }, [theme]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogOut = () => {
        logOut()
            .then(() => setDropdownOpen(false))
            .catch(console.error);
    };

    const Links = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? 'text-blue-500 font-semibold flex items-center gap-1' : 'hover:text-blue-400 flex items-center gap-1'
                    }
                    end
                >
                    <FaHome /> Home
                </NavLink>
            </li>

            {user && (
                <>
                    <li>
                        <NavLink
                            to="/allClass"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-500 font-semibold flex items-center gap-1"
                                    : "hover:text-blue-400 flex items-center gap-1"
                            }
                        >
                            <MdOutlineKingBed /> All Classes
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/teacher"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-500 font-semibold flex items-center gap-1"
                                    : "hover:text-blue-400 flex items-center gap-1"
                            }
                        >
                            <FaUserAlt /> ApplyAsTeacher
                        </NavLink>
                    </li>
                </>
            )}
            <li>
                <NavLink
                    to="/aboutUs"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-500 font-semibold flex items-center gap-1"
                            : "hover:text-blue-400 flex items-center gap-1"
                    }
                >
                    <FaInfoCircle /> About Us
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/contactUs"
                    className={({ isActive }) =>
                        isActive
                            ? "text-blue-500 font-semibold flex items-center gap-1"
                            : "hover:text-blue-400 flex items-center gap-1"
                    }
                >
                    <FaEnvelope /> Contact Us
                </NavLink>
            </li>
        </>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
            <div className=" mx-auto px-4 sm:px-6 lg:px-15 flex items-center justify-between h-16">
                {/* Logo + Website name */}
                <NavLink to="/" className="flex items-center  text-2xl font-bold text-[#0B2545] dark:text-white select-none">
                    <img
                        src="/logo.png" // Replace with your logo path
                        alt="school-Logo"
                        className="w-14 h-14 rounded mt-3"
                        style={{
                            filter:
                                'brightness(0) saturate(100%) invert(24%) sepia(94%) saturate(7464%) hue-rotate(204deg) brightness(92%) contrast(101%)',
                        }}
                    />
                    <span>
                        Next<span className="text-blue-500">Class</span>
                    </span>
                </NavLink>

                {/* Menu - Desktop */}
                <ul className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-300">{Links}</ul>

                <div className="flex items-center gap-4">
                    {/* Dark mode toggle */}
                    {/* <button
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        className="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-500 transition"
                    >
                        {theme === 'dark' ? <RiSunFill /> : <RiMoonFill />}
                    </button> */}

                    {/* Auth buttons / User profile */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 focus:outline-none"
                                aria-label="User menu"
                            >
                                <img
                                    src={user.photoURL || '/default-avatar.png'}
                                    alt={user.displayName || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            </button>

                            {dropdownOpen && (
                                <ul className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 text-gray-700 dark:text-gray-200 text-sm">
                                    <li className="px-4 py-2 cursor-default font-semibold border-b border-gray-200 dark:border-gray-700 truncate">
                                        {user.displayName || 'No Name'}
                                    </li>
                                    <li>
                                        <NavLink
                                            to="myProfile"
                                            className="block px-4 py-2 hover:bg-blue-500 hover:text-white transition"

                                        >
                                            My-Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="dashboard/myProfile"
                                            className="block px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Dashboard
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogOut}
                                            className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <NavLink
                            to="/login"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow"
                        >
                            Sign In
                        </NavLink>
                    )}

                    {/* Mobile menu button */}
                    <MobileMenuLinks Links={Links} />
                </div>
            </div>
        </nav>
    );
};

// Separate mobile menu component
const MobileMenuLinks = ({ Links }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
                aria-label="Toggle menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    {open ? (
                        <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    )}
                </svg>
            </button>

            {open && (
                <ul className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 flex flex-col space-y-3 py-4 px-4 shadow-md md:hidden z-40">
                    {Links}
                    <li>
                        {/* Place Sign In or Profile button here as needed */}
                    </li>
                </ul>
            )}
        </>
    );
};

export default NavBar;
