import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, push, get, ref as dbRef } from "firebase/database";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/Landing.css";
import "../css/ProgressBar.css";

export default function Landing() {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [uploadProgress, setUploadProgress] = useState(null);
    const [receive, setReceive] = useState(true);

    useEffect(() => {
        // Show receive button if there is no upload progress
        if (uploadProgress == null) {
            setReceive(true);
        } 
        
        // Hide receive button when showing upload progress
        else if (0 <= uploadProgress && uploadProgress < 100) {
            setReceive(false);
            setUploadProgress(uploadProgress);
        } 
        
        // On complete upload, set success toast and still hide receive button
        else if (uploadProgress >= 100) {
            setReceive(false)
            successToast();
        }
    }, [uploadProgress]);

    // Successful File Upload Toast
    const successToast = () => {
        const refreshPage = setTimeout(() => {
            // Refresh the page after 5 seconds
            window.location.reload();
        }, 5000);

        toast.success("File Uploaded Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: { refreshPage },
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    // Submit File and Password Function
    const handleSubmit = async () => {
        if (file && password) {
            if ((await checkPassword(password)) === 0) {
                uploadFile(password);
            }
        }
    };

    // Query Password from Firebase Realtime Database
    const checkPassword = async (password) => {
        const db = getDatabase();
        const fileRef = dbRef(db, `files/`);
        const snapshot = await get(ref(fileRef));
        const data = snapshot.val();

        // If Entered Password doesn't exist, then that password is accepted
        if (data == null) {
            return 0;
        }

        for (const [key, value] of Object.entries(data)) {
            // console.log(value.pwd);
            // If that password already exists in the database, Give a toast
            if (password === value.pwd) {
                alert(
                    "Entered Password already exists in the database. Please use another password."
                );
                return 1;
            }
        }
        return 0;
    };

    // Upload File Function
    const uploadFile = (password) => {
        if (file == null) return;

        const fileRef = ref(storage, `files/${file.name}`);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                // if (progress && progress.toFixed(0) < 100) {
                //     setUploadProgress(progress.toFixed(1));
                // } else {
                //     setUploadProgress(null);
                // }

                setUploadProgress(progress.toFixed(1));

                console.log("Upload is " + progress.toFixed(2) + "% done");

                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                alert(`Error uploading: ${error}`);
            },
            () => {
                // Handle successful uploads on complete
                // Get Download URL
                getDownloadURL(uploadTask.snapshot.ref).then(
                    async (downloadURL) => {
                        await writeFileMetadata(
                            file.name,
                            downloadURL,
                            password
                        );
                        console.log("File available at", downloadURL);
                    }
                );
            }
        );
    };

    // Write Metadata of the File to Firebase Realtime Database
    const writeFileMetadata = async (fileName, url, pwd) => {
        const db = getDatabase();
        await push(dbRef(db, "files/"), {
            fileName,
            url,
            pwd,
        });
    };

    return (
        <>
            <div className="App">
                <ToastContainer />
                <Header />
                <Link to={"/howto"} className="how-to-link">
                    <button className="how-to-btn">
                        <p className="how-to-p">How to ?</p>
                    </button>
                </Link>

                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-div-1">
                        <label htmlFor="file" className="fileLabel">
                            File:
                        </label>

                        <input
                            type="file"
                            className="fileInput"
                            onChange={(e) => {
                                setFile(e.target.files[0]);
                            }}
                            required
                        />

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
                    <button className="btn" onClick={handleSubmit}>
                        <strong>UPLOAD</strong>
                        <div id="container-stars">
                            <div id="stars"></div>
                        </div>

                        <div id="glow">
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>
                    </button>
                </form>
                {receive && (
                    <button class="receive-btn">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span> Receive a File?
                    </button>
                )}
                {uploadProgress && (
                    <div
                        style={{
                            display: "flex",
                            position: "relative",
                            justifyContent: "center",
                            width: "100%",
                            top: "50px",
                        }}
                    >
                        <div className="progressBar">
                            <CircularProgressbar
                                value={uploadProgress}
                                text={`${uploadProgress}%`}
                                background
                                backgroundPadding={6}
                                styles={buildStyles({
                                    backgroundColor: "#0f0f0f",
                                    textColor: "#fff",
                                    pathColor: "#11ff11",
                                    trailColor: "transparent",
                                    textSize: "20px",
                                })}
                            />
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </>
    );
}
