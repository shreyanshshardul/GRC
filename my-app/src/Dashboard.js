import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({risks}) {


  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col">
          <h2>
            Risk Registered{" "}
            {risks.length === 0 ? "No risk registered" : risks.length}
          </h2>

          {/* BOX */}
          <div
            className="mt-4 p-3"
            style={{
              border: "1px solid black",
              width: "100%",
              borderRadius: "10px",
              maxHeight: "350px",       
              overflowY: "auto",        
              overflowX: "auto",       
              boxShadow: "2px 8px 15px #1A2CA3"
            }}
          >
            <table
              className="table table-striped table-bordered w-100"
              style={{ tableLayout: "fixed" }}   //  box ke andar force
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "#fff",
                  zIndex: 1
                }}
              >
                <tr>
                  <th>ID</th>
                  <th>ASSET</th>
                  <th>THREAT</th>
                  <th>LIKELIHOOD</th>
                  <th>IMPACT</th>
                  <th>SCORE</th>
                  <th>LEVEL</th>
                </tr>
              </thead>

              <tbody>
                {risks.map((risk) => (
                  <tr key={risk.id}>
                    <td>{risk.id}</td>
                    <td style={{ wordWrap: "break-word" }}>{risk.asset}</td>
                    <td style={{ wordWrap: "break-word" }}>{risk.threat}</td>
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
      </div>
    </div>
  );
}

export {Dashboard};
