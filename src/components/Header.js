import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

export default function Header() {

    return (
        <header>
            <h1>
                <a href="/" className="title">
                    File Pass
                </a>
            </h1>
        </header>
    );
}
