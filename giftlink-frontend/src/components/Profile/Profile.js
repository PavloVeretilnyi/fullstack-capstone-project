import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
    const [userDetails, setUserDetails] = useState({});
    const [updatedDetails, setUpdatedDetails] = useState({});
    const {setUserName} = useAppContext();
    const [changed, setChanged] = useState("");

    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const authtoken = sessionStorage.getItem("auth-token");
        if (!authtoken) {
            navigate("/app/login");
        } else {
            fetchUserProfile();
        }
    }, [navigate]);

    const fetchUserProfile = async () => {
        try {
            const authtoken = sessionStorage.getItem("auth-token");
            const email = sessionStorage.getItem("email");
            const name = sessionStorage.getItem('name');
        if (name || authtoken) {
            const storedUserDetails = {
            name: name,
            email:email
            };

            setUserDetails(storedUserDetails);
            setUpdatedDetails(storedUserDetails);
        }
    } catch (error) {
    console.error(error);
    // Handle error case
    }
    };

    const handleEdit = () => {
    setEditMode(true);
    };

    const handleInputChange = (e) => {
    setUpdatedDetails({
    ...updatedDetails,
    [e.target.name]: e.target.value,
    });
    };
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const authtoken = sessionStorage.getItem("auth-token");
        const email = sessionStorage.getItem("email");

        if (!authtoken || !email) {
        navigate("/app/login");
        return;
        }

        const payload = { ...updatedDetails };
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
            method: "PUT",//Step 1: Task 1
            headers: {//Step 1: Task 2
              "Authorization": `Bearer ${authtoken}`,
              "Content-Type": "application/json",
              "Email": email,
            },
            body: JSON.stringify(payload),//Step 1: Task 3
        });

        if (response.ok) {
        // Update the user details in session storage
        setUserName(updatedDetails.name);//Step 1: Task 4
        sessionStorage.setItem("name", updatedDetails.name);//Step 1: Task 5
        setUserDetails(updatedDetails);
        setEditMode(false);
        // Display success message to the user
        setChanged("Name Changed Successfully!");
        setTimeout(() => {
            setChanged("");
            navigate("/");
        }, 1000);

        } else {
        // Handle error case
        throw new Error("Failed to update profile");
        }
        } catch (error) {
            console.error(error);
            // Handle error case
        }
    };

    return (
        <div className="profile-container">
            {editMode ? (
            <form onSubmit={handleSubmit}>
                <label>
                Email
                <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    disabled // Disable the email field
                />
                </label>
                <label>
                Name
                <input
                    type="text"
                    name="name"
                    value={updatedDetails.name}
                    onChange={handleInputChange}
                />
                </label>

                <button type="submit">Save</button>
            </form>
            ) : (
            <div className="profile-details">
                <h1>Hi, {userDetails.name}</h1>
                <p> <b>Email:</b> {userDetails.email}</p>
                <button onClick={handleEdit}>Edit</button>
                <span style={{color:'green',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{changed}</span>
            </div>
            )}
        </div>
    );
};

export default Profile;

/*

🔴 1️⃣ Field Name Mismatch with Backend (Real Bug)
Your backend /update route expects:
req.body.firstName
But your frontend sends:
const payload = { ...updatedDetails };
And your input field is:
name="name"
So the request body becomes:
{
  "name": "John"
}
But the backend expects:
{
  "firstName": "John"
}
Result
The name will not update correctly in the database.
Fix
Change this input:
name="name"
to
name="firstName"
and update related code.
Example:
value={updatedDetails.firstName}

🔴 2️⃣ Wrong Navigation After Update
You redirect to:
navigate("/");
But your main page route is:
/app
So users will land on the backend root instead of the React app.
Fix
navigate("/app");

🟡 3️⃣ Authorization Header Is Unused
You send:
"Authorization": `Bearer ${authtoken}`
But your backend does not verify JWT for /update.
Instead it uses:
const email = req.headers.email;
So the Authorization header is currently unnecessary.
Not harmful, but misleading.

🟡 4️⃣ fetchUserProfile() Condition Is Wrong
Current:
if (name || authtoken)
This allows profile loading if only one exists.
Example:
name exists but token missing
Better:
if (name && authtoken)

🟡 5️⃣ Unused Import
You imported:
import {urlConfig} from '../../config';
This is used later, so it's fine — but make sure your config looks like:
export const urlConfig = {
  backendUrl: "http://localhost:3060"
}
Otherwise requests will fail.

🟡 7️⃣ UI State Initialization
You initialize:
const [userDetails, setUserDetails] = useState({});
Then immediately access:
userDetails.name
Better safer default:
useState({ name:"", email:"" })

*/