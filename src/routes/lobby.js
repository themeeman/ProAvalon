import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'express';
import { ServerStyleSheet } from 'styled-components';

import ReportButton from '../views/components/report/reportButton';

const router = new Router();

router.get('/', (req, res) => {
  const css = new ServerStyleSheet();
  const reportButton = renderToString(css.collectStyles(<ReportButton />));

  res.render('lobby', {
    headerActive: 'lobby',
    optionsCog: true,
    reportButton,
    styledComponentsCSS: css.getStyleTags(),
  });
});

export default router;
