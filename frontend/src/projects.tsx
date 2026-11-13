import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import projects from "./projects.json";
type Project = (typeof projects)[number];
function Diagram({ id }: { id: string }) {
  switch (id) {
    case "devops":
      return (
        <>
          <div className="art-label">
            <span>PIPELINE INSTITUCIONAL</span>
            <span>14 ETAPAS</span>
          </div>
          <div className="pipeline case-pipeline">
            <span>
              <b>01</b>Build
            </span>
            <span>
              <b>02</b>Pruebas
            </span>
            <span>
              <b>03</b>Control
            </span>
            <span>
              <b>04</b>Entrega
            </span>
          </div>
          <div className="diagram-footer">
            GITLAB CI/CD <i></i> SONARQUBE <i></i> DOCKER
          </div>
        </>
      );
    case "clinic":
      return (
        <>
          <div className="art-label">
            <span>PLATAFORMA ODONTOLÓGICA</span>
            <span>4 SEDES</span>
          </div>
          <div className="case-network">
            <span className="network-center">Operación multisede</span>
            <div>
              <span>Agenda</span>
              <span>ERP clínico</span>
              <span>CRM</span>
            </div>
          </div>
          <div className="diagram-footer">
            MAPA FUNCIONAL <i></i> PORTAL DE PACIENTES
          </div>
        </>
      );
    case "school":
      return (
        <>
          <div className="art-label">
            <span>ASISTENCIA ESCOLAR</span>
            <span>PROPUESTA</span>
          </div>
          <div className="case-pipeline school-flow">
            <span>
              <b>01</b>Credencial QR
            </span>
            <span>
              <b>02</b>Registro
            </span>
            <span>
              <b>03</b>Aviso
            </span>
          </div>
          <div className="diagram-footer">
            FLUJO DE INGRESO <i></i> NEXKERNEL
          </div>
        </>
      );
    case "elections":
      return (
        <>
          <div className="art-label">
            <span>EDUCACIÓN</span>
            <span>IMPLEMENTACIÓN</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Padrón
            </span>
            <span>
              <b>02</b>Habilitación
            </span>
            <span>
              <b>03</b>Votación
            </span>
            <span>
              <b>04</b>Reportes
            </span>
          </div>
        </>
      );
    case "mesa":
      return (
        <>
          <div className="art-label">
            <span>SECTOR PÚBLICO</span>
            <span>DISEÑO DE SOLUCIÓN</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Recepción
            </span>
            <span>
              <b>02</b>Registro
            </span>
            <span>
              <b>03</b>Derivación
            </span>
            <span>
              <b>04</b>Seguimiento
            </span>
          </div>
        </>
      );
    case "municipal":
      return (
        <>
          <div className="art-label">
            <span>SECTOR PÚBLICO</span>
            <span>DISEÑO DE SOLUCIÓN</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Procesos
            </span>
            <span>
              <b>02</b>Registros
            </span>
            <span>
              <b>03</b>Operación
            </span>
            <span>
              <b>04</b>Control
            </span>
          </div>
        </>
      );
    case "writer":
      return (
        <>
          <div className="art-label">
            <span>WEB</span>
            <span>DISEÑO DE PRODUCTO</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Autor
            </span>
            <span>
              <b>02</b>Obras
            </span>
            <span>
              <b>03</b>Lectores
            </span>
            <span>
              <b>04</b>Gestión
            </span>
          </div>
        </>
      );
    case "assessment":
      return (
        <>
          <div className="art-label">
            <span>EDUCACIÓN</span>
            <span>DISEÑO DE SOLUCIÓN</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Práctica
            </span>
            <span>
              <b>02</b>Pipeline
            </span>
            <span>
              <b>03</b>Rúbrica
            </span>
            <span>
              <b>04</b>Resultados
            </span>
          </div>
        </>
      );
    case "documents":
      return (
        <>
          <div className="art-label">
            <span>IA Y AUTOMATIZACIÓN</span>
            <span>FORMACIÓN APLICADA</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Redacción
            </span>
            <span>
              <b>02</b>Extracción
            </span>
            <span>
              <b>03</b>Revisión
            </span>
            <span>
              <b>04</b>Archivo
            </span>
          </div>
        </>
      );
    case "agents":
      return (
        <>
          <div className="art-label">
            <span>INVESTIGACIÓN</span>
            <span>METODOLOGÍA</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Requisitos
            </span>
            <span>
              <b>02</b>Diseño
            </span>
            <span>
              <b>03</b>Desarrollo
            </span>
            <span>
              <b>04</b>Verificación
            </span>
          </div>
        </>
      );
    case "infrastructure":
      return (
        <>
          <div className="art-label">
            <span>DEVOPS</span>
            <span>OPERACIÓN</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Despliegue
            </span>
            <span>
              <b>02</b>Operación
            </span>
            <span>
              <b>03</b>Diagnóstico
            </span>
            <span>
              <b>04</b>Continuidad
            </span>
          </div>
        </>
      );
    case "channels":
      return (
        <>
          <div className="art-label">
            <span>IA Y AUTOMATIZACIÓN</span>
            <span>PLAN DE IMPLEMENTACIÓN</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Canales
            </span>
            <span>
              <b>02</b>Atención
            </span>
            <span>
              <b>03</b>Visibilidad
            </span>
            <span>
              <b>04</b>Medición
            </span>
          </div>
        </>
      );
    case "portfolio":
      return (
        <>
          <div className="art-label">
            <span>WEB</span>
            <span>DESARROLLO</span>
          </div>
          <div className="case-pipeline">
            <span>
              <b>01</b>Catálogo
            </span>
            <span>
              <b>02</b>Perfil
            </span>
            <span>
              <b>03</b>Contacto
            </span>
            <span>
              <b>04</b>CMS
            </span>
          </div>
        </>
      );
    default:
      return null;
  }
}
export function ProjectVisual({ project }: { project: Project }) {
  return (
    <div className={"case-art " + project.id} aria-hidden="true">
      <div>
        <Diagram id={project.id} />
      </div>
    </div>
  );
}
export function ProjectCards({
  featured = false,
  items = projects,
}: {
  featured?: boolean;
  items?: Project[];
}) {
  return (
    <>
      {(featured ? items.slice(0, 3) : items).map((p) =>
        featured ? (
          <Link
            className="work-tile"
            key={p.id}
            to={"/proyectos/" + p.slug + "/"}
          >
            <ProjectVisual project={p} />
            <div className="work-tile-copy">
              <span className="micro">
                {p.category.toUpperCase()} / {p.state.toUpperCase()}
              </span>
              <strong>
                {p.title} <span className="arrow" />
              </strong>
              <p>{p.summary}</p>
              <span className="work-open">
                Explorar proyecto <span className="arrow" />
              </span>
            </div>
          </Link>
        ) : (
          <article
            className={"case-card" + (p.id === "devops" ? " featured" : "")}
            key={p.id}
          >
            <ProjectVisual project={p} />
            <div className="case-body">
              <p className="micro">
                {p.category.toUpperCase()} / {p.state.toUpperCase()}
              </p>
              <h2>{p.title}</h2>
              <p>{p.summary}</p>
              <Link className="case-open" to={"/proyectos/" + p.slug + "/"}>
                Ver caso <span className="arrow" />
              </Link>
            </div>
          </article>
        ),
      )}
    </>
  );
}
export function ProjectRows({ limit = 13 }: { limit?: number }) {
  return (
    <>
      {projects.slice(0, limit).map((p) => (
        <div className="table-row" key={p.id}>
          <Link className="text-link" to={"/proyectos/" + p.slug + "/"}>
            {p.title}
          </Link>
          <span className="badge">{p.state}</span>
        </div>
      ))}
    </>
  );
}
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
export function Projects() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("Todos");
  const categories = ["Todos", ...new Set(projects.map((p) => p.category))];
  const items = useMemo(
    () =>
      projects.filter(
        (p) =>
          (category === "Todos" || p.category === category) &&
          normalize(
            [p.title, p.summary, p.category, ...p.stack].join(" "),
          ).includes(normalize(query.trim())),
      ),
    [query, category],
  );
  return (
    <section className="section wrap">
      <div className="section-kicker micro">
        <span>PORTAFOLIO</span>
        <span>SOFTWARE · INFRAESTRUCTURA · INVESTIGACIÓN</span>
      </div>
      <div className="section-heading">
        <h1>
          Proyectos<span>.</span>
        </h1>
        <p>
          Desarrollo de software, operación, investigación y diseño de
          soluciones para distintos equipos y sectores.
        </p>
      </div>
      <div className="project-tools">
        <label htmlFor="project-search">
          Buscar en el portafolio
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre, sector o tecnología"
          />
        </label>
        <p role="status">
          {items.length} {items.length === 1 ? "proyecto" : "proyectos"}
        </p>
      </div>
      <div className="filters" aria-label="Filtrar proyectos">
        {categories.map((c) => (
          <button
            type="button"
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="case-list">
        <ProjectCards items={items} />
      </div>
      {!items.length && <p>No hay proyectos que coincidan con tu búsqueda.</p>}
    </section>
  );
}
export function ProjectDetail() {
  const { slug } = useParams();
  const p = projects.find((p) => p.slug === slug);
  if (!p) return <NotFound />;
  return (
    <section className="wrap section internal project-page">
      <div className="section-kicker micro">
        <span>PORTAFOLIO / {p.category.toUpperCase()}</span>
        <Link to="/proyectos/">Volver al catálogo</Link>
      </div>
      <div className="project-hero">
        <div>
          <p className="micro project-state">{p.state}</p>
          <h1>
            {p.title}
            <span>.</span>
          </h1>
          <p className="lede">{p.summary}</p>
          <div className="tags">
            {p.stack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <ProjectVisual project={p} />
      </div>
      <div className="tech-details case-details">
        {[
          ["Reto", p.problem],
          ["Decisión de ingeniería", p.decision],
          ["Enfoque técnico", p.evidence],
        ].map(([t, s], i) => (
          <article key={t}>
            <p className="micro">0{i + 1} / INGENIERÍA</p>
            <h2>{t}</h2>
            <p>{s}</p>
          </article>
        ))}
      </div>
      <Link className="button dark" to="/contacto/">
        Conversar sobre un proyecto <span className="arrow" />
      </Link>
    </section>
  );
}
export function NotFound() {
  return (
    <section className="wrap section">
      <p className="micro">404</p>
      <h1>Página no encontrada.</h1>
      <Link className="button dark" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}
