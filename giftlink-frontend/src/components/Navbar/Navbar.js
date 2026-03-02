import React from 'react';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">GiftLink</a>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                     <li className="nav-item">
                        <a className="nav-link" href="/home.html">Home</a> {/* Link to home.html */}
                     </li>
                     <li className="nav-item">
                        <a className="nav-link" href="/app">Gifts</a> {/* Updated Link */}
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/app/search">Search</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

/*
Issue 1: Using <a href=""> in a React Router App (Major SPA Issue)
You wrote:
<a className="nav-link" href="/app">Gifts</a>
This causes:
- Full page reload
- React state resets
- Breaks SPA behavior
Since you’re using react-router-dom, you should use:
import { Link } from 'react-router-dom';
And replace <a> with <Link>:
<Link className="nav-link" to="/app">Gifts</Link>
Same for:
<a className="navbar-brand" href="/">
Should be:
<Link className="navbar-brand" to="/">

Issue 2: /home.html Is Probably Wrong
href="/home.html"
If you're building a React SPA:
You usually don’t have home.html
You have routes like / or /home
So unless you're intentionally linking to a static HTML file outside React, this is likely incorrect.

Issue 3: Navbar Collapse Won’t Work
You have:
<div className="collapse navbar-collapse">
But you do NOT have:
Navbar toggler button
Bootstrap JS bundle loaded
So on mobile:
Navbar will not toggle
It won’t expand/collapse
Not breaking — but incomplete.

Recommended Correct Version (React Router Proper):

import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">GiftLink</Link>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
*/