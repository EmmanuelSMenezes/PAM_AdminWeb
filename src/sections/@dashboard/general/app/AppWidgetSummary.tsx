import { ApexOptions } from 'apexcharts';
import { Box, Card, Typography, Stack, CardProps } from '@mui/material';
import { fNumber } from '../../../../utils/formatNumber';

interface Props extends CardProps {
  title: string;
  total: number;
  percent: number;
  chart: {
    colors?: string[];
    series: number[];
    options?: ApexOptions;
  };
}

export default function AppWidgetSummary({ title, percent, total, chart, sx, ...other }: Props) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ pb: 1 }} variant="subtitle2">
          {title}
        </Typography>

        {/* <TrendingInfo percent={percent} /> */}

        <Typography variant="h3">{fNumber(total)}</Typography>
      </Box>

      {/* <Chart type="bar" series={[{ data: series }]} options={chartOptions} width={60} height={36} /> */}
    </Card>
  );
}
