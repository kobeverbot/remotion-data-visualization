import { Composition, registerRoot } from 'remotion';
import { DataSummary } from './DataSummary';
import { MetricsDashboard } from './MetricsDashboard';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="DataSummary"
        component={DataSummary}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Resumen de Ventas",
          data: [
            { label: "Enero", value: 120 },
            { label: "Febrero", value: 180 },
            { label: "Marzo", value: 150 },
            { label: "Abril", value: 200 },
            { label: "Mayo", value: 250 },
          ],
          maxValue: 250
        }}
      />

      <Composition
        id="MetricsDashboard"
        component={MetricsDashboard}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "Dashboard de Métricas",
          subtitle: "Reporte Semanal de Rendimiento",
          kpis: [
            {
              label: "Ingresos Totales",
              value: 45800,
              prefix: "$",
              color: "#10b981"
            },
            {
              label: "Usuarios Activos",
              value: 1234,
              suffix: " usuarios",
              color: "#3b82f6"
            },
            {
              label: "Tasa de Conversión",
              value: 24.5,
              suffix: "%",
              color: "#f59e0b"
            },
            {
              label: "Satisfacción Cliente",
              value: 4.7,
              suffix: "/ 5.0",
              color: "#8b5cf6"
            }
          ],
          chartData: [120, 150, 180, 160, 200, 230, 250, 220, 240, 280, 300, 280],
          progress: 87,
          date: "Semana del 20 - 26 Enero 2026"
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
