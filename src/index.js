import { Router } from '@vaadin/router';
import './components/navigation-container.js';

window.addEventListener('load', () => {
  const outlet = document.getElementById('outlet');
  const router = new Router(outlet);
  
  router.setRoutes([
    {
      path: '/',
      component: 'employee-page',
      action: () => import('./pages/employee-page.js')
    },
    {
      path: '/add-employee',
      component: 'add-employee-page',
      action: () => import('./pages/add-employee-page.js')
    },
  ]);
});
