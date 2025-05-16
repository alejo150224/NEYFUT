"use client"

import { useState, useEffect, useRef } from "react"
import "./Home.css"

const Home = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const videoRef = useRef(null)

  // Countdown timer for next match
  useEffect(() => {
    const nextMatchDate = new Date("2025-05-31T23:00:00")

    const updateCountdown = () => {
      const now = new Date()
      const difference = nextMatchDate - now

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  // Autoplay video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error)
      })
    }
  }, [])

  const videos = [
    {
      id: 1,
      title: " La lucha por el título en las principales ligas de Europa",
      time: "14:00",
      source: "Photo via Lorem.px",
    },
    {
      id: 2,
      title: " West Brom dio un paso importante...",
      time: "14:00",
      source: "Photo via Lorem.px",
    },
    {
      id: 3,
      title: "Aberdeen empató con St Johnstone",
      time: "14:00",
      source: "Photo via Lorem.px",
    },
    {
      id: 4,
      title: " Los entrenadores descartan el trabajo en el Man Utd",
      time: "14:00",
      source: "Photo via Lorem.px",
    },
  ]

  const upcomingMatches = [
    {
      id: 1,
      homeTeam: "Tottenham",
      awayTeam: "Man United",
      date: "21 Mayo",
      time: "21:45",
      league: "UEFA Europa League",
    },
    {
      id: 2,
      homeTeam: "Corinthians",
      awayTeam: "Santos",
      date: "18 Mayo",
      time: "21:45",
      league: "Brasileirao",
    },
    {
      id: 3,
      homeTeam: "Barcelona",
      awayTeam: "Villarreal",
      date: "18 Mayo",
      time: "21:45",
      league: "La Liga",
    },
  ]

  const recentMatches = [
    {
      id: 1,
      homeTeam: "Espanyol",
      homeScore: 0,
      awayTeam: "barcelona",
      awayScore: 2,
      date: "17 May0",
      league: "La Liga",
    },
    {
      id: 2,
      homeTeam: "Bayern",
      homeScore: 2,
      awayTeam: "Dortmund",
      awayScore: 1,
      date: "10 Mayo",
      league: "Bundesliga",
    },
    {
      id: 3,
      homeTeam: "Leipzig",
      homeScore: 1,
      awayTeam: "Bayern",
      awayScore: 3,
      date: "14 May",
      league: "Bundesliga",
    },
  ]

  const players = [
    {
      id: 1,
      name: "Neymar Jr",
      position: "Extremo",
      number: 10,
      image: "/images/Ney1.png",
      age: 32,
      height: "175cm",
      goals: 439,
    },
    {
      id: 2,
      name: "Lionel Messi",
      position: "Extremo",
      number: 10,
      image: "/images/messi.png",
      age: 35,
      height: "172cm",
      goals: 887,
    },
    {
      id: 3,
      name: "James Rodriguez",
      position: "MedioCampista",
      number: 10,
      image: "/images/james.png",
      age: 30,
      height: "178cm",
      goals: 130,
    },
    {
      id: 4,
      name: "Lamine Yamal",
      position: "Extremo",
      number: 19,
      image: "/images/lamine.webp",
      age: 17,
      height: "170cm",
      goals: 25,
      featured: true,
    },
  ]

  const news = [
    {
      id: 1,
      title: "Rangers review presents stark picture",
      excerpt: "Chief executive Graham Wallace's review outlines the scale of the financial problems at Rangers...",
      date: "22 May",
      featured: true,
    },
    {
      id: 2,
      title: "Rangers review presents stark picture",
      excerpt: "Chief executive Graham Wallace's review outlines...",
      date: "21 May",
    },
    {
      id: 3,
      title: "Rangers review presents stark picture",
      excerpt: "Chief executive Graham Wallace's review outlines...",
      date: "21 May",
    },
  ]

  return (
    <div className="home-container">
      {/* Hero Section with Video Background */}
      <section className="hero">
        <div className="video-background">
          <video ref={videoRef} autoPlay muted loop playsInline poster="/placeholder.svg?height=1080&width=1920">
            <source src="/images/ney1.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          
          <h1 className="club-name">NEY FUT</h1>
          <p className="club-slogan">Mas que fútbol, Una PASIÓN</p>
          <div className="hero-cta">
            <button className="btn-primary">Explora este espacio</button>
            <button className="btn-secondary">Unete a la Familia</button>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Desliza</span>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </div>
      </section>

      {/* Next Match Section */}
      <section className="next-match">
        <div className="section-header">
          <h2>Proximo Partido</h2>
          <div className="section-line"></div>
        </div>
        <div className="next-match-card">
          <div className="match-date-badge">
            <div className="match-day">31</div>
            <div className="match-month">MAYO</div>
          </div>
          <div className="match-teams">
            <div className="team">
              <div className="team-logo">
                <img src="/images/psg.webp" alt="psg" />
              </div>
              <h3>PSG</h3>
            </div>
            <div className="match-details">
              <div className="match-vs">VS</div>
              <div className="match-info">
                <span className="match-league">Champions League</span>
                <span className="match-time">14:00</span>
                <span className="match-stadium">Allianz Arena</span>
              </div>
            </div>
            <div className="team">
              <div className="team-logo">
                <img src="/images/inter.webp" alt="Inter" />
              </div>
              <h3>INTER</h3>
            </div>
          </div>
          <div className="match-countdown">
            <div className="countdown-title">Cuenta regresiva para la final </div>
            <div className="countdown-timer">
              <div className="countdown-item">
                <span className="countdown-value">{countdown.days}</span>
                <span className="countdown-label">Dias</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{countdown.hours}</span>
                <span className="countdown-label">Horas</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{countdown.minutes}</span>
                <span className="countdown-label">Min</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-value">{countdown.seconds}</span>
                <span className="countdown-label">Seg</span>
              </div>
            </div>
          </div>
          <div className="match-actions">
            <button className="btn-ticket">Compra Boletos</button>
            <button className="btn-details">Compra Merchs</button>
          </div>
        </div>
      </section>

      {/* Latest Match Section */}
      <section className="latest-match">
        <div className="section-header">
          <h2>Resultado Ultimo Partido</h2>
          <div className="section-line"></div>
        </div>
        <div className="match-card">
          <div className="match-league-badge">Champions League • Semi-Final</div>
          <div className="match-teams">
            <div className="team">
              <div className="team-logo">
                <img src="/images/psg.webp" alt="Psg" />
              </div>
              <h3>Psg</h3>
            </div>
            <div className="match-details">
              <div className="match-score">
                <span>2</span>
                <span className="score-divider">:</span>
                <span>1</span>
              </div>
              <div className="match-info">
                <span className="match-date">7 May 23:00</span>
              </div>
            </div>
            <div className="team">
              <div className="team-logo">
                <img src="/images/arsenal.webp" alt="Arsenal" />
              </div>
              <h3>Arsenal</h3>
            </div>
          </div>
          <div className="match-stats">
            <div className="stat">
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: "40%" }}></div>
              </div>
              <span className="stat-value">46%</span>
              <span className="stat-label">Possession</span>
              <span className="stat-value">54%</span>
              <div className="stat-bar">
                <div className="stat-fill right" style={{ width: "60%" }}></div>
              </div>
            </div>
            <div className="stat">
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: "35%" }}></div>
              </div>
              <span className="stat-value">11</span>
              <span className="stat-label">Remates</span>
              <span className="stat-value">19</span>
              <div className="stat-bar">
                <div className="stat-fill right" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="stat">
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: "45%" }}></div>
              </div>
              <span className="stat-value">2</span>
              <span className="stat-label">T. Esquina</span>
              <span className="stat-value">6</span>
              <div className="stat-bar">
                <div className="stat-fill right" style={{ width: "55%" }}></div>
              </div>
            </div>
          </div>
          <div className="match-actions">
            <button className="btn-match-action">Reporte</button>
            <button className="btn-match-action">Highlights</button>
            <button className="btn-match-action">Galeria</button>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="matches-section">
        <div className="section-header">
          <h2>Partidos</h2>
          <div className="section-line"></div>
        </div>
        <div className="matches-tabs">
          <button
            className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Proximos Partidos
          </button>
          <button
            className={`tab-button ${activeTab === "recent" ? "active" : ""}`}
            onClick={() => setActiveTab("recent")}
          >
            Resultados Recientes
          </button>
        </div>
        <div className="matches-container">
          {activeTab === "upcoming"
            ? upcomingMatches.map((match) => (
                <div className="match-item" key={match.id}>
                  <div className="match-date">
                    <span className="day">{match.date.split(" ")[0]}</span>
                    <span className="month">{match.date.split(" ")[1]}</span>
                  </div>
                  <div className="match-league-tag">{match.league}</div>
                  <div className="match-teams-mini">
                    <span className="team-name">{match.homeTeam}</span>
                    <div className="match-time-wrapper">
                      <span className="match-time">{match.time}</span>
                    </div>
                    <span className="team-name">{match.awayTeam}</span>
                  </div>
                  <div className="match-ticket">
                    <button className="btn-ticket">Compra Boletas</button>
                  </div>
                </div>
              ))
            : recentMatches.map((match) => (
                <div className="match-item result" key={match.id}>
                  <div className="match-date">
                    <span className="day">{match.date.split(" ")[0]}</span>
                    <span className="month">{match.date.split(" ")[1]}</span>
                  </div>
                  <div className="match-league-tag">{match.league}</div>
                  <div className="match-teams-mini">
                    <div className="team-result">
                      <span className="team-name">{match.homeTeam}</span>
                      <span className="team-score">{match.homeScore}</span>
                    </div>
                    <div className="match-separator">-</div>
                    <div className="team-result">
                      <span className="team-score">{match.awayScore}</span>
                      <span className="team-name">{match.awayTeam}</span>
                    </div>
                  </div>
                  <div className="match-ticket">
                    <button className="btn-details">Detalles</button>
                  </div>
                </div>
              ))}
        </div>
        <div className="matches-view-all">
          <button className="btn-view-all">Mira todos los resultados</button>
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <div className="section-header">
          <h2>Ultimas Noticias</h2>
          <div className="section-line"></div>
          <a href="#" className="view-all">
            Mira todas las noticias
          </a>
        </div>
        <div className="news-grid">
          {news.map((item) => (
            <div className={`news-card ${item.featured ? "featured" : ""}`} key={item.id}>
              <div className="news-image">
                <div className="news-category">Importante</div>
              </div>
              <div className="news-content">
                <span className="news-date">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
                <a href="#" className="read-more">
                  Leer Mas
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="section-header">
          <h2>Videos Conjuntos</h2>
          <div className="section-line"></div>
        </div>
        <div className="video-container">
          <div className="video-player">
            <div className="video-thumbnail">
              <div className="play-button">
                <svg viewBox="0 0 24 24" width="64" height="64">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3>{videos[activeVideoIndex].title}</h3>
            </div>
          </div>
          <div className="video-playlist">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`video-item ${index === activeVideoIndex ? "active" : ""}`}
                onClick={() => setActiveVideoIndex(index)}
              >
                <div className="video-item-thumbnail">
                  <div className="play-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="video-item-info">
                  <h4>{video.title}</h4>
                  <p>
                    {video.time} - {video.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Players Section */}
      <section className="players-section">
        <div className="section-header">
          <h2>Los mejores jugadores</h2>
          <div className="section-line"></div>
          <a href="#" className="view-all">
            Mira todo el equipo
          </a>
        </div>
        <div className="players-container">
          {players.map((player) => (
            <div className={`player-card ${player.featured ? "featured" : ""}`} key={player.id}>
              <div className="player-image-container">
                <div className="player-number">{player.number}</div>
                <img src={player.image || "/placeholder.svg"} alt={player.name} className="player-image" />
              </div>
              <div className="player-info">
                <h3>{player.name}</h3>
                <span className="player-position">{player.position}</span>
                <div className="player-stats">
                  <div className="stat">
                    <span className="stat-value">{player.age}</span>
                    <span className="stat-label">Edad</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{player.height}</span>
                    <span className="stat-label">altura</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{player.goals}</span>
                    <span className="stat-label">Goles</span>
                  </div>
                </div>
                <button className="btn-player-profile">Perfil</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-content">
          <h2>
            Hay una nueva forma de vivir el fútbol
            <span>Conoce FutNey, tu fuente de resultados en vivo</span>
          </h2>
          <p>
            Si eres fanático del fútbol, en FutNey encuentras todo lo que necesitas: resultados actualizados al instante, estadísticas detalladas y lo mejor del deporte rey, en un solo lugar.
Actualizaciones rápidas, diseño limpio y una experiencia pensada para ti.
          </p>
          <button className="btn-primary">VER RESULTADOS</button>
        </div>
        <div className="info-pattern"></div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors-section">
        <div className="section-header">
          <h2>Nuestros Patrocinadores</h2>
          <div className="section-line"></div>
        </div>
        <div className="sponsors-container">
          <div className="sponsor-logo">
            <img src="/images/gatorade.png" alt="Gatorade" />
          </div>
          <div className="sponsor-logo">
            <img src="/images/nike.webp" alt="Nike" />
          </div>
          <div className="sponsor-logo">
            <img src="/images/365.4f3370c2-5cc5-422f-a7cf-fe99398d0799" alt="Indesit" />
          </div>
          <div className="sponsor-logo">
            <img src="/images/corona.png" alt="O2" />
          </div>
          <div className="sponsor-logo">
            <img src="/images/budweiser.png" alt="Carlsberg" />
          </div>
          <div className="sponsor-logo">
            <img src="/images/apple.svg" alt="Huawei" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-newsletter">
            <h3>Suscribete a nuestra familia</h3>
            <p>Mantente informado de todas las noticas, ultimas tendencias, ultimos resultados y ofertas</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Tu correo electronico" />
              <button type="submit">Subscribete</button>
            </form>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-content">
            <div className="footer-about">
              <div className="footer-logo">
                <img src="/images/futney.png" alt="Football Club" />
              </div>
              <p>
                FutNey es una plataforma dedicada a los fanáticos del fútbol. Nuestro objetivo es ofrecer resultados en vivo, estadísticas detalladas y noticias actualizadas con un estilo moderno y ágil inspirado en Neymar. En FutNey, cada jugada cuenta.
              </p>
              <div className="footer-social">
                <h4>Siguenos</h4>
                <div className="social-icons">
                  <a href="#" className="social-icon" aria-label="Twitter">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </a>
                  <a href="#" className="social-icon" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z" />
                    </svg>
                  </a>
                  <a href="#" className="social-icon" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                    </svg>
                  </a>
                  <a href="#" className="social-icon" aria-label="YouTube">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-links-container">
              <div className="footer-links">
                <h4>Información del Club</h4>
                <ul>
                  <li>
                    <a href="#">Sobre Nosotros</a>
                  </li>
                  <li>
                    <a href="#">Historia del Club</a>
                  </li>
                  <li>
                    <a href="#">Estadio</a>
                  </li>
                  <li>
                    <a href="#">Dirección</a>
                  </li>
                  <li>
                    <a href="#">Carreras</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links">
                <h4>Equipos</h4>
                <ul>
                  <li>
                    <a href="#">Primer Equipo</a>
                  </li>
                  <li>
                    <a href="#">Equipo Femenino</a>
                  </li>
                  <li>
                    <a href="#">Academia</a>
                  </li>
                  <li>
                    <a href="#">Equipos Juveniles</a>
                  </li>
                  <li>
                    <a href="#">Cuerpo Técnico</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links">
                <h4>Aficionados</h4>
                <ul>
                  <li>
                    <a href="#">Membresías</a>
                  </li>
                  <li>
                    <a href="#">Entradas</a>
                  </li>
                  <li>
                    <a href="#">Club de Fans</a>
                  </li>
                  <li>
                    <a href="#">Asociación de Hinchas</a>
                  </li>
                  <li>
                    <a href="#">Comunidad</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links">
                <h4>Contacto</h4>
                <ul className="contact-info">
                  <li>
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M12 11.5A2.5 2.5 0 0 1 9.5 9 2.5 2.5 0 0 1 12 6.5 2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z" />
                    </svg>
                    <span>123 Calle Estadio, Ciudad</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    <span>+57 321-652-0444</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <span>neyfut@footballclub.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>© 2025 NeyFut - Todos los derechos reservados-Alejandro Rosero</p>
            </div>
            <div className="footer-legal">
              <a href="#">Politica de privacidad</a>
              <a href="#">Terminos de servicio</a>
              <a href="#">Politica Cookie</a>
              <a href="#">Accessibilidad</a>
            </div>
          </div>
        </div>

        <div className="footer-pattern"></div>
      </footer>
    </div>
  )
}

export default Home
