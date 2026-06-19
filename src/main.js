import './scss/main.scss'
import { fetchProducts } from './js/api.js'
import { populateCategories, updateProductsCount, renderProducts, renderPagination } from './js/ui.js'
import { state } from './js/state.js'

console.log("Main js loaded")

function debounce(fun, delay = 300) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fun(...args), delay)
    }
}

function syncStateToURL() {
    const url = new URL(window.location)

    if (state.filters.category) {
        url.searchParams.set("category", state.filters.category)
    } else {
        url.searchParams.delete("category")
    }
    if (state.filters.minPrice) {
        url.searchParams.set("minPrice", state.filters.minPrice)
    } else {
        url.searchParams.delete("minPrice")
    }
    if (state.filters.maxPrice) {
        url.searchParams.set("maxPrice", state.filters.maxPrice)
    } else {
        url.searchParams.delete("maxPrice")
    }

    if (state.pagination.currentPage > 1) {
        url.searchParams.set("page", state.pagination.currentPage)
    } else {
        url.searchParams.delete("page")
    }

    window.history.pushState({}, "", url)
}

function readStateFromURL() {
    const params = new URLSearchParams(window.location.search)

    state.filters.category = params.get("category") || ""
    state.filters.minPrice = params.get("minPrice") || ""
    state.filters.maxPrice = params.get("maxPrice") || ""
    state.pagination.currentPage = parseInt(params.get("page")) || 1

    const categorySelect = document.getElementById("category-select")
    const priceMinInput = document.getElementById("price-min")
    const priceMaxInput = document.getElementById("price-max")

    if (categorySelect) categorySelect.value = state.filters.category
    if (priceMinInput) priceMinInput.value = state.filters.minPrice
    if (priceMaxInput) priceMaxInput.value = state.filters.maxPrice
}

function updateDisplay() {
    const { currentPage, itemsPerPage } = state.pagination

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const productsToRender = state.filteredProducts.slice(startIndex, endIndex)

    renderProducts(productsToRender)
    updateProductsCount(state.filteredProducts.length)
    renderPagination(state.filteredProducts.length, itemsPerPage, currentPage)

    syncStateToURL()
}

function applyFilters(resetPage = true) {
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

    if (resetPage) state.pagination.currentPage = 1

    updateDisplay()
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

function setupPaginationListener() {
    const container = document.getElementById("pagination-container")

    if (!container) {
        console.error("Missing DOM pagination-container")
        return
    }

    container.addEventListener("click", (e) => {
        const button = e.target.closest(".pagination-btn")

        if (!button || button.hasAttribute("disabled")) return

        const targetPage = parseInt(button.dataset.page)
        state.pagination.currentPage = targetPage

        updateDisplay()
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

        readStateFromURL()
        applyFilters(false)

        setupFilterListeners()
        setupPaginationListener()

        loader.classList.add("hidden")
    } catch (error) {
        console.log("Initialization failed in main.js: ", error)

        loader.classList.add("hidden")
        errorMessage.classList.remove("hidden")
    }
}

init()