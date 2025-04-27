import {html, LitElement, css} from 'lit';
import './language-switcher.js';
import {I18n} from '../i18n/index.js';

export class NavigationContainer extends LitElement {
  static get properties() {
    return {
      currentPath: {type: String},
    };
  }

  constructor() {
    super();
    this.currentPath = window.location.pathname;

    this._handleLocationChanged = this._handleLocationChanged.bind(this);

    window.addEventListener(
      'vaadin-router-location-changed',
      this._handleLocationChanged
    );
  }

  _handleLocationChanged(event) {
    this.currentPath = event.detail.location.pathname;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._handleLocationChanged
    );
  }

  static get styles() {
    return css`
      nav {
        background-color: var(--white);
        padding: 1rem;
        box-shadow: var(--box-shadow);
        border-radius: var(--radius-sm);
        display: flex;
        justify-content: space-between;
      }

      ul {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
        gap: 1.5rem;
      }

      li {
        margin: 0;
      }

      a {
        color: var(--text-color);
        text-decoration: none;
        font-weight: 500;
        transition: color var(--transition-default);
        padding: 0.5rem 0;
        position: relative;
      }

      a:hover {
        color: var(--primary-color);
      }

      a.active {
        color: var(--primary-color);
      }

      a::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 0.125rem;
        background-color: var(--primary-color);
        transition: width var(--transition-default);
      }

      a.active::after,
      a:hover::after {
        width: 100%;
      }
    `;
  }

  render() {
    return html`
      <nav>
        <ul>
          <li>
            <a href="/" class=${this.currentPath === '/' ? 'active' : ''}
              >${I18n.t('nav.employeeList')}</a
            >
          </li>
          <li>
            <a
              href="/add-employee"
              class=${this.currentPath === '/add-employee' ? 'active' : ''}
              >${I18n.t('nav.addEmployee')}</a
            >
          </li>
        </ul>
        <language-switcher></language-switcher>
      </nav>
    `;
  }
}

customElements.define('navigation-container', NavigationContainer);
