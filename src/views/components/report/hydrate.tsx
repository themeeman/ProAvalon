import React from 'react';
import { hydrate } from 'react-dom';
import ReportButton from './reportButton';

hydrate(<ReportButton />, document.getElementById('report-button-lobby'));
