import React, { useContext } from 'react';
import notFound from '../assets/NotFound.svg';
import { Link } from 'react-router-dom';
import { GlobalState } from '../GlobalState';

function NotFound() {
    const state = useContext(GlobalState);
    const [theme] = state.theme;

    return (
        <div id={theme} className='d-flex flex-column justify-content-center align-items-center' style={{ height: "100vh" }}>
            <img src={notFound} alt="" width="400px" />
            <h3 className='mb-3 mt-5'>Page Not Found</h3>
            <span>Feeling under the weather?</span>
            <Link className={theme === "light" ? "btn mt-3 py-2 btn-dark" : "btn mt-3 py-2 btn-secondary"} to="/">Go to Home</Link>
        </div>
    );
}

export default NotFound;