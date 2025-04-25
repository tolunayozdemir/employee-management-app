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
    return html`<nav></nav>`;
  }
}

customElements.define('navigation-container', NavigationContainer);
