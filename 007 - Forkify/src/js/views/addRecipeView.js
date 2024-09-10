import View from "./view";

class AddRecipeView extends View {
  _parentEl = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this.#addHandlerWindow();
  }

  #addHandlerWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
    window.addEventListener("keydown", (e) => {
      if (this._overlay.classList.contains("hidden")) return;
      if (e.key === "Escape") this.toggleWindow();
    });
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = [...new FormData(e.target)];
      handler(Object.fromEntries(data));
    });
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }
}

export default new AddRecipeView();
