import React, { useState, useEffect } from "react";
import axios from "axios";

function RiskForm({setRisks}) {
  const [asset, setAsset] = useState("");
  const [threat, setThreat] = useState("");
  const [likelihood, setLikelihood] = useState(1);
  const [impact, setImpact] = useState(1);
  const [riskPreview, setRiskPreview] = useState(0);
  const [riskColor, setRiskColor] = useState("green");
  const [level, setLevel] = useState("");

  //  Risk calculation
  useEffect(() => {
    const val = likelihood * impact;

    if (val < 8) {
      setRiskColor("green");
      setLevel("Low");
    } else if (val < 16) {
      setRiskColor("orange");
      setLevel("Medium");
    } else {
      setRiskColor("red");
      setLevel("High");
    }

    setRiskPreview(val);
  }, [likelihood, impact]);

  //  Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

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
        }
      );

      console.log("Risk Added:", response.data);

      // optional reset
      setAsset("");
      setThreat("");
      setLikelihood(1);
      setImpact(1);

      setRisks(prev=>[...prev , response.data])
    } catch (error) {
      console.log("Error:", error);
    }

    form.classList.add("was-validated");
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
                  required
                />
                <div className="invalid-feedback">Asset is required</div>
              </div>

              {/* Threat */}
              <div className="col-md-6">
                <label className="form-label">Threat</label>
                <input
                  type="text"
                  className="form-control"
                  value={threat}
                  onChange={(e) => setThreat(e.target.value)}
                  required
                />
                <div className="invalid-feedback">Threat is required</div>
              </div>

              {/* Likelihood */}
              <div className="col-md-6">
                <label className="form-label">
                  Likelihood : {likelihood}
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
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
                  min="1"
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
                    color: riskColor,
                    border: `2px solid ${riskColor}`,
                    borderRadius: "10px",
                  }}
                >
                  Risk Preview : {riskPreview} ({level})
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
