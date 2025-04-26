import {LitElement, css, html} from 'lit';

export class PaginationComponent extends LitElement {
  static get properties() {
    return {
      currentPage: {type: Number},
      totalPages: {type: Number},
      itemsPerPage: {type: Number},
    };
  }

  constructor() {
    super();
    this.currentPage = 0;
    this.totalPages = 0;
  }
  static get styles() {
    return css`
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        gap: 0.5rem;
      }

      .pagination button {
        background: none;
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .pagination button:disabled {
        opacity: 0.5;
      }

      .pagination button.active {
        background-color: var(--primary-color);
        color: var(--white);
        border-color: var(--primary-color);
      }

      .pagination .page-info {
        margin: 0 0.5rem;
      }
    `;
  }

  _handlePageChange(page) {
    this.dispatchEvent(
      new CustomEvent('page-changed', {
        detail: {page},
      })
    );
  }

  _renderPageNumbers() {
    const totalPages = this.totalPages;

    let pageNumbers = [];
    const currentPage = this.currentPage;

    pageNumbers.push(0);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    if (endPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    if (totalPages > 1 && !pageNumbers.includes(totalPages - 1)) {
      pageNumbers.push(totalPages - 1);
    }
    return pageNumbers.map((page) => {
      if (page === '...') {
        return html`<span class="page-info">${page}</span>`;
      }
      return html`
        <button
          class="${this.currentPage === page ? 'active' : ''}"
          @click=${() => this._handlePageChange(page)}
        >
          ${page + 1}
        </button>
      `;
    });
  }

  render() {
    if (this.totalPages <= 1) return '';

    return html`
      <div class="pagination">
        <button
          @click=${() => this._handlePageChange(this.currentPage - 1)}
          ?disabled=${this.currentPage === 0}
        >
          <
        </button>

        ${this._renderPageNumbers()}

        <button
          @click=${() => this._handlePageChange(this.currentPage + 1)}
          ?disabled=${this.currentPage === this.totalPages - 1}
        >
          >
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-component', PaginationComponent);
