import { useState } from "react";
import { ref as storageRef } from "firebase/storage";
import { getDatabase, get, ref as dbRef } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Menu from "../components/Menu";
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
            const res = await deleteFile({
                filePath: filePath,
                pwd: password,
            });
            console.log(res);
        } catch (err) {
            errorToast(`Error Download Failed: ${err}`);
        }
    };

    return (
        <div className="App">
            <ToastContainer />
            <Header />
            <Menu />

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
                    <h4 className="fileSize">
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
