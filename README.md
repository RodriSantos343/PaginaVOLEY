# 🏐 COPA NOVA - Torneo Oficial de Voleibol (12 Equipos)

Sistema completo desarrollado con **React.js** y **PostgreSQL** para la gestión y seguimiento en vivo de un torneo oficial de voleibol de 12 equipos.

---

## 🌟 Características Principales

### 1. Cuatro Pestañas de Navegación
1. **Principal**:
   - Información importante del torneo (sede, fechas, formato, reglamento).
   - Métricas clave en tiempo real (12 equipos, 3 grupos, 8 clasificados).
   - Carrusel de próximos partidos y resultados recientes con marcadores de sets.
   - Resumen oficial de competencia y sistema FIVB de puntuación.
2. **Grupos y Resultados**:
   - **3 Grupos de 4 equipos**: Grupo A, Grupo B y Grupo C.
   - Tabla de posiciones completa por grupo: **PJ, PG, PP, SF, SC, DS, PF, PC, DP, PTS**.
   - Indicadores visuales de posición:
     - 🟢 **1º y 2º Puesto**: Clasificación directa a Cuartos de Final.
     - 🟡 **3º Puesto**: Zona de selección para los mejores terceros.
     - ⚫ **4º Puesto**: Eliminado.
   - Fixture completo de partidos por grupo con parciales de sets (Set 1, Set 2, Set 3 Tiebreak).
3. **Tabla de Clasificados**:
   - Tabla comparativa con los **8 equipos clasificados a Cuartos de Final** ordenados de mejor a menor (**Sembrados #1 al #8**).
   - Criterio exacto: Los **2 mejores equipos de cada grupo** (6 equipos) + los **2 mejores terceros** (2 equipos).
   - Sección especial **"Batalla de los Terceros Puestos"**: Comparativa directa de los tres 3º puestos con desempate por puntos, sets y tantos para determinar los 2 que avanzan y el eliminado.
   - Visualización del cruce proyectado en Cuartos de Final (1º vs 8º, 4º vs 5º, 2º vs 7º, 3º vs 6º).
4. **Ronda Clasificadora (Playoffs)**:
   - Llave interactiva visual con **Cuartos de Final**, **Semifinales**, **3er Puesto** y **Gran Final**.
   - Conectores de llave, detalles de parciales y coronación del campeón con animación de confetti.

---

### 2. Doble Rol: Espectador y Administrador
- **Modo Espectador**: Consulta en tiempo real de fixture, resultados, tablas de grupos, clasificados y llaves.
- **Modo Administrador**:
  - Acceso seguro mediante contraseña (clave por defecto: `admin123`).
  - **Carga y Modificación de Marcadores**: Ingreso de puntos por set (Set 1, Set 2, Set 3 Tiebreak) con cálculo automático de sets ganados y asignación del ganador.
  - **Gestión de Equipos y Jugadores**: Edición de nombre del club, DT, ciudad, color de uniforme y plantel completo con número de camiseta, nombre, posición (Armador, Opuesto, Punta Receptor, Central, Líbero) y designación de capitán.
  - **Generación Automática de Llaves**: Sembrado automático de los Cuartos de Final a partir de la tabla general de los 8 clasificados.
  - **Restauración de Datos de Prueba**: Botón para restaurar la base de datos oficial en cualquier momento.

---

## 🗄️ Base de Datos PostgreSQL

La aplicación utiliza la base de datos local `torneo_voley` en PostgreSQL con el siguiente esquema relacional:
- `tournament_info`: Metadatos del torneo, sede, fechas y reglas.
- `teams`: 12 equipos con su grupo asignado (A, B, C), DT, colores y ciudad.
- `players`: Nómina de jugadores con camiseta, posición y capitanía.
- `matches`: 18 partidos de la fase de grupos con sets y parciales.
- `playoff_matches`: Llaves de Cuartos, Semis, 3er Puesto y Final con enlaces dinámicos de ganadores.

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Iniciar Servidor y Cliente juntos:
```bash
npm run dev
```
Esto iniciará:
- **Backend API (Express + PostgreSQL)**: `http://localhost:5000`
- **Frontend (React + Vite)**: `http://localhost:5173`

### 2. Acceso como Administrador:
- Haz clic en el botón **"Modo Administrador"** en la barra superior.
- Contraseña: `admin123`
