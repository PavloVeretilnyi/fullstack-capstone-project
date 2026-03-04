import React, { useState } from 'react';
import './RegisterPage.css';
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();
    
    const handleRegister = async () => {
        try{
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                //Step 1 - Task 6
                method: 'POST',
                //Step 1 - Task 7
                headers: {
                    'content-type': 'application/json',
                },
                //Step 1 - Task 8
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            })

            const json = await response.json();
            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                setIsLoggedIn(true);
                navigate('/app');
            }
            if (json.error) {
                setShowerr(json.error);
            }

            }catch (e) {
            console.log("Error fetching details: " + e.message);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">FirstName</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* last name */}

                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">LastName</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        {/* email  */}
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

                        <div className="text-danger">{showerr}</div>

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
                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;

/*
🚨 1️⃣ Major Issue: No response.ok Check
Right now you do:
const json = await response.json();
If backend returns 400 or 500, this can cause problems.
You should check:
if (!response.ok)
Otherwise:
500 errors may crash JSON parsing
You rely only on json.error
✅ FIX
Change this part:
const json = await response.json();
To:
const json = await response.json();
if (!response.ok) {
    setShowerr(json.error || "Registration failed");
    return;
}

🚨 2️⃣ Possible Crash if Backend Returns Non-JSON
If your backend ever returns:
res.status(500).send("Internal server error");
That is NOT JSON.
Then this line:
const json = await response.json();
Will throw an error.
Your catch block will catch it, but user won’t see the error.
Better:
let json;
try {
    json = await response.json();
} catch {
    setShowerr("Server error");
    return;
}

⚠ 4️⃣ Using <a href> Instead of <Link>
This:
<a href="/app/login">
Will cause FULL page reload.
Better:
import { Link } from 'react-router-dom';
<Link to="/app/login" className="text-primary">Login</Link>
Cleaner SPA behavior.



*/