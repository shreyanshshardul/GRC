import React, { useState, useEffect } from "react";
import RiskForm from "./RiskForm.js";
import { Dashboard } from "./Dashboard.js";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";


const BACKEND_URI = process.env.REACT_APP_BACKEND

function App() {
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    fetchingData();
  }, []);

  const fetchingData = async () => {
    try {
      let response = await axios.get(`${BACKEND_URI}/risks`);
      setRisks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <RiskForm setRisks={setRisks} />
      <Dashboard risks={risks} />
    </>
  );
}

export default App;
