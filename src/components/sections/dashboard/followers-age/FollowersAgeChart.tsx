import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { theme } from 'theme/theme';
import { colors } from 'theme/colors'; // Ajusta la ruta

/**
 * Gráfico de barras con ancho dinámico.
 */
export function BasicBars({ width }: { width: number }) {
  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: ['0-15', '15-25', '25-35', '35-45', '45-65', '+65'] }]}
      series={[
        { data: [4, 3, 5, 8, 7, 9], color: theme.palette.primary.main },
        { data: [2, 5, 9, 5, 12, 6], color: colors.blue[400] },
      ]}
      width={width}
      height={300}
    />
  );
}

/**
 * Controla el tamaño dinámico del gráfico.
 */
const FollowersAgeChart = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(500);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', minWidth: 300 }}>
      <BasicBars width={width} />
    </div>
  );
};

export default FollowersAgeChart;
