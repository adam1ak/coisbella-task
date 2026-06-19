import './scss/main.scss'
import { fetchProducts } from './js/api.js'
import { populateCategories, updateProductsCount, renderProducts } from './js/ui.js'
import { state } from './js/state.js'

console.log("Main js loaded")

function debounce(fun, delay = 300) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fun(...args), delay)
    }
}

function applyFilters() {
    state.filteredProducts = state.products.filter((product) => {
        const matchCategory = state.filters.category === "" || product.category === state.filters.category

        const minPrice = state.filters.minPrice === ""
        ? 0
        : parseFloat(state.filters.minPrice)
        const matchMinPrice = product.price >= minPrice

        const maxPrice = state.filters.maxPrice === ""
        ? Infinity
        : parseFloat(state.filters.maxPrice)
        const matchMaxPrice = product.price <= maxPrice
    
        return matchCategory && matchMinPrice && matchMaxPrice
    })

    console.log("Filters aplied: ", state.filteredProducts)

    renderProducts(state.filteredProducts)
    updateProductsCount(state.filteredProducts.length)
}

function setupFilterListeners() {
    const categorySelect = document.getElementById("category-select")
    const priceMinInput = document.getElementById("price-min")
    const priceMaxInput = document.getElementById("price-max")
    const resetBtn = document.getElementById("reset-btn")

    if (!categorySelect || !priceMinInput || !priceMaxInput || !resetBtn) {
        console.error("Filter DOM elements are missing!")
        return
    }

    categorySelect.addEventListener("change", (e) => {
        state.filters.category = e.target.value
        applyFilters()
    })

    const debouncedApplyFilters = debounce(applyFilters, 300)

    priceMinInput.addEventListener("input", (e) => {
        state.filters.minPrice = e.target.value
        debouncedApplyFilters()
    })

    priceMaxInput.addEventListener("input", (e) => {
        state.filters.maxPrice = e.target.value
        debouncedApplyFilters()
    })

    resetBtn.addEventListener("click", () => {
        state.filters.category = ""
        state.filters.minPrice = ""
        state.filters.maxPrice = ""

        categorySelect.value = ""
        priceMinInput.value = ""
        priceMaxInput.value = ""

        applyFilters()
    })
}

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

        setupFilterListeners()

        loader.classList.add("hidden")
    } catch (error) {
        console.log("Initialization failed in main.js: ", error)

        loader.classList.add("hidden")
        errorMessage.classList.remove("hidden")
    }
}

init()