"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"
import { Menu, X, Trophy, Home, BarChart2, MessageSquare } from "lucide-react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="football_navbar_wrapper">
      <nav className="football_navbar">
        <div className="football_navbar_container">
          <div className="football_navbar_logo">
            {/* Logo personalizable - Reemplaza la ruta con tu imagen */}
            <img src="/images/futney.png" alt="Logo" className="football_navbar_logo_image" />
            <h2 className="football_navbar_logo_text">NEYFUT</h2>
          </div>

          <ul className="football_navbar_links">
            <li className="football_navbar_item">
              <Link to="/" className="football_navbar_link football_navbar_link_active">
                <Home size={18} />
                <span>Inicio</span>
              </Link>
            </li>
            <li className="football_navbar_item">
              <Link to="/resultados" className="football_navbar_link">
                <Trophy size={18} />
                <span>Resultados</span>
              </Link>
            </li>
            <li className="football_navbar_item">
              <Link to="/tabla" className="football_navbar_link">
                <BarChart2 size={18} />
                <span>Tabla</span>
              </Link>
            </li>
            <li className="football_navbar_item">
              <Link to="/ia" className="football_navbar_link">
                <MessageSquare size={18} />
                <span>IA Chat</span>
              </Link>
            </li>
          </ul>

          <button className="football_navbar_mobile_toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="football_navbar_mobile_menu">
            <Link to="/" className="football_navbar_mobile_link" onClick={toggleMobileMenu}>
              <Home size={18} />
              <span>Inicio</span>
            </Link>
            <Link to="/resultados" className="football_navbar_mobile_link" onClick={toggleMobileMenu}>
              <Trophy size={18} />
              <span>Resultados</span>
            </Link>
            <Link to="/tabla" className="football_navbar_mobile_link" onClick={toggleMobileMenu}>
              <BarChart2 size={18} />
              <span>Tabla</span>
            </Link>
            <Link to="/ia" className="football_navbar_mobile_link" onClick={toggleMobileMenu}>
              <MessageSquare size={18} />
              <span>IA Chat</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}
