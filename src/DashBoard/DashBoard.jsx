import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiHome, FiPackage, FiCreditCard, FiMapPin, FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';
import { MdClass, MdDashboard, MdOutlineJoinRight, MdSportsMotorsports } from 'react-icons/md';
import { GrUserAdmin } from 'react-icons/gr';
import useAdmin from '../Hooks/useAdmin';
import { AuthContext } from '../Provider/AuthProvider';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { SiGoogleclassroom } from "react-icons/si";
import useTeacher from '../Hooks/useTeacher';


const DashBoard = () => {
    const { user, } = useContext(AuthContext);
    const email = user?.email;
    const [isAdmin, isLoading] = useAdmin(email);
    const [isTeacher] = useTeacher(email);
    console.log(isTeacher);


    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            {/* Main Content Area */}
            <div className="drawer-content p-4">
                {/* Mobile Navbar */}
                <div className="navbar bg-base-300 w-full lg:hidden mb-4">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                </div>

                {/* Dynamic content from nested routes */}
                <Outlet />
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-6 space-y-4 font-semibold text-lg">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''}`
                            }
                        >
                            <FiHome size={20} />
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="myProfile"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''}`
                            }
                        >
                            <FiUser size={20} />
                            My Profile
                        </NavLink>
                    </li>
                    {
                        isAdmin && <> <li>
                            <NavLink
                                to="Admin/TeacherRequestTable"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''}`
                                }
                            >
                                <FaChalkboardTeacher size={20} />
                                Teacher-Table
                            </NavLink>
                        </li>

                            <li>
                                <NavLink
                                    to="allUserTable"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''}`
                                    }
                                >
                                    <GrUserAdmin size={20} />
                                    Admin
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="classTable"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''}`
                                    }
                                >
                                    <FiCheckCircle size={20} />
                                     Pending-Class
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="allPaymentsChart"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''}`
                                    }
                                >
                                    <MdDashboard className="text-xl" />
                                     Overview
                                </NavLink>
                            </li>
                        </>

                    }
                    <li>
                        <NavLink
                            to="/dashboard/PaymentHistory"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''}`
                            }
                        >
                            <FiCreditCard size={20} />
                            Payment History
                        </NavLink>
                    </li>
                    {isTeacher && (
                        <>
                            <li>
                                <NavLink
                                    to="addClass"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''
                                        }`
                                    }
                                >
                                    <MdClass size={20} />
                                    Add Class
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="myClass"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''
                                        }`
                                    }
                                >
                                    <SiGoogleclassroom size={20} />
                                    My Class
                                </NavLink>
                            </li>
                        </>
                    )}


                    <li>
                        <NavLink
                            to="/dashboard/my-enroll"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-base-300 transition-colors ${isActive ? 'bg-primary text-white' : ''}`
                            }
                        >
                            <MdOutlineJoinRight size={25} />
                            MyEnrollments
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashBoard;
