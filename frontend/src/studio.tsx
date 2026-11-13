import { Link } from "react-router-dom";
import { useState } from "react";
import { RecordForm, LoginForm, RecordList } from "./forms";
import { ProjectCards, ProjectRows } from "./projects";
import projects from "./projects.json";
import { useStudio } from "./forms";
export function Overview() {
  const { records, counts, reload, error } = useStudio("");
  return (
    <>
      <p role="status">{error}</p>
      <div className="dashboard-metrics">
        <Link to="/dashboard/proyectos/">
          <span>Casos visibles</span>
          <strong>{projects.length}</strong>
          <small>Explorar catálogo editorial</small>
        </Link>
        <Link to="/dashboard/proyectos/">
          <span>Borradores</span>
          <strong>{counts.drafts ?? "—"}</strong>
          <small>Preparar nuevas fichas</small>
        </Link>
        <Link to="/dashboard/recursos/">
          <span>Recursos</span>
          <strong>{counts.resources ?? "—"}</strong>
          <small>Ver biblioteca docente</small>
        </Link>
        <Link to="/dashboard/consultas/">
          <span>Consultas</span>
          <strong>{counts.inquiries ?? "—"}</strong>
          <small>Abrir bandeja de entrada</small>
        </Link>
      </div>
      <div className="dash-overview">
        <article className="dash-panel">
          <p className="micro">01 / CATÁLOGO</p>
          <h2>Contenido visible</h2>
          <div className="project-rows">
            <ProjectRows limit={5} />
          </div>
          <Link className="text-link" to="/dashboard/proyectos/">
            Ver todos los proyectos{" "}
            <span className="arrow" aria-hidden="true"></span>
          </Link>
        </article>
        <article className="dash-panel dash-next">
          <p className="micro">02 / ACCIONES</p>
          <h2>Accesos rápidos</h2>
          <Link className="button dark" to="/dashboard/proyectos/#nuevo">
            Crear borrador <span aria-hidden="true">+</span>
          </Link>
          <Link className="text-link" to="/contacto/">
            Abrir formulario <span className="arrow" aria-hidden="true"></span>
          </Link>
          <Link className="text-link" to="/arquitectura/">
            Criterios de ingeniería{" "}
            <span className="arrow" aria-hidden="true"></span>
          </Link>
        </article>
      </div>
    </>
  );
}
export function StudioProjects() {
  const { records, counts, reload, error } = useStudio("drafts");
  return (
    <>
      <p role="status">{error}</p>
      <div className="dash-panel">
        <p className="micro">01 / FICHAS DEL PORTAFOLIO</p>
        <h2>Contenido visible</h2>
        <div className="project-rows">
          <ProjectRows limit={13} />
        </div>
      </div>
      <div className="dash-panel" id="nuevo">
        <p className="micro">02 / PREPARACIÓN</p>
        <h2>Borradores</h2>

        <RecordList records={records} />
        <RecordForm kind="drafts" onSaved={reload} />
        <p id="draft-result" role="status"></p>
      </div>
    </>
  );
}
export function Resources() {
  const { records, counts, reload, error } = useStudio("resources");
  return (
    <>
      <p role="status">{error}</p>
      <div className="dash-panel">
        <p className="micro">BIBLIOTECA DOCENTE</p>
        <h2>Recursos</h2>

        <RecordList records={records} />
      </div>
      <div className="dash-panel">
        <p className="micro">NUEVO MATERIAL</p>
        <h2>Añadir una ficha</h2>
        <RecordForm kind="resources" onSaved={reload} />
        <p id="resource-result" role="status"></p>
      </div>
    </>
  );
}
export function Inquiries() {
  const { records, counts, reload, error } = useStudio("inquiries");
  return (
    <>
      <p role="status">{error}</p>
      <div className="dash-panel">
        <p className="micro">BANDEJA DE ENTRADA</p>
        <h2>Consultas recibidas</h2>

        <RecordList records={records} />
        <Link className="button dark" to="/contacto/">
          Abrir formulario <span className="arrow" aria-hidden="true"></span>
        </Link>
      </div>
    </>
  );
}
