"use client"

import { useState } from "react"
import PlayerDetail from "./PlayerDetail"
import "./Players.css"
import { ArrowLeft, ArrowRight, Search } from "lucide-react"
import FootballFooter from "./FootballFooter"

const jugadores = [
  {
    id: 1,
    nombre: "Neymar Jr",
    numero: 10,
    posicion: "Forward",
    equipo: "Santos",
    imagen: "/images/ney2.jpg",
    nacionalidad: "Brasil",
    estatura: "1.72m",
    peso: "73kg",
    edad: 32,
    partidos: 732,
    goles: 439,
    minutos: 1210,
    precision: 41,
    conversion: 14,
    proximos: [
      { rival: "Palmeiras", fecha: "27 JULY", hora: "19:00" },
      { rival: "Fluminense", fecha: "30 JULY", hora: "18:30" },
    ],
  },
  {
    id: 2,
    nombre: "Alvaro Morata",
    numero: 9,
    posicion: "Forward",
    equipo: "Chelsea",
    imagen: "/images/morata.jpg",
    nacionalidad: "Spain",
    estatura: "1.89m",
    peso: "85kg",
    edad: 28,
    partidos: 15,
    goles: 5,
    minutos: 720,
    precision: 45,
    conversion: 18,
    proximos: [
      { rival: "ManUnited", fecha: "27 JULY", hora: "19:00" },
      { rival: "Arsenal", fecha: "30 JULY", hora: "18:30" },
    ],
  },
  {
    id: 3,
    nombre: "Eden Hazard",
    numero: 10,
    posicion: "Midfielder",
    equipo: "Chelsea",
    imagen: "/images/hazard.jpg",
    nacionalidad: "Belgium",
    estatura: "1.75m",
    peso: "74kg",
    edad: 30,
    partidos: 18,
    goles: 8,
    minutos: 850,
    precision: 52,
    conversion: 22,
    proximos: [
      { rival: "ManUnited", fecha: "27 JULY", hora: "19:00" },
      { rival: "Arsenal", fecha: "30 JULY", hora: "18:30" },
    ],
  },
  {
    id: 4,
    nombre: "Gary Cahill",
    numero: 24,
    posicion: "Defender",
    equipo: "Chelsea",
    imagen: "/images/gary.webp",
    nacionalidad: "England",
    estatura: "1.93m",
    peso: "86kg",
    edad: 32,
    partidos: 12,
    goles: 1,
    minutos: 780,
    precision: 38,
    conversion: 5,
    proximos: [
      { rival: "ManUnited", fecha: "27 JULY", hora: "19:00" },
      { rival: "Arsenal", fecha: "30 JULY", hora: "18:30" },
    ],
  },
  {
    id: 5,
    nombre: "Davide Zappacosta",
    numero: 21,
    posicion: "Defender",
    equipo: "Chelsea",
    imagen: "/images/zappa.jpg",
    nacionalidad: "Italy",
    estatura: "1.82m",
    peso: "77kg",
    edad: 29,
    partidos: 10,
    goles: 0,
    minutos: 520,
    precision: 35,
    conversion: 0,
    proximos: [
      { rival: "ManUnited", fecha: "27 JULY", hora: "19:00" },
      { rival: "Arsenal", fecha: "30 JULY", hora: "18:30" },
    ],
  },
]

