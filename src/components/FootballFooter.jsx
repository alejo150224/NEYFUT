import "./FootballFooter.css"

function FootballFooter() {
  return (
    <footer className="football_footer">
      <div className="football_footer_top">
        <div className="football_footer_newsletter">
          <h3>Suscribete a nuestra familia</h3>
          <p>Mantente informado de todas las noticas, ultimas tendencias, ultimos resultados y ofertas</p>
          <form className="football_newsletter_form">
            <input type="email" placeholder="Tu correo electronico" />
            <button type="submit">Subscribete</button>
          </form>
        </div>
      </div>

      <div className="football_footer_main">
        <div className="football_footer_content">
          <div className="football_footer_about">
            <div className="football_footer_logo">
              <img src="/images/futney.png" alt="Football Club" />
            </div>
            <p>
              FutNey es una plataforma dedicada a los fanáticos del fútbol. Nuestro objetivo es ofrecer resultados en
              vivo, estadísticas detalladas y noticias actualizadas con un estilo moderno y ágil inspirado en Neymar. En
              FutNey, cada jugada cuenta.
            </p>
            <div className="football_footer_social">
              <h4>Siguenos</h4>
              <div className="football_social_icons">
                <a href="#" className="football_social_icon" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="football_social_icon" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z" />
                  </svg>
                </a>
                <a href="#" className="football_social_icon" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </a>
                <a href="#" className="football_social_icon" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="football_footer_links_container">
            <div className="football_footer_links">
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

            <div className="football_footer_links">
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

            <div className="football_footer_links">
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

            <div className="football_footer_links">
              <h4>Contacto</h4>
              <ul className="football_contact_info">
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

      <div className="football_footer_bottom">
        <div className="football_footer_bottom_content">
          <div className="football_footer_copyright">
            <p>© 2025 NeyFut - Todos los derechos reservados-Alejandro Rosero</p>
          </div>
          <div className="football_footer_legal">
            <a href="#">Politica de privacidad</a>
            <a href="#">Terminos de servicio</a>
            <a href="#">Politica Cookie</a>
            <a href="#">Accessibilidad</a>
          </div>
        </div>
      </div>

      <div className="football_footer_pattern"></div>
    </footer>
  )
}

export default FootballFooter
