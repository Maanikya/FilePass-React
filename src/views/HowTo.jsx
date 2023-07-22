import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/HowTo.css";
import { Link } from "react-router-dom";

export default function HowTo() {
    return (
        <div className="App">
            <Header />
            <h3 className="instructions-h3">How to Upload?</h3>
            <p className="instruct-p">1. Select a File</p>
            <br />
            <p className="instruct-p">2. Enter a Password</p>
            <br />
            <p className="instruct-p">3. Click on Upload</p>
            <br />

            <h3 className="instructions-h3">How to Dowload?</h3>
            <p className="instruct-p">1. Click on Receive Button</p>
            <br />
            <p className="instruct-p">2. Enter the password used to upload</p>
            <br />
            <p className="instruct-p">3. Click on Download</p>

            <Link to={"/"}>
                <button className="imready-btn"> I'M READY </button>
            </Link>
            <Footer />
        </div>
    );
}
