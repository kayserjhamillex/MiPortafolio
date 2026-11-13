import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
export type StudioRecord = {
  id: string;
  title: string;
  summary: string;
  contact_name?: string;
  contact_email?: string;
};
export async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch("/api/" + path, {
    credentials: "same-origin",
    ...(body === undefined
      ? {}
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("El servicio no está disponible. Inténtalo más tarde.");
  }
  if (response.status === 401 && !path.startsWith("auth/")) {
    window.location.assign("/acceso/");
    throw new Error("Inicia sesión para continuar.");
  }
  if (!response.ok)
    throw new Error(data.error || "No pudimos completar la operación.");
  return data as T;
}
export function useStudio(kind: string) {
  const [records, setRecords] = useState<StudioRecord[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    try {
      if (kind) {
        const data = await request<{ records: StudioRecord[] }>(
          "studio/" + kind,
        );
        setRecords(data.records);
      } else setCounts(await request("studio/summary"));
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo cargar el contenido.",
      );
    }
  }, [kind]);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { records, counts, reload, error };
}
export function RecordList({ records }: { records: StudioRecord[] }) {
  return (
    <div className="project-rows">
      {records.length === 0 ? (
        <p>Todavía no hay registros.</p>
      ) : (
        records.map((r) => (
          <div className="table-row" key={r.id}>
            <div>
              <strong>{r.title}</strong>
              <p>{r.summary}</p>
              {r.contact_email && (
                <p>
                  {r.contact_name} ·{" "}
                  <a href={"mailto:" + r.contact_email}>{r.contact_email}</a>
                </p>
              )}
            </div>
            <span className="badge">Registrado</span>
          </div>
        ))
      )}
    </div>
  );
}
export function RecordForm({
  kind,
  onSaved,
}: {
  kind: "inquiries" | "drafts" | "resources";
  onSaved?: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState("");
  const id = useRef(crypto.randomUUID());
  const [params] = useSearchParams();
  const options = [
    "Sistema a medida",
    "DevOps y calidad",
    "IA y automatización",
    "Docencia o investigación",
  ];
  const preset: Record<string, string> = {
    desarrollo: options[0],
    devops: options[1],
    ia: options[2],
  };
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget,
      data = new FormData(form);
    const body = {
      id: id.current,
      title: data.get("title"),
      summary: data.get("summary"),
      ...(kind === "inquiries"
        ? { name: data.get("name"), email: data.get("email") }
        : {}),
    };
    setBusy(true);
    setStatus("Guardando…");
    try {
      await request("studio/" + kind, body);
      form.reset();
      id.current = crypto.randomUUID();
      setStatus(
        kind === "inquiries"
          ? "Tu consulta quedó registrada. Gracias por compartir tu proyecto."
          : "Contenido guardado.",
      );
      await onSaved?.();
    } catch (e) {
      setStatus(
        e instanceof Error ? e.message : "No se pudo guardar el contenido.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      id={
        kind === "inquiries"
          ? "contact-form"
          : kind === "drafts"
            ? "draft-form"
            : "resource-form"
      }
      onSubmit={submit}
      onInput={() => {
        id.current = crypto.randomUUID();
      }}
      aria-busy={busy}
    >
      <fieldset
        disabled={busy}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        {kind === "inquiries" ? (
          <>
            <p className="micro form-label">INICIAR UNA CONVERSACIÓN</p>
            <div className="form-pair">
              <label>
                Tu nombre
                <input
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </label>
              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>
            </div>
            <label>
              ¿En qué puedo ayudarte?
              <select
                name="title"
                defaultValue={preset[params.get("tipo") || ""] || ""}
                required
              >
                <option value="">Selecciona una opción</option>
                {options.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label>
            Título
            <input name="title" maxLength={90} required />
          </label>
        )}
        <label>
          {kind === "inquiries" ? "Cuéntame sobre tu proyecto" : "Descripción"}
          <textarea name="summary" rows={4} maxLength={1000} required />
        </label>
        <button
          className={"button " + (kind === "inquiries" ? "lime" : "dark")}
          type="submit"
        >
          {busy
            ? "Guardando…"
            : kind === "inquiries"
              ? "Enviar consulta"
              : kind === "drafts"
                ? "Guardar borrador"
                : "Guardar recurso"}{" "}
          <span className="arrow" aria-hidden="true" />
        </button>
        {kind === "inquiries" && (
          <small>
            Tu nombre y correo se utilizan para atender esta consulta.
          </small>
        )}
      </fieldset>
      <p role="status" className="form-result">
        {status}
      </p>
    </form>
  );
}
export function LoginForm() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setStatus("Validando acceso…");
    try {
      await request("auth/login", {
        username: data.get("username"),
        password: data.get("password"),
      });
      navigate("/dashboard/", { replace: true });
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form id="login-form" onSubmit={submit}>
      <p className="micro">ACCESO PRIVADO</p>
      <h2>Iniciar sesión</h2>
      <label>
        Usuario
        <input
          name="username"
          autoComplete="username"
          maxLength={100}
          required
          disabled={busy}
        />
      </label>
      <label>
        Contraseña
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={128}
          required
          disabled={busy}
        />
      </label>
      <button type="submit" className="button dark" disabled={busy}>
        {busy ? "Ingresando…" : "Ingresar"}
      </button>
      <p role="alert">{status}</p>
    </form>
  );
}
