import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./views/Landing";
import "./App.css";
import "./Background.css";
import ParticlesAnime from "./components/Particles";
import HowTo from "./views/HowTo";

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/howto" element={<HowTo />} />
                </Routes>
            </BrowserRouter>
            <ParticlesAnime />
        </>
    );
}

export default App;
