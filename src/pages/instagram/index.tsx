import { Box, Grid } from '@mui/material';
import PageHeader from 'components/common/PageHeader';
import { FollowersAgeSection } from 'components/sections/dashboard/followers-age/FollowersAgeSection';
import { FollowersSexSection } from 'components/sections/dashboard/followers-sex/FollowersSexSection';
import TeamMembers from 'components/sections/dashboard/members/TeamMembers';
import OrdersSection from 'components/sections/dashboard/orders/OrdersSection';
import ProgressTracker from 'components/sections/dashboard/progressTracker/ProgressTracker';
import SalesSection from 'components/sections/dashboard/sales/SalesSection';
import StatisticsCards from 'components/sections/dashboard/statistics/StatisticCards';
import TodoList from 'components/sections/dashboard/todos/TodoList';
import TopProductsTable from 'components/sections/dashboard/topProducts/TopProductsTable';
import TransactionTable from 'components/sections/dashboard/transactions/TransactionTable';

const InstagramPage = () => {
  return (
    <Box
      sx={{
        pb: 1,
      }}
    >
      <PageHeader>Welcome to Instagram Page!</PageHeader>
      {/* /* ------------- Reach section ---------------- */}
      <Grid container spacing={2} mt={1} mb={3}>
        <Grid item xs={12} md={7} zIndex={1}>
          <OrdersSection />
        </Grid>
        <Grid item xs={12} md={5}>
          <SalesSection />
        </Grid>
        <Grid item xs={12}>
          <StatisticsCards />
        </Grid>
      </Grid>
      {/* /* ------------- Target section ---------------- */}
      <Grid container spacing={3} mt={1} mb={3}>
        <Grid item xs={12} md={7} zIndex={1}>
          <FollowersAgeSection />
        </Grid>
        <Grid item xs={12} md={5}>
          <FollowersSexSection />
        </Grid>
      </Grid>
      {/* /* ------------- Content section ---------------- */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} xl={6} zIndex={1}>
          <TransactionTable />
        </Grid>
        <Grid item xs={12} xl={6}>
          <TopProductsTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstagramPage;
