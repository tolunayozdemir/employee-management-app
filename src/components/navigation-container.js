import {html, LitElement, css} from 'lit';

export class NavigationContainer extends LitElement {
  static get styles() {
    return css`
      nav {
        background-color: var(--white);
        padding: 1rem;
      }
      ul {
        display: flex;
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
