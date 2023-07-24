import { useState } from "react";
import { Link } from "react-router-dom";
import { ref as storageRef } from "firebase/storage";
import { getDatabase, get, ref as dbRef } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Receive.css";

export default function Receive() {
    const [password, setPassword] = useState("");
    const [downloadBtn, setDownloadBtn] = useState(true);
    const [downloadLink, setDownloadLink] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [animation, setAnimation] = useState(false);

    // Warning toast
    const warnToast = async (msg) => {
        toast.warn(msg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const errorToast = async (msg) => {
        toast.error(msg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    // Query Password from Firebase Realtime Database
    const checkPassword = async () => {
        const db = getDatabase();
        const fileRef = dbRef(db, `files/`);
        const snapshot = await get(storageRef(fileRef));
        const data = snapshot.val();
        // console.log(data);

        // If Entered Password doesn't exist, then that password is accepted
        if (data == null) {
            return 0;
        }

        for (const [key, value] of Object.entries(data)) {
            // If that password already exists in the database, Give a toast
            if (password === value.pwd) {
                setDownloadLink(value.url);
                setFileName(value.fileName);
                setFileSize(value.fileSize);
                return 1;
            }
        }
        return 0;
    };

    const handleSearch = async () => {
        setDownloadBtn(false);
        setAnimation(true);

        if (password && (await checkPassword())) {
            setAnimation(false);
            setDownloadBtn(true);
        } else if ((await checkPassword()) === 0) {
            setAnimation(false);
            setDownloadBtn(true);
            setPassword("");
            warnToast("File not found!");
        }
    };

    const handleDownload = async () => {
        const filePath = `files/${fileName}`;
        try {
            window.open(downloadLink, "_black");
            const functions = getFunctions();
            const deleteFile = httpsCallable(functions, "Deletion");
            await deleteFile({
                filePath: filePath,
                pwd: password,
            });
            // console.log(response);
        } catch (err) {
            errorToast(`Error Download Failed: ${err}`);
        }
    };

    return (
        <div className="App">
            <ToastContainer />
            <Header />
            <div className="links">
                <Link to={"/howto"} className="how-to-link">
                    <button className="how-to-btn">
                        <p className="how-to-p">How to ?</p>
                    </button>
                </Link>
                <div className="main">
                    <div className="down">
                        <button className="card3">
                            <svg
                                viewBox="0 0 30 30"
                                width="30px"
                                height="30px"
                                className="github"
                            >
                                {" "}
                                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {downloadBtn && (
                    <button className="btn" onClick={handleSearch}>
                        <strong>SEARCH</strong>
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
            {downloadLink && fileSize && (
                <>
                    <button
                        type="button"
                        className="download-button"
                        onClick={handleDownload}
                    >
                        <span className="button__text">Download</span>
                        <span className="button__icon">
                            <svg
                                className="svg"
                                data-name="Layer 2"
                                id="bdd05811-e15d-428c-bb53-8661459f9307"
                                viewBox="0 0 35 35"
                            >
                                <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                                <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                                <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
                            </svg>
                        </span>
                    </button>
                    <h4 style={{ color: "whitesmoke" }}>
                        File Size: {fileSize}
                    </h4>
                </>
            )}
            {animation && (
                <>
                    <div className="loader">
                        <div className="scanner">
                            <span>Searching...</span>
                        </div>
                    </div>
                    <div className="cube">
                        <div className="topD"></div>
                        <div>
                            <span style={{ "--i": 0 }}></span>
                            <span style={{ "--i": 1 }}></span>
                            <span style={{ "--i": 2 }}></span>
                            <span style={{ "--i": 3 }}></span>
                        </div>

                        <div className="cube2">
                            <div>
                                <span style={{ "--i": 0 }}></span>
                                <span style={{ "--i": 1 }}></span>
                                <span style={{ "--i": 2 }}></span>
                                <span style={{ "--i": 3 }}></span>
                            </div>

                            <div className="cube3">
                                <div className="top3"></div>
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
