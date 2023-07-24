import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/HowTo.css";

export default function HowTo() {
    return (
        <div className="App">
            <Header />
            <h4 className="instructions-h3">How to Upload?</h4>
            <p className="instruct-p">1. Select a File less than 500MB in size</p>
            <br />
            <p className="instruct-p">
                2. Enter a Password to be associated with that File
            </p>
            <br />
            <p className="instruct-p">3. Click on Upload</p>
            <br />

            <h4 className="instructions-h3">How to Dowload?</h4>
            <p className="instruct-p">1. Click on Receive Button</p>
            <br />
            <p className="instruct-p">
                2. Enter the password used to upload the File
            </p>
            <br />
            <p className="instruct-p">
                3. Click on Search to search that file based on entered Password
            </p>
            <br />
            <p className="instruct-p">4. Click on Download after File Search</p>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "350px",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <Link to={"/"}>
                    <button className="imready-btn"> UPLOAD </button>
                </Link>
                <Link to={"/receive"}>
                    <button className="imready-btn"> DOWNLOAD </button>
                </Link>
            </div>
            <Footer />
        </div>
    );
}
