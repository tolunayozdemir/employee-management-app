import {html, LitElement, css} from 'lit';

export class NavigationContainer extends LitElement {
  static get styles() {
    return css`
      nav {
        background-color: var(--white);
        padding: 1rem;
        box-shadow: var(--box-shadow);
        border-radius: var(--radius-sm);
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
      
      a:hover::after {
        width: 100%;
      }
    `;
  }
  
  render() {
    return html`
      <nav>
        <ul>
          <li><a href="/">Employee List</a></li>
          <li><a href="/add-employee">Add Employee</a></li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('navigation-container', NavigationContainer);
