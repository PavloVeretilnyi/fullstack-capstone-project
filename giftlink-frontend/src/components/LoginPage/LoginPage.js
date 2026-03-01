import React, { useState,useEffect } from 'react';

import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
}


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"//type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* Include appropriate error message if login is incorrect*/}
                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

/*
Issue 2 — No <form> Element (Important)
You wrote:
<button onClick={handleLogin}>Login</button>
But you are calling:
e.preventDefault();
That only makes sense if this is inside a <form>.
Right now:
Pressing Enter will NOT submit
Browser default behavior isn’t being used properly
Better Version
Wrap inputs inside:
<form onSubmit={handleLogin}>
Then change button to:
<button type="submit" className="btn btn-primary w-100 mb-3">
That is the correct semantic structure.

Issue 4 — Using <a> Instead of React Router <Link>
You wrote:
<a href="/app/register" className="text-primary">
If you’re using react-router-dom, this causes:
Full page reload
React state reset
Better:
import { Link } from 'react-router-dom';
Then:
<Link to="/app/register" className="text-primary">
This is important for SPA behavior.

Issue 5 — Login Does Nothing Yet
Your handler:
const handleLogin = async (e) => {
    e.preventDefault();
}
This is fine structurally, but:
No backend call
No error handling
No navigation on success
Not wrong — just incomplete.

*/

/*
Here’s the corrected LoginPage:

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login invoked");
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        <form onSubmit={handleLogin}>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 mb-3">
                                Login
                            </button>

                        </form>

                        <p className="mt-4 text-center">
                            New here? <Link to="/app/register" className="text-primary">Register Here</Link>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
*/