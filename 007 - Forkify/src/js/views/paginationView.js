import View from "./view";
import icons from "../../img/icons.svg";

class Pagination extends View {
  _parentEl = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPage = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    if (this._data.page === 1 && numPage > 1) {
      return this.#nextPage(currentPage);
    }

    if (this._data.page === numPage && numPage > 1) {
      return this.#previousPage(currentPage);
    }

    if (this._data.page < numPage) {
      return `${this.#previousPage(currentPage)} ${this.#nextPage(
        currentPage
      )}`;
    }

    return "";
  }

  #nextPage(page) {
    return `
    <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
  }

  #previousPage(page) {
    return `
    <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${page - 1}</span>
    </button>
    `;
  }
}
export default new Pagination();
