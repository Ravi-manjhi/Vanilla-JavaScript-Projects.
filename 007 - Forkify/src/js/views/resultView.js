import View from "./view";
import previewView from "./previewView";

class ResultView extends View {
  _parentEl = document.querySelector(".results");
  _errorMessage = "No recipe found for your query! Please try again ;)";
  _successMessage = "";

  _generateMarkup() {
    return this._data
      .map((recipe) => previewView.render(recipe, false))
      .join("");
  }
}

export default new ResultView();
