import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'express';

import ReportButton from '../views/components/report/reportButton';

const router = new Router();

router.get('/', (req, res) => {
  const reportButton = renderToString(<ReportButton />);

  res.render('lobby', {
    headerActive: 'lobby',
    optionsCog: true,
    reportButton,
  });
});

export default router;
