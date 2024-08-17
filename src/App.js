import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./views/Landing";
import "./App.css";
import "./Background.css";
import ParticlesAnime from "./components/Particles";
import HowTo from "./views/HowTo";
import Receive from "./views/Receive";
import { SpeedInsights } from '@vercel/speed-insights/react';


function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/howto" element={<HowTo />} />
                    <Route path="/receive" element={<Receive />} />
                </Routes>
            </BrowserRouter>
            <ParticlesAnime />
            <SpeedInsights />
        </>
    );
}

export default App;