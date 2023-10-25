import React from 'react';
import {NavLink} from 'react-router-dom';

function Navigation() {
    return (
        <nav className="app-nav">
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/help">Help</NavLink></li>
                <li><NavLink to="/settings">Settings</NavLink></li>
            </ul>
        </nav>
    );
  }
  

export default Navigation;