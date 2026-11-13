import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Home,
  Services,
  Teaching,
  Profile,
  Contact,
  Architecture,
  Login,
} from "./pages";
import { Projects, ProjectDetail, NotFound } from "./projects";
import { Overview, StudioProjects, Resources, Inquiries } from "./studio";
import { request } from "./forms";
import "./styles.css";
import "./studio-theme.css";
import "./react.css";
import { MotionLayer } from "./motion";
const navigation = [
  ["/", "Inicio"],
  ["/proyectos/", "Proyectos"],
  ["/servicios/", "Servicios"],
  ["/docencia/", "Docencia"],
  ["/perfil/", "Perfil"],
];
const studioNavigation = [
  ["/dashboard/", "Resumen"],
  ["/dashboard/proyectos/", "Proyectos"],
  ["/dashboard/recursos/", "Recursos"],
  ["/dashboard/consultas/", "Consultas"],
];
function Layout() {
  const location = useLocation(),
    navigate = useNavigate();
  const admin = location.pathname.startsWith("/dashboard");
  const [status, setStatus] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.toggle("admin-page", admin);
    const label =
      [
        ...navigation,
        ...studioNavigation,
        ["/contacto/", "Contacto"],
        ["/acceso/", "Acceso privado"],
      ].find(([p]) => p === location.pathname)?.[1] || "Portafolio";
    document.title = label + " · Jhamil Huaman";
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.append(robots);
    }
    robots.setAttribute(
      "content",
      admin || location.pathname === "/acceso/"
        ? "noindex, nofollow"
        : "index, follow",
    );
  }, [location.pathname, admin]);
  async function logout() {
    try {
      await request("auth/logout", {});
      navigate("/acceso/", { replace: true });
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "No se pudo cerrar sesión.");
    }
  }
  return (
    <>
      <a className="skip" href="#main">
        Saltar al contenido
      </a>
      <header className="top">
        <div className="wrap top-inner">
          <Link className="brand" to="/">
            <span className="mark" aria-hidden="true">
              JH
            </span>
            <span>
              Jhamil Huaman<small>INGENIERÍA DE SOFTWARE</small>
            </span>
          </Link>
          <nav className="main-nav" aria-label="Navegación principal">
            {navigation.map(([p, l]) => (
              <NavLink key={p} to={p} end={p === "/"}>
                {l}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="top-cta" to="/contacto/">
              Hablemos <span className="arrow" />
            </Link>
            {admin && (
              <button className="top-cta" onClick={logout}>
                Salir
              </button>
            )}
          </div>
        </div>
      </header>
      <main id="main">
        {status && <p role="alert">{status}</p>}
        <div className="route-scene" key={location.pathname}>
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <span className="micro">ANIBAL JHAMIL HUAMAN VERASTEIN</span>
          <nav aria-label="Vistas del sitio">
            <Link to="/perfil/">Perfil</Link>
            <Link to="/dashboard/">Acceso privado</Link>
            <Link to="/contacto/">Contacto</Link>
          </nav>
          <MotionLayer />
        </div>
      </footer>
    </>
  );
}
function Studio() {
  const [state, setState] = useState<"loading" | "active" | "denied" | "error">(
    "loading",
  );
  const location = useLocation();
  useEffect(() => {
    let live = true;
    request<{ authenticated: boolean }>("auth/session")
      .then((r) => {
        if (live) setState(r.authenticated ? "active" : "denied");
      })
      .catch(() => {
        if (live) setState("error");
      });
    return () => {
      live = false;
    };
  }, []);
  if (state === "denied") return <Navigate to="/acceso/" replace />;
  if (state !== "active")
    return (
      <section className="wrap section" role="status">
        {state === "error"
          ? "No se pudo verificar el acceso. Recarga la página para continuar."
          : "Cargando espacio de trabajo…"}
      </section>
    );
  const title =
    studioNavigation.find(([p]) => p === location.pathname)?.[1] || "Resumen";
  return (
    <section className="wrap section internal dashboard">
      <div className="section-kicker micro">
        <span>JH STUDIO / ADMINISTRACIÓN</span>
        <Link to="/">Volver al portafolio</Link>
      </div>
      <div className="studio dashboard-shell">
        <aside className="studio-side">
          <div className="studio-brand">
            <span className="mark">JH</span>
            <div>
              <strong>JH Studio</strong>
              <small>GESTIÓN DEL PORTAFOLIO</small>
            </div>
          </div>
          <nav aria-label="Módulos del dashboard">
            {studioNavigation.map(([p, l]) => (
              <NavLink key={p} to={p} end>
                {l}
              </NavLink>
            ))}
          </nav>
          <Link className="studio-tech" to="/arquitectura/">
            Criterios de ingeniería
          </Link>
        </aside>
        <div className="studio-main dashboard-content">
          <div className="dashboard-bar">
            <p className="micro">ESPACIO DE TRABAJO</p>
            <span className="badge">ESPACIO PRIVADO</span>
          </div>
          <h1>
            {title}
            <span>.</span>
          </h1>
          <Outlet />
        </div>
      </div>
    </section>
  );
}
export default function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="proyectos" element={<Projects />} />
            <Route path="proyectos/:slug" element={<ProjectDetail />} />
            <Route path="servicios" element={<Services />} />
            <Route path="docencia" element={<Teaching />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="contacto" element={<Contact />} />
            <Route path="arquitectura" element={<Architecture />} />
            <Route path="acceso" element={<Login />} />
            <Route path="dashboard" element={<Studio />}>
              <Route index element={<Overview />} />
              <Route path="proyectos" element={<StudioProjects />} />
              <Route path="recursos" element={<Resources />} />
              <Route path="consultas" element={<Inquiries />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
