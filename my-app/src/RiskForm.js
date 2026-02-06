import React, { useState, useEffect } from "react";
import axios from "axios";

function RiskForm({ setRisks }) {
  const [asset, setAsset] = useState("");
  const [threat, setThreat] = useState("");
  const [likelihood, setLikelihood] = useState(0);
  const [impact, setImpact] = useState(0);
  const [riskPreview, setRiskPreview] = useState(0);
  const [riskColor, setRiskColor] = useState("green");
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Compliance hint based on level
  const getComplianceHint = (level) => {
    switch (level) {
      case "Low":
        return "Routine monitoring recommended";
      case "Medium":
        return "Consider implementing basic controls (ISO 27001)";
      case "High":
        return "Recommend NIST PR.AC-7: Rate Limiting";
      case "Critical":
        return "Immediate action required: NIST PR.AC-7 + ISO 27001 controls";
      default:
        return "";
    }
  };

  useEffect(()=>{
    if(error){
       const timer = setTimeout(()=> setError("") , 2000);
     return () => clearTimeout(timer);
    }
      else if(success){
        const timer2 = setTimeout(()=>setSuccess("") , 2000);
        return () => clearTimeout(timer2);
      }
  },[error , success])

  // Risk calculation
  useEffect(() => {
    const val = likelihood * impact;
    if(val === 0){
      setRiskColor("white");
      setLevel("Enter risk")
    }
      else if (val <= 5 && val > 0) {
      setRiskColor("green");
      setLevel("Low");
    } else if (val <= 12 && val > 5) {
      setRiskColor("yellow");
      setLevel("Medium");
    } else if (val <= 18 && val>12) {
      setRiskColor("orange");
      setLevel("High");
    } else {
      setRiskColor("red");
      setLevel("Critical");
    }

    setRiskPreview(val);
  }, [likelihood, impact]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!asset || !threat) {
      setError("Both Asset and Threat are required");
      return;
    }

    // Get hint based on level
    const hint = getComplianceHint(level);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/add-risk",
        {
          asset,
          threat,
          likelihood,
          impact,
          score: riskPreview,
          level,
          hint, // NEW FIELD
        }
      );

      // Update parent state
      setRisks((prev) => [...prev, response.data]);

      // Reset form
      setAsset("");
      setThreat("");
      setLikelihood(1);
      setImpact(1);

      // Show success
      setSuccess("Risk added successfully");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Server error");
      }
    }
  };



  return (
    <div className="mb-5">
      {/* NAVBAR */}
      <nav className="navbar p-3" style={{ backgroundColor: "#1A2CA3" }}>
        <div className="container-fluid text-center">
          <div className="text-white fs-3 fw-bold">
            GRC Risk Assessment Dashboard
          </div>
          <div className="text-white fs-6 opacity-75">
            Enterprise Governance, Risk & Compliance Management
          </div>
        </div>
      </nav>

      
      {/* Alerts */}
      
      {error && (
            <div className="alert alert-danger text-center">{error}</div>
      )}
      {success && (
        <div className="alert alert-success text-center">{success}</div>
      )}

      {/* FORM */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div
            className="col-md-10 border rounded p-4"
            style={{ boxShadow: "2px 8px 12px #1A2CA3" }}
          >
            <form
              className="row g-4 needs-validation"
              noValidate
              onSubmit={handleSubmit}
            >
              {/* Asset */}
              <div className="col-md-6">
                <label className="form-label">Asset</label>
                <input
                  type="text"
                  className="form-control"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                />
              </div>

              {/* Threat */}
              <div className="col-md-6">
                <label className="form-label">Threat</label>
                <input
                  type="text"
                  className="form-control"
                  value={threat}
                  onChange={(e) => setThreat(e.target.value)}
                />
              </div>

              {/* Likelihood */}
              <div className="col-md-6">
                <label className="form-label">
                  Likelihood : {likelihood}
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="5"
                  value={likelihood}
                  onChange={(e) => setLikelihood(Number(e.target.value))}
                />
              </div>

              {/* Impact */}
              <div className="col-md-6">
                <label className="form-label">Impact : {impact}</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="5"
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                />
              </div>

              {/* Submit */}
              <div className="col-12 text-center mt-3">
                <button className="btn btn-primary px-5" type="submit">
                  + Add Risk
                </button>
              </div>

              {/* Risk Preview */}
              <div className="col-12 text-center mt-4">
                <span
                  className="fs-4 px-4 py-2"
                  style={{
                    backgroundColor: riskColor,
                    color: "black",
                    border: `2px solid ${riskColor}`,
                    borderRadius: "10px",
                  }}
                >
                  Risk Preview : {riskPreview} ({level})
                </span>
              </div>
              <div className="col-12 text-center mt-4">
                <span
                  className="fs-4 px-4 py-2"
                  style={{
                    backgroundColor: riskColor,
                    color: "black",
                    border: `2px solid ${riskColor}`,
                    borderRadius: "10px",
                  }}
                >
                   Hint: {getComplianceHint(level)} ({level})
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskForm;
