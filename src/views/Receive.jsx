import { useState } from "react";
import { Link } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, push, get, ref as dbRef } from "firebase/database";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Receive.css";

export default function Receive() {
    const [password, setPassword] = useState("");
    const [downloadBtn, setDownloadBtn] = useState(true);
    const [downloadLink, setDownloadLink] = useState(null);
    const [animation, setAnimation] = useState(false);

    // Query Password from Firebase Realtime Database
    const checkPassword = async (password) => {
        const db = getDatabase();
        const fileRef = dbRef(db, `files/`);
        const snapshot = await get(ref(fileRef));
        const data = snapshot.val();
        console.log(data);

        // If Entered Password doesn't exist, then that password is accepted
        if (data == null) {
            return 0;
        }

        for (const [key, value] of Object.entries(data)) {
            console.log(value);
            // If that password already exists in the database, Give a toast
            if (password === value.pwd) {
                setDownloadLink(value.url);
                return 1;
            }
        }
        return 0;
    };

    const handleDownload = () => {
        setDownloadBtn(false);
        setAnimation(true);

        if(password && checkPassword(password)){
            setDownloadLink()
        }
    };

    return (
        <div className="App">
            <Header />
            <Link to={"/howto"} className="how-to-link">
                <button className="how-to-btn">
                    <p className="how-to-p">How to ?</p>
                </button>
            </Link>
            <form onSubmit={(e) => e.preventDefault()}>
                <p className="downloadInstruct">
                    Enter the Password used to Upload the File
                </p>

                <div className="form-div-1">
                    <label htmlFor="password" className="passwordLabel">
                        Password:{" "}
                    </label>
                    <input
                        type="password"
                        className="passwordInput"
                        placeholder="Mandatory"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {downloadBtn && (
                    <button className="btn" onClick={handleDownload}>
                        <strong>DOWNLOAD</strong>
                        <div id="container-stars">
                            <div id="stars"></div>
                        </div>

                        <div id="glow">
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>
                    </button>
                )}
            </form>
            {animation && (
                <>
                    <div class="loader">
                        <div class="scanner">
                            <span>Searching...</span>
                        </div>
                    </div>
                    <div class="cube">
                        <div class="topD"></div>
                        <div>
                            <span style={{ "--i": 0 }}></span>
                            <span style={{ "--i": 1 }}></span>
                            <span style={{ "--i": 2 }}></span>
                            <span style={{ "--i": 3 }}></span>
                        </div>

                        <div class="cube2">
                            <div>
                                <span style={{ "--i": 0 }}></span>
                                <span style={{ "--i": 1 }}></span>
                                <span style={{ "--i": 2 }}></span>
                                <span style={{ "--i": 3 }}></span>
                            </div>

                            <div class="cube3">
                                <div class="top3"></div>
                                <div>
                                    <span style={{ "--i": 0 }}></span>
                                    <span style={{ "--i": 1 }}></span>
                                    <span style={{ "--i": 2 }}></span>
                                    <span style={{ "--i": 3 }}></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <Footer />
        </div>
    );
}
