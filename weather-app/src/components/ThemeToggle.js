import React, { useContext } from 'react';
import moon from '../assets/Moon.svg';
import sun from '../assets/Sun.svg';
import { GlobalState } from '../GlobalState';

function ThemeToggle() {
    const state = useContext(GlobalState);
    const [theme, setTheme] = state.theme;

    const toggleTheme = e => {
        setTheme(prevTheme => {
            if (prevTheme === 'light') {
                localStorage.setItem('theme', 'dark');
                return 'dark';
            } else {
                localStorage.setItem('theme', 'light');
                return 'light';
            }
        });
    };

    return (
        <div className='mt-4' style={{ marginRight: "35px" }}>
            <input type="checkbox" className="theme-checkbox" id="theme-toggle" checked={theme === "dark" ? true : false} onChange={toggleTheme} />
            <label className="theme-label" htmlFor="theme-toggle">
                <img src={sun} width="12px" alt="" />
                <img src={moon} width="12px" alt="" />
                <div className="ball"></div>
            </label>
        </div>
    );
}

export default ThemeToggle;