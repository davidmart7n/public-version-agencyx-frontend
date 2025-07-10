import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { theme } from 'theme/theme';
import { colors } from 'theme/colors';

export default function BasicPie() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 85, label: 'Mans', color: theme.palette.primary.dark },
            { id: 1, value: 25, label: 'Womens', color: colors.purple[400] },
          ],
          // Aquí puedes customizar el formato del label

          paddingAngle: 3,
          cornerRadius: 5,
          innerRadius: 45,
        },
      ]}
      width={400}
      height={200}
    />
  );
}

export const FollowersSexChart = () => {
  return <BasicPie />;
};
