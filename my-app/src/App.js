import RiskForm from "./RiskForm.js"
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Dashboard} from "./Dashboard.js"
import react , {useState , useEffect} from "react";
import axios from "axios"


function App() {

  const [risks , setRisks] = useState([]);

  useEffect(()=>{
      fetchingData()
  },[])

  const fetchingData = async()=>{
    try{
        let response = await axios.get("http://localhost:8000/api/v1/risks")
      setRisks(response.data)
    }
    catch(error){
      console.log(error);
    }
      
  }
  return (
    <>
        <RiskForm setRisks={setRisks}/>
        <Dashboard risks={risks}/>
    </>
  );
}

export default App;
