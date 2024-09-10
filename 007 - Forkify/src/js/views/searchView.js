import View from "./view";

class SearchView extends View {
  _parentEl = document.querySelector(".search");

  getQuery() {
    const query = document.querySelector(".search__field").value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    document.querySelector(".search__field").value = "";
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
