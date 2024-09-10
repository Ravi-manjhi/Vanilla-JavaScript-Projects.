import "core-js/stable";
import "regenerator-runtime";
import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultView from "./views/resultView";
import paginationView from "./views/paginationView";
import bookmarkView from "./views/bookmarkView";
import addRecipeView from "./views/addRecipeView";

if (model.hot) {
  module.hot.accept();
}

// display recipe
const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Update view
    resultView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    // loading & rendering recipe
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

// display search result
const controlSearchResult = async () => {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResult(query);
    resultView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
    resultView.renderError();
  }
};

// page render
const controlPagination = (page) => {
  resultView.render(model.getSearchResultPage(page));
  paginationView.render(model.state.search);
};

// control Num of serving
const controlService = (newServing) => {
  model.updateServing(newServing);
  recipeView.update(model.state.recipe);
};

// controller for adding bookmarks
const controllerBookmark = () => {
  // add / remove bookmarks
  if (model.state.recipe.bookmarked) {
    model.removeBookmark(model.state.recipe.id);
  } else {
    model.addBookmark(model.state.recipe);
  }
  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

// render bookmarks
const controlBookmarks = () => {
  bookmarkView.render(model.state.bookmarks);
};

// create or remove Recipe
const controlAddRemoveRecipe = async (recipe) => {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(recipe);
    recipeView.render(model.state.recipe);

    bookmarkView.render(model.state.bookmarks);
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    addRecipeView.renderMassage("Successful added!");
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 1000);

    //
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error?.response.data.message);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};

// calling the methods
(function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServing(controlService);
  recipeView.addHandlerBookmarks(controllerBookmark);
  addRecipeView.addHandlerUpload(controlAddRemoveRecipe);
})();
