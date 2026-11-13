# MiPortafolio

**Portafolio profesional de Ing. Anibal Jhamil Huaman Verastein**

Proyecto multipágina para instalar en un VPS con dominio propio. Incluye los 13 proyectos del catálogo, tu retrato, el diseño animado, el formulario de contacto y el espacio privado de administración. El proyecto de la óptica está retirado.

Esta edición para VPS utiliza React + TypeScript + Vite en el frontend, FastAPI en el backend y PostgreSQL para los registros. La instalación crea una base de datos vacía.

| Ruta | Acceso |
| --- | --- |
| / y /proyectos/ | Público |
| /servicios/, /docencia/, /perfil/ | Público |
| /contacto/ | Público, guarda consultas |
| /acceso/ | Inicio de sesión |
| /dashboard/ y sus módulos | Administrador |
| /health | Estado de la aplicación y su conexión |

El dashboard permite guardar borradores, consultar solicitudes y organizar fichas de recursos. Las fichas del catálogo público se editan en frontend/src/projects.json y se publican reconstruyendo la aplicación. Guardar un borrador en el dashboard lo mantiene en el espacio privado.

**Preparar el servidor y el dominio**

Necesitas un VPS Linux con Docker Engine, el plugin Docker Compose y Python 3. El dominio debe tener un registro A que apunte a la IPv4 de tu VPS. Si utilizas un registro AAAA, debe corresponder a una IPv6 operativa de ese servidor.

