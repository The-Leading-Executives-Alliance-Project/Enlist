import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    AiOutlineHome,
    AiOutlineUser,
    AiOutlineBook,
    AiOutlineFileText,
    AiOutlineSearch
} from 'react-icons/ai';
import {
    IoChevronBackCircleOutline,
    IoChevronForwardCircleOutline
} from 'react-icons/io5';

const navItems = [
    { name: 'Home', path: '/home', icon: <AiOutlineHome size={20} /> },
    { name: 'Profile', path: '/profile', icon: <AiOutlineUser size={20} /> },
    { name: 'Grades', path: '/grades', icon: <AiOutlineBook size={20} /> },
    { name: 'Applications', path: '/applications', icon: <AiOutlineFileText size={20} /> },
    { name: 'Search', path: '/search', icon: <AiOutlineSearch size={20} /> },
];

const NavBar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <nav className={`${isCollapsed ? 'w-20' : 'w-56'} min-h-screen bg-blue-100 flex flex-col py-8 px-4 shadow-lg transition-all duration-300 ease-in-out`}>
            <div className={`mb-10 ${isCollapsed ? 'px-0' : 'px-2'} flex items-center justify-between`}>
                {!isCollapsed && (
                    <span className="text-2xl font-bold text-blue-700">CONCIS-Evolve</span>
                )}
                <button
                    onClick={toggleCollapse}
                    className="p-2 rounded-lg hover:bg-blue-200 transition-colors"
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                    {isCollapsed ? (
                        <IoChevronForwardCircleOutline size={24} className="text-blue-700" />
                    ) : (
                        <IoChevronBackCircleOutline size={24} className="text-blue-700" />
                    )}
                </button>
            </div>
            <ul className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg transition-colors font-medium text-lg
                ${isActive
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'text-blue-900 hover:bg-blue-200 hover:text-blue-700'}
                `
                            }
                            end
                            title={isCollapsed ? item.name : ''}
                        >
                            {item.icon}
                            {!isCollapsed && item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar; 