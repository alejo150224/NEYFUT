// src/components/TablaPosiciones.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TablaPosiciones.css";

function TablaPosiciones() {
  const [tabla, setTabla] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTabla = async () => {
      try {
        const res = await axios.get(
          "https://www.thesportsdb.com/api/v1/json/1/lookuptable.php?l=4328&s=2023-2024"
        );
        setTabla(res.data.table);
      } catch (err) {
        console.error("Error al obtener tabla:", err);
      }
      setLoading(false);
    };

    obtenerTabla();
  }, []);

  return (
    <div className="tabla-posiciones">
      <h2>📊 Tabla de Posiciones - Premier League</h2>
      {loading ? (
        <p>Cargando tabla...</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>GF</th>
              <th>GC</th>
              <th>DIF</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((team) => (
              <tr key={team.teamid}>
                <td>{team.intRank}</td>
                <td className="team-name">
                  <img src={team.strTeamBadge} alt="logo" className="logo" />
                  {team.strTeam}
                </td>
                <td>{team.intPlayed}</td>
                <td>{team.intWin}</td>
                <td>{team.intDraw}</td>
                <td>{team.intLoss}</td>
                <td>{team.intGoalsFor}</td>
                <td>{team.intGoalsAgainst}</td>
                <td>{team.intGoalDifference}</td>
                <td>{team.intPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TablaPosiciones;
