import React, { useState, useEffect } from "react";

function Nav({ children }) {
  return (
    <nav className="navbar is-light">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          Lucky Marketplace
        </a>

        <div className="navbar-burger" data-target="navbarExampleTransparentExample">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div id="navbarExampleTransparentExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="/">Overview</a>

          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" href="/">
              Menu
            </a>

            <div className="navbar-dropdown is-boxed">
              <a className="navbar-item" href="/">
                All Listings
              </a>
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">

              <p className="control">
                <a className="button is-primary" href="/">
                  <span className="icon">
                    <i className="fas fa-download"></i>
                  </span>

                  <span>New Listing</span>
                </a>
              </p>

              {children}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav;