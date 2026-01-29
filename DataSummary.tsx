import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const dataSummarySchema = z.object({
  title: z.string(),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number()
    })
  ),
  maxValue: z.number()
});

type DataSummaryProps = z.infer<typeof dataSummarySchema>;

export const DataSummary: React.FC<DataSummaryProps> = ({ title, data, maxValue }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const barWidth = 150;
  const barGap = 60;
  const startX = (1920 - (data.length * (barWidth + barGap) - barGap)) / 2;
  const startY = 700;
  const maxHeight = 400;

  // Animación de entrada del título
  const titleOpacity = interpolate(
    frame,
    [0, 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Animación de entrada de las barras (escaladas)
  const bars = data.map((item, index) => {
    const delay = index * 10;
    const barHeight = (item.value / maxValue) * maxHeight;
    const animatedHeight = spring({
      frame: frame - delay,
      fps,
      config: {
        damping: 15,
        stiffness: 50,
        mass: 1,
      },
    });

    return {
      ...item,
      barHeight,
      animatedHeight: animatedHeight * barHeight,
      x: startX + index * (barWidth + barGap),
      y: startY - barHeight,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f0f0f', fontFamily: 'Arial, sans-serif' }}>
      {/* Título */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 64,
          fontWeight: 'bold',
          color: '#ffffff',
          opacity: titleOpacity,
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}
      >
        {title}
      </div>

      {/* Gráfico de barras */}
      {bars.map((bar, index) => (
        <div key={index}>
          {/* Barra */}
          <div
            style={{
              position: 'absolute',
              left: bar.x,
              top: bar.y + maxHeight - bar.animatedHeight,
              width: barWidth,
              height: bar.animatedHeight,
              backgroundColor: '#3b82f6',
              borderRadius: 8,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}
          />

          {/* Valor sobre la barra */}
          <div
            style={{
              position: 'absolute',
              left: bar.x + barWidth / 2,
              top: bar.y + maxHeight - bar.animatedHeight - 50,
              transform: 'translateX(-50%)',
              fontSize: 32,
              fontWeight: 'bold',
              color: '#ffffff',
              opacity: bar.animatedHeight > 0 ? 1 : 0,
            }}
          >
            {bar.value}
          </div>

          {/* Etiqueta (eje X) */}
          <div
            style={{
              position: 'absolute',
              left: bar.x + barWidth / 2,
              top: startY + 20,
              transform: 'translateX(-50%)',
              fontSize: 28,
              fontWeight: 'bold',
              color: '#ffffff',
              whiteSpace: 'nowrap'
            }}
          >
            {bar.label}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