La instalación de Docker para Ubuntu está documentada en su sitio oficial. [Docker Engine en Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

Sube el ZIP por SFTP, WinSCP o scp. En el servidor, descomprime el archivo y entra a la carpeta del proyecto.

~~~bash
unzip Portafolio_Jhamil_VPS.zip
cd portafolio-jhamil
python3 scripts/configurar.py --domain portafolio.tudominio.com --admin jhamil
~~~

Sustituye portafolio.tudominio.com por el dominio o subdominio exacto que usarás. El script genera .env con una contraseña aleatoria para el dashboard, su hash y las claves de la base de datos. Guarda la contraseña que aparece en la terminal. El archivo .env queda con permisos de lectura y escritura para su propietario.

Si .env ya existe, el script se detiene para conservar la configuración. En actualizaciones utiliza el archivo .env que ya está en el servidor.

**Desplegar con Docker independiente**

Esta modalidad utiliza Caddy para gestionar el dominio y HTTPS. Los puertos 80 y 443 deben estar disponibles en el VPS y accesibles desde Internet.

~~~bash
docker compose --profile standalone up -d --build
docker compose ps
docker compose logs --tail=100 app
~~~

Visita tu dominio con HTTPS. El acceso privado está en /acceso/ y en el enlace del pie de página. Utiliza el usuario y la contraseña generados por el script.

Caddy solicita y renueva el certificado para el dominio configurado. El registro DNS y la conectividad deben estar listos antes de levantar el servicio. [HTTPS automático en Caddy](https://caddyserver.com/docs/automatic-https)

**Desplegar con Dokploy**

Si tu VPS ya utiliza Dokploy para gestionar dominios, utiliza esta modalidad. El servicio Caddy del ZIP está asociado al perfil standalone y se deja desactivado en Dokploy.

1. Sube este código a un repositorio privado que pueda leer tu instancia de Dokploy. Conserva .env fuera del repositorio.
2. Crea un servicio de tipo **Docker Compose** y configura como archivo de composición ./compose.yaml. Utiliza Docker Compose, porque la aplicación se construye con su Dockerfile.
3. Copia las variables del .env generado a **Environment** del servicio. Usa los mismos valores de APP_URL, DOMAIN, usuario y claves.
4. En **Domains**, añade tu dominio con el servicio app, el puerto interno 8000, la ruta / y HTTPS.
5. Despliega o vuelve a desplegar el servicio para aplicar el dominio.

El Compose utiliza variables explícitas para inyectar la configuración a los contenedores. La aplicación escucha en el puerto interno 8000 y PostgreSQL conserva sus datos en un volumen. [Docker Compose en Dokploy](https://docs.dokploy.com/docs/core/docker-compose) · [Dominios en Dokploy](https://docs.dokploy.com/docs/core/docker-compose/domains)

**Comprobar la instalación**

~~~bash
curl -fsS https://portafolio.tudominio.com/health
curl -i https://portafolio.tudominio.com/api/studio/summary
~~~

El primer comando debe devolver {"status":"ok"}. El segundo debe devolver 401 cuando se ejecuta sin una sesión de administrador.

Abre una ventana privada del navegador y comprueba que el portafolio se puede visitar y que /dashboard/ dirige al acceso privado. Después inicia sesión, guarda un borrador y recarga la página. Una consulta enviada desde /contacto/ debe aparecer en la bandeja del administrador.

Las consultas se registran en el dashboard. El envío de avisos por correo o WhatsApp requiere configurar el proveedor y su integración.

La API utiliza sesiones con cookie HttpOnly, Secure y SameSite, comprueba el origen de las escrituras y aplica límites a los intentos de acceso y al formulario de contacto. El contenedor recibe tráfico a través del proxy, que debe gestionar los encabezados reenviados. El Compose incluido mantiene la aplicación en la red de Docker. [FastAPI detrás de un proxy](https://fastapi.tiangolo.com/advanced/behind-a-proxy/) · [Gestión de sesiones de OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

**Editar y actualizar**

| Archivo o carpeta | Contenido |
| --- | --- |
| frontend/src/pages.tsx y studio.tsx | Componentes de páginas y dashboard |
| frontend/src/projects.json | Catálogo y estados de los proyectos |
| frontend/src/*.css y frontend/public/assets/ | Estilos e imágenes |
| frontend/src/App.tsx | Navegación React Router y protección del dashboard |
| frontend/src/motion.tsx y motion.css | Animaciones, profundidad de tarjetas y preferencias de movimiento |
| backend/app.py | API, sesiones y servicio de archivos |
| backend/database.py | Modelo de datos |
| backend/config.py | Configuración del servidor |
| compose.yaml, Dockerfile, Caddyfile | Despliegue |
| tests/ | Comprobaciones de la API |

Modifica los archivos fuente y reconstruye la imagen.

~~~bash
docker compose --profile standalone up -d --build
~~~

En Dokploy actualiza el repositorio y utiliza su opción de despliegue. Conserva las variables y los volúmenes de la instalación.

La carpeta frontend/dist/ está incluida para inspeccionar las páginas generadas. Al ejecutar (cd frontend && npm ci && npm run build) se reconstruye desde los archivos fuente. Los formularios y el dashboard requieren el backend.

Las tablas se crean al iniciar por primera vez sobre la base de datos vacía. Los cambios futuros de estructura requieren una migración específica antes de actualizar el modelo.

**Respaldar**

Desde la carpeta raíz del proyecto, ejecuta lo siguiente.

~~~bash
./scripts/backup.sh
~~~

El resultado queda en backups/. Copia también .env a tu resguardo de configuración y conserva esos archivos fuera del VPS.

Para restaurar en una base de datos vacía con la misma configuración, utiliza lo siguiente antes de iniciar la aplicación.

~~~bash
set -o pipefail
gzip -dc backups/tu-respaldo.sql.gz | docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB"'
~~~

**Cambiar la contraseña del administrador**

Ejecuta este comando desde la carpeta del proyecto. Solicita la nueva contraseña, actualiza únicamente su hash y conserva el resto de .env.

~~~bash
python3 scripts/cambiar_clave.py
docker compose up -d --force-recreate app
~~~

El cambio de hash invalida las sesiones anteriores.

**Comprobaciones para desarrollo**

~~~bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt -r tests/requirements.txt
(cd frontend && npm ci && npm run build)
python3 -m pytest tests -q
~~~

Las pruebas usan una base SQLite temporal para verificar los contratos de acceso, las validaciones, la persistencia y los reintentos. La configuración de producción utiliza PostgreSQL.

Para un servidor local con PostgreSQL, carga la configuración en tu terminal y establece DB_HOST=127.0.0.1 si tu base local escucha en esa dirección. Para HTTP local establece APP_URL=http://localhost:8000 y COOKIE_SECURE=false únicamente en ese entorno.

~~~bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000
~~~

**Alcance de la verificación de esta entrega**

Se verificaron los flujos de acceso privado, sesión, consultas, borradores y recursos mediante la API, junto con las rutas y el catálogo de 13 proyectos. La ejecución de Docker, PostgreSQL y la emisión del certificado deben comprobarse al instalar el paquete en tu VPS.

**Desarrollo local con React**

Requiere Node.js 22, Python 3.12 y PostgreSQL. Crea un entorno virtual e instala backend/requirements.txt. Configura DATABASE_URL con una conexión postgresql+psycopg, APP_URL=http://127.0.0.1:4173, COOKIE_SECURE=false y las credenciales privadas descritas en .env.example. Exporta esas variables en la terminal del backend.

```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

En otra terminal:

```bash
cd frontend
npm ci
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Vite reenvía /api y /health al backend. El navegador utiliza el mismo origen y cookies de sesión. Para producción, Docker compila React y FastAPI sirve los archivos resultantes y las rutas multipágina. No necesitas Node.js en el contenedor final.

Comprobaciones: npm run build en frontend y pytest tests/ desde la raíz con las dependencias de tests/requirements.txt instaladas. Las pruebas automatizadas de API emplean una base SQLite aislada. El despliegue PostgreSQL y HTTPS debe verificarse en el VPS.

**Movimiento y accesibilidad**

La interfaz incluye una entrada escalonada del hero, luces ambientales, partículas discretas, transiciones entre páginas, aparición de secciones al desplazarse, brillo y profundidad de tarjetas con puntero preciso, microinteracciones y una barra de avance de lectura. El pie de página permite pausar los efectos y conserva la preferencia en el navegador. La configuración de movimiento reducido del sistema desactiva las animaciones. En dispositivos táctiles se omite la inclinación de tarjetas. Los efectos decorativos no interceptan clics.
