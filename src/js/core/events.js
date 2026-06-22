import { state } from './state.js'
import { debounce } from '../utils/utils.js'
import { syncStateToURL, readStateFromURL } from '../utils/url.js'
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
    let processedProducts = state.products.filter((product) => {
        const matchCategory = state.filters.category === "" || product.category === state.filters.category

        const minPrice = state.filters.minPrice === "" ? 0 : parseFloat(state.filters.minPrice)
        const matchMinPrice = product.price >= minPrice

        const maxPrice = state.filters.maxPrice === "" ? Infinity : parseFloat(state.filters.maxPrice)
        const matchMaxPrice = product.price <= maxPrice

        return matchCategory && matchMinPrice && matchMaxPrice
    })

    if (state.filters.sortBy !== "default") {
        processedProducts.sort((a, b) => {
            switch (state.filters.sortBy) {
                case "name-asc":
                    return a.name.localeCompare(b.name, "pl")
                case "name-desc":
                    return b.name.localeCompare(a.name, "pl")
                case "price-asc":
                    return a.price - b.price
                case "price-desc":
                    return b.price - a.price
                case "stock-asc":
                    return b.stock - a.stock
                case "stock-desc":
                    return a.stock - b.stock
                default:
                    return 0
            }
        })
    }

    state.filteredProducts = processedProducts

    const categorySelect = document.getElementById("category-select")
    if (categorySelect) {
        if (state.filters.category !== "") categorySelect.classList.add("is-active")
        else categorySelect.classList.remove("is-active")
    }

    const sortSelect = document.getElementById("sort-select")
    if (sortSelect) {
        if (state.filters.sortBy !== "default") sortSelect.classList.add("is-active")
        else sortSelect.classList.remove("is-active")
    }

    if (resetPage) state.pagination.currentPage = 1

    updateDisplay()
}

export function setupFilterListeners() {
    const categorySelect = document.getElementById("category-select")
    const priceMinInput = document.getElementById("price-min")
    const priceMaxInput = document.getElementById("price-max")
    const sortSelect = document.getElementById("sort-select")
    const resetBtn = document.getElementById("reset-btn")

    if (!categorySelect || !priceMinInput || !priceMaxInput || !sortSelect || !resetBtn) {
        console.error("Filter DOM elements are missing")
        return
    }

    categorySelect.addEventListener("change", (e) => {
        state.filters.category = e.target.value
        applyFilters()
    })

    sortSelect.addEventListener("change", (e) => {
        state.filters.sortBy = e.target.value
        applyFilters(false)
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
        state.filters.sortBy = "default"

        categorySelect.value = ""
        priceMinInput.value = ""
        priceMaxInput.value = ""
        sortSelect.value = "default"

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

        const productId = card.dataset.id
        const clickedProduct = state.products.find((p) => String(p.id) === String(productId))

        if (!clickedProduct) return

        state.activeProductId = productId
        syncStateToURL()

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
            closeModal(modal)
        }
    })

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal(modal)
        }
    })
}

function closeModal(modal) {
    state.activeProductId = null
    syncStateToURL()
    modal.classList.add("hidden")
    modal.setAttribute("aria-hidden", "true")
}

export function checkAndOpenModalFromURL() {
    if (!state.activeProductId) return

    const matchedProduct = state.products.find((p) => String(p.id) === String(state.activeProductId))
    const modal = document.getElementById("product-modal")

    if (!matchedProduct) {
        console.warn(`Product with ID ${state.activeProductId} not found. Cleaning URL parameter.`);
        
        state.activeProductId = null
        syncStateToURL()
        return
    }

    if (modal) {
        renderModalContent(matchedProduct)
        modal.classList.remove("hidden")
        modal.setAttribute("aria-hidden", "false")
    }
}

export function setupPopstateListener() {
    window.addEventListener("popstate", () => {
        readStateFromURL()
        applyFilters(false)
        checkAndOpenModalFromURL()
    })
}