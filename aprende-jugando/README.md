# 🎈 Aprende Jugando

Aplicación web educativa para niños de **pre-primaria** y **primaria** con juegos didácticos y un **panel de seguimiento para docentes y tutores**.

**Stack:** React + CSS (frontend) · Express + Node.js (backend, API REST con CORS) · MySQL (base de datos)

**Autor:** José Luis Véliz Cucul — Ingeniería en Sistemas, Universidad Mariano Gálvez de Guatemala
**Curso:** Desarrollo Web — Proyecto de fin de curso 2026

---

## 1. Contenido del proyecto

```
aprende-jugando/
├── video/
│   └── demo_aprende_jugando.mp4  Video demostrativo (4 min 19 s)
├── database/
│   └── schema.sql              Tablas, llaves foráneas y datos iniciales
├── backend/                    API REST (Express)
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js           Arranque del servidor
│       ├── app.js              Configuración de Express, CORS y rutas
│       ├── config/db.js        Pool de conexiones MySQL
│       ├── routes/             Definición de rutas
│       ├── controllers/        Lógica de cada recurso
│       ├── middlewares/        Manejo de errores
│       └── scripts/initDb.js   Crea las tablas (npm run db:init)
└── frontend/                   Aplicación React (Vite)
    ├── .env.example
    ├── index.html
    ├── package.json
    └── src/
        ├── App.jsx             Rutas de la aplicación
        ├── services/api.js     Cliente HTTP (fetch) hacia la API
        ├── context/            Estudiante activo
        ├── hooks/              useGuardarProgreso (POST de resultados)
        ├── components/         Header, QuizGame, Resultado, Fraccion...
        ├── games/              Un componente por juego
        ├── pages/              Inicio, Actividades, Juego, PanelDocente
        └── styles/global.css
```

## 2. Juegos incluidos

| Nivel | Área | Juego | Contenido |
|---|---|---|---|
| Pre-primaria | Conocimientos espaciales | ¿Dónde está? | Adentro/Afuera, Arriba/Abajo, Cerca/Lejos, Encima/Debajo (12 preguntas con escenas ilustradas) |
| Pre-primaria | Figuras geométricas | Figuras geométricas | Círculo, cuadrado, triángulo y rectángulo (nombrar la figura y buscarla) |
| Pre-primaria | Memoria | Juego de memoria | 6 pares de tarjetas (animales, frutas o transportes) |
| Primaria | Matemáticas | Tablas de multiplicar | Tablas del 2 al 10 o todas mezcladas |
| Primaria | Matemáticas | Suma de quebrados | Igual y distinto denominador, con barras visuales y explicación del procedimiento |
| Primaria | Matemáticas | Multiplicación con decimales | Decimal × entero y decimal × decimal, con explicación |

Todas las preguntas incluyen botón 🔊 para escuchar el enunciado (útil para niños que aún no leen).

## 3. Requerimientos cumplidos

| Req. | Dónde se cumple |
|---|---|
| RF-01 Gestión de estudiantes | Pantalla de inicio → `POST /api/estudiantes` (nombre y edad) |
| RF-02 Ejecución del juego | `components/QuizGame.jsx` y `games/*` con preguntas generadas dinámicamente |
| RF-03 Evaluación visual | Opción correcta en verde, incorrecta en rojo, mensaje y explicación al instante |
| RF-04 Cálculo de puntuación | Marcador ⭐ en tiempo real (+10 por acierto, racha 🔥, bono en memoria) |
| RF-05 Registro de progreso | `hooks/useGuardarProgreso.js` → `POST /api/progresos` |
| RF-06 Consulta de reporte | Panel docente → `GET /api/progresos` y `GET /api/progresos/resumen` |
| RF-07 Catálogo de actividades | `GET /api/actividades` (tabla `actividades` en MySQL) |
| RF-08 Filtrado de reportes | Filtro por estudiante (y por actividad), tabla ordenable por columna |
| RNF-01 Usabilidad infantil | Fuentes grandes (Baloo 2 / Nunito), botones de 64–88 px, emojis, colores, voz |
| RNF-02 Rendimiento < 500 ms | Consultas con índices; encabezado `X-Response-Time`; el panel muestra el tiempo de la consulta |
| RNF-03 CORS | `app.js` con lista de orígenes permitidos en `CORS_ORIGIN` |
| RNF-04 Integridad referencial | `FOREIGN KEY` de `progresos` hacia `estudiantes` y `actividades` |
| RNF-05 Arquitectura desacoplada | `frontend/` y `backend/` son proyectos independientes que se comunican solo por HTTP |
| RNF-06 Portabilidad | Node.js 18+ y MySQL 8.0+ (también probado con MariaDB 10.11) |
| RNF-07 Calidad de código | Componentes funcionales en React; rutas y controladores separados en Express |

## 4. Instalación local (para revisión)

### Requisitos
- **Node.js 18 o superior** → https://nodejs.org
- **MySQL 8.0 o superior** (o XAMPP/MariaDB)

### Paso 1 — Base de datos
Opción A, con el script incluido (recomendado, se hace en el paso 2):
```bash
npm run db:init
```
Opción B, manual: abrir **MySQL Workbench / phpMyAdmin** y ejecutar `database/schema.sql`.

