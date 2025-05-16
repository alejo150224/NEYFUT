"use client"

import { ArrowLeft, Calendar, Clock, Trophy } from "lucide-react"
import "./PlayerDetail.css"

function PlayerDetail({ jugador, onClose }) {
  return (
    <div className="soccer_player_detail">
      <div className="soccer_player_detail_header">
        <button className="soccer_back_button" onClick={onClose}>
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>
      </div>

      <div className="soccer_player_detail_content">
        <div className="soccer_player_detail_sidebar">
          <div className="soccer_player_detail_number">{jugador.numero}</div>
          <div className="soccer_player_detail_position_badge">{jugador.posicion}</div>
        </div>

        <div className="soccer_player_detail_main">
          <div className="soccer_player_detail_hero">
            <div className="soccer_player_detail_image_container">
              <img
                src={jugador.imagen || "/placeholder.svg"}
                alt={jugador.nombre}
                className="soccer_player_detail_image"
              />
            </div>

            <div className="soccer_player_detail_info">
              <div className="soccer_player_detail_name">
                <h1 className="soccer_player_detail_firstname">{jugador.nombre.split(" ")[0]}</h1>
                <h1 className="soccer_player_detail_lastname">{jugador.nombre.split(" ")[1]}</h1>
              </div>

              <div className="soccer_player_detail_nationality">{jugador.nacionalidad}</div>

              <div className="soccer_player_detail_stats_grid">
                <div className="soccer_player_detail_stat">
                  <div className="soccer_player_detail_stat_value">{jugador.minutos}</div>
                  <div className="soccer_player_detail_stat_label">Minutos</div>
                </div>
                <div className="soccer_player_detail_stat">
                  <div className="soccer_player_detail_stat_value">{jugador.partidos}</div>
                  <div className="soccer_player_detail_stat_label">Apariciones</div>
                </div>
                <div className="soccer_player_detail_stat">
                  <div className="soccer_player_detail_stat_value">{jugador.goles}</div>
                  <div className="soccer_player_detail_stat_label">Goles</div>
                </div>
              </div>
            </div>
          </div>

          <div className="soccer_player_detail_sections">
            <div className="soccer_player_detail_physical_section">
              <h2 className="soccer_player_detail_section_title">
                <span className="soccer_section_title_icon">
                  <Trophy size={18} />
                </span>
                Información Personal
              </h2>
              <div className="soccer_player_detail_physical">
                <div className="soccer_player_detail_physical_item">
                  <div className="soccer_player_detail_physical_value">{jugador.estatura}</div>
                  <div className="soccer_player_detail_physical_label">Altura</div>
                </div>
                <div className="soccer_player_detail_physical_item">
                  <div className="soccer_player_detail_physical_value">{jugador.peso}</div>
                  <div className="soccer_player_detail_physical_label">Peso</div>
                </div>
                <div className="soccer_player_detail_physical_item">
                  <div className="soccer_player_detail_physical_value">{jugador.edad}</div>
                  <div className="soccer_player_detail_physical_label">Edad</div>
                </div>
              </div>
            </div>

            <div className="soccer_player_detail_matches_section">
              <h2 className="soccer_player_detail_section_title">
                <span className="soccer_section_title_icon">
                  <Calendar size={18} />
                </span>
                Próximos Partidos
              </h2>
              <div className="soccer_player_detail_matches">
                {jugador.proximos.map((partido, index) => (
                  <div key={index} className="soccer_player_detail_match">
                    <div className="soccer_player_detail_match_vs">VS</div>
                    <div className="soccer_player_detail_match_rival">{partido.rival}</div>
                    <div className="soccer_player_detail_match_info">
                      <div className="soccer_player_detail_match_date">
                        <Calendar size={16} />
                        <span>{partido.fecha}</span>
                      </div>
                      <div className="soccer_player_detail_match_time">
                        <Clock size={16} />
                        <span>{partido.hora}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="soccer_player_detail_performance_section">
              <h2 className="soccer_player_detail_section_title">
                <span className="soccer_section_title_icon">
                  <Trophy size={18} />
                </span>
                Estadísticas de Temporada
              </h2>
              <div className="soccer_player_detail_performance">
                <div className="soccer_player_detail_performance_item">
                  <div className="soccer_player_detail_performance_label">Precisión de Pases</div>
                  <div className="soccer_player_detail_performance_bar">
                    <div
                      className="soccer_player_detail_performance_progress"
                      style={{ width: `${jugador.precision}%` }}
                    ></div>
                  </div>
                  <div className="soccer_player_detail_performance_value">{jugador.precision}%</div>
                </div>
                <div className="soccer_player_detail_performance_item">
                  <div className="soccer_player_detail_performance_label">Tasa de Conversión</div>
                  <div className="soccer_player_detail_performance_bar">
                    <div
                      className="soccer_player_detail_performance_progress"
                      style={{ width: `${jugador.conversion}%` }}
                    ></div>
                  </div>
                  <div className="soccer_player_detail_performance_value">{jugador.conversion}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetail
