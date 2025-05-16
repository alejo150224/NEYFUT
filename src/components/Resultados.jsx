import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Resultados.css";

function Resultados() {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const obtenerPartidos = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v2/odds/league/865927/bookmaker/5?page=2",
          params: {
            league: "39", // Premier League
            season: "2023", // Temporada actual
            last: "10", // Últimos 10 partidos
          },
          headers: {
            "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4", // 🔐 Reemplaza con tu clave
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        }

        const res = await axios.request(options)
        setPartidos(res.data.response)
      } catch (error) {
        console.error("Error al obtener partidos:", error)
      } finally {
        setLoading(false)
      }
    }

    obtenerPartidos()
  }, [])

  return (
    <>
      <div className="resultados">
        <div className="resultados-header">
          <h2>📋 Últimos Resultados</h2>
          <p>Premier League - API-Football</p>
        </div>

        {loading ? (
          <p className="cargando">Cargando resultados...</p>
        ) : (
          <ul className="lista-partidos">
            {partidos.map((match) => (
              <li key={match.fixture.id} className="partido">
                <div className="equipos">
                  <strong>{match.teams.home.name}</strong> vs <strong>{match.teams.away.name}</strong>
                </div>
                <div className="score">
                  {match.goals.home} - {match.goals.away}
                </div>
                <div className="fecha">{new Date(match.fixture.date).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <FootballFooter />
    </>
  )
}

export default Resultados;