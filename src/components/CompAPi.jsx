"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "./gpt.css"
import { Send, MessageSquare, Trophy, User, Star, Zap, Calendar } from "lucide-react"
import FootballFooter from "./FootballFooter"

function CompAPi() {
const [mensajes, setMensajes] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const chatBoxRef = useRef(null)

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

    // Update immediately
    updateCountdown()

    // Then update every second
    const intervalId = setInterval(updateCountdown, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [mensajes, loading])

  const mandarMensaje = async () => {
    if (input.trim() === "") return

    const nuevosMensajes = [...mensajes, { sender: "user", text: input }]
    setMensajes(nuevosMensajes)
    setInput("")
    setLoading(true)
    setShowSuggestions(false)

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: nuevosMensajes.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        },
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
        },
      )

      const botReply = response.data.choices[0].message.content
      setMensajes([...nuevosMensajes, { sender: "bot", text: botReply }])
    } catch (error) {
      console.error("Error en la API:", error)
      setMensajes([...nuevosMensajes, { sender: "bot", text: "🚨 Error al obtener respuesta" }])
    }

    setLoading(false)
  }

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion)
  }

  const sugerencias = [
    {
      icon: <Trophy size={16} />,
      text: "¿Quién ganó el último Mundial?",
      color: "var(--football-gold)",
    },
    {
      icon: <Star size={16} />,
      text: "Mejores jugadores de la historia",
      color: "var(--football-blue)",
    },
    {
      icon: <Zap size={16} />,
      text: "Explícame la regla del fuera de juego",
      color: "var(--football-green)",
    },
    {
      icon: <Calendar size={16} />,
      text: "Próximos partidos de Champions",
      color: "var(--football-purple)",
    },
  ]

  const nextMatchInfo = {
    homeTeam: "PSG",
    awayTeam: "INTER",
    competition: "CHAMPIONS LEAGUE",
    date: "31 MAYO",
    time: "14:00",
    stadium: "Allianz Arena",
  }

  return (
    <>
      <div className="football_chat_container">
        <div className="football_chat_sidebar">
          <div className="football_chat_logo">
            <div className="football_chat_logo_icon">
              <div className="football_chat_ball"></div>
            </div>
            <h2 className="football_chat_logo_text">
              NEYFUT
              <span>ASSISTANT</span>
            </h2>
          </div>

          <div className="football_chat_next_match">
            <div className="football_chat_next_match_date">
              <div className="football_chat_date_number">{nextMatchInfo.date.split(" ")[0]}</div>
              <div className="football_chat_date_month">{nextMatchInfo.date.split(" ")[1]}</div>
            </div>
            <div className="football_chat_match_details">
              <div className="football_chat_competition">{nextMatchInfo.competition}</div>
              <div className="football_chat_teams">
                <span>{nextMatchInfo.homeTeam}</span>
                <span className="football_chat_vs">VS</span>
                <span>{nextMatchInfo.awayTeam}</span>
              </div>
              <div className="football_chat_time_stadium">
                <span>{nextMatchInfo.time}</span>
                <span className="football_chat_stadium">{nextMatchInfo.stadium}</span>
              </div>
            </div>
          </div>

          <div className="football_chat_countdown">
            <h3 className="football_chat_countdown_title">CUENTA REGRESIVA PARA LA FINAL</h3>
            <div className="football_chat_countdown_timer">
              <div className="football_chat_countdown_item">
                <div className="football_chat_countdown_value">{countdown.days}</div>
                <div className="football_chat_countdown_label">DÍAS</div>
              </div>
              <div className="football_chat_countdown_item">
                <div className="football_chat_countdown_value">{countdown.hours}</div>
                <div className="football_chat_countdown_label">HORAS</div>
              </div>
              <div className="football_chat_countdown_item">
                <div className="football_chat_countdown_value">{countdown.minutes}</div>
                <div className="football_chat_countdown_label">MIN</div>
              </div>
              <div className="football_chat_countdown_item">
                <div className="football_chat_countdown_value">{countdown.seconds}</div>
                <div className="football_chat_countdown_label">SEG</div>
              </div>
            </div>
          </div>
        </div>

        <div className="football_chat_main">
          <div className="football_chat_header">
            <div className="football_chat_welcome">
              <h1>
                ¡Bienvenido al <span className="football_chat_highlight">Asistente</span> de Fútbol!
              </h1>
              <p className="football_chat_subtitle">Pregúntame cualquier cosa sobre el mundo del fútbol</p>
            </div>
            <div className="football_chat_user_badge">
              <User size={20} />
            </div>
          </div>

          {showSuggestions && (
            <div className="football_chat_suggestions">
              <h3 className="football_chat_suggestions_title">Sugerencias populares</h3>
              <div className="football_chat_suggestions_grid">
                {sugerencias.map((sugerencia, index) => (
                  <button
                    key={index}
                    className="football_chat_suggestion_card"
                    style={{ "--card-color": sugerencia.color }}
                    onClick={() => handleSuggestionClick(sugerencia.text)}
                  >
                    <div className="football_chat_suggestion_icon">{sugerencia.icon}</div>
                    <div className="football_chat_suggestion_text">{sugerencia.text}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="football_chat_box" ref={chatBoxRef}>
            {mensajes.length === 0 && !showSuggestions && (
              <div className="football_chat_empty_state">
                <div className="football_chat_empty_icon">
                  <MessageSquare size={40} />
                </div>
                <p>Tu asistente de fútbol está listo para responder tus preguntas</p>
              </div>
            )}

            {mensajes.map((msg, index) => (
              <div
                key={index}
                className={`football_chat_message ${
                  msg.sender === "user" ? "football_chat_user_message" : "football_chat_bot_message"
                }`}
              >
                <div className="football_chat_message_avatar">
                  {msg.sender === "user" ? <User size={16} /> : <Trophy size={16} />}
                </div>
                <div className="football_chat_message_content">{msg.text}</div>
              </div>
            ))}

            {loading && (
              <div className="football_chat_message football_chat_bot_message">
                <div className="football_chat_message_avatar">
                  <Trophy size={16} />
                </div>
                <div className="football_chat_message_content football_chat_loading">
                  <div className="football_chat_typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  Analizando jugada...
                </div>
              </div>
            )}
          </div>

          <div className="football_chat_input_area">
            <input
              type="text"
              placeholder="Pregunta sobre fútbol..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && mandarMensaje()}
              disabled={loading}
              className="football_chat_input"
            />
            <button
              onClick={mandarMensaje}
              disabled={loading || input.trim() === ""}
              className="football_chat_send_btn"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      <FootballFooter />
    </>
  )
}

export default CompAPi
