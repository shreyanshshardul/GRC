import React,{useState , useEffect , useCallback} from "react";

function RiskForm() {

  const [likelihood , setLikelihood] = useState(1);
  const [impact , setImpact] = useState(1);
  const [riskPreview , setRiskPreview] = useState(0);
  const [riskColor, setRiskColor] = useState("green");
  const [level , setLevel] = useState("")


  useEffect(()=>{
    let val = impact * likelihood;
    if(val<8){
        setRiskColor("green")
        setLevel("Low")
    }
    else if(val<16){
       setRiskColor("orange")
       setLevel("Medium")
    }
    else if(val>15){
       setRiskColor("red")
       setLevel("High")
    }
    setRiskPreview(val)
  },[impact , likelihood])



  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
    }
    form.classList.add("was-validated");
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar p-3" style={{ backgroundColor: "#1A2CA3" }}>
        <div className="container-fluid text-center">
          <div className="text-white fs-3 fw-bold">
            <i className="bi bi-shield-lock-fill me-2"></i>
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
          <div className="col-md-10 border rounded p-4" style={{boxShadow:"5px 5px 15px black"}}>

            <form
              className="row g-4 needs-validation"
              noValidate
              onSubmit={handleSubmit}
            >
              {/* Asset */}
              <div className="col-md-6">
                <label htmlFor="asset" className="form-label">
                  Asset
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="asset"
                  placeholder="Enter Asset"
                  required
                />
                <div className="invalid-feedback">
                  Asset is required
                </div>
              </div>

              {/* Threat */}
              <div className="col-md-6">
                <label htmlFor="threat" className="form-label">
                  Threat
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="threat"
                  placeholder="Enter Threat"
                  required
                />
                <div className="invalid-feedback">
                  Threat is required
                </div>
              </div>

              {/* Likelihood */}
              <div className="col-md-6">
                <label htmlFor="likelihood" className="form-label">
                  Likelihood :{likelihood}
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="5"
                  id="likelihood"
                  value={likelihood}
                  onChange={(e)=>setLikelihood(e.target.value)}
                  required
                />
              </div>

              {/* Impact */}
              <div className="col-md-6">
                <label htmlFor="impact" className="form-label">
                  Impact :{impact}
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="5"
                  id="impact"
                  value={impact}
                  onChange={(e)=> setImpact(e.target.value)}
                  required
                />
              </div>

              {/* Submit */}
              <div className="col-12 text-center mt-3">
                <button className="btn btn-primary px-5" type="submit">
                  + Add Risk
                </button>
              </div>
                <span className="text-center fs-4 mt-5 mb-4" style={{color:riskColor , boxShadow:`5px 5px 10px ${riskColor}` , width:"30%" , marginLeft:"35%"}}>Risk Preview : {riskPreview} {level}</span>
            </form>

          </div>
          
        </div>
      </div>
    </div>
  );
}

export default RiskForm;
