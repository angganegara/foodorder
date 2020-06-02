const axios = window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// load React
import React from 'react';
import { render } from 'react-dom';
import Reports from './Reports';

render(<Reports />, document.getElementById('report-app'));
