"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import debounce from "lodash.debounce"
import FootballFooter from "./FootballFooter" 
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js"
import { Radar, Bar } from "react-chartjs-2"
import "./partidos.css"

// Registrar componentes de Chart.js
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
)

const Partidos = () => {
  // Estados para tema
  const [temaDark, setTemaDark] = useState(false)
  const [temaEquipo, setTemaEquipo] = useState(null)

  // Estados para partidos y paginación
  const [partidos, setPartidos] = useState([])
  const [proximosPartidos, setProximosPartidos] = useState([])
  const [cargandoPartidos, setCargandoPartidos] = useState(true)
  const [paginaActual, setPaginaActual] = useState(1)
  const partidosPorPagina = 5
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null)
  const [estadisticasPartido, setEstadisticasPartido] = useState(null)
  const [timelinePartido, setTimelinePartido] = useState([])

  // Estados para clasificación
  const [clasificacion, setClasificacion] = useState([])
  const [cargandoClasificacion, setCargandoClasificacion] = useState(true)

  // Estados para jugadores
  const [jugador, setJugador] = useState(null)
  const [jugadoresEquipo, setJugadoresEquipo] = useState([])
  const [cargandoJugadores, setCargandoJugadores] = useState(false)
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null)
  const [jugadoresComparacion, setJugadoresComparacion] = useState([])
  const [historialTransferencias, setHistorialTransferencias] = useState([])

  // Estados para buscador de equipos
  const [equipoBuscado, setEquipoBuscado] = useState("")
  const [equiposEncontrados, setEquiposEncontrados] = useState([])
  const [cargandoEquipos, setCargandoEquipos] = useState(false)
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false)
  const [equiposFavoritos, setEquiposFavoritos] = useState([])
  const [jugadoresFavoritos, setJugadoresFavoritos] = useState([])

  // Estados para filtros
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroEquipo, setFiltroEquipo] = useState("")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Estados para pestañas y navegación
  const [pestañaActiva, setPestañaActiva] = useState("partidos")
  const [subPestañaActiva, setSubPestañaActiva] = useState("resultados")
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)

  // Referencias para animaciones
  const partidosRef = useRef(null)
  const jugadoresRef = useRef(null)

  // Estados adicionales
  const [jugadoresEncontrados, setJugadoresEncontrados] = useState([])
  const [jugadorBuscado, setJugadorBuscado] = useState("")
  const [mostrarBuscadorJugadores, setMostrarBuscadorJugadores] = useState(false)
  const [partidosEquipo, setPartidosEquipo] = useState([])
  const [equipoPartidosBuscado, setEquipoPartidosBuscado] = useState(null)
  const [mostrarBuscadorPartidos, setMostrarBuscadorPartidos] = useState(false)

  // Estado para las búsquedas
  const [busquedaPartido, setBusquedaPartido] = useState("")
  const [busquedaJugador, setBusquedaJugador] = useState("")
  const [resultadosBusquedaPartidos, setResultadosBusquedaPartidos] = useState([])
  const [resultadosBusquedaJugadores, setResultadosBusquedaJugadores] = useState([])
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false)

  // Estado para manejar errores
  const [error, setError] = useState(null)

  // Estado para las nuevas funcionalidades de búsqueda
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false)

  // Efecto para cargar tema desde localStorage
  useEffect(() => {
    const temaGuardado = localStorage.getItem("tema")
    if (temaGuardado === "dark") {
      setTemaDark(true)
      document.documentElement.classList.add("dark-theme")
    }

    // Cargar favoritos
    const equiposFavoritosGuardados = localStorage.getItem("equiposFavoritos")
    if (equiposFavoritosGuardados) {
      setEquiposFavoritos(JSON.parse(equiposFavoritosGuardados))
    }

    const jugadoresFavoritosGuardados = localStorage.getItem("jugadoresFavoritos")
    if (jugadoresFavoritosGuardados) {
      setJugadoresFavoritos(JSON.parse(jugadoresFavoritosGuardados))
    }
  }, [])

  // Cambiar tema
  const toggleTema = () => {
    setTemaDark(!temaDark)
    if (!temaDark) {
      document.documentElement.classList.add("dark-theme")
      localStorage.setItem("tema", "dark")
    } else {
      document.documentElement.classList.remove("dark-theme")
      localStorage.setItem("tema", "light")
    }
  }

  // Configurar tema para Chart.js
  useEffect(() => {
    // Actualizar colores de gráficos según el tema
    const textColor = temaDark ? "#e8eaed" : "#202124"
    const gridColor = temaDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

    ChartJS.defaults.color = textColor
    ChartJS.defaults.scale.grid.color = gridColor
    ChartJS.defaults.scale.ticks.color = textColor
  }, [temaDark])

  // Aplicar tema de equipo
  const aplicarTemaEquipo = (equipo) => {
    if (!equipo) return

    // Extraer color principal del equipo (simulado)
    const colores = {
      Barcelona: { primary: "#a50044", secondary: "#004d98" },
      "Real Madrid": { primary: "#00529f", secondary: "#ffffff" },
      "Atletico Madrid": { primary: "#d71920", secondary: "#262e62" },
      // Añadir más equipos según sea necesario
    }

    const temaEquipo = colores[equipo.name] || null
    setTemaEquipo(temaEquipo)

    if (temaEquipo) {
      document.documentElement.style.setProperty("--primary", temaEquipo.primary)
      document.documentElement.style.setProperty("--primary-dark", temaEquipo.primary)
      document.documentElement.style.setProperty("--primary-light", `${temaEquipo.primary}22`)
    } else {
      // Restaurar colores por defecto
      document.documentElement.style.removeProperty("--primary")
      document.documentElement.style.removeProperty("--primary-dark")
      document.documentElement.style.removeProperty("--primary-light")
    }
  }

  // Obtener partidos al cargar
  useEffect(() => {
    const obtenerPartidos = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
          params: { league: "140", season: "2023", last: "20" }, // La Liga, últimos 20 partidos
          headers: {
            "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        }
        const response = await axios.request(options)
        setPartidos(response.data.response)
      } catch (error) {
        console.error("Error al obtener partidos:", error)
      } finally {
        setCargandoPartidos(false)
      }
    }

    const obtenerProximosPartidos = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
          params: { league: "140", season: "2023", next: "10" }, // La Liga, próximos 10 partidos
          headers: {
            "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        }
        const response = await axios.request(options)
        setProximosPartidos(response.data.response)
      } catch (error) {
        console.error("Error al obtener próximos partidos:", error)
      }
    }

    const obtenerClasificacion = async () => {
      setCargandoClasificacion(true)
      try {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v3/standings",
          params: { league: "140", season: "2023" }, // La Liga
          headers: {
            "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        }
        const response = await axios.request(options)
        if (response.data.response[0]?.league?.standings[0]) {
          setClasificacion(response.data.response[0].league.standings[0])
        }
      } catch (error) {
        console.error("Error al obtener clasificación:", error)
      } finally {
        setCargandoClasificacion(false)
      }
    }

    obtenerPartidos()
    obtenerProximosPartidos()
    obtenerClasificacion()
  }, [])

  // Obtener estadísticas de partido
  const obtenerEstadisticasPartido = async (fixtureId) => {
    try {
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics",
        params: { fixture: fixtureId },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const response = await axios.request(options)
      return response.data.response
    } catch (error) {
      console.error("Error al obtener estadísticas del partido:", error)
      return null
    }
  }

  // Obtener timeline de partido
  const obtenerTimelinePartido = async (fixtureId) => {
    try {
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/events",
        params: { fixture: fixtureId },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const response = await axios.request(options)
      return response.data.response
    } catch (error) {
      console.error("Error al obtener timeline del partido:", error)
      return []
    }
  }

  // Seleccionar partido para ver detalles
  const seleccionarPartido = async (partido) => {
    try {
      setPartidoSeleccionado(partido)
      setPestañaActiva("partido")

      // Obtener estadísticas con manejo de errores
      try {
        const estadisticas = await obtenerEstadisticasPartido(partido.fixture.id)
        setEstadisticasPartido(estadisticas || [])
      } catch (error) {
        console.error("Error al obtener estadísticas:", error)
        setEstadisticasPartido([])
        mostrarNotificacion("No se pudieron cargar las estadísticas del partido", "error")
      }

      // Obtener timeline con manejo de errores
      try {
        const timeline = await obtenerTimelinePartido(partido.fixture.id)
        setTimelinePartido(timeline || [])
      } catch (error) {
        console.error("Error al obtener timeline:", error)
        setTimelinePartido([])
        mostrarNotificacion("No se pudo cargar la línea de tiempo del partido", "error")
      }
    } catch (error) {
      console.error("Error al seleccionar partido:", error)
      mostrarNotificacion("Ocurrió un error al cargar los detalles del partido", "error")
    }
  }

  // Debounce para autocompletado de equipos
  const buscarEquiposDebounced = useCallback(
    debounce(async (nombre) => {
      if (!nombre.trim()) {
        setEquiposEncontrados([])
        return
      }

      setCargandoEquipos(true)
      try {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v3/teams",
          params: { name: nombre },
          headers: {
            "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        }
        const response = await axios.request(options)
        setEquiposEncontrados(response.data.response)
      } catch (error) {
        console.error("Error al buscar equipos:", error)
      } finally {
        setCargandoEquipos(false)
      }
    }, 500),
    [],
  )

  const buscarPartidosPorEquipo = async (equipoId) => {
    if (!equipoId) return []

    setCargandoPartidos(true)
    try {
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
        params: { team: equipoId, season: "2023", last: "10" },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const response = await axios.request(options)
      return response.data.response
    } catch (error) {
      console.error("Error al buscar partidos por equipo:", error)
      mostrarNotificacion("Error al buscar partidos", "error")
      return []
    } finally {
      setCargandoPartidos(false)
    }
  }

  const buscarJugadoresPorNombre = useCallback(
    debounce(async (nombre) => {
      if (!nombre.trim()) {
        setJugadoresEncontrados([])
        return
      }

      setCargandoJugadores(true)
      try {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v3/players",
          params: { search: nombre, league: "140", season: "2023" },
          headers: {
            "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        }
        const response = await axios.request(options)
        setJugadoresEncontrados(response.data.response)
      } catch (error) {
        console.error("Error al buscar jugadores:", error)
        mostrarNotificacion("Error al buscar jugadores", "error")
      } finally {
        setCargandoJugadores(false)
      }
    }, 500),
    [],
  )

  // Manejar cambio en el buscador de equipos
  const handleChangeEquipo = (e) => {
    setEquipoBuscado(e.target.value)
    buscarEquiposDebounced(e.target.value)
    setMostrarSugerencias(true)
  }

  // Seleccionar equipo del buscador
  const seleccionarEquipo = (equipo) => {
    setEquipoBuscado(equipo.team.name)
    setEquipoSeleccionado(equipo.team)
    setMostrarSugerencias(false)
    obtenerJugadoresEquipo(equipo.team.id)
    setPestañaActiva("equipos")
    aplicarTemaEquipo(equipo.team)
  }

  // Obtener jugadores de un equipo
  const obtenerJugadoresEquipo = async (teamId) => {
    setCargandoJugadores(true)
    try {
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/players",
        params: { team: teamId, season: "2023" },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const response = await axios.request(options)
      setJugadoresEquipo(response.data.response)
    } catch (error) {
      console.error("Error al obtener jugadores:", error)
    } finally {
      setCargandoJugadores(false)
    }
  }

  // Buscar estadísticas de jugador
  const buscarJugador = async (jugadorId) => {
    if (!jugadorId) return
    setCargandoJugadores(true)
    try {
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/players",
        params: { id: jugadorId, season: "2023" },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const response = await axios.request(options)
      setJugador(response.data.response[0])

      // Obtener historial de transferencias
      obtenerHistorialTransferencias(jugadorId)

      setPestañaActiva("jugador")
    } catch (error) {
      console.error("Error al buscar jugador:", error)
    } finally {
      setCargandoJugadores(false)
    }
  }

  // Obtener historial de transferencias
  const obtenerHistorialTransferencias = async (jugadorId) => {
    try {
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/transfers",
        params: { player: jugadorId },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const response = await axios.request(options)
      if (response.data.response && response.data.response.length > 0) {
        setHistorialTransferencias(response.data.response[0].transfers)
      }
    } catch (error) {
      console.error("Error al obtener historial de transferencias:", error)
    }
  }

  // Añadir jugador a comparación
  const añadirJugadorComparacion = (jugador) => {
    if (jugadoresComparacion.length < 2 && !jugadoresComparacion.find((j) => j.player.id === jugador.player.id)) {
      setJugadoresComparacion([...jugadoresComparacion, jugador])
      if (jugadoresComparacion.length === 1) {
        setPestañaActiva("comparacion")
      }
    }
  }

  // Quitar jugador de comparación
  const quitarJugadorComparacion = (jugadorId) => {
    setJugadoresComparacion(jugadoresComparacion.filter((j) => j.player.id !== jugadorId))
  }

  // Gestionar favoritos
  const toggleEquipoFavorito = (equipo) => {
    const esFavorito = equiposFavoritos.some((e) => e.id === equipo.id)
    let nuevosFavoritos

    if (esFavorito) {
      nuevosFavoritos = equiposFavoritos.filter((e) => e.id !== equipo.id)
    } else {
      nuevosFavoritos = [...equiposFavoritos, equipo]
    }

    setEquiposFavoritos(nuevosFavoritos)
    localStorage.setItem("equiposFavoritos", JSON.stringify(nuevosFavoritos))

    // Mostrar notificación
    mostrarNotificacion(esFavorito ? `${equipo.name} eliminado de favoritos` : `${equipo.name} añadido a favoritos`)
  }

  const toggleJugadorFavorito = (jugador) => {
    const esFavorito = jugadoresFavoritos.some((j) => j.id === jugador.player.id)
    let nuevosFavoritos

    if (esFavorito) {
      nuevosFavoritos = jugadoresFavoritos.filter((j) => j.id !== jugador.player.id)
    } else {
      nuevosFavoritos = [
        ...jugadoresFavoritos,
        {
          id: jugador.player.id,
          name: jugador.player.name,
          photo: jugador.player.photo,
          team: jugador.statistics[0].team,
        },
      ]
    }

    setJugadoresFavoritos(nuevosFavoritos)
    localStorage.setItem("jugadoresFavoritos", JSON.stringify(nuevosFavoritos))

    // Mostrar notificación
    mostrarNotificacion(
      esFavorito ? `${jugador.player.name} eliminado de favoritos` : `${jugador.player.name} añadido a favoritos`,
    )
  }

  // Notificaciones
  const [notificaciones, setNotificaciones] = useState([])

  const mostrarNotificacion = (mensaje, tipo = "info") => {
    const id = Date.now()
    setNotificaciones([...notificaciones, { id, mensaje, tipo }])

    // Auto eliminar después de 3 segundos
    setTimeout(() => {
      setNotificaciones((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  // Compartir
  const compartir = (tipo, id, nombre) => {
    // Crear URL para compartir
    const url = `${window.location.origin}/futbol/${tipo}/${id}`

    // Intentar usar la API de compartir si está disponible
    if (navigator.share) {
      navigator
        .share({
          title: `Estadísticas de fútbol - ${nombre}`,
          text: `Mira las estadísticas de ${nombre}`,
          url: url,
        })
        .catch((error) => console.log("Error compartiendo", error))
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard
        .writeText(url)
        .then(() => mostrarNotificacion("Enlace copiado al portapapeles"))
        .catch((err) => console.error("Error al copiar: ", err))
    }
  }

  // Exportar datos
  const exportarDatos = (datos, nombreArchivo) => {
    // Convertir a CSV o JSON
    const jsonString = JSON.stringify(datos, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    // Crear enlace de descarga
    const a = document.createElement("a")
    a.href = url
    a.download = `${nombreArchivo}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    mostrarNotificacion(`Datos exportados como ${nombreArchivo}.json`)
  }

  // Filtrar partidos
  const filtrarPartidos = () => {
    let partidosFiltrados = [...partidos]

    if (filtroFecha) {
      const fechaFiltro = new Date(filtroFecha)
      partidosFiltrados = partidosFiltrados.filter((partido) => {
        const fechaPartido = new Date(partido.fixture.date)
        return fechaPartido.toDateString() === fechaFiltro.toDateString()
      })
    }

    if (filtroEquipo) {
      partidosFiltrados = partidosFiltrados.filter(
        (partido) =>
          partido.teams.home.name.toLowerCase().includes(filtroEquipo.toLowerCase()) ||
          partido.teams.away.name.toLowerCase().includes(filtroEquipo.toLowerCase()),
      )
    }

    return partidosFiltrados
  }

  // Paginación
  const partidosFiltrados = filtrarPartidos()
  const indiceUltimoPartido = paginaActual * partidosPorPagina
  const indicePrimerPartido = indiceUltimoPartido - partidosPorPagina
  const partidosActuales = partidosFiltrados.slice(indicePrimerPartido, indiceUltimoPartido)
  const totalPaginas = Math.ceil(partidosFiltrados.length / partidosPorPagina)

  // Función para formatear fecha
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Función para formatear hora
  const formatearHora = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Obtener color para forma reciente
  const getColorForma = (resultado) => {
    switch (resultado) {
      case "W":
        return "var(--secondary)" // Victoria
      case "L":
        return "var(--accent)" // Derrota
      case "D":
        return "var(--text-light)" // Empate
      default:
        return "var(--border-color)"
    }
  }

  // Preparar datos para gráficos
  const prepararDatosRadar = (jugador) => {
    if (!jugador || !jugador.statistics || !jugador.statistics[0]) return null

    const stats = jugador.statistics[0]

    return {
      labels: ["Goles", "Asistencias", "Pases", "Regates", "Duelos Ganados", "Recuperaciones"],
      datasets: [
        {
          label: jugador.player.name,
          data: [
            stats.goals?.total || 0,
            stats.goals?.assists || 0,
            stats.passes?.total ? Math.min(stats.passes.total / 100, 10) : 0, // Normalizar para el gráfico
            stats.dribbles?.success || 0,
            stats.duels?.won || 0,
            stats.tackles?.total || 0,
          ],
          backgroundColor: "rgba(66, 133, 244, 0.2)",
          borderColor: "rgb(66, 133, 244)",
          pointBackgroundColor: "rgb(66, 133, 244)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(66, 133, 244)",
        },
      ],
    }
  }

  const prepararDatosComparacion = () => {
    if (jugadoresComparacion.length !== 2) return null

    const jugador1 = jugadoresComparacion[0]
    const jugador2 = jugadoresComparacion[1]

    const stats1 = jugador1.statistics[0]
    const stats2 = jugador2.statistics[0]

    return {
      labels: ["Goles", "Asistencias", "Partidos", "Minutos", "Tarjetas Amarillas", "Tarjetas Rojas"],
      datasets: [
        {
          label: jugador1.player.name,
          data: [
            stats1.goals?.total || 0,
            stats1.goals?.assists || 0,
            stats1.games?.appearences || 0,
            stats1.games?.minutes || 0,
            stats1.cards?.yellow || 0,
            stats1.cards?.red || 0,
          ],
          backgroundColor: "rgba(66, 133, 244, 0.5)",
          borderColor: "rgb(66, 133, 244)",
          borderWidth: 1,
        },
        {
          label: jugador2.player.name,
          data: [
            stats2.goals?.total || 0,
            stats2.goals?.assists || 0,
            stats2.games?.appearences || 0,
            stats2.games?.minutes || 0,
            stats2.cards?.yellow || 0,
            stats2.cards?.red || 0,
          ],
          backgroundColor: "rgba(234, 67, 53, 0.5)",
          borderColor: "rgb(234, 67, 53)",
          borderWidth: 1,
        },
      ],
    }
  }

  const prepararDatosEstadisticasPartido = () => {
    if (!estadisticasPartido || !Array.isArray(estadisticasPartido) || estadisticasPartido.length < 2) {
      return {
        labels: ["No hay datos disponibles"],
        datasets: [],
      }
    }

    const equipoLocal = estadisticasPartido[0]
    const equipoVisitante = estadisticasPartido[1]

    if (!equipoLocal || !equipoVisitante || !equipoLocal.statistics || !equipoVisitante.statistics) {
      return {
        labels: ["No hay datos disponibles"],
        datasets: [],
      }
    }

    // Buscar estadísticas comunes
    const posesionLocal = equipoLocal.statistics.find((s) => s.type === "Ball Possession")?.value || "0%"
    const posesionVisitante = equipoVisitante.statistics.find((s) => s.type === "Ball Possession")?.value || "0%"

    const tirosLocal = equipoLocal.statistics.find((s) => s.type === "Total Shots")?.value || "0"
    const tirosVisitante = equipoVisitante.statistics.find((s) => s.type === "Total Shots")?.value || "0"

    const tirosPuertaLocal = equipoLocal.statistics.find((s) => s.type === "Shots on Goal")?.value || "0"
    const tirosPuertaVisitante = equipoVisitante.statistics.find((s) => s.type === "Shots on Goal")?.value || "0"

    const cornersLocal = equipoLocal.statistics.find((s) => s.type === "Corner Kicks")?.value || "0"
    const cornersVisitante = equipoVisitante.statistics.find((s) => s.type === "Corner Kicks")?.value || "0"

    const faltasLocal = equipoLocal.statistics.find((s) => s.type === "Fouls")?.value || "0"
    const faltasVisitante = equipoVisitante.statistics.find((s) => s.type === "Fouls")?.value || "0"

    return {
      labels: ["Posesión (%)", "Tiros", "Tiros a puerta", "Córners", "Faltas"],
      datasets: [
        {
          label: equipoLocal.team.name,
          data: [
            Number.parseInt(posesionLocal) || 0,
            Number.parseInt(tirosLocal) || 0,
            Number.parseInt(tirosPuertaLocal) || 0,
            Number.parseInt(cornersLocal) || 0,
            Number.parseInt(faltasLocal) || 0,
          ],
          backgroundColor: "rgba(66, 133, 244, 0.5)",
          borderColor: "rgb(66, 133, 244)",
          borderWidth: 1,
        },
        {
          label: equipoVisitante.team.name,
          data: [
            Number.parseInt(posesionVisitante) || 0,
            Number.parseInt(tirosVisitante) || 0,
            Number.parseInt(tirosPuertaVisitante) || 0,
            Number.parseInt(cornersVisitante) || 0,
            Number.parseInt(faltasVisitante) || 0,
          ],
          backgroundColor: "rgba(234, 67, 53, 0.5)",
          borderColor: "rgb(234, 67, 53)",
          borderWidth: 1,
        },
      ],
    }
  }

  // Opciones para gráficos
  const opcionesRadar = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 100,
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  }

  const opcionesBarras = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 100,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Comparación de Estadísticas",
      },
    },
  }

  // Manejadores para los buscadores
  const handleChangeJugador = (e) => {
    setJugadorBuscado(e.target.value)
    buscarJugadoresPorNombre(e.target.value)
  }

  const seleccionarJugadorBuscado = (jugador) => {
    buscarJugador(jugador.player.id)
    setJugadorBuscado("")
    setJugadoresEncontrados([])
    setMostrarBuscadorJugadores(false)
  }

  const buscarPartidosEquipo = async (equipo) => {
    setEquipoPartidosBuscado(equipo)
    const partidos = await buscarPartidosPorEquipo(equipo.id)
    setPartidosEquipo(partidos)
    setSubPestañaActiva("equipo-partidos")
    setPestañaActiva("partidos")
  }

  // Función para buscar partidos por equipo
  const buscarPartidosPorEquipoNombre = async (nombreEquipo) => {
    try {
      setCargandoBusqueda(true)
      setError(null)

      // Primero buscamos el ID del equipo
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/teams",
        params: { name: nombreEquipo },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const respuestaEquipo = await axios.request(options)

      if (respuestaEquipo.data.response.length === 0) {
        mostrarNotificacion(`No se encontró ningún equipo con el nombre "${nombreEquipo}"`, "error")
        setCargandoBusqueda(false)
        return
      }

      const equipoId = respuestaEquipo.data.response[0].team.id

      // Ahora buscamos los partidos de ese equipo
      const optionsPartidos = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
        params: { team: equipoId, last: "10" },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const respuestaPartidos = await axios.request(optionsPartidos)

      setResultadosBusquedaPartidos(respuestaPartidos.data.response)
      setMostrarResultadosBusqueda(true)
      setCargandoBusqueda(false)
    } catch (error) {
      console.error("Error al buscar partidos:", error)
      mostrarNotificacion("No se pudieron buscar los partidos. Por favor, inténtalo de nuevo.", "error")
      setCargandoBusqueda(false)
    }
  }

  // Función para buscar jugadores por nombre
  const buscarJugadorPorNombre = async (nombreJugador) => {
    try {
      setCargandoBusqueda(true)
      setError(null)

      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/players",
        params: { search: nombreJugador },
        headers: {
          "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      }
      const respuestaJugador = await axios.request(options)

      if (respuestaJugador.data.response.length === 0) {
        mostrarNotificacion(`No se encontró ningún jugador con el nombre "${nombreJugador}"`, "error")
        setCargandoBusqueda(false)
        return
      }

      setResultadosBusquedaJugadores(respuestaJugador.data.response)
      setMostrarResultadosBusqueda(true)
      setCargandoBusqueda(false)
    } catch (error) {
      console.error("Error al buscar jugadores:", error)
      mostrarNotificacion("No se pudieron buscar los jugadores. Por favor, inténtalo de nuevo.", "error")
      setCargandoBusqueda(false)
    }
  }

  // Función para manejar la búsqueda
  const manejarBusqueda = (tipo) => {
    if (tipo === "partido" && busquedaPartido.trim()) {
      buscarPartidosPorEquipoNombre(busquedaPartido)
    } else if (tipo === "jugador" && busquedaJugador.trim()) {
      buscarJugadorPorNombre(busquedaJugador)
    }
  }

  // Función para mostrar detalles del partido
  const mostrarDetallesPartido = async (partido) => {
    try {
      setCargandoPartidos(true)
      setError(null)

      // Guardar el partido actual antes de cargar los detalles
      const partidoActual = partido

      // Cargar estadísticas del partido
      let estadisticas = null
      try {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics",
          params: { fixture: partido.fixture.id },
          headers: {
            "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        }
        const respuestaEstadisticas = await axios.request(options)
        estadisticas = respuestaEstadisticas.data.response
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
        mostrarNotificacion("Error al cargar estadísticas del partido", "error")
        // No lanzamos el error, solo lo registramos para que la función continúe
      }

      // Cargar eventos del partido (timeline)
      let eventos = null
      try {
        const options = {
          method: "GET",
          url: "https://api-football-v1.p.rapidapi.com/v3/fixtures/events",
          params: { fixture: partido.fixture.id },
          headers: {
            "X-RapidAPI-Key": "3c5001e238msh35cad7441ba376ap143b95jsnfcea68aedeb4",
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
        }
        const respuestaEventos = await axios.request(options)
        eventos = respuestaEventos.data.response
      } catch (error) {
        console.error("Error al cargar eventos:", error)
        mostrarNotificacion("Error al cargar eventos del partido", "error")
        // No lanzamos el error, solo lo registramos para que la función continúe
      }

      // Establecer los datos incluso si alguna parte falló
      setPartidoSeleccionado(partidoActual)
      setEstadisticasPartido(estadisticas || [])
      setTimelinePartido(eventos || [])
      setPestañaActiva("partido")
      setCargandoPartidos(false)
    } catch (error) {
      console.error("Error al mostrar detalles del partido:", error)
      mostrarNotificacion("No se pudieron cargar los detalles del partido. Por favor, inténtalo de nuevo.", "error")
      setCargandoPartidos(false)
    }
  }

  return (
    <div className={`futbol-app ${temaDark ? "dark-theme" : ""}`}>
      <header className="app-header">
        <div className="header-top">
          <button className="menu-button" onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}>
            ☰
          </button>

          <h1>⚽ Fútbol Stats Pro</h1>

          <div className="header-actions">
            <button className="icon-button" onClick={toggleTema} aria-label="Cambiar tema">
              {temaDark ? "☀️" : "🌙"}
            </button>
            <button className="icon-button" onClick={() => setPestañaActiva("favoritos")} aria-label="Ver favoritos">
              ❤️
            </button>
            <button
              className="icon-button"
              onClick={() => setPestañaActiva("configuracion")}
              aria-label="Configuración"
            >
              ⚙️
            </button>
          </div>
        </div>

        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              value={equipoBuscado}
              onChange={handleChangeEquipo}
              onFocus={() => setMostrarSugerencias(true)}
              placeholder="Buscar equipo..."
              className="search-input"
            />
            <span className="search-icon">🔍</span>
            {cargandoEquipos && <div className="loader"></div>}
          </div>

          {/* Sugerencias de autocompletado */}
          {mostrarSugerencias && equiposEncontrados.length > 0 && (
            <ul className="search-suggestions">
              {equiposEncontrados.map((equipo) => (
                <li key={equipo.team.id} onClick={() => seleccionarEquipo(equipo)} className="suggestion-item">
                  <img
                    src={equipo.team.logo || "/placeholder.svg?height=24&width=24"}
                    alt={equipo.team.name}
                    className="team-logo-small"
                  />
                  <span>{equipo.team.name}</span>
                  <span className="country-tag">{equipo.team.country}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {/* Agregar los nuevos componentes de búsqueda después del header y antes de los tabs */}
      {mostrarBuscadorJugadores && (
        <div className="buscador-flotante">
          <div className="buscador-header">
            <h3>Buscar Jugador</h3>
            <button className="close-button" onClick={() => setMostrarBuscadorJugadores(false)}>
              ❌
            </button>
          </div>
          <div className="search-box">
            <input
              type="text"
              value={jugadorBuscado}
              onChange={handleChangeJugador}
              placeholder="Nombre del jugador..."
              className="search-input"
              autoFocus
            />
            <span className="search-icon">🔍</span>
            {cargandoJugadores && <div className="loader"></div>}
          </div>

          {jugadoresEncontrados.length > 0 ? (
            <ul className="search-suggestions">
              {jugadoresEncontrados.map((jugador) => (
                <li
                  key={jugador.player.id}
                  onClick={() => seleccionarJugadorBuscado(jugador)}
                  className="suggestion-item"
                >
                  <img
                    src={jugador.player.photo || "/placeholder.svg?height=24&width=24"}
                    alt={jugador.player.name}
                    className="team-logo-small"
                  />
                  <span>{jugador.player.name}</span>
                  <span className="country-tag">{jugador.statistics[0]?.team?.name || "Desconocido"}</span>
                </li>
              ))}
            </ul>
          ) : jugadorBuscado && !cargandoJugadores ? (
            <div className="no-results">No se encontraron jugadores con ese nombre</div>
          ) : null}
        </div>
      )}

      {mostrarBuscadorPartidos && (
        <div className="buscador-flotante">
          <div className="buscador-header">
            <h3>Buscar Partidos por Equipo</h3>
            <button className="close-button" onClick={() => setMostrarBuscadorPartidos(false)}>
              ❌
            </button>
          </div>
          <div className="search-box">
            <input
              type="text"
              value={equipoBuscado}
              onChange={handleChangeEquipo}
              placeholder="Nombre del equipo..."
              className="search-input"
              autoFocus
            />
            <span className="search-icon">🔍</span>
            {cargandoEquipos && <div className="loader"></div>}
          </div>

          {equiposEncontrados.length > 0 ? (
            <ul className="search-suggestions">
              {equiposEncontrados.map((equipo) => (
                <li
                  key={equipo.team.id}
                  onClick={() => {
                    buscarPartidosEquipo(equipo.team)
                    setMostrarBuscadorPartidos(false)
                  }}
                  className="suggestion-item"
                >
                  <img
                    src={equipo.team.logo || "/placeholder.svg?height=24&width=24"}
                    alt={equipo.team.name}
                    className="team-logo-small"
                  />
                  <span>{equipo.team.name}</span>
                  <span className="country-tag">{equipo.team.country}</span>
                </li>
              ))}
            </ul>
          ) : equipoBuscado && !cargandoEquipos ? (
            <div className="no-results">No se encontraron equipos con ese nombre</div>
          ) : null}
        </div>
      )}

      <nav className="tabs">
        <div className="tabs-actions">
          
        </div>
        <button
          className={`tab ${pestañaActiva === "partidos" ? "active" : ""}`}
          onClick={() => setPestañaActiva("partidos")}
        >
          📅 Partidos
        </button>
        <button
          className={`tab ${pestañaActiva === "clasificacion" ? "active" : ""}`}
          onClick={() => setPestañaActiva("clasificacion")}
        >
          🏆 Clasificación
        </button>
        <button
          className={`tab ${pestañaActiva === "equipos" ? "active" : ""}`}
          onClick={() => setPestañaActiva("equipos")}
          disabled={!equipoSeleccionado}
        >
          👥 Equipo
        </button>
        <button
          className={`tab ${pestañaActiva === "jugador" ? "active" : ""}`}
          onClick={() => setPestañaActiva("jugador")}
          disabled={!jugador}
        >
          👤 Jugador
        </button>
        <button
          className={`tab ${pestañaActiva === "partido" ? "active" : ""}`}
          onClick={() => setPestañaActiva("partido")}
          disabled={!partidoSeleccionado}
        >
          📊 Partido
        </button>
        <button
          className={`tab ${pestañaActiva === "comparacion" ? "active" : ""}`}
          onClick={() => setPestañaActiva("comparacion")}
          disabled={jugadoresComparacion.length < 1}
        >
          📊 Comparación
        </button>
      </nav>

      {/* Buscadores */}
      <div className="buscadores-container">
        <div className="buscador">
          <h3>Buscar partidos por equipo</h3>
          <div className="input-group">
            <input
              type="text"
              value={busquedaPartido}
              onChange={(e) => setBusquedaPartido(e.target.value)}
              placeholder="Nombre del equipo (ej. Barcelona)"
              className="search-input"
            />
            <button onClick={() => manejarBusqueda("partido")} className="search-button" disabled={cargandoBusqueda}>
              {cargandoBusqueda && busquedaPartido ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        <div className="buscador">
          <h3>Buscar jugador</h3>
          <div className="input-group">
            <input
              type="text"
              value={busquedaJugador}
              onChange={(e) => setBusquedaJugador(e.target.value)}
              placeholder="Nombre del jugador (ej. Messi)"
              className="search-input"
            />
            <button onClick={() => manejarBusqueda("jugador")} className="search-button" disabled={cargandoBusqueda}>
              {cargandoBusqueda && busquedaJugador ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {mostrarResultadosBusqueda && (
        <div className="resultados-busqueda">
          {resultadosBusquedaPartidos.length > 0 && (
            <div className="seccion-resultados">
              <h3>Resultados de partidos</h3>
              <div className="partidos-grid">
                {resultadosBusquedaPartidos.map((partido) => (
                  <div
                    key={partido.fixture.id}
                    className="partido-card"
                    onClick={() => mostrarDetallesPartido(partido)}
                  >
                    <div className="equipos">
                      <div className="equipo">
                        <img
                          src={partido.teams.home.logo || "/placeholder.svg"}
                          alt={partido.teams.home.name}
                          className="equipo-logo"
                        />
                        <span>{partido.teams.home.name}</span>
                      </div>
                      <div className="resultado">
                        <span>
                          {partido.goals.home} - {partido.goals.away}
                        </span>
                      </div>
                      <div className="equipo">
                        <img
                          src={partido.teams.away.logo || "/placeholder.svg"}
                          alt={partido.teams.away.name}
                          className="equipo-logo"
                        />
                        <span>{partido.teams.away.name}</span>
                      </div>
                    </div>
                    <div className="partido-info">
                      <span>{new Date(partido.fixture.date).toLocaleDateString()}</span>
                      <button
                        className="ver-detalles"
                        onClick={(e) => {
                          e.stopPropagation()
                          mostrarDetallesPartido(partido)
                        }}
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resultadosBusquedaJugadores.length > 0 && (
            <div className="seccion-resultados">
              <h3>Resultados de jugadores</h3>
              <div className="jugadores-grid">
                {resultadosBusquedaJugadores.map((jugador) => (
                  <div
                    key={jugador.player.id}
                    className="jugador-card"
                    onClick={() => buscarJugador(jugador.player.id)}
                  >
                    <div className="jugador-imagen">
                      <img
                        src={jugador.player.photo || "/placeholder.svg?height=150&width=150"}
                        alt={jugador.player.name}
                        className="jugador-foto"
                      />
                    </div>
                    <div className="jugador-info">
                      <h4>{jugador.player.name}</h4>
                      <p>Edad: {jugador.player.age}</p>
                      <p>Nacionalidad: {jugador.player.nationality}</p>
                      {jugador.statistics && jugador.statistics[0] && <p>Equipo: {jugador.statistics[0].team.name}</p>}
                      <button
                        className="ver-detalles"
                        onClick={(e) => {
                          e.stopPropagation()
                          buscarJugador(jugador.player.id)
                        }}
                      >
                        Ver estadísticas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            className="cerrar-resultados"
            onClick={() => {
              setMostrarResultadosBusqueda(false)
              setResultadosBusquedaPartidos([])
              setResultadosBusquedaJugadores([])
            }}
          >
            Cerrar resultados
          </button>
        </div>
      )}

      <main className="content" ref={partidosRef}>
        {/* Sección de Partidos */}
        {pestañaActiva === "partidos" && (
          <section className="section-partidos">
            <div className="section-header">
              <h2 className="section-title">Partidos de La Liga</h2>
              <div className="section-actions">
                <button
                  className="action-button"
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  aria-label="Filtrar partidos"
                >
                  🔍
                </button>
                <button
                  className="action-button"
                  onClick={() => setMostrarBuscadorPartidos(!mostrarBuscadorPartidos)}
                  aria-label="Buscar partidos por equipo"
                >
                  ⚽
                </button>
              </div>
            </div>

            {/* Buscador de partidos por equipo */}
            {mostrarBuscadorPartidos && (
              <div className="buscador-partidos">
                <input
                  type="text"
                  placeholder="Buscar partidos por equipo..."
                  value={equipoBuscado}
                  onChange={handleChangeEquipo}
                  onFocus={() => setMostrarSugerencias(true)}
                  className="search-input"
                />
                {mostrarSugerencias && equiposEncontrados.length > 0 && (
                  <ul className="search-suggestions">
                    {equiposEncontrados.map((equipo) => (
                      <li
                        key={equipo.team.id}
                        onClick={() => buscarPartidosEquipo(equipo.team)}
                        className="suggestion-item"
                      >
                        <img
                          src={equipo.team.logo || "/placeholder.svg?height=24&width=24"}
                          alt={equipo.team.name}
                          className="team-logo-small"
                        />
                        <span>{equipo.team.name}</span>
                        <span className="country-tag">{equipo.team.country}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Filtros */}
            {mostrarFiltros && (
              <div className="filtros-container">
                <div className="filtro">
                  <label htmlFor="filtro-fecha">Fecha:</label>
                  <input
                    type="date"
                    id="filtro-fecha"
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className="filtro-input"
                  />
                </div>
                <div className="filtro">
                  <label htmlFor="filtro-equipo">Equipo:</label>
                  <input
                    type="text"
                    id="filtro-equipo"
                    value={filtroEquipo}
                    onChange={(e) => setFiltroEquipo(e.target.value)}
                    placeholder="Nombre del equipo"
                    className="filtro-input"
                  />
                </div>
                <button
                  className="filtro-reset"
                  onClick={() => {
                    setFiltroFecha("")
                    setFiltroEquipo("")
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Pestañas de partidos */}
            <div className="subtabs">
              <button
                className={`subtab ${subPestañaActiva === "resultados" ? "active" : ""}`}
                onClick={() => setSubPestañaActiva("resultados")}
              >
                Resultados
              </button>
              <button
                className={`subtab ${subPestañaActiva === "proximos" ? "active" : ""}`}
                onClick={() => setSubPestañaActiva("proximos")}
              >
                Próximos partidos
              </button>
              <button
                className={`subtab ${subPestañaActiva === "equipo-partidos" ? "active" : ""}`}
                onClick={() => setSubPestañaActiva("equipo-partidos")}
                disabled={!equipoPartidosBuscado}
              >
                Partidos por Equipo
              </button>
            </div>

            {subPestañaActiva === "resultados" && (
              <>
                {cargandoPartidos ? (
                  <div className="loading-container">
                    <div className="loader"></div>
                    <p>Cargando partidos...</p>
                  </div>
                ) : partidosActuales.length > 0 ? (
                  <>
                    <div className="partidos-list">
                      {partidosActuales.map((partido) => (
                        <div
                          key={partido.fixture.id}
                          className="partido-card"
                          onClick={() => seleccionarPartido(partido)}
                        >
                          <div className="partido-fecha">
                            <span>{formatearFecha(partido.fixture.date)}</span>
                            <span className="partido-hora">{formatearHora(partido.fixture.date)}</span>
                          </div>
                          <div className="partido-content">
                            <div className="equipo home">
                              <img
                                src={partido.teams.home.logo || "/placeholder.svg?height=50&width=50"}
                                alt={partido.teams.home.name}
                                className="team-logo"
                              />
                              <span className="team-name">{partido.teams.home.name}</span>
                            </div>

                            <div className="score-container">
                              <div className="score">
                                <span className={`score-number ${partido.teams.home.winner ? "winner" : ""}`}>
                                  {partido.goals.home}
                                </span>
                                <span className="score-separator">-</span>
                                <span className={`score-number ${partido.teams.away.winner ? "winner" : ""}`}>
                                  {partido.goals.away}
                                </span>
                              </div>
                              <div className="match-status">{partido.fixture.status.short}</div>
                            </div>

                            <div className="equipo away">
                              <img
                                src={partido.teams.away.logo || "/placeholder.svg?height=50&width=50"}
                                alt={partido.teams.away.name}
                                className="team-logo"
                              />
                              <span className="team-name">{partido.teams.away.name}</span>
                            </div>
                          </div>
                          <div className="partido-footer">
                            <span className="ver-detalles">Ver detalles</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Paginación */}
                    <div className="pagination">
                      <button
                        onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                        disabled={paginaActual === 1}
                        className="pagination-button"
                      >
                        ◀️
                      </button>

                      {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                        // Mostrar 5 páginas centradas en la actual
                        let pageNum
                        if (totalPaginas <= 5) {
                          pageNum = i + 1
                        } else {
                          const start = Math.max(1, paginaActual - 2)
                          const end = Math.min(totalPaginas, start + 4)
                          pageNum = start + i
                          if (pageNum > end) return null
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPaginaActual(pageNum)}
                            className={`pagination-button ${paginaActual === pageNum ? "active" : ""}`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                        disabled={paginaActual === totalPaginas}
                        className="pagination-button"
                      >
                        ▶️
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <p>No se encontraron partidos con los filtros actuales.</p>
                    <button
                      className="action-button"
                      onClick={() => {
                        setFiltroFecha("")
                        setFiltroEquipo("")
                      }}
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </>
            )}

            {subPestañaActiva === "proximos" && (
              <>
                {cargandoPartidos ? (
                  <div className="loading-container">
                    <div className="loader"></div>
                    <p>Cargando próximos partidos...</p>
                  </div>
                ) : (
                  <div className="partidos-list">
                    {proximosPartidos.map((partido) => (
                      <div key={partido.fixture.id} className="partido-card proximo">
                        <div className="partido-fecha">
                          <span>{formatearFecha(partido.fixture.date)}</span>
                          <span className="partido-hora">{formatearHora(partido.fixture.date)}</span>
                        </div>
                        <div className="partido-content">
                          <div className="equipo home">
                            <img
                              src={partido.teams.home.logo || "/placeholder.svg?height=50&width=50"}
                              alt={partido.teams.home.name}
                              className="team-logo"
                            />
                            <span className="team-name">{partido.teams.home.name}</span>
                          </div>

                          <div className="score-container">
                            <div className="score proximo">
                              <span className="score-vs">VS</span>
                            </div>
                            <div className="match-status">{partido.league.round}</div>
                          </div>

                          <div className="equipo away">
                            <img
                              src={partido.teams.away.logo || "/placeholder.svg?height=50&width=50"}
                              alt={partido.teams.away.name}
                              className="team-logo"
                            />
                            <span className="team-name">{partido.teams.away.name}</span>
                          </div>
                        </div>
                        <div className="partido-footer">
                          <button className="recordatorio-btn">🔔 Recordatorio</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {subPestañaActiva === "equipo-partidos" && (
              <>
                {cargandoPartidos ? (
                  <div className="loading-container">
                    <div className="loader"></div>
                    <p>Cargando partidos...</p>
                  </div>
                ) : partidosEquipo.length > 0 ? (
                  <div className="partidos-list">
                    {partidosEquipo.map((partido) => (
                      <div
                        key={partido.fixture.id}
                        className="partido-card"
                        onClick={() => seleccionarPartido(partido)}
                      >
                        <div className="partido-fecha">
                          <span>{formatearFecha(partido.fixture.date)}</span>
                          <span className="partido-hora">{formatearHora(partido.fixture.date)}</span>
                        </div>
                        <div className="partido-content">
                          <div className="equipo home">
                            <img
                              src={partido.teams.home.logo || "/placeholder.svg?height=50&width=50"}
                              alt={partido.teams.home.name}
                              className="team-logo"
                            />
                            <span className="team-name">{partido.teams.home.name}</span>
                          </div>

                          <div className="score-container">
                            <div className="score">
                              <span className={`score-number ${partido.teams.home.winner ? "winner" : ""}`}>
                                {partido.goals.home}
                              </span>
                              <span className="score-separator">-</span>
                              <span className={`score-number ${partido.teams.away.winner ? "winner" : ""}`}>
                                {partido.goals.away}
                              </span>
                            </div>
                            <div className="match-status">{partido.fixture.status.short}</div>
                          </div>

                          <div className="equipo away">
                            <img
                              src={partido.teams.away.logo || "/placeholder.svg?height=50&width=50"}
                              alt={partido.teams.away.name}
                              className="team-logo"
                            />
                            <span className="team-name">{partido.teams.away.name}</span>
                          </div>
                        </div>
                        <div className="partido-footer">
                          <span className="ver-detalles">Ver detalles</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No se encontraron partidos para este equipo.</p>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Sección de Clasificación */}
        {pestañaActiva === "clasificacion" && (
          <section className="section-clasificacion">
            <div className="section-header">
              <h2 className="section-title">Clasificación de La Liga</h2>
              <div className="section-actions">
                <button
                  className="action-button"
                  onClick={() => exportarDatos(clasificacion, "clasificacion-laliga")}
                  aria-label="Exportar clasificación"
                >
                  💾
                </button>
              </div>
            </div>

            {cargandoClasificacion ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Cargando clasificación...</p>
              </div>
            ) : (
              <div className="tabla-container">
                <table className="tabla-clasificacion">
                  <thead>
                    <tr>
                      <th className="pos-col">Pos</th>
                      <th className="equipo-col">Equipo</th>
                      <th>PJ</th>
                      <th>G</th>
                      <th>E</th>
                      <th>P</th>
                      <th>GF</th>
                      <th>GC</th>
                      <th>DG</th>
                      <th>Pts</th>
                      <th>Forma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clasificacion.map((equipo) => (
                      <tr
                        key={equipo.team.id}
                        className={`
                          ${equipo.rank <= 4 ? "champions" : ""} 
                          ${equipo.rank > 4 && equipo.rank <= 6 ? "europa" : ""} 
                          ${equipo.rank >= 18 ? "descenso" : ""}
                        `}
                        onClick={() => {
                          const equipoObj = { team: equipo.team }
                          seleccionarEquipo(equipoObj)
                        }}
                      >
                        <td className="pos-col">{equipo.rank}</td>
                        <td className="equipo-col">
                          <div className="equipo-info">
                            <img
                              src={equipo.team.logo || "/placeholder.svg?height=24&width=24"}
                              alt={equipo.team.name}
                              className="team-logo-small"
                            />
                            <span>{equipo.team.name}</span>
                          </div>
                        </td>
                        <td>{equipo.all.played}</td>
                        <td>{equipo.all.win}</td>
                        <td>{equipo.all.draw}</td>
                        <td>{equipo.all.lose}</td>
                        <td>{equipo.all.goals.for}</td>
                        <td>{equipo.all.goals.against}</td>
                        <td>{equipo.goalsDiff}</td>
                        <td className="puntos-col">{equipo.points}</td>
                        <td>
                          <div className="forma-container">
                            {equipo.form?.split("").map((resultado, index) => (
                              <span
                                key={index}
                                className="forma-indicador"
                                style={{ backgroundColor: getColorForma(resultado) }}
                                title={resultado === "W" ? "Victoria" : resultado === "L" ? "Derrota" : "Empate"}
                              >
                                {resultado}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="leyenda">
              <div className="leyenda-item champions">
                <span className="leyenda-color"></span>
                <span>Champions League</span>
              </div>
              <div className="leyenda-item europa">
                <span className="leyenda-color"></span>
                <span>Europa League</span>
              </div>
              <div className="leyenda-item descenso">
                <span className="leyenda-color"></span>
                <span>Descenso</span>
              </div>
            </div>
          </section>
        )}

        {/* Sección de Equipo y Jugadores */}
        {pestañaActiva === "equipos" && equipoSeleccionado && (
          <section className="section-equipo" ref={jugadoresRef}>
            <div className="section-header">
              <h2 className="section-title">Detalles del Equipo</h2>
              <div className="section-actions">
                <button
                  className="action-button"
                  onClick={() => toggleEquipoFavorito(equipoSeleccionado)}
                  aria-label={
                    equiposFavoritos.some((e) => e.id === equipoSeleccionado.id)
                      ? "Quitar de favoritos"
                      : "Añadir a favoritos"
                  }
                >
                  {equiposFavoritos.some((e) => e.id === equipoSeleccionado.id) ? "❤️" : "🤍"}
                </button>
                <button
                  className="action-button"
                  onClick={() => compartir("equipo", equipoSeleccionado.id, equipoSeleccionado.name)}
                  aria-label="Compartir equipo"
                >
                  📤
                </button>
              </div>
            </div>

            <div className="team-header">
              <img
                src={equipoSeleccionado.logo || "/placeholder.svg?height=100&width=100"}
                alt={equipoSeleccionado.name}
                className="team-logo-large"
              />
              <h2 className="team-title">{equipoSeleccionado.name}</h2>
              <div className="team-info">
                <span className="team-country">{equipoSeleccionado.country}</span>
                {equipoSeleccionado.founded && (
                  <span className="team-founded">Fundado en {equipoSeleccionado.founded}</span>
                )}
              </div>
            </div>

            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  value={jugadorBuscado}
                  onChange={handleChangeJugador}
                  onFocus={() => setMostrarBuscadorJugadores(true)}
                  placeholder="Buscar jugador..."
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
                {cargandoJugadores && <div className="loader"></div>}
              </div>

              {/* Sugerencias de autocompletado */}
              {mostrarBuscadorJugadores && jugadoresEncontrados.length > 0 && (
                <ul className="search-suggestions">
                  {jugadoresEncontrados.map((jugador) => (
                    <li
                      key={jugador.player.id}
                      onClick={() => seleccionarJugadorBuscado(jugador)}
                      className="suggestion-item"
                    >
                      <img
                        src={jugador.player.photo || "/placeholder.svg?height=24&width=24"}
                        alt={jugador.player.name}
                        className="team-logo-small"
                      />
                      <span>{jugador.player.name}</span>
                      {jugador.statistics && jugador.statistics.length > 0 && (
                        <span className="country-tag">{jugador.statistics[0].team.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <h3 className="section-subtitle">Jugadores</h3>

            {cargandoJugadores ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Cargando jugadores...</p>
              </div>
            ) : (
              <div className="jugadores-grid">
                {jugadoresEquipo.map((jugador) => (
                  <div
                    key={jugador.player.id}
                    className="jugador-card-3d"
                    onClick={() => buscarJugador(jugador.player.id)}
                  >
                    <div className="card-inner">
                      <div className="card-front">
                        <div
                          className="jugador-banner"
                          style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), 
                                          url(${jugador.statistics[0].team.logo})`,
                          }}
                        >
                          <span className="jugador-numero">{jugador.statistics[0].games.number || "?"}</span>
                        </div>
                        <div className="jugador-photo-container">
                          <img
                            src={jugador.player.photo || "/placeholder.svg?height=150&width=150"}
                            alt={jugador.player.name}
                            className="jugador-photo"
                            loading="lazy"
                          />
                        </div>
                        <div className="jugador-info">
                          <h4 className="jugador-name">{jugador.player.name}</h4>
                          <div className="jugador-position-badge">{jugador.statistics[0].games.position || "N/A"}</div>

                          <div className="jugador-stats-mini">
                            <div className="stat-mini">
                              <span className="stat-icon">⚽</span>
                              <span className="stat-value">{jugador.statistics[0].goals?.total || 0}</span>
                            </div>
                            <div className="stat-mini">
                              <span className="stat-icon">🎯</span>
                              <span className="stat-value">{jugador.statistics[0].goals?.assists || 0}</span>
                            </div>
                            <div className="stat-mini">
                              <span className="stat-icon">👟</span>
                              <span className="stat-value">{jugador.statistics[0].games?.appearences || 0}</span>
                            </div>
                          </div>

                          <div className="jugador-actions">
                            <button
                              className="jugador-action-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                buscarJugador(jugador.player.id)
                              }}
                            >
                              ℹ️ Detalles
                            </button>
                            <button
                              className="jugador-action-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                añadirJugadorComparacion(jugador)
                              }}
                            >
                              📊 Comparar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Estadísticas de Jugador */}
        {pestañaActiva === "jugador" && jugador && (
          <section className="section-jugador">
            <div className="section-header">
              <h2 className="section-title">Perfil de Jugador</h2>
              <div className="section-actions">
                <button
                  className="action-button"
                  onClick={() => toggleJugadorFavorito(jugador)}
                  aria-label={
                    jugadoresFavoritos.some((j) => j.id === jugador.player.id)
                      ? "Quitar de favoritos"
                      : "Añadir a favoritos"
                  }
                >
                  {jugadoresFavoritos.some((j) => j.id === jugador.player.id) ? "❤️" : "🤍"}
                </button>
                <button
                  className="action-button"
                  onClick={() => añadirJugadorComparacion(jugador)}
                  aria-label="Comparar jugador"
                  disabled={jugadoresComparacion.some((j) => j.player.id === jugador.player.id)}
                >
                  📊
                </button>
                <button
                  className="action-button"
                  onClick={() => compartir("jugador", jugador.player.id, jugador.player.name)}
                  aria-label="Compartir jugador"
                >
                  📤
                </button>
                <button
                  className="action-button"
                  onClick={() => exportarDatos(jugador, `jugador-${jugador.player.id}`)}
                  aria-label="Exportar datos"
                >
                  💾
                </button>
              </div>
            </div>

            <div className="jugador-profile">
              <div className="jugador-header">
                <div className="jugador-photo-large-container">
                  <img
                    src={jugador.player.photo || "/placeholder.svg?height=200&width=200"}
                    alt={jugador.player.name}
                    className="jugador-photo-large"
                  />
                </div>
                <div className="jugador-header-info">
                  <h2 className="jugador-name-large">{jugador.player.name}</h2>
                  <div className="jugador-meta">
                    <div className="jugador-team">
                      <img
                        src={jugador.statistics[0].team.logo || "/placeholder.svg?height=24&width=24"}
                        alt={jugador.statistics[0].team.name}
                        className="team-logo-small"
                      />
                      <span>{jugador.statistics[0].team.name}</span>
                    </div>
                    <div className="jugador-personal">
                      <div className="jugador-detail">
                        <span className="detail-label">Edad:</span>
                        <span className="detail-value">{jugador.player.age} años</span>
                      </div>
                      <div className="jugador-detail">
                        <span className="detail-label">Nacionalidad:</span>
                        <span className="detail-value">{jugador.player.nationality}</span>
                      </div>
                      <div className="jugador-detail">
                        <span className="detail-label">Posición:</span>
                        <span className="detail-value">{jugador.statistics[0].games.position || "N/A"}</span>
                      </div>
                      <div className="jugador-detail">
                        <span className="detail-label">Altura:</span>
                        <span className="detail-value">{jugador.player.height || "N/A"}</span>
                      </div>
                      <div className="jugador-detail">
                        <span className="detail-label">Peso:</span>
                        <span className="detail-value">{jugador.player.weight || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-container">
                <h3 className="stats-title">Estadísticas de la Temporada</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">👟</div>
                    <div className="stat-value">{jugador.statistics[0].games.appearences || 0}</div>
                    <div className="stat-label">Partidos</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⚽</div>
                    <div className="stat-value">{jugador.statistics[0].goals?.total || 0}</div>
                    <div className="stat-label">Goles</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-value">{jugador.statistics[0].goals?.assists || 0}</div>
                    <div className="stat-label">Asistencias</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🟨</div>
                    <div className="stat-value">{jugador.statistics[0].cards?.yellow || 0}</div>
                    <div className="stat-label">Amarillas</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🟥</div>
                    <div className="stat-value">{jugador.statistics[0].cards?.red || 0}</div>
                    <div className="stat-label">Rojas</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-value">{Math.round(jugador.statistics[0].games.minutes / 90) || 0}</div>
                    <div className="stat-label">Partidos Completos</div>
                  </div>
                </div>

                {/* Gráfico de radar para estadísticas */}
                <div className="chart-container">
                  <h4 className="chart-title">Perfil de Rendimiento</h4>
                  {prepararDatosRadar(jugador) && (
                    <div className="radar-chart">
                      <Radar data={prepararDatosRadar(jugador)} options={opcionesRadar} />
                    </div>
                  )}
                </div>

                {jugador.statistics[0].goals?.total > 0 && (
                  <div className="progress-section">
                    <h4 className="progress-title">Distribución de Goles</h4>
                    <div className="progress-container">
                      <div className="progress-label">
                        <span>Pie Derecho</span>
                        <span>{jugador.statistics[0].goals.right || 0}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill right-foot"
                          style={{
                            width: `${(jugador.statistics[0].goals.right / jugador.statistics[0].goals.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="progress-container">
                      <div className="progress-label">
                        <span>Pie Izquierdo</span>
                        <span>{jugador.statistics[0].goals.left || 0}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill left-foot"
                          style={{
                            width: `${(jugador.statistics[0].goals.left / jugador.statistics[0].goals.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="progress-container">
                      <div className="progress-label">
                        <span>Cabeza</span>
                        <span>{jugador.statistics[0].goals.header || 0}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill header"
                          style={{
                            width: `${(jugador.statistics[0].goals.header / jugador.statistics[0].goals.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="progress-container">
                      <div className="progress-label">
                        <span>Otros</span>
                        <span>{jugador.statistics[0].goals.other || 0}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill other"
                          style={{
                            width: `${(jugador.statistics[0].goals.other / jugador.statistics[0].goals.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Historial de transferencias */}
              {historialTransferencias && historialTransferencias.length > 0 && (
                <div className="transferencias-section">
                  <h3 className="section-subtitle">Historial de Transferencias</h3>
                  <div className="timeline">
                    {historialTransferencias.map((transferencia, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-date">{transferencia.date}</div>
                        <div className="timeline-content">
                          <div className="transfer-teams">
                            <div className="transfer-team">
                              <img
                                src={transferencia.teams.out.logo || "/placeholder.svg?height=30&width=30"}
                                alt={transferencia.teams.out.name}
                                className="team-logo-small"
                              />
                              <span>{transferencia.teams.out.name}</span>
                            </div>
                            <div className="transfer-arrow">→</div>
                            <div className="transfer-team">
                              <img
                                src={transferencia.teams.in.logo || "/placeholder.svg?height=30&width=30"}
                                alt={transferencia.teams.in.name}
                                className="team-logo-small"
                              />
                              <span>{transferencia.teams.in.name}</span>
                            </div>
                          </div>
                          <div className="transfer-type">
                            {transferencia.type || "Transferencia"}
                            {transferencia.fee && <span className="transfer-fee">{transferencia.fee}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Detalles de Partido */}
        {pestañaActiva === "partido" && partidoSeleccionado && (
          <section className="section-partido-detalle">
            <div className="section-header">
              <h2 className="section-title">Detalles del Partido</h2>
              <div className="section-actions">
                <button
                  className="action-button"
                  onClick={() =>
                    compartir(
                      "partido",
                      partidoSeleccionado.fixture.id,
                      `${partidoSeleccionado.teams.home.name} vs ${partidoSeleccionado.teams.away.name}`,
                    )
                  }
                  aria-label="Compartir partido"
                >
                  📤
                </button>
                <button
                  className="action-button"
                  onClick={() => exportarDatos(partidoSeleccionado, `partido-${partidoSeleccionado.fixture.id}`)}
                  aria-label="Exportar datos"
                >
                  💾
                </button>
              </div>
            </div>

            <div className="partido-header">
              <div className="partido-fecha-completa">
                🕒
                <span>
                  {formatearFecha(partidoSeleccionado.fixture.date)} - {formatearHora(partidoSeleccionado.fixture.date)}
                </span>
              </div>

              <div className="partido-equipos">
                <div className="partido-equipo">
                  <img
                    src={partidoSeleccionado.teams.home.logo || "/placeholder.svg?height=80&width=80"}
                    alt={partidoSeleccionado.teams.home.name}
                    className="equipo-logo-grande"
                  />
                  <h3 className="equipo-nombre">{partidoSeleccionado.teams.home.name}</h3>
                </div>

                <div className="partido-resultado">
                  <div className="resultado-grande">
                    <span className={partidoSeleccionado.teams.home.winner ? "ganador" : ""}>
                      {partidoSeleccionado.goals.home}
                    </span>
                    <span className="separador">-</span>
                    <span className={partidoSeleccionado.teams.away.winner ? "ganador" : ""}>
                      {partidoSeleccionado.goals.away}
                    </span>
                  </div>
                  <div className="partido-estado">{partidoSeleccionado.fixture.status.long}</div>
                </div>

                <div className="partido-equipo">
                  <img
                    src={partidoSeleccionado.teams.away.logo || "/placeholder.svg?height=80&width=80"}
                    alt={partidoSeleccionado.teams.away.name}
                    className="equipo-logo-grande"
                  />
                  <h3 className="equipo-nombre">{partidoSeleccionado.teams.away.name}</h3>
                </div>
              </div>
            </div>

            {/* Estadísticas del partido */}
            {estadisticasPartido && (
              <div className="partido-estadisticas">
                <h3 className="section-subtitle">Estadísticas</h3>

                <div className="chart-container">
                  {prepararDatosEstadisticasPartido() && (
                    <Bar data={prepararDatosEstadisticasPartido()} options={opcionesBarras} />
                  )}
                </div>

                <div className="estadisticas-detalle">
                  {estadisticasPartido.length >= 2 &&
                    estadisticasPartido[0].statistics.map((stat, index) => {
                      const statLocal = stat
                      const statVisitante = estadisticasPartido[1].statistics[index]

                      if (!statLocal || !statVisitante) return null

                      // Calcular porcentajes para la barra de progreso
                      let porcentajeLocal = 50
                      let porcentajeVisitante = 50

                      if (statLocal.value && statVisitante.value) {
                        // Si son porcentajes (como posesión)
                        if (statLocal.value.includes("%") && statVisitante.value.includes("%")) {
                          porcentajeLocal = Number.parseInt(statLocal.value)
                          porcentajeVisitante = Number.parseInt(statVisitante.value)
                        }
                        // Si son números
                        else {
                          const valorLocal = Number.parseInt(statLocal.value) || 0
                          const valorVisitante = Number.parseInt(statVisitante.value) || 0
                          const total = valorLocal + valorVisitante

                          if (total > 0) {
                            porcentajeLocal = (valorLocal / total) * 100
                            porcentajeVisitante = (valorVisitante / total) * 100
                          }
                        }
                      }

                      return (
                        <div key={index} className="estadistica-item">
                          <div className="estadistica-valores">
                            <span className="valor-local">{statLocal.value || "0"}</span>
                            <span className="estadistica-tipo">{statLocal.type}</span>
                            <span className="valor-visitante">{statVisitante.value || "0"}</span>
                          </div>
                          <div className="estadistica-barra">
                            <div className="barra-local" style={{ width: `${porcentajeLocal}%` }}></div>
                            <div className="barra-visitante" style={{ width: `${porcentajeVisitante}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Timeline del partido */}
            {timelinePartido && timelinePartido.length > 0 && (
              <div className="partido-timeline">
                <h3 className="section-subtitle">Eventos del Partido</h3>

                <div className="timeline-partido">
                  {timelinePartido.map((evento, index) => {
                    // Determinar icono según tipo de evento
                    let icono = "⚽"
                    let tipoEvento = "gol"

                    if (evento.type === "Card") {
                      icono = evento.detail === "Yellow Card" ? "🟨" : "🟥"
                      tipoEvento = "tarjeta"
                    } else if (evento.type === "subst") {
                      icono = "🔄"
                      tipoEvento = "cambio"
                    } else if (evento.detail === "Missed Penalty") {
                      icono = "❌"
                      tipoEvento = "penalti-fallado"
                    }

                    return (
                      <div
                        key={index}
                        className={`evento-partido ${tipoEvento} ${evento.team.id === partidoSeleccionado.teams.home.id ? "local" : "visitante"}`}
                      >
                        <div className="evento-tiempo">{evento.time.elapsed}'</div>
                        <div className="evento-icono">{icono}</div>
                        <div className="evento-detalle">
                          <div className="evento-jugador">{evento.player.name}</div>
                          <div className="evento-descripcion">{evento.detail}</div>
                          {evento.assist && evento.assist.name && (
                            <div className="evento-asistencia">Asistencia: {evento.assist.name}</div>
                          )}
                        </div>
                        <div className="evento-equipo">
                          <img
                            src={evento.team.logo || "/placeholder.svg?height=20&width=20"}
                            alt={evento.team.name}
                            className="equipo-logo-mini"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Comparación de Jugadores */}
        {pestañaActiva === "comparacion" && (
          <section className="section-comparacion">
            <div className="section-header">
              <h2 className="section-title">Comparación de Jugadores</h2>
              <div className="section-actions">
                {jugadoresComparacion.length === 2 && (
                  <button
                    className="action-button"
                    onClick={() => exportarDatos(jugadoresComparacion, "comparacion-jugadores")}
                    aria-label="Exportar comparación"
                  >
                    💾
                  </button>
                )}
              </div>
            </div>

            <div className="jugadores-seleccionados">
              {jugadoresComparacion.map((jugador, index) => (
                <div key={jugador.player.id} className="jugador-seleccionado">
                  <div className="jugador-seleccionado-header">
                    <img
                      src={jugador.player.photo || "/placeholder.svg?height=80&width=80"}
                      alt={jugador.player.name}
                      className="jugador-foto-comparacion"
                    />
                    <button
                      className="quitar-jugador"
                      onClick={() => quitarJugadorComparacion(jugador.player.id)}
                      aria-label="Quitar jugador"
                    >
                      ❌
                    </button>
                  </div>
                  <div className="jugador-seleccionado-info">
                    <h4 className="jugador-nombre-comparacion">{jugador.player.name}</h4>
                    <div className="jugador-equipo-comparacion">
                      <img
                        src={jugador.statistics[0].team.logo || "/placeholder.svg?height=20&width=20"}
                        alt={jugador.statistics[0].team.name}
                        className="equipo-logo-mini"
                      />
                      <span>{jugador.statistics[0].team.name}</span>
                    </div>
                    <div className="jugador-posicion-comparacion">{jugador.statistics[0].games.position || "N/A"}</div>
                  </div>
                </div>
              ))}

              {jugadoresComparacion.length < 2 && (
                <div className="seleccionar-jugador">
                  <div className="seleccionar-jugador-placeholder">👤</div>
                  <p>Selecciona {jugadoresComparacion.length === 0 ? "dos jugadores" : "otro jugador"} para comparar</p>
                </div>
              )}
            </div>

            {jugadoresComparacion.length === 2 && (
              <div className="comparacion-contenido">
                <div className="chart-container">
                  <h4 className="chart-title">Comparación de Estadísticas</h4>
                  {prepararDatosComparacion() && <Bar data={prepararDatosComparacion()} options={opcionesBarras} />}
                </div>

                <div className="tabla-comparacion">
                  <h4 className="tabla-titulo">Detalles Comparativos</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Estadística</th>
                        <th>{jugadoresComparacion[0].player.name}</th>
                        <th>{jugadoresComparacion[1].player.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Edad</td>
                        <td>{jugadoresComparacion[0].player.age}</td>
                        <td>{jugadoresComparacion[1].player.age}</td>
                      </tr>
                      <tr>
                        <td>Nacionalidad</td>
                        <td>{jugadoresComparacion[0].player.nationality}</td>
                        <td>{jugadoresComparacion[1].player.nationality}</td>
                      </tr>
                      <tr>
                        <td>Altura</td>
                        <td>{jugadoresComparacion[0].player.height || "N/A"}</td>
                        <td>{jugadoresComparacion[1].player.height || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>Peso</td>
                        <td>{jugadoresComparacion[0].player.weight || "N/A"}</td>
                        <td>{jugadoresComparacion[1].player.weight || "N/A"}</td>
                      </tr>
                      <tr>
                        <td>Partidos</td>
                        <td>{jugadoresComparacion[0].statistics[0].games.appearences || 0}</td>
                        <td>{jugadoresComparacion[1].statistics[0].games.appearences || 0}</td>
                      </tr>
                      <tr>
                        <td>Minutos</td>
                        <td>{jugadoresComparacion[0].statistics[0].games.minutes || 0}</td>
                        <td>{jugadoresComparacion[1].statistics[0].games.minutes || 0}</td>
                      </tr>
                      <tr>
                        <td>Goles</td>
                        <td>{jugadoresComparacion[0].statistics[0].goals?.total || 0}</td>
                        <td>{jugadoresComparacion[1].statistics[0].goals?.total || 0}</td>
                      </tr>
                      <tr>
                        <td>Asistencias</td>
                        <td>{jugadoresComparacion[0].statistics[0].goals?.assists || 0}</td>
                        <td>{jugadoresComparacion[1].statistics[0].goals?.assists || 0}</td>
                      </tr>
                      <tr>
                        <td>Tarjetas Amarillas</td>
                        <td>{jugadoresComparacion[0].statistics[0].cards?.yellow || 0}</td>
                        <td>{jugadoresComparacion[1].statistics[0].cards?.yellow || 0}</td>
                      </tr>
                      <tr>
                        <td>Tarjetas Rojas</td>
                        <td>{jugadoresComparacion[0].statistics[0].cards?.red || 0}</td>
                        <td>{jugadoresComparacion[1].statistics[0].cards?.red || 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Sección de Favoritos */}
        {pestañaActiva === "favoritos" && (
          <section className="section-favoritos">
            <h2 className="section-title">Mis Favoritos</h2>

            <div className="favoritos-tabs">
              <button
                className={`favoritos-tab ${subPestañaActiva === "equipos-fav" ? "active" : ""}`}
                onClick={() => setSubPestañaActiva("equipos-fav")}
              >
                Equipos
              </button>
              <button
                className={`favoritos-tab ${subPestañaActiva === "jugadores-fav" ? "active" : ""}`}
                onClick={() => setSubPestañaActiva("jugadores-fav")}
              >
                Jugadores
              </button>
            </div>

            {subPestañaActiva === "equipos-fav" && (
              <div className="favoritos-contenido">
                {equiposFavoritos.length > 0 ? (
                  <div className="equipos-favoritos-grid">
                    {equiposFavoritos.map((equipo) => (
                      <div
                        key={equipo.id}
                        className="equipo-favorito-card"
                        onClick={() => {
                          const equipoObj = { team: equipo }
                          seleccionarEquipo(equipoObj)
                        }}
                      >
                        <img
                          src={equipo.logo || "/placeholder.svg?height=80&width=80"}
                          alt={equipo.name}
                          className="equipo-favorito-logo"
                        />
                        <h3 className="equipo-favorito-nombre">{equipo.name}</h3>
                        <button
                          className="quitar-favorito"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleEquipoFavorito(equipo)
                          }}
                          aria-label="Quitar de favoritos"
                        >
                          ❤️
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="favoritos-vacio">
                    ❤️
                    <p>No tienes equipos favoritos</p>
                    <p className="favoritos-tip">Añade equipos a favoritos haciendo clic en el icono de corazón</p>
                  </div>
                )}
              </div>
            )}

            {subPestañaActiva === "jugadores-fav" && (
              <div className="favoritos-contenido">
                {jugadoresFavoritos.length > 0 ? (
                  <div className="jugadores-favoritos-grid">
                    {jugadoresFavoritos.map((jugador) => (
                      <div key={jugador.id} className="jugador-favorito-card" onClick={() => buscarJugador(jugador.id)}>
                        <img
                          src={jugador.photo || "/placeholder.svg?height=100&width=100"}
                          alt={jugador.name}
                          className="jugador-favorito-foto"
                        />
                        <div className="jugador-favorito-info">
                          <h3 className="jugador-favorito-nombre">{jugador.name}</h3>
                          {jugador.team && (
                            <div className="jugador-favorito-equipo">
                              <img
                                src={jugador.team.logo || "/placeholder.svg?height=20&width=20"}
                                alt={jugador.team.name}
                                className="equipo-logo-mini"
                              />
                              <span>{jugador.team.name}</span>
                            </div>
                          )}
                        </div>
                        <button
                          className="quitar-favorito"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleJugadorFavorito({ player: jugador, statistics: [{ team: jugador.team }] })
                          }}
                          aria-label="Quitar de favoritos"
                        >
                          ❤️
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="favoritos-vacio">
                    ❤️
                    <p>No tienes jugadores favoritos</p>
                    <p className="favoritos-tip">Añade jugadores a favoritos haciendo clic en el icono de corazón</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Sección de Configuración */}
        {pestañaActiva === "configuracion" && (
          <section className="section-configuracion">
            <h2 className="section-title">Configuración</h2>

            <div className="configuracion-grupo">
              <h3 className="configuracion-titulo">Apariencia</h3>

              <div className="configuracion-opcion">
                <div className="opcion-info">
                  <h4 className="opcion-titulo">Tema</h4>
                  <p className="opcion-descripcion">Cambia entre modo claro y oscuro</p>
                </div>
                <div className="opcion-control">
                  <button
                    className={`tema-btn ${!temaDark ? "active" : ""}`}
                    onClick={() => {
                      if (temaDark) toggleTema()
                    }}
                  >
                    ☀️ Claro
                  </button>
                  <button
                    className={`tema-btn ${temaDark ? "active" : ""}`}
                    onClick={() => {
                      if (!temaDark) toggleTema()
                    }}
                  >
                    🌙 Oscuro
                  </button>
                </div>
              </div>

              <div className="configuracion-opcion">
                <div className="opcion-info">
                  <h4 className="opcion-titulo">Tema de Equipo</h4>
                  <p className="opcion-descripcion">Usar colores del equipo seleccionado</p>
                </div>
                <div className="opcion-control">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={!!temaEquipo}
                      onChange={() => {
                        if (temaEquipo) {
                          setTemaEquipo(null)
                          document.documentElement.style.removeProperty("--primary")
                          document.documentElement.style.removeProperty("--primary-dark")
                          document.documentElement.style.removeProperty("--primary-light")
                        } else if (equipoSeleccionado) {
                          aplicarTemaEquipo(equipoSeleccionado)
                        }
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="configuracion-grupo">
              <h3 className="configuracion-titulo">Datos</h3>

              <div className="configuracion-opcion">
                <div className="opcion-info">
                  <h4 className="opcion-titulo">Limpiar Favoritos</h4>
                  <p className="opcion-descripcion">Eliminar todos los equipos y jugadores favoritos</p>
                </div>
                <div className="opcion-control">
                  <button
                    className="accion-btn peligro"
                    onClick={() => {
                      if (window.confirm("¿Estás seguro de que quieres eliminar todos tus favoritos?")) {
                        setEquiposFavoritos([])
                        setJugadoresFavoritos([])
                        localStorage.removeItem("equiposFavoritos")
                        localStorage.removeItem("jugadoresFavoritos")
                        mostrarNotificacion("Se han eliminado todos los favoritos")
                      }
                    }}
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <div className="configuracion-opcion">
                <div className="opcion-info">
                  <h4 className="opcion-titulo">Exportar Datos</h4>
                  <p className="opcion-descripcion">Descargar todos tus datos guardados</p>
                </div>
                <div className="opcion-control">
                  <button
                    className="accion-btn"
                    onClick={() => {
                      const datos = {
                        equiposFavoritos,
                        jugadoresFavoritos,
                      }
                      exportarDatos(datos, "mis-datos-futbol")
                    }}
                  >
                    Exportar
                  </button>
                </div>
              </div>
            </div>

            <div className="configuracion-grupo">
              <h3 className="configuracion-titulo">Acerca de</h3>
              <p className="acerca-de">
                Fútbol Stats Pro v1.0
                <br />
                Desarrollado con ❤️ para los amantes del fútbol
                <br />
                Datos proporcionados por API-Football
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Notificaciones */}
      <div className="notificaciones-container">
        {notificaciones.map((notificacion) => (
          <div key={notificacion.id} className={`notificacion ${notificacion.tipo}`}>
            <span className="notificacion-mensaje">{notificacion.mensaje}</span>
            <button
              className="cerrar-notificacion"
              onClick={() => setNotificaciones((prev) => prev.filter((n) => n.id !== notificacion.id))}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <footer className="app-footer">
        <p>Datos proporcionados por API-Football</p>
        <p className="copyright">© {new Date().getFullYear()} Fútbol Stats Pro</p>
      </footer>
      <FootballFooter />
    </div>
  )
}

export default Partidos
