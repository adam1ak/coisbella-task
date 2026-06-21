import './scss/main.scss'
import { fetchProducts } from './js/core/api.js'
import { populateCategories } from './js/components/categories.js'
import { state } from './js/core/state.js'
import { readStateFromURL } from './js/utils/url.js'
import { 
    applyFilters, 
    setupFilterListeners, 
    setupPaginationListener, 
    setupModalOpenListener, 
    setupModalCloseListeners 
} from './js/core/events.js'

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

        readStateFromURL()
        applyFilters(false)

        setupFilterListeners()
        setupPaginationListener()
        setupModalOpenListener()
        setupModalCloseListeners()

        loader.classList.add("hidden")
    } catch (error) {
        console.log("Initialization failed in main.js: ", error)

        loader.classList.add("hidden")
        errorMessage.classList.remove("hidden")
    }
}

init()