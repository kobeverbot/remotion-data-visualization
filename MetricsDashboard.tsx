/**
 * 🎬 MetricsDashboard.tsx
 *
 * Ejemplo avanzado de Remotion: Dashboard de Métricas Animado
 *
 * Este componente crea un video de dashboard con:
 * - 4 tarjetas de KPIs (métricas clave) con contadores animados
 * - Un gráfico de líneas que se dibuja animadamente
 * - Barra de progreso circular
 * - Texto que aparece con efecto typewriter
 * - Transiciones entre secciones
 *
 * Conceptos que aprenderás:
 * 1. Cómo crear múltiples elementos animados con diferentes timings
 * 2. Cómo usar Sequence para animaciones en secuencia
 * 3. Cómo crear contadores animados con interpolate
 * 4. Cómo dibujar líneas SVG animadas
 * 5. Cómo crear transiciones suaves entre secciones
 */

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';
import { z } from 'zod';

/**
 * ========================================
 * SCHEMA DE VALIDACIÓN DE DATOS
 * ========================================
 *
 * Definimos la estructura de datos que acepta este componente.
 * Esto asegura que recibimos los datos correctos y TypeScript
 * puede inferir los tipos automáticamente.
 */
export const metricsDashboardSchema = z.object({
  // Título principal del dashboard
  title: z.string(),

  // Subtítulo o descripción
  subtitle: z.string().optional(),

  // 4 KPIs principales
  kpis: z.array(
    z.object({
      label: z.string(),       // Etiqueta del KPI (ej: "Ventas")
      value: z.number(),        // Valor actual
      prefix: z.string().optional(),      // Prefijo (ej: "$")
      suffix: z.string().optional(),      // Sufijo (ej: "%")
      color: z.string(),       // Color del KPI (en formato hex)
    })
  ).min(4).max(4), // Exactamente 4 KPIs

  // Datos para el gráfico de líneas (tendencia)
  chartData: z.array(z.number()),

  // Progreso (0-100)
  progress: z.number().min(0).max(100),

  // Fecha del reporte
  date: z.string().optional(),
});

type MetricsDashboardProps = z.infer<typeof metricsDashboardSchema>;

/**
 * ========================================
 * SUB-COMPONENTES
 * ========================================
 */

/**
 * KpiCard: Componente que renderiza una tarjeta de métrica
 *
 * @param label - Etiqueta del KPI
 * @param value - Valor a animar
 * @param prefix - Prefijo (ej: "$", "S/")
 * @param suffix - Sufijo (ej: "%", "k")
 * @param color - Color de la tarjeta
 * @param delay - Delay de entrada (frames)
 */
const KpiCard: React.FC<{
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  delay: number;
}> = ({ label, value, prefix, suffix, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación de entrada de la tarjeta (escala + opacidad)
  const cardScale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
      mass: 0.8,
    },
  });

  const cardOpacity = interpolate(
    frame - delay,
    [0, 20],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Animación del contador (valor numérico)
  const counterValue = interpolate(
    frame - delay - 10,
    [0, 40],
    [0, value],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        width: 400,
        height: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 24,
        transform: `scale(${cardScale})`,
        opacity: cardOpacity,
        border: `2px solid ${color}40`,
        boxShadow: `0 4px 20px ${color}20`,
      }}
    >
      {/* Etiqueta del KPI */}
      <div
        style={{
          fontSize: 24,
          color: '#ffffff80',
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      {/* Valor del KPI (con contador animado) */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 'bold',
          color: color,
          fontFamily: 'monospace',
        }}
      >
        {prefix}
        {Math.floor(counterValue).toLocaleString()}
        {suffix}
      </div>
    </div>
  );
};

/**
 * LineChart: Componente que dibuja un gráfico de líneas animado
 *
 * @param data - Array de números para el gráfico
 * @param delay - Delay de entrada (frames)
 */
const LineChart: React.FC<{
  data: number[];
  delay: number;
}> = ({ data, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const width = 1200;
  const height = 300;
  const padding = 20;

  // Animación del gráfico (las líneas se dibujan de izquierda a derecha)
  const chartProgress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 15,
      stiffness: 60,
      mass: 1.2,
    },
  });

  // Animación de opacidad del gráfico
  const chartOpacity = interpolate(
    frame - delay,
    [0, 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  // Calcular puntos del gráfico
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const normalizedValue = (value - minValue) / range;
    const y = height - padding - normalizedValue * (height - padding * 2);
    return { x, y, value };
  });

  // Crear path SVG para la línea
  const linePath = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `L ${point.x} ${point.y}`;
    })
    .join(' ');

  // Crear path con recorte para animación de dibujo
  const totalLength = width; // Aproximación
  const currentLength = totalLength * chartProgress;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 500,
        transform: 'translateX(-50%)',
        width: width,
        height: height,
        opacity: chartOpacity,
      }}
    >
      <svg width={width} height={height}>
        {/* Gradiente para el área bajo la línea */}
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Área bajo la línea */}
        <path
          d={`${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
          fill="url(#chartGradient)"
          opacity={0.5}
        />

        {/* Línea principal */}
        <path
          d={linePath}
          stroke="#3b82f6"
          strokeWidth={4}
          fill="none"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - currentLength}
          strokeLinecap="round"
        />

        {/* Puntos de datos */}
        {points.map((point, index) => {
          // Los puntos aparecen cuando la línea los alcanza
          const pointProgress = index / (points.length - 1);
          const pointVisible = chartProgress >= pointProgress;

          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={pointVisible ? 8 : 0}
              fill="#3b82f6"
              opacity={pointVisible ? 1 : 0}
              transition="r 0.2s, opacity 0.2s"
            />
          );
        })}
      </svg>
    </div>
  );
};

/**
 * CircularProgress: Barra de progreso circular animada
 *
 * @param value - Valor del progreso (0-100)
 * @param delay - Delay de entrada (frames)
 */
const CircularProgress: React.FC<{
  value: number;
  delay: number;
}> = ({ value, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación del progreso
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 15,
      stiffness: 70,
      mass: 1,
    },
  });

  const opacity = interpolate(
    frame - delay,
    [0, 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const size = 150;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // El progreso animado (0 -> valor)
  const animatedValue = progress * value;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div
      style={{
        position: 'absolute',
        right: 50,
        top: 20,
        opacity,
      }}
    >
      <svg width={size} height={size}>
        {/* Círculo de fondo */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#ffffff20"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Círculo de progreso */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#10b981"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Texto del valor */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dy=".3em"
          fontSize={36}
          fontWeight="bold"
          fill="#ffffff"
          fontFamily="Arial"
        >
          {Math.floor(animatedValue)}%
        </text>
      </svg>

      {/* Etiqueta debajo */}
      <div
        style={{
          position: 'absolute',
          top: size + 10,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 18,
          color: '#ffffff80',
          whiteSpace: 'nowrap',
        }}
      >
        Completado
      </div>
    </div>
  );
};

/**
 * ========================================
 * COMPONENTE PRINCIPAL
 * ========================================
 */
export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  title,
  subtitle,
  kpis,
  chartData,
  progress,
  date,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación de entrada del título
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [0, 30], [-20, 0], {
    extrapolateRight: 'clamp',
  });

  // Animación de la fecha
  const dateOpacity = interpolate(
    frame,
    [20, 50],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* SECCIÓN 1: Título y fecha (0-60 frames) */}
      <Sequence from={0}>
        <div style={{ position: 'absolute', top: 80, left: '50%' }}>
          {/* Título */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: `translateX(-50%) translateY(${titleY}px)`,
              fontSize: 64,
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              opacity: titleOpacity,
            }}
          >
            {title}
          </div>

          {/* Subtítulo */}
          {subtitle && (
            <div
              style={{
                position: 'absolute',
                top: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 28,
                color: '#ffffff80',
                textAlign: 'center',
                opacity: titleOpacity,
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Fecha */}
          {date && (
            <div
              style={{
                position: 'absolute',
                top: subtitle ? 120 : 80,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 20,
                color: '#ffffff60',
                opacity: dateOpacity,
              }}
            >
              {date}
            </div>
          )}
        </div>
      </Sequence>

      {/* SECCIÓN 2: KPIs (30 frames - todo el video) */}
      <Sequence from={30}>
        {/* KPI 1 - Top left */}
        <div style={{ position: 'absolute', top: 200, left: 100 }}>
          <KpiCard
            label={kpis[0].label}
            value={kpis[0].value}
            prefix={kpis[0].prefix}
            suffix={kpis[0].suffix}
            color={kpis[0].color}
            delay={0}
          />
        </div>

        {/* KPI 2 - Top right */}
        <div style={{ position: 'absolute', top: 200, right: 100 }}>
          <KpiCard
            label={kpis[1].label}
            value={kpis[1].value}
            prefix={kpis[1].prefix}
            suffix={kpis[1].suffix}
            color={kpis[1].color}
            delay={10}
          />
        </div>

        {/* KPI 3 - Bottom left */}
        <div style={{ position: 'absolute', top: 420, left: 100 }}>
          <KpiCard
            label={kpis[2].label}
            value={kpis[2].value}
            prefix={kpis[2].prefix}
            suffix={kpis[2].suffix}
            color={kpis[2].color}
            delay={20}
          />
        </div>

        {/* KPI 4 - Bottom right */}
        <div style={{ position: 'absolute', top: 420, right: 100 }}>
          <KpiCard
            label={kpis[3].label}
            value={kpis[3].value}
            prefix={kpis[3].prefix}
            suffix={kpis[3].suffix}
            color={kpis[3].color}
            delay={30}
          />
        </div>
      </Sequence>

      {/* SECCIÓN 3: Gráfico de líneas (90 frames - todo el video) */}
      <Sequence from={90}>
        <LineChart data={chartData} delay={0} />
      </Sequence>

      {/* SECCIÓN 4: Progreso circular (120 frames - todo el video) */}
      <Sequence from={120}>
        <CircularProgress value={progress} delay={0} />
      </Sequence>
    </AbsoluteFill>
  );
};
