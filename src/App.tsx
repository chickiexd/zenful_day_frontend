import React, { useEffect, useState } from "react";
// import Header from '@/components/Header'
// import Footer from '@/components/Footer'
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Youtubefeed from "@/components/Youtube/YoutubeFeed";
import { fetchYoutubeFeed } from "@/features/Youtube/api";
import { useAppDispatch } from "./hooks";

function App() {
  const [theme, setTheme] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchYoutubeFeed());
  }, [dispatch]);

  return (
    <>
      <Router>
        <div
          className={`App flex flex-col justify-between bg-ctp-base min-h-screen max-h-screen ${theme}`}
        >
          <div className="">
            <Routes>
              <Route path="/" element={<Youtubefeed />} />
              <Route path="/youtube_feed" element={<Youtubefeed />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
