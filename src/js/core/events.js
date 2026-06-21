import { state } from './state.js'
import { debounce } from '../utils/utils.js'
import { syncStateToURL } from '../utils/url.js'
import { renderProducts, updateProductsCount } from '../components/products.js'
import { renderPagination } from '../components/pagination.js'
import { renderModalContent } from '../components/modal.js'

export function updateDisplay() {
    const { currentPage, itemsPerPage } = state.pagination

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const productsToRender = state.filteredProducts.slice(startIndex, endIndex)

    renderProducts(productsToRender)
    updateProductsCount(state.filteredProducts.length)
    renderPagination(state.filteredProducts.length, itemsPerPage, currentPage)

    syncStateToURL()
}

export function applyFilters(resetPage = true) {
    state.filteredProducts = state.products.filter((product) => {
        const matchCategory = state.filters.category === "" || product.category === state.filters.category

        const minPrice = state.filters.minPrice === "" ? 0 : parseFloat(state.filters.minPrice)
        const matchMinPrice = product.price >= minPrice

        const maxPrice = state.filters.maxPrice === "" ? Infinity : parseFloat(state.filters.maxPrice)
        const matchMaxPrice = product.price <= maxPrice

        return matchCategory && matchMinPrice && matchMaxPrice
    })

    console.log("Filters applied: ", state.filteredProducts)

    if (resetPage) state.pagination.currentPage = 1

    updateDisplay()
}

export function setupFilterListeners() {
    const categorySelect = document.getElementById("category-select")
    const priceMinInput = document.getElementById("price-min")
    const priceMaxInput = document.getElementById("price-max")
    const resetBtn = document.getElementById("reset-btn")

    if (!categorySelect || !priceMinInput || !priceMaxInput || !resetBtn) {
        console.error("Filter DOM elements are missing")
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

export function setupPaginationListener() {
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

export function setupModalOpenListener() {
    const container = document.getElementById("products-container")
    const modal = document.getElementById("product-modal")

    if (!container || !modal) {
        console.error("Missing DOM elements (products-container or product-modal)")
        return
    }

    container.addEventListener("click", (e) => {
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

export function setupModalCloseListeners() {
    const modal = document.getElementById("product-modal")
    if (!modal) {
        console.error("Missing DOM element product-modal)")
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