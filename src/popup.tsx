import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';

import 'typeface-roboto';

import Popup from '@src/components/Popup';

const container = document.querySelector('#popup');
const root = createRoot(container!);
root.render(
  <>
    <CssBaseline />
    <Popup />
  </>,
);
