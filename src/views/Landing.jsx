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
            setReceive(false);
            successToast();
        }
    }, [uploadProgress]);

    // Successful File Upload Toast
    const successToast = () => {
        const refreshPage = setTimeout(() => {
            // Refresh the page after 5 seconds
            window.location.reload();
        }, 4000);

        toast.success("File Uploaded Successfully!", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: { refreshPage },
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

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

    // Submit File and Password Function
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file && password) {
            if ((await checkPassword(password)) === 0) {
                try {
                    await uploadFile();
                    setFile(null);
                    setPassword("");
                } catch (err) {
                    errorToast("Something went wrong!");
                }
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
        } else if (data) {
            for (const [key, value] of Object.entries(data)) {
                // If that password already exists in the database, Give a toast
                if (password === value.pwd) {
                    setPassword("");
                    warnToast(
                        "Entered Password already exists. Use a different password."
                    );
                    return 1;
                }
            }
        }
        return 0;
    };

    // Upload File Function
    const uploadFile = async () => {
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

                // console.log("Upload is " + progress.toFixed(2) + "% done");

                // switch (snapshot.state) {
                //     case "paused":
                //         console.log("Upload is paused");
                //         break;
                //     case "running":
                //         console.log("Upload is running");
                //         break;
                // }
            },
            (error) => {
                // Handle unsuccessful uploads
                errorToast(`Error uploading the file!: ${error}`);
            },
            () => {
                // Handle successful uploads on complete
                // Get Download URL
                getDownloadURL(uploadTask.snapshot.ref).then(
                    async (downloadURL) => {
                        const fileSizeInBytes = uploadTask.snapshot.totalBytes;
                        const fileSizeFormatted =
                            formatFileSize(fileSizeInBytes);

                        await writeFileMetadata(
                            file.name,
                            fileSizeFormatted,
                            downloadURL,
                            password
                        );
                        // console.log("File available at", downloadURL);
                    }
                );
            }
        );
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Write Metadata of the File to Firebase Realtime Database
    const writeFileMetadata = async (fileName, fileSize, url, pwd) => {
        const db = getDatabase();
        await push(dbRef(db, "files/"), {
            fileName,
            fileSize,
            url,
            pwd,
        });
    };

    return (
        <>
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
                            <button className="card3" onClick={handleGithub}>
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

                <form id="myForm" onSubmit={(e) => handleSubmit(e)}>
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn" type="submit">
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
                    <Link to={"/receive"}>
                        <button className="receive-btn">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span> Receive a File?
                        </button>
                    </Link>
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
