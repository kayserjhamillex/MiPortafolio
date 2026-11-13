import { Link } from "react-router-dom";
import { useState } from "react";
import { RecordForm, LoginForm, RecordList } from "./forms";
import { ProjectCards, ProjectRows } from "./projects";
import projects from "./projects.json";
const steps = [
  [
    "Commit",
    "Un cambio en GitLab dispara el pipeline y deja un registro del código que se va a evaluar.",
  ],
  [
    "Pruebas",
    "El pipeline compila el proyecto y ejecuta pruebas para detectar regresiones.",
  ],
  [
    "Control",
    "Los controles de calidad y seguridad pueden detener la entrega si la revisión falla.",
  ],
  [
    "Despliegue",
    "La versión aprobada pasa al entorno de destino. El flujo contempla la reversión ante fallos.",
  ],
];
export function Home() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  return (
    <>
      <section className="opening" id="inicio">
        <div className="wrap hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="signal" aria-hidden="true"></span> INGENIERÍA DE
              SOFTWARE · HUANCAYO
            </p>
            <h1>
              Del código
              <br />
              <span>a producción.</span>
            </h1>
            <p className="lede">
              Diseño sistemas a medida, automatizo su entrega y convierto esa
              experiencia en laboratorios para enseñar ingeniería de software.
            </p>
            <div className="hero-actions">
              <Link className="button dark" to="/proyectos/">
                Explorar proyectos{" "}
                <span className="arrow" aria-hidden="true"></span>
              </Link>
              <Link className="button secondary" to="/contacto/">
                Conversemos <span className="arrow" aria-hidden="true"></span>
              </Link>
            </div>
            <Link className="hero-author" to="/perfil/">
              <img
                src="/assets/jhamil-huaman.webp"
                width="42"
                height="42"
                alt=""
              />
              <span>
                <strong>Ing. Anibal Jhamil Huaman Verastein</strong>
                <small>Full-stack · Subgerente de NexKernel</small>
              </span>
              <span className="arrow" aria-hidden="true"></span>
            </Link>
          </div>
          <figure
            className={`hero-art engine ${paused ? "motion-paused" : ""}`}
            data-active={active}
            aria-labelledby="engine-title"
          >
            <div className="art-top">
              <div>
                <p className="micro">LABORATORIO DEVOPS</p>
                <h2 id="engine-title">Del commit al despliegue</h2>
              </div>
              <button
                className="motion-control"
                type="button"
                onClick={() => setPaused(!paused)}
              >
                {paused ? "Reanudar animación" : "Pausar animación"}
              </button>
            </div>
            <svg
              className="engine-visual"
              viewBox="0 0 620 350"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="engine-grid"
                  width="27"
                  height="27"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 0h27M0 0v27"
                    fill="none"
                    stroke="#354574"
                    strokeOpacity=".4"
                  ></path>
                </pattern>
                <radialGradient id="engine-field">
                  <stop stopColor="#354782" stopOpacity=".53"></stop>
                  <stop offset="1" stopColor="#0c142b" stopOpacity="0"></stop>
                </radialGradient>
                <linearGradient
                  id="engine-top"
                  x1="0%"
                  x2="100%"
                  y1="0%"
                  y2="100%"
                >
                  <stop stopColor="#4e69ae"></stop>
                  <stop offset=".52" stopColor="#172649"></stop>
                  <stop offset="1" stopColor="#26365e"></stop>
                </linearGradient>
                <linearGradient
                  id="engine-side"
                  x1="0%"
                  x2="100%"
                  y1="0%"
                  y2="100%"
                >
                  <stop stopColor="#182749"></stop>
                  <stop offset="1" stopColor="#0b1226"></stop>
                </linearGradient>
                <linearGradient
                  id="engine-metal"
                  x1="0%"
                  x2="100%"
                  y1="0%"
                  y2="100%"
                >
                  <stop stopColor="#c5dfff"></stop>
                  <stop offset=".42" stopColor="#5d85f6"></stop>
                  <stop offset="1" stopColor="#192b68"></stop>
                </linearGradient>
                <linearGradient id="engine-trace" x1="0%" x2="100%">
                  <stop stopColor="#70eeef"></stop>
                  <stop offset="1" stopColor="#a391ff"></stop>
                </linearGradient>
                <g id="engine-layer" strokeLinejoin="round">
                  <path
                    d="M133 152 310 64 486 152 310 246Z"
                    fill="url(#engine-top)"
                    stroke="#6686c1"
                  ></path>
                  <path
                    d="M133 152v14l177 94v-14Z"
                    fill="#192844"
                    stroke="#466095"
                  ></path>
                  <path
                    d="m310 246 176-94v14l-176 94Z"
                    fill="url(#engine-side)"
                    stroke="#466095"
                  ></path>
                  <path
                    d="M148 153 310 73 472 153 310 237Z"
                    fill="none"
                    stroke="#6686c1"
                    opacity=".6"
                  ></path>
                </g>
              </defs>
              <rect width="620" height="350" fill="url(#engine-grid)"></rect>
              <ellipse
                cx="320"
                cy="185"
                rx="300"
                ry="167"
                fill="url(#engine-field)"
              ></ellipse>
              <g fill="none" stroke="#566998" strokeWidth="1" opacity=".65">
                <ellipse cx="310" cy="237" rx="272" ry="92"></ellipse>
                <ellipse
                  cx="310"
                  cy="237"
                  rx="242"
                  ry="72"
                  strokeDasharray="3 6"
                ></ellipse>
                <path d="M310 14v307M20 237h580" strokeDasharray="3 7"></path>
                <path d="M16 83h76l63 34m450-34h-78l-66 35M16 292h70l78-39m439 35h-69l-75-39"></path>
              </g>
              <g className="engine-stack">
                <use
                  href="#engine-layer"
                  transform="translate(0 61)"
                  opacity=".67"
                ></use>
                <use
                  href="#engine-layer"
                  transform="translate(0 39)"
                  opacity=".83"
                ></use>
                <use href="#engine-layer" transform="translate(0 15)"></use>
                <use href="#engine-layer"></use>
                <g
                  fill="none"
                  stroke="url(#engine-trace)"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                  opacity=".78"
                >
                  <path d="m158 147 48 23 28-14 30 15m-72-52 33 16 29-15 26 12m-51-30 26 13 33-16m28-22v26l24 12m50-5-25 14 23 11m40-13-28 15 15 8 29-15m17 31-53 28-25-11m-3 27-23-11-34 18m-17 15v-23l-26-13m-42 9 24-12-23-11-23 12"></path>
                  <path
                    className="engine-flow"
                    d="m158 147 48 23 28-14 30 15m-35-69 26 13 33-16m173 62-53 28-25-11m-77 48v-23l-26-13"
                  ></path>
                </g>
                <g fill="#a2e7ff">
                  <circle cx="158" cy="147" r="2.5"></circle>
                  <circle cx="229" cy="102" r="2.5"></circle>
                  <circle cx="461" cy="161" r="2.5"></circle>
                  <circle cx="306" cy="226" r="2.5"></circle>
                </g>
                <path
                  d="m236 146 73-37 76 37-76 42Z"
                  fill="#0e182e"
                  stroke="#91b6fa"
                  strokeWidth="1.5"
                ></path>
                <path
                  d="m248 144 61-32 64 32-64 35Z"
                  fill="url(#engine-metal)"
                  stroke="#c3d7ff"
                ></path>
                <path
                  d="m265 144 44-23 45 23-45 25Z"
                  fill="#111c3b"
                  stroke="#a6d6ff"
                ></path>
                <path
                  className="engine-core"
                  d="m283 144 26-14 26 14-26 14Z"
                  strokeWidth="1.5"
                ></path>
                <path
                  d="m139 165 170 89 171-90m-341 25 170 89 171-90m-341 22 170 90 171-91"
                  fill="none"
                  stroke="url(#engine-trace)"
                  strokeOpacity=".45"
                ></path>
              </g>
              <g className="engine-dots" fill="#89d8ff">
                <circle cx="38" cy="237" r="3"></circle>
                <circle cx="581" cy="237" r="3"></circle>
                <circle cx="310" cy="329" r="3"></circle>
                <circle cx="92" cy="83" r="2"></circle>
                <circle cx="527" cy="83" r="2"></circle>
              </g>
              <g
                fontFamily="monospace"
                fontSize="10"
                fill="#a5b7db"
                letterSpacing="1.1"
              >
                <text x="20" y="72">
                  ENTRADA
                </text>
                <text x="600" y="72" textAnchor="end">
                  ENTREGA
                </text>
                <text x="20" y="318">
                  CI / CD
                </text>
                <text x="600" y="318" textAnchor="end">
                  DEVSECOPS
                </text>
              </g>
            </svg>
            <figcaption>
              <div className="engine-stages" aria-label="Etapas del pipeline">
                {steps.map((step, i) => (
                  <button
                    key={step[0]}
                    type="button"
                    aria-pressed={active === i}
                    onClick={() => setActive(i)}
                  >
                    <span>0{i + 1}</span> {step[0]}
                  </button>
                ))}
              </div>
              <p className="engine-description" aria-live="polite">
                {steps[active][1]}
              </p>
            </figcaption>
          </figure>
        </div>
      </section>
      <section
        className="wrap evidence-strip"
        aria-label="Experiencia y alcance de proyectos"
      >
        <div>
          <strong>06</strong>
          <span>
            Años de experiencia<span>Desarrollo full-stack</span>
          </span>
        </div>
        <div>
          <strong>14</strong>
          <span>
            Etapas del pipeline<span>Laboratorio DevOps institucional</span>
          </span>
        </div>
        <div>
          <strong>04</strong>
          <span>
            Sedes contempladas<span>Plataforma odontológica</span>
          </span>
        </div>
      </section>
      <section className="wrap home-work" aria-labelledby="selected-work">
        <div className="section-kicker micro">
          <span>01 / TRABAJO SELECCIONADO</span>
          <Link to="/proyectos/">
            Ver los {projects.length} proyectos{" "}
            <span className="arrow" aria-hidden="true"></span>
          </Link>
        </div>
        <h2 id="selected-work">Ingeniería en acción.</h2>
        <div className="home-browse work-collection">
          <ProjectCards featured />
        </div>
      </section>
      <section className="wrap home-about">
        <div className="about-photo">
          <img
            src="/assets/jhamil-huaman.webp"
            width="260"
            height="336"
            loading="lazy"
            alt="Retrato profesional de Anibal Jhamil Huaman Verastein"
          />
        </div>
        <div className="about-copy">
          <p className="micro">DESARROLLO Y DOCENCIA</p>
          <h2>
            Experiencia que conecta
            <br />
            el código con las personas.
          </h2>
          <p>
            Mi trabajo reúne desarrollo full-stack, automatización y docencia.
            Desde NexKernel y el aula, diseño soluciones que responden a
            procesos y equipos concretos.
          </p>
          <Link className="text-link" to="/perfil/">
            Conocer mi trayectoria{" "}
            <span className="arrow" aria-hidden="true"></span>
          </Link>
        </div>
      </section>
      <section className="wrap closing-cta">
        <div>
          <p className="micro">TRABAJEMOS EN TU PRÓXIMO PROYECTO</p>
          <h2>
            Conversemos sobre
            <br />
            lo que necesitas resolver.
          </h2>
        </div>
        <Link className="button dark" to="/contacto/">
          Iniciar una conversación{" "}
          <span className="arrow" aria-hidden="true"></span>
        </Link>
      </section>
    </>
  );
}
export function Services() {
  return (
    <>
      <section className="section wrap services" id="servicios">
        <div className="section-kicker micro">
          <span>02 / SERVICIOS</span>
          <span>DESARROLLO + OPERACIÓN</span>
        </div>
        <div className="section-heading">
          <h1>
            En qué puedo ayudarte<span>.</span>
          </h1>
          <p>
            Elige el punto de partida según el problema que necesitas resolver.
          </p>
        </div>
        <div className="services-grid">
          <article>
            <p className="micro">SISTEMAS A MEDIDA</p>
            <h3>Digitalizar una operación</h3>
            <p>
              Centraliza procesos como citas, asistencia, atención o trámites
              con un sistema web y los paneles que requiere tu equipo.
            </p>
            <Link className="text-link" to="/contacto/?tipo=desarrollo">
              Consultar por desarrollo{" "}
              <span className="arrow" aria-hidden="true"></span>
            </Link>
          </article>
          <article>
            <p className="micro">DEVOPS Y CALIDAD</p>
            <h3>Entregar con control</h3>
            <p>
              Integra pruebas, análisis de calidad y seguridad en tu pipeline.
              Define cómo desplegar y recuperar una versión.
            </p>
            <Link className="text-link" to="/contacto/?tipo=devops">
              Consultar por DevOps{" "}
              <span className="arrow" aria-hidden="true"></span>
            </Link>
          </article>
          <article>
            <p className="micro">IA Y AUTOMATIZACIÓN</p>
            <h3>Reducir trabajo repetitivo</h3>
            <p>
              Conecta herramientas para automatizar avisos, seguimiento y
              gestión documental. Incorpora IA donde pueda asistir a un
              responsable.
            </p>
            <Link className="text-link" to="/contacto/?tipo=ia">
              Consultar por automatización{" "}
              <span className="arrow" aria-hidden="true"></span>
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
export function Teaching() {
  return (
    <>
      <section className="field" id="docencia">
        <div className="wrap section">
          <div className="section-kicker micro">
            <span>03 / AULA Y LABORATORIO</span>
            <span>DOCENCIA + INVESTIGACIÓN</span>
          </div>
          <div className="section-heading">
            <h1>
              Ingeniería que se enseña<span>.</span>
            </h1>
            <p>
              Asistente de cátedra en la Universidad Continental y ponente en
              talleres aplicados de IA.
            </p>
          </div>
          <div className="field-grid">
            <article>
              <p className="micro">
                <span>01</span> / EVALUACIÓN
              </p>
              <h3>Calidad de software</h3>
              <p>
                Rúbricas de evaluación por equipos, hallazgos de SonarQube y
                retroalimentación basada en evidencias.
              </p>
            </article>
            <article>
              <p className="micro">
                <span>02</span> / PRÁCTICA
              </p>
              <h3>DevSecOps en el aula</h3>
              <p>
                Laboratorios con GitLab y pipelines que conectan repositorio,
                pruebas, seguridad y entrega.
              </p>
            </article>
            <article>
              <p className="micro">
                <span>03</span> / TALLERES
              </p>
              <h3>IA aplicada al trabajo</h3>
              <p>
                Talleres sobre gestión documental, extracción de datos y
                automatización de tareas administrativas.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
export function Profile() {
  return (
    <>
      <section className="section wrap profile" id="perfil">
        <div className="section-kicker micro">
          <span>04 / PERFIL</span>
          <span>HUANCAYO · PERÚ</span>
        </div>
        <div className="profile-portrait">
          <img
            src="/assets/jhamil-huaman.webp"
            width="300"
            height="388"
            alt="Anibal Jhamil Huaman Verastein"
            fetchPriority="high"
          />
        </div>
        <div className="profile-grid">
          <h1>
            Anibal Jhamil
            <br />
            Huaman Verastein<span>.</span>
          </h1>
          <div>
            <p className="profile-lede">
              Desarrollador full-stack, subgerente de NexKernel y asistente de
              cátedra.
            </p>
            <p>
              Formación técnica en Computación e Informática y bachillerato en
              Ingeniería de Sistemas e Informática. Trabajo con sistemas web,
              automatizaciones e infraestructura de despliegue, desde la
              operación diaria hasta el aula.
            </p>
            <div className="tags">
              <span>React / Angular</span>
              <span>FastAPI / NestJS</span>
              <span>PostgreSQL</span>
              <span>Docker</span>
              <span>GitLab CI/CD</span>
              <span>n8n</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export function Contact() {
  return (
    <>
      <section className="contact standalone-contact" id="contacto">
        <div className="wrap contact-inner">
          <div className="contact-copy">
            <p className="micro">
              <span className="signal"></span> CONVERSEMOS
            </p>
            <h1>
              Tu próximo
              <br />
              proyecto<span>.</span>
            </h1>
            <p>
              Cuéntame qué necesita tu equipo. Podemos trabajar en un sistema a
              medida, mejorar la entrega de software o automatizar un proceso.
            </p>
            <div className="contact-lines">
              <span>Desarrollo y consultoría</span>
              <span>Docencia e investigación</span>
              <span>Huancayo, Perú</span>
            </div>
          </div>
          <RecordForm kind="inquiries" />
        </div>
      </section>
    </>
  );
}
export function Architecture() {
  return (
    <>
      <section className="wrap section internal" id="arquitectura">
        <div className="section-kicker micro">
          <span>FORMA DE TRABAJAR</span>
          <Link to="/dashboard/">Volver al dashboard</Link>
        </div>
        <div className="section-heading">
          <h1>
            Criterios de ingeniería<span>.</span>
          </h1>
          <p>
            Las decisiones técnicas parten del proceso, las personas y las
            condiciones en que el software debe operar.
          </p>
        </div>
        <div className="tech-details">
          <article>
            <p className="micro">01 / ARQUITECTURA</p>
            <h2>Límites claros</h2>
            <p>
              Módulos con responsabilidades definidas, contratos explícitos y
              modelos de datos que responden al dominio. React, FastAPI y
              PostgreSQL forman parte de mi stack de trabajo.
            </p>
          </article>
          <article>
            <p className="micro">02 / CALIDAD</p>
            <h2>Evidencia para decidir</h2>
            <p>
              Pruebas, análisis de código y revisión de los recorridos
              principales acompañan cada entrega. Los hallazgos se convierten en
              acciones priorizadas.
            </p>
          </article>
          <article>
            <p className="micro">03 / OPERACIÓN</p>
            <h2>Entregas repetibles</h2>
            <p>
              La automatización con GitLab y Docker conecta el repositorio con
              los entornos. El flujo contempla validaciones, despliegue y
              recuperación de versiones.
            </p>
          </article>
          <article>
            <p className="micro">04 / CONTEXTO</p>
            <h2>Personas y procesos</h2>
            <p>
              Una solución necesita encajar con quienes la utilizan. El análisis
              incluye los roles, la continuidad operativa y el seguimiento del
              trabajo cotidiano.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
export function Login() {
  return (
    <>
      <section className="wrap login-page">
        <div className="login-intro">
          <p className="micro">JH STUDIO</p>
          <h1>
            Tu espacio
            <br />
            de trabajo<span>.</span>
          </h1>
          <p>
            Administra el contenido del portafolio y consulta las conversaciones
            de tus próximos proyectos.
          </p>
        </div>
        <LoginForm />
      </section>
    </>
  );
}
