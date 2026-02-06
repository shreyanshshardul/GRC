import React, { useState } from "react";
import { CSVLink } from "react-csv"; 


const getLevelColor = (level) => {
  switch (level) {
    case "Low": return "#d4edda";
    case "Medium": return "#fff3cd";
    case "High": return "#ffe5b4";
    case "Critical": return "#f8d7da";
    default: return "#fff";
  }
};

const getHeatmapColor = (level) => {
  switch (level) {
    case "Low": return "#00FF00";
    case "Medium": return "#FFFF00";
    case "High": return "#FFA500";
    case "Critical": return "#FF0000";
    default: return "#fff";
  }
};

const getHint = (level) => {
  switch (level) {
    case "Low": return "Monitor";
    case "Medium": return "Plan mitigation within 6 months";
    case "High": return "Prioritize action";
    case "Critical": return "Immediate mitigation required";
    default: return "-";
  }
};


export function Dashboard({ risks }) {
  const [filterLevel, setFilterLevel] = useState("All");
  const [sortOrder, setSortOrder] = useState(null);

  // Stats
  const totalRisks = risks.length;
  const highCriticalCount = risks.filter(
    (r) => r.level === "High" || r.level === "Critical"
  ).length;
  const avgScore = totalRisks
    ? (risks.reduce((sum, r) => sum + r.score, 0) / totalRisks).toFixed(2)
    : 0;

  // Filter & Sort
  const filteredRisks = risks.filter((r) =>
    filterLevel === "All" ? true : r.level === filterLevel
  );
  const sortedRisks = [...filteredRisks].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
  });
  const toggleSort = () =>
    setSortOrder((prev) => (!prev ? "asc" : prev === "asc" ? "desc" : null));

  // CSV Data
  const csvData = sortedRisks.map((r) => ({
    ID: r.id,
    Asset: r.asset,
    Threat: r.threat,
    Likelihood: r.likelihood,
    Impact: r.impact,
    Score: r.score,
    Level: r.level,
    "Mitigation Hint": getHint(r.level),
  }));

  // Heatmap 5x5
  const heatmap = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => [])
  );
  risks.forEach((r) => {
    if (r.likelihood >= 1 && r.likelihood <= 5 && r.impact >= 1 && r.impact <= 5)
      heatmap[r.likelihood - 1][r.impact - 1].push(r.asset);
  });

  const cardColors = ["#6a11cb", "#ff758c", "#43e97b"];

  return (
    <div className="container mb-5">
      {/* Stats Cards */}
      <div className="row text-center g-3 mb-5 mt-5">
        {[
          { title: "Total Risks", value: totalRisks },
          { title: "High/Critical", value: highCriticalCount },
          { title: "Average Score", value: avgScore },
        ].map((card, i) => (
          <div className="col-12 col-md-4" key={i}>
            <div
              className="p-3 rounded text-white"
              style={{ backgroundColor: cardColors[i], fontWeight: "600" }}
            >
              <h6>{card.title}</h6>
              <h3>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* CSV Export */}
      <div className="d-flex justify-content-end mb-2">
        <CSVLink
          data={csvData}
          filename={`risks_${new Date().toISOString().slice(0, 10)}.csv`}
        >
          <button className="btn btn-primary btn-sm">Download CSV</button>
        </CSVLink>
      </div>

      {/* Risk Table */}
      <div className="table-responsive shadow-sm rounded border p-2 mb-4 mt-5">
        <table
          className="table table-hover table-bordered table-striped"
          style={{ minWidth: "700px" }}
        >
          <thead className="table-primary position-sticky top-0" style={{ zIndex: 2 }}>
            <tr>
              <th>ID</th>
              <th>Asset</th>
              <th>Threat</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th
                onClick={toggleSort}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Score {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
              </th>
              <th>
                Level <br />
                <select
                  className="form-select form-select-sm mt-1"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option>All</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </th>
              <th>Mitigation Hint</th>
            </tr>
          </thead>
          <tbody>
            {sortedRisks.map((r) => (
              <tr key={r.id} style={{ backgroundColor: getLevelColor(r.level) }}>
                <td>{r.id}</td>
                <td>{r.asset}</td>
                <td>{r.threat}</td>
                <td>{r.likelihood}</td>
                <td>{r.impact}</td>
                <td>{r.score}</td>
                <td>{r.level}</td>
                <td>{getHint(r.level)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Heatmap */}
      <h5 className="mb-3">Heatmap (Likelihood x Impact)</h5>
      <div className="d-flex flex-column gap-1 flex-wrap">
        {heatmap.map((row, rIdx) => (
          <div className="d-flex flex-wrap gap-1 justify-content-center" key={rIdx}>
            {row.map((cell, cIdx) => {
              let level = "Low";
              const score = (rIdx + 1) * (cIdx + 1);
              if (score > 18) level = "Critical";
              else if (score > 12) level = "High";
              else if (score > 5) level = "Medium";
              return (
                <div
                  key={cIdx}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    border: "1px solid #555",
                    backgroundColor: getHeatmapColor(level),
                    fontSize: "12px",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  title={`${cell.length} risk(s): ${cell.join(", ")}`}
                >
                  {cell.length}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
