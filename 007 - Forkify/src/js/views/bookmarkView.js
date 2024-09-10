import View from "./view";
import previewView from "./previewView";

class BookmarkView extends View {
  _parentEl = document.querySelector(".bookmarks__list");
  _errorMessage = "No recipe found for your query! Please try again ;)";
  _successMessage = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarkView();