### Paso 2 — Backend (API)
```bash
cd backend
npm install
cp .env.example .env        # en Windows: copy .env.example .env
```
Editar `.env` con el usuario y contraseña de MySQL:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=su_contraseña
DB_NAME=aprende_jugando
```
Luego:
```bash
npm run db:init             # crea la base, tablas y datos iniciales
npm start                   # API en http://localhost:4000
```
Comprobar en el navegador: http://localhost:4000/api/health → `{"ok":true,"db":"conectada"}`

### Paso 3 — Frontend (React)
En otra terminal:
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:4000/api
npm run dev                 # http://localhost:5173
```

Abrir **http://localhost:5173**, registrar un estudiante y jugar. El panel de docentes está en el menú **📊 Docentes**.

## 5. API REST

URL base: `http://localhost:4000/api`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servidor y de la conexión a MySQL |
| GET | `/estudiantes` | Lista de estudiantes con partidas y puntaje acumulado |
| GET | `/estudiantes/:id` | Un estudiante |
| POST | `/estudiantes` | Crea un estudiante. Body: `{ "nombre": "Ana", "edad": 5 }` |
| DELETE | `/estudiantes/:id` | Elimina un estudiante (y su historial, `ON DELETE CASCADE`) |
| GET | `/actividades?nivel=preprimaria` | Catálogo de actividades (filtro opcional por nivel) |
| GET | `/actividades/:codigo` | Una actividad, p. ej. `/actividades/tablas` |
| POST | `/progresos` | Guarda una partida. Body: `{ "estudiante_id": 1, "actividad_id": 4, "puntaje": 90, "aciertos": 9, "total_preguntas": 10, "duracion_segundos": 75 }` |
| GET | `/progresos?estudiante_id=1&actividad=tablas` | Historial (filtros opcionales) |
| GET | `/progresos/resumen?estudiante_id=1` | Promedio, mejor puntaje y % de aciertos por actividad |

Errores de validación devuelven `400` con `{ "error": "mensaje" }`.

### Modelo de datos

```
estudiantes (id PK, nombre, edad, creado_en)
actividades (id PK, codigo UNIQUE, nombre, nivel, area, descripcion, icono, color, orden)
progresos   (id PK, estudiante_id FK → estudiantes, actividad_id FK → actividades,
             puntaje, aciertos, total_preguntas, duracion_segundos, fecha)
```

## 6. Publicación en webhosting gratuito

Se usan tres servicios gratuitos: **Aiven** (MySQL), **Render** (API Node.js) y **Render Static Site** (React). Antes, subir el proyecto a un repositorio de GitHub.

### 6.0 Subir el código a GitHub (sin usar comandos)
1. Entrar a https://github.com → botón **New** → nombre `aprende-jugando` → **Public** → **Create repository**.
2. En el repositorio nuevo, clic en **uploading an existing file**.
3. Arrastrar el **contenido** de la carpeta `aprende-jugando` (las carpetas `backend`, `frontend`, `database` y el `README.md`).
   **No** arrastrar las carpetas `node_modules` ni los archivos `.env` (tienen la contraseña).
4. Clic en **Commit changes**.

### 6.1 Base de datos MySQL en Aiven
1. Crear cuenta en https://aiven.io → **Create service** → **MySQL** → plan **Free**.
2. Cuando el servicio esté *Running*, copiar la **Service URI** (empieza con `mysql://avnadmin:...@...:PUERTO/defaultdb?ssl-mode=REQUIRED`).
3. En su computadora, dentro de `backend/`, poner en `.env` solo esa línea:
   ```
   DATABASE_URL=mysql://avnadmin:CLAVE@HOST:PUERTO/defaultdb?ssl-mode=REQUIRED
   ```
   y ejecutar `npm run db:init`. Debe mostrar *Actividades cargadas: 6*.

### 6.2 API (backend) en Render
1. https://render.com → **New → Web Service** → conectar el repositorio.
2. Configuración:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free
3. **Environment variables:**
   - `DATABASE_URL` = la Service URI de Aiven
   - `CORS_ORIGIN` = la URL del frontend (paso 6.3), p. ej. `https://aprende-jugando.onrender.com`
4. Al terminar, probar `https://SU-API.onrender.com/api/health`.

> El plan gratuito de Render "duerme" el servicio tras un tiempo sin uso; la primera petición puede tardar ~1 minuto. Abrir `/api/health` unos minutos antes de la presentación.

### 6.3 Frontend en Render (Static Site)
1. **New → Static Site** → mismo repositorio.
2. Configuración:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. **Environment variable:** `VITE_API_URL` = `https://SU-API.onrender.com/api`
4. Volver al servicio de la API y verificar que `CORS_ORIGIN` sea exactamente la URL del frontend (sin `/` al final).

*(Alternativa: el frontend también se puede publicar en Netlify o Vercel con la misma configuración: carpeta `frontend`, comando `npm run build`, carpeta `dist`.)*

El frontend usa rutas con `#` (HashRouter) y `base: './'` en Vite, por lo que todos los recursos usan **rutas relativas** y no se necesita configuración extra de redirecciones.

## 7. Solución de problemas

| Problema | Solución |
|---|---|
| "No se pudo conectar con el servidor" | La API no está encendida o `VITE_API_URL` es incorrecta. Al cambiar `.env` del frontend hay que volver a ejecutar `npm run dev` / `npm run build`. |
| `Origen no permitido por CORS` | Agregar la URL del frontend en `CORS_ORIGIN` del backend (separar varias con coma). |
| `/api/health` → `"db":"sin conexión"` | Revisar usuario, contraseña y host de MySQL en `.env`. En Aiven usar la Service URI completa. |
| `ER_NOT_SUPPORTED_AUTH_MODE` | Actualizar MySQL/mysql2 o crear el usuario con `mysql_native_password`. |
