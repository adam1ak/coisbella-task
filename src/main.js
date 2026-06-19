import './scss/main.scss'
import { fetchProducts } from './js/api.js'
import { populateCategories, updateProductsCount, renderProducts } from './js/ui.js'
import { state } from './js/state.js'

console.log("Main js loaded")

async function init() {
    const loader = document.getElementById("loader")
    const errorMessage = document.getElementById("error-message")

    if (!loader || !errorMessage) {
        console.error("Missing DOM elements ('loader' or 'error-message')")
        return
    }

    try {
        loader.classList.remove("hidden")
        errorMessage.classList.add("hidden")

        const fetchedData = await fetchProducts()

        state.products = fetchedData
        state.filteredProducts = fetchedData

        console.log("Application state initialized successfully:", state)

        populateCategories(state.products)
        updateProductsCount(state.filteredProducts.length)

        renderProducts(state.filteredProducts)

        loader.classList.add("hidden")
    } catch (error) {
        console.log("Initialization failed in main.js: ", error)

        loader.classList.add("hidden")
        errorMessage.classList.remove("hidden")
    }
}

init()