import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <>
            <nav className="navbar navbar-expand-sm bg-dark" data-bs-theme="dark" data-testid="header">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        Zucchini Launcher
                    </a>
                    <button
                        className="navbar-toggler collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbar"
                        aria-controls="navbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar">
                        <ul className="navbar-nav me-auto" data-testid="linkList">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Main
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about" data-testid="linkAbout">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
