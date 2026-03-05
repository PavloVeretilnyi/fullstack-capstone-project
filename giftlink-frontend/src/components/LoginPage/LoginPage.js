import React, { useState,useEffect } from 'react';
//Step 1 - Task 1
import {urlConfig} from '../../config';
//Step 1 - Task 2
import { useAppContext } from '../../context/AuthContext';
//Step 1 - Task 3
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //Step 1 - Task 4
    const [incorrect, setIncorrect] = useState('');
    //Step 1 - Task 5
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    //Step 1 - Task 6
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
          navigate('/app')
        }
      }, [navigate])

    const handleLogin = async (e) => {
        e.preventDefault();
        //api call
        const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            //Step 1 - Task 7
            method: 'POST',
            //Step 1 - Task 8
          headers: {
            'content-type': 'application/json',
            'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Include Bearer token if available
          },
        //Step 1 - Task 9
          body: JSON.stringify({
            email: email,
            password: password,
          })
        });

        //Step 2: Task 1
        const json = await res.json();
        console.log('Json',json);
        if (json.authtoken) {
            //Step 2: Task 2
          sessionStorage.setItem('auth-token', json.authtoken);
          sessionStorage.setItem('name', json.userName);
          sessionStorage.setItem('email', json.userEmail);
            //Step 2: Task 3
          setIsLoggedIn(true);
            //Step 2: Task 4
          navigate('/app');
        } else {
            //Step 2: Task 5
          document.getElementById("email").value="";
          document.getElementById("password").value="";
          setIncorrect("Wrong password. Try again.");
          setTimeout(() => {
            setIncorrect("");
          }, 2000);
        }

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
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value); setIncorrect("")}}
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
                                onChange={(e) => {setPassword(e.target.value);setIncorrect("")}}
                            />

                            {/*Step 2: Task 6*/}
                            <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
                        </div>
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

1.Unnecessary Authorization Header (Potential Bug)
You send this header:
'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
But:
Login endpoint does NOT require authentication
bearer-token is never set anywhere in your project
You only store:
sessionStorage.setItem('auth-token', json.authtoken);
So this line does nothing and can cause confusion.
Fix
Remove it:
headers: {
  'content-type': 'application/json'
}

2.Direct DOM Manipulation (Bad React Practice)
You clear inputs using:
document.getElementById("email").value="";
document.getElementById("password").value="";
But React inputs are controlled components.
Correct way:
setEmail("");
setPassword("");
Replace this
document.getElementById("email").value="";
document.getElementById("password").value="";
With
setEmail("");
setPassword("");

3.Wrong Error Message Logic
Your backend can return:
{ "error": "Wrong password" }
or
{ "error": "User not found" }
But your frontend always shows:
Wrong password. Try again.
Better:
setIncorrect(json.error || "Login failed");

4.type="text" for Email
Current:
type="text"
Better:
type="email"
This enables browser validation.

5.Register Link Should Use React Router
You used:
<a href="/app/register">
This reloads the entire page.
Better:
<Link to="/app/register">Register Here</Link>
Add import:
import { Link } from 'react-router-dom';

6.Unused Variable
You defined:
const bearerToken = sessionStorage.getItem('bearer-token');
But it's not used properly.
Remove it.


*/