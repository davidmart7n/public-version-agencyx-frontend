import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { FollowersSexChart } from './FollowersSexChart';

export const FollowersSexSection = () => {
  return (
    <Card>
      <CardContent sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6"> Followers Sex </Typography>
        <FollowersSexChart></FollowersSexChart>
      </CardContent>
    </Card>
  );
};
