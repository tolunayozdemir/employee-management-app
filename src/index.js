import {Router} from '@vaadin/router';
import './components/navigation-container.js';
import {I18n} from './i18n';

I18n.initLanguage();

window.addEventListener('load', () => {
  const outlet = document.getElementById('outlet');
  const router = new Router(outlet);

  router.setRoutes([
    {
      path: '/',
      component: 'employee-page',
      action: () => import('./pages/employee-page.js'),
    },
    {
      path: '/add-employee',
      component: 'add-employee-page',
      action: () => import('./pages/add-employee-page.js'),
    },
  ]);
});
