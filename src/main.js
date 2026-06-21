import './scss/main.scss'
import { fetchProducts } from './js/api.js'
import { populateCategories, updateProductsCount, renderProducts, renderPagination, renderModalContent } from './js/ui.js'
import { debounce } from './js/utils.js'
import { state } from './js/state.js'
import { syncStateToURL, readStateFromURL } from './js/url.js'

console.log("Main js loaded")

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

function setupModalOpenListener() {
    const productsContainer = document.getElementById("products-container")
    const modal = document.getElementById("product-modal")

    if (!productsContainer || !modal) {
        console.error("Missing DOM elements (products-container or product-modal)")
        return
    }

    productsContainer.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card")
        if (!card) return

        const productId = parseInt(card.dataset.id)
        const clickedProduct = state.products.find((p) => p.id === productId)

        if (!clickedProduct) return

        renderModalContent(clickedProduct)
        modal.classList.remove("hidden")
        modal.setAttribute("aria-hidden", "false")
    })
}

function setupModalCloseListeners() {
    const modal = document.getElementById("product-modal")

    if (!modal) {
        console.error("Missing DOM element product-modal")
        return
    }

    modal.addEventListener("click", (e) => {
        const isCloseBtn = e.target.closest(".modal__close-btn")

        if (e.target === modal || isCloseBtn) {
            modal.classList.add("hidden")
            modal.setAttribute("aria-hidden", "true")
        }
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