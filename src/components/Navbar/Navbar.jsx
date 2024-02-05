import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "./Navbar.css";
import {FaSkype} from "react-icons/fa";
import {IoMdRocket} from "react-icons/io";

const Navbar = () => {

  return (
    <nav className='navbar w-100 flex'>
        <div className='container w-100'>
            <div className='navbar-content flex fw-7'>
                <div className='brand-and-toggler flex flex-between w-100'>
                    <Link to = "/" className='navbar-logo fs-26'>SpaceCodeLab</Link>
                </div>

                <div className='navbar-container'>
                    <div className='navbar-content'>
                        <ul className='navbar-nav'>
                            <li className='text-white'>
                                <Link to = "/">About</Link>
                            </li>
                            <li className='text-white'>
                                <Link to = "/">Features</Link>
                            </li>
                            <li className='text-white'>
                                <Link to = "/">Pricing</Link>
                            </li>
                            <li className='text-white'>
                                <Link to = "/">Contacts</Link>
                            </li>
                            <li className='text-white'>
                                <Link to = "/">Contacts</Link>
                            </li>
                        </ul>
                        <ul className='navbar-social flex'>
                            <li className='text-white'>
                                <Link to = "" className='flex flex-center'><FaSkype /></Link>
                            </li>
                        </ul>
                        <div className='navbar-btns'>
                            <button type = "button" className='btn'><IoMdRocket /> <span>get started</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    // <div className='test'>
    //     Hello
    // </div>

  )
}

export default Navbar