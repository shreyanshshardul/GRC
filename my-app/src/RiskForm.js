import React, { useState, useEffect } from "react";
import axios from "axios";


const BACKEND_URI = process.env.REACT_APP_BACKEND

function RiskForm({ setRisks }) {
  const [asset, setAsset] = useState("");
  const [threat, setThreat] = useState("");
  const [likelihood, setLikelihood] = useState(0);
  const [impact, setImpact] = useState(0);
  const [riskPreview, setRiskPreview] = useState(0);
  const [riskColor, setRiskColor] = useState("white");
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Compliance hint based on level
  const getComplianceHint = (level) => {
    switch (level) {
      case "Low": return "Routine monitoring recommended";
      case "Medium": return "Consider implementing basic controls (ISO 27001)";
      case "High": return "Recommend NIST PR.AC-7: Rate Limiting";
      case "Critical": return "Immediate action required: NIST PR.AC-7 + ISO 27001 controls";
      default: return "";
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    } else if (success) {
      const timer2 = setTimeout(() => setSuccess(""), 2000);
      return () => clearTimeout(timer2);
    }
  }, [error, success]);

  // Risk calculation
  useEffect(() => {
    const val = likelihood * impact;
    if (val === 0) {
      setRiskColor("white");
      setLevel("Enter risk");
    } else if (val <= 5) {
      setRiskColor("#70c247");
      setLevel("Low");
    } else if (val <= 12) {
      setRiskColor("yellow");
      setLevel("Medium");
    } else if (val <= 18) {
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
    setError(""); setSuccess("");

    if (!asset || !threat) {
      setError("Both Asset and Threat are required");
      return;
    }

    const hint = getComplianceHint(level);

    try {
      const response = await axios.post(
        `${BACKEND_URI}/add-risk`,
        { asset, threat, likelihood, impact, score: riskPreview, level, hint }
      );

      setRisks((prev) => [...prev, response.data]);

      setAsset(""); setThreat(""); setLikelihood(1); setImpact(1);
      setSuccess("Risk added successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="mb-5">
      {/* Navbar */}
      <nav className="navbar p-3 mb-5" style={{ backgroundColor: "#1A2CA3" }}>
        <div className="container-fluid text-center text-white">
          <div className="fs-4 fw-bold">GRC Risk Assessment Dashboard</div>
          <div className="fs-6 opacity-75">Enterprise Governance, Risk & Compliance</div>
        </div>
      </nav>

      {/* Alerts */}
      {error && <div className="alert alert-danger text-center m-2">{error}</div>}
      {success && <div className="alert alert-success text-center m-2">{success}</div>}

      {/* Form */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 border rounded p-3 p-md-4 shadow-sm">
            <form onSubmit={handleSubmit} className="row g-3">
              {/* Asset */}
              <div className="col-12 col-md-6">
                <label className="form-label">Asset</label>
                <input type="text" className="form-control" value={asset} onChange={e => setAsset(e.target.value)} />
              </div>

              {/* Threat */}
              <div className="col-12 col-md-6">
                <label className="form-label">Threat</label>
                <input type="text" className="form-control" value={threat} onChange={e => setThreat(e.target.value)} />
              </div>

              {/* Likelihood */}
              <div className="col-12 col-md-6">
                <label className="form-label">Likelihood: {likelihood}</label>
                <input type="range" className="form-range" min="0" max="5" value={likelihood} onChange={e => setLikelihood(Number(e.target.value))} />
              </div>

              {/* Impact */}
              <div className="col-12 col-md-6">
                <label className="form-label">Impact: {impact}</label>
                <input type="range" className="form-range" min="0" max="5" value={impact} onChange={e => setImpact(Number(e.target.value))} />
              </div>

              {/* Submit Button */}
              <div className="col-12 text-center mt-5">
                <button type="submit" className="btn btn-primary w-100 w-md-auto px-4">+ Add Risk</button>
              </div>

              {/* Risk Preview */}
              <div className="col-12 text-center mt-3">
                <span style={{
                  display: "inline-block",
                  backgroundColor: riskColor,
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: `2px solid ${riskColor}`,
                  fontWeight: "600",
                }}>
                  Risk Preview: {riskPreview} ({level})
                </span>
              </div>

              {/* Hint */}
              <div className="col-12 text-center mt-2">
                <span style={{
                  display: "inline-block",
                  backgroundColor: riskColor,
                  padding: "8px 15px",
                  borderRadius: "8px",
                  border: `2px solid ${riskColor}`,
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}>
                  Hint: {getComplianceHint(level)}
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
