import React, { useState } from "react";

function Dashboard({ risks }) {
  const [filterLevel, setFilterLevel] = useState("All"); // Level filter
  const [sortOrder, setSortOrder] = useState(null); // Score sorting

  // Filter risks based on level
  const filteredRisks = risks.filter((risk) =>
    filterLevel === "All" ? true : risk.level === filterLevel
  );

  // Sort risks by score
  const sortedRisks = [...filteredRisks].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc" ? a.score - b.score : b.score - a.score;
  });

  const toggleSort = () => {
    if (!sortOrder) setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder(null);
  };

  // Row color based on level
  const getRowColor = (level) => {
    switch (level) {
      case "Low":
        return "#d4edda"; // light green
      case "Medium":
        return "#fff3cd"; // light yellow
      case "High":
        return "#ffe5b4"; // light orange
      case "Critical":
        return "#f8d7da"; // light red
      default:
        return "white";
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row mb-3">
        <div className="col-md-6">
          <h2>
            Risk Registered:{" "}
            {filteredRisks.length === 0 ? "No risk registered" : filteredRisks.length}
          </h2>
        </div>
      </div>

      <div
        className="mt-4 p-3"
        style={{
          border: "1px solid black",
          width: "100%",
          borderRadius: "10px",
          maxHeight: "450px",
          overflowY: "auto",
          overflowX: "auto",
          boxShadow: "2px 8px 15px #1A2CA3",
        }}
      >
        <table
          className="table table-striped table-bordered w-100"
          style={{ tableLayout: "fixed" }}
        >
          <thead
            style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}
          >
            <tr>
              <th>ID</th>
              <th>ASSET</th>
              <th>THREAT</th>
              <th>LIKELIHOOD</th>
              <th>IMPACT</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={toggleSort}
                title="Click to sort by Score"
              >
                SCORE {sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : ""}
              </th>
              <th>
                LEVEL
                <br />
                <select
                  className="form-select form-select-sm mt-1"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedRisks.map((risk) => (
              <tr key={risk.id} style={{ backgroundColor: getRowColor(risk.level) }}>
                <td>{risk.id}</td>
                <td style={{ wordBreak: "break-word" }}>{risk.asset}</td>
                <td style={{ wordBreak: "break-word" }}>{risk.threat}</td>
                <td>{risk.likelihood}</td>
                <td>{risk.impact}</td>
                <td>{risk.score}</td>
                <td>{risk.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { Dashboard };
