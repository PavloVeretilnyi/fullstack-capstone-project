import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();

  const navigate=useNavigate();
    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');
        if (authTokenFromSession) {
            if(isLoggedIn && nameFromSession) {
              setUserName(nameFromSession);
            } else {
              sessionStorage.removeItem('auth-token');
              sessionStorage.removeItem('name');
              sessionStorage.removeItem('email');
              setIsLoggedIn(false);
            }
        }
    },[isLoggedIn, setIsLoggedIn, setUserName])
    const handleLogout=()=>{
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        navigate(`/app`);

    }
    const profileSecton=()=>{
      navigate(`/app/profile`);
    }
    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light" id='navbar_container'>
            {/*<a className="navbar-brand" href={`${urlConfig.backendUrl}/app`}>GiftLink</a>*/}
            {/*next expression is temporary and for the previous one to work app.js need to be corrected*/}
            <Link className="navbar-brand" to="/">GiftLink</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                <a className="nav-link" href="/home.html">Home</a> {/* Link to home.html */}
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/app">Gifts</Link> {/* Updated Link */}
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/app/search">Search</Link>
                </li>
                <ul className="navbar-nav ml-auto">
                {isLoggedIn ? (
                                        <>
                                        <li className="nav-item"> <span className="nav-link" style={{color: "black", cursor:"pointer"}} onClick={profileSecton}>Welcome, {userName}</span> </li>
                                        <li className="nav-item"><button className="nav-link login-btn" onClick={handleLogout}>Logout</button></li>
                                        </>
                                        )  : (
                                        <>
                                            <li className="nav-item">

                                            <Link className="nav-link login-btn" to="/app/login">Login</Link>
                                            </li>
                                            <li className="nav-item">
                                            <Link className="nav-link register-btn" to="/app/register">Register</Link>
                                            </li>
                                        </>
                                    )

                                    }
                </ul>
            </ul>
            </div>
        </nav>
        </>
    )
}

/*
🚨 1️⃣ LOGIC BUG in useEffect (Important)
This part has flawed logic:
if (authTokenFromSession) {
    if(isLoggedIn && nameFromSession) {
        setUserName(nameFromSession);
    } else {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
    }
}
❌ Problem
If:
You refresh the page
auth-token exists in sessionStorage
BUT isLoggedIn is initially false (which happens on reload)
Then it will:
👉 DELETE the token
👉 Log user out
That’s wrong behavior.
✅ Correct Logic
If token exists → user should be logged in.
Replace your entire useEffect with this:
useEffect(() => {
    const authToken = sessionStorage.getItem('auth-token');
    const nameFromSession = sessionStorage.getItem('name');

    if (authToken) {
        setIsLoggedIn(true);
        if (nameFromSession) {
            setUserName(nameFromSession);
        }
    }
}, [setIsLoggedIn, setUserName]);

✔ Now refresh will NOT log user out.

🚨 2️⃣ Using <a href> Instead of <Link>
You have:
<a className="navbar-brand" href={`${urlConfig.backendUrl}/app`}>
This will:
Reload the entire page
Leave React app
Also:
<a className="nav-link" href="/home.html">
This breaks SPA routing.
✅ Fix
Replace:
<a className="navbar-brand" href={`${urlConfig.backendUrl}/app`}>
With:
<Link className="navbar-brand" to="/app">
And remove urlConfig import (you don't need it here).

⚠ 3️⃣ Nested <ul> Inside <ul> (Invalid Structure)
You have:
<ul className="navbar-nav">
   ...
   <ul className="navbar-nav ml-auto">

This is invalid HTML structure.
You should NOT nest <ul> directly inside another <ul> like that.
✅ Fix Structure
Just keep ONE <ul>:
<ul className="navbar-nav ms-auto">
   ...
</ul>
Remove the inner <ul> completely.

⚠ 4️⃣ Typo: profileSecton
const profileSecton = () => {
Should be:
const profileSection = () => {
(Not breaking, just cleaner.)

⚠ 5️⃣ urlConfig is Unnecessary
You are importing:
import { urlConfig } from '../../config';
But Navbar doesn’t need backend URL.
Remove it if not used elsewhere.

🔥 Cleaned Navbar (Correct Version):

import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');

        if (authToken) {
            setIsLoggedIn(true);
            if (nameFromSession) {
                setUserName(nameFromSession);
            }
        }
    }, [setIsLoggedIn, setUserName]);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate('/app');
    };

    const profileSection = () => {
        navigate('/app/profile');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" id='navbar_container'>
            <Link className="navbar-brand" to="/app">GiftLink</Link>

            <div className="collapse navbar-collapse justify-content-end">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>

                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <span 
                                    className="nav-link" 
                                    style={{ cursor: "pointer" }} 
                                    onClick={profileSection}
                                >
                                    Welcome, {userName}
                                </span>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

*/