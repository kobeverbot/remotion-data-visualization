# Remotion Demo - Generación de Videos con Datos

Ejemplos de generación de videos con Remotion a partir de datos JSON.

## 📚 Ejemplos Disponibles

### 1. DataSummary (Básico)
Un gráfico de barras animado simple.

- **Duración:** 5 segundos (150 frames @ 30 FPS)
- **Componentes:** Gráfico de barras con animación spring
- **Ideal para:** Visualizar datos simples y rápidos

### 2. MetricsDashboard (Avanzado) ⭐
Un dashboard completo con múltiples animaciones y elementos.

- **Duración:** 10 segundos (300 frames @ 30 FPS)
- **Componentes:**
  - 4 tarjetas de KPIs con contadores animados
  - Gráfico de líneas SVG animado
  - Barra de progreso circular
  - Títulos con transiciones
  - Secuenciación de animaciones
- **Ideal para:** Reportes, presentaciones, dashboards de datos

## 📂 Estructura del Proyecto

```
remotion-demo/
├── Root.tsx                    # Entry point con las composiciones
├── DataSummary.tsx             # Ejemplo 1: Gráfico de barras simple
├── MetricsDashboard.tsx        # Ejemplo 2: Dashboard avanzado
├── remotion.config.ts          # Configuración de Remotion
├── package.json                # Scripts y dependencias
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Este archivo
```

## 🚀 Scripts Disponibles

```bash
# Abrir el preview de Remotion (interactivo)
npm start

# Renderizar DataSummary con datos de ejemplo
npm run build

# Renderizar MetricsDashboard con datos de ejemplo
npm run build MetricsDashboard

# Renderizar con datos personalizados
remotion render DataSummary out/custom.mp4 --props '{"title":"Mi Título","data":[...]}'
remotion render MetricsDashboard out/dashboard.mp4 --props '{"title":"Dashboard",...}'
```

## 📖 Uso de Ejemplos

### DataSummary - Gráfico de Barras

El componente `DataSummary` acepta:

```typescript
{
  title: string;      // Título del gráfico
  data: Array<{       // Datos de las barras
    label: string;    // Etiqueta (eje X)
    value: number;    // Valor (altura de barra)
  }>;
  maxValue: number;   // Valor máximo para escalar
}
```

**Ejemplo:**
```bash
remotion render DataSummary out/ventas.mp4 --props '{
  "title": "Ventas Q1 2026",
  "data": [
    {"label": "Enero", "value": 120},
    {"label": "Febrero", "value": 180},
    {"label": "Marzo", "value": 250}
  ],
  "maxValue": 300
}'
```

---

### MetricsDashboard - Dashboard Avanzado

El componente `MetricsDashboard` acepta:

```typescript
{
  title: string;           // Título principal
  subtitle?: string;       // Subtítulo opcional
  date?: string;           // Fecha del reporte

  kpis: Array<{            // 4 KPIs exactamente
    label: string;         // Etiqueta
    value: number;         // Valor
    prefix?: string;       // Prefijo (ej: "$", "S/")
    suffix?: string;       // Sufijo (ej: "%", " usuarios")
    color: string;         // Color (hex)
  }>;

  chartData: number[];     // Array de números para el gráfico

  progress: number;        // Progreso (0-100)
}
```

**Ejemplo:**
```bash
remotion render MetricsDashboard out/dashboard.mp4 --props '{
  "title": "Dashboard Semanal",
  "subtitle": "Reporte de Rendimiento",
  "kpis": [
    {
      "label": "Ingresos",
      "value": 45800,
      "prefix": "$",
      "color": "#10b981"
    },
    {
      "label": "Usuarios",
      "value": 1234,
      "suffix": " usuarios",
      "color": "#3b82f6"
    },
    {
      "label": "Conversión",
      "value": 24.5,
      "suffix": "%",
      "color": "#f59e0b"
    },
    {
      "label": "Satisfacción",
      "value": 4.7,
      "suffix": "/ 5.0",
      "color": "#8b5cf6"
    }
  ],
  "chartData": [120, 150, 180, 160, 200, 230, 250, 220, 240, 280],
  "progress": 87,
  "date": "Semana del 20-26 Enero 2026"
}'
```

---

## 🎓 Conceptos Aprendidos

### En DataSummary (Básico)
- ✅ Cómo crear una composición simple
- ✅ Uso de `useCurrentFrame` para animaciones
- ✅ Función `spring()` para animaciones naturales
- ✅ Posicionamiento absoluto de elementos
- ✅ Interpolación de valores numéricos

### En MetricsDashboard (Avanzado)
- ✅ Uso de `Sequence` para animaciones en secuencia
- ✅ Contadores animados con `interpolate()`
- ✅ Gráficos SVG animados
- ✅ Múltiples elementos con diferentes delays
- ✅ Gradientes y efectos visuales avanzados
- ✅ Validación de tipos con Zod
- ✅ Sub-componentes reutilizables

---

## 🔧 Configuración del Video

Ambos ejemplos usan:
- **Resolución:** 1920x1080 (Full HD)
- **FPS:** 30
- **Formato de salida:** MP4 (h264 codec)

---

## 📝 Notas

- Las animaciones usan funciones `spring()` de Remotion para efectos naturales
- Los datos se pueden cargar desde JSON, APIs, archivos, o cualquier fuente
- Los componentes están tipados con TypeScript y validados con Zod
- El preview de Remotion (`npm start`) permite ver las animaciones en tiempo real

---

## 🎨 Personalización

### Cambiar colores

En `MetricsDashboard.tsx`, puedes modificar:
- Colores de KPIs en el prop `color`
- Color del gráfico: busca `#3b82f6` y reemplázalo
- Color de fondo: modifica `backgroundColor` en `AbsoluteFill`

### Ajustar timings

- Cambia `delay` en los sub-componentes para ajustar el momento de entrada
- Modifica `durationInFrames` en `Root.tsx` para cambiar la duración total

---

**Última actualización:** 2026-01-29