function Players() {
  const [jugadorActivo, setJugadorActivo] = useState(null)
  const [categoriaActiva, setCategoriaActiva] = useState("ALL")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const categorias = ["ALL", "GOALKEEPERS", "DEFENDERS", "MIDFIELDERS", "FORWARDS"]

  const filteredPlayers = jugadores
    .filter((jugador) => {
      if (categoriaActiva === "ALL") return true
      return jugador.posicion.toUpperCase().includes(categoriaActiva.slice(0, -1))
    })
    .filter((jugador) => jugador.nombre.toLowerCase().includes(searchQuery.toLowerCase()))

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredPlayers.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredPlayers.length - 1 ? 0 : prev + 1))
  }

  const featuredPlayer = filteredPlayers[currentIndex] || jugadores[0]

  return (
    <div className="soccer_players_container">
      {jugadorActivo ? (
        <>
          <PlayerDetail jugador={jugadorActivo} onClose={() => setJugadorActivo(null)} />
          <FootballFooter />
        </>
      ) : (
        <>
          <main className="soccer_main_content">
            {/* Header with Search */}
            <div className="soccer_header">
              <div className="soccer_logo_container">
                <img src="/images/futney.png" alt="Club Logo" className="soccer_logo" />
                <h1 className="soccer_title">TEAM</h1>
              </div>
              <div className="soccer_search_container">
                <Search className="soccer_search_icon" size={16} />
                <input
                  type="text"
                  placeholder="Search players..."
                  className="soccer_search_input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="soccer_category_container">
              <div className="soccer_section_tabs">
                <button className="soccer_section_tab soccer_section_tab_active">PLAYERS</button>
                <button className="soccer_section_tab">MANAGEMENT</button>
              </div>

              <div className="soccer_position_tabs">
                {categorias.map((categoria) => (
                  <button
                    key={categoria}
                    className={`soccer_position_tab ${categoriaActiva === categoria ? "soccer_position_tab_active" : ""}`}
                    onClick={() => setCategoriaActiva(categoria)}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Player Section */}
            <div className="soccer_featured_section">
              <div className="soccer_featured_controls">
                <button className="soccer_control_button" onClick={handlePrevious}>
                  <ArrowLeft size={24} />
                </button>
                <button className="soccer_control_button" onClick={handleNext}>
                  <ArrowRight size={24} />
                </button>
              </div>

              <div className="soccer_featured_player_card" onClick={() => setJugadorActivo(featuredPlayer)}>
                <div className="soccer_featured_player_sidebar">
                  <div className="soccer_featured_player_number">{featuredPlayer.numero}</div>
                </div>
                <div className="soccer_featured_player_content">
                  <div className="soccer_featured_player_position">{featuredPlayer.posicion}</div>
                  <div className="soccer_featured_player_image_container">
                    <img
                      src={featuredPlayer.imagen || "/placeholder.svg"}
                      alt={featuredPlayer.nombre}
                      className="soccer_featured_player_image"
                    />
                  </div>
                  <div className="soccer_featured_player_info">
                    <div className="soccer_featured_player_name">
                      {featuredPlayer.nombre.split(" ").map((part, index) => (
                        <div key={index} className={index === 0 ? "soccer_player_firstname" : "soccer_player_lastname"}>
                          {part}
                        </div>
                      ))}
                    </div>
                    <div className="soccer_featured_player_stats">
                      <div className="soccer_stat_item">
                        <span className="soccer_stat_value">{featuredPlayer.partidos}</span>
                        <span className="soccer_stat_label">Matches</span>
                      </div>
                      <div className="soccer_stat_item">
                        <span className="soccer_stat_value">{featuredPlayer.goles}</span>
                        <span className="soccer_stat_label">Goals</span>
                      </div>
                      <div className="soccer_stat_item">
                        <span className="soccer_stat_value">{featuredPlayer.minutos}</span>
                        <span className="soccer_stat_label">Minutes</span>
                      </div>
                    </div>
                    <button className="soccer_view_profile_btn">VIEW PROFILE</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Grid */}
            <div className="soccer_players_grid">
              {filteredPlayers.map((jugador) => (
                <div key={jugador.id} className="soccer_player_card" onClick={() => setJugadorActivo(jugador)}>
                  <div className="soccer_player_card_sidebar">
                    <div className="soccer_player_card_number">{jugador.numero}</div>
                  </div>
                  <div className="soccer_player_card_content">
                    <div className="soccer_player_card_position">{jugador.posicion}</div>
                    <div className="soccer_player_card_image_container">
                      <img
                        src={jugador.imagen || "/placeholder.svg"}
                        alt={jugador.nombre}
                        className="soccer_player_card_image"
                      />
                    </div>
                    <div className="soccer_player_card_info">
                      <div className="soccer_player_card_name">{jugador.nombre}</div>
                      <div className="soccer_player_card_nationality">{jugador.nacionalidad}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
          <FootballFooter />
        </>
      )}
    </div>
  )
}

export default Players
