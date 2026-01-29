import { Composition, registerRoot } from 'remotion';
import { DataSummary } from './DataSummary';

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
    </>
  );
};

registerRoot(RemotionRoot);
