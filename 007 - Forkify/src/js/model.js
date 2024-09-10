import { API_RECIPE, SEARCH_API, PAGE_COUNTS, API_KRY } from "./config";
import { AJAX } from "./helper";

export const state = {
  recipe: {},
  bookmarks: [],
  search: {
    query: "",
    result: [],
    resultPerPage: PAGE_COUNTS,
    page: 1,
  },
};

// getting data recipe
export const loadRecipe = async (id) => {
  try {
    const { recipe } = await AJAX(`${API_RECIPE}/${id}?key=${API_KRY}`);
    state.recipe = recipe;

    if (state.bookmarks.some((el) => el.id === recipe.id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    throw error;
  }
};

// getting search data
export const loadSearchResult = async (query) => {
  try {
    const { recipes } = await AJAX(`${SEARCH_API}${query}&key=${API_KRY}`);

    state.search.query = query;
    recipes.forEach((el) => state.search.result.push(el));
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

// Setting Pagination data
export const getSearchResultPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.result.slice(start, end);
};

// setting pages
export const updateServing = (newServing) => {
  state.recipe.ingredients.forEach((el) => {
    el.quantity = (el.quantity * newServing) / state.recipe.servings;
  });

  state.recipe.servings = newServing;
};

// adding bookmarks
export const addBookmark = (recipe) => {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = (id) => {
  state.bookmarks = state.bookmarks.filter((el) => el.id !== id);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

// bookmark to localStorage
const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

const bookmark = function () {
  const storage = localStorage.getItem("bookmarks");
  if (!storage) return;
  state.bookmarks = JSON.parse(storage);
};
bookmark();

const clearBookmarks = () => {
  localStorage.clear("bookmarks");
};

// upload recipe
export const uploadRecipe = async (newRecipe) => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0]?.startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1]?.split(",").map((el) => el.trim());
        if (ingArr.length !== 3) {
          throw new Error("Wrong Ingredient format! Please use correct formal");
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const newRecipeData = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const { recipe } = await AJAX(
      `${API_RECIPE}/?key=${API_KRY}`,
      newRecipeData
    );

    state.recipe = recipe;
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
