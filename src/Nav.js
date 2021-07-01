import React from 'react'
import { Link } from 'react-router-dom'; // to setup Link

//Note- For the Hamburger to work, Include js-<script> tags of Bootstrap also along with css,
// Refer to getting started doc of Bootstrap
function Nav() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item nav-link active">
              <Link to="/">Home</Link>
            </li>
            <li className="nav-item nav-link">
              <Link to="/about">About</Link>
            </li>
            <li className="nav-item nav-link">
              <Link to="/movies">Movies</Link>
            </li>
            
          </ul>
        </div>
      </nav>
    
    </>
  )
}

export default Nav
