# Remotion Demo - Resumen de Datos

Ejemplo de generación de videos con Remotion a partir de datos JSON.

## Estructura del proyecto

- `Root.tsx` - Entry point con la configuración de Composition
- `DataSummary.tsx` - Componente que renderiza un gráfico de barras animado
- `remotion.config.ts` - Configuración de Remotion
- `package.json` - Scripts y dependencias

## Scripts disponibles

```bash
# Abrir el preview de Remotion
npm start

# Renderizar el video con los datos de ejemplo
npm run build

# Renderizar con datos personalizados
remotion render DataSummary out/video.mp4 --props '{"title":"Mi Título","data":[...]}'
```

## Estructura de datos

El componente `DataSummary` acepta un objeto con:
- `title`: Título del gráfico (string)
- `data`: Array de objetos con `label` (string) y `value` (number)
- `maxValue`: Valor máximo para escalar las barras (number)

## Ejemplo de datos

```json
{
  "title": "Resumen de Ventas 2026",
  "data": [
    { "label": "Enero", "value": 120 },
    { "label": "Febrero", "value": 180 },
    { "label": "Marzo", "value": 150 },
    { "label": "Abril", "value": 200 },
    { "label": "Mayo", "value": 250 }
  ],
  "maxValue": 250
}
```

## Renderizar con datos personalizados

```bash
npm run render DataSummary out/custom.mp4 --props '{"title":"Mis Datos","data":[{"label":"A","value":100},{"label":"B","value":200}],"maxValue":200}'
```

## Notas

- La duración del video es de 150 frames a 30 FPS (5 segundos)
- La resolución es 1920x1080 (Full HD)
- Las barras se animan con efecto spring natural
- Los datos se pueden cargar desde archivos JSON, APIs o cualquier fuente
