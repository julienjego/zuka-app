const searchBox = document.querySelector("#bar-search");
const searchBtn = document.querySelector("#btn-search");
const randomBtn = document.querySelector("#btn-random-search");
// searchBtn.addEventListener("click", doSearch, false);
// randomBtn.addEventListener("click", doRandomSearch, false);

searchBox?.addEventListener("keydown", getEnter, false);

function getEnter(e: KeyboardEvent) {
    e = e;
    if (e.key === "Enter") {
        e.preventDefault();
        // doSearch();
        console.log("Enter");
    }
}
