import Navbar from '../components/Navbar/Navbar';
import './Login.css'
import React, { useState }  from 'react'


export default function Login(){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    function handleSubmit(event) {
        event.preventDefault();
    }
    return <>
            <div className='navbar'><Navbar/></div>

            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <div className='input-fields'>
                        <div className='input-login'>
                            <input type="username" placeholder='Username' className='form-control'
                            onChange={e => setUsername(e.target.value)}/>
                        </div>
                        <div className="input-login">
                            <input type="password" placeholder='Password' className='form-control'
                            onChange={e => setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <button className='button-login'>LOG IN</button>
                </form>
            </div>
            
            <div className='register-texts'>
                <h2 className=''>Don't have an account?</h2>
                <a className="register-link" href="register">Register Now.</a>
            </div>
        </>
}