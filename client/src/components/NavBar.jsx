import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Profile', path: '/profile' },
    { name: 'Grades', path: '/grades' },
    { name: 'Applications', path: '/applications' },
    { name: 'Search', path: '/search' },
];

const NavBar = () => {
    const location = useLocation();
    return (
        <nav className="w-56 min-h-screen bg-blue-100 flex flex-col py-8 px-4 shadow-lg">
            <div className="mb-10 px-2">
                <span className="text-2xl font-bold text-blue-700">CONCIS-Evolve</span>
            </div>
            <ul className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-lg
                ${isActive
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'text-blue-900 hover:bg-blue-200 hover:text-blue-700'}
                `
                            }
                            end
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavBar; 