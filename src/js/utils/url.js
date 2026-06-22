import { state } from '../core/state'

export function syncStateToURL() {
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

    if (state.filters.sortBy && state.filters.sortBy !== "default") {
        url.searchParams.set("sortBy", state.filters.sortBy)
    } else {
        url.searchParams.delete("sortBy")
    }

    if (state.pagination.currentPage > 1) {
        url.searchParams.set("page", state.pagination.currentPage)
    } else {
        url.searchParams.delete("page")
    }

    if (state.activeProductId) {
        url.searchParams.set("productId", state.activeProductId)
    } else {
        url.searchParams.delete("productId")
    }

    window.history.replaceState({}, "", url)
}

export function readStateFromURL() {
    const params = new URLSearchParams(window.location.search)

    state.filters.category = params.get("category") || ""
    state.filters.minPrice = params.get("minPrice") || ""
    state.filters.maxPrice = params.get("maxPrice") || ""
    state.filters.sortBy = params.get("sortBy") || "default"
    state.pagination.currentPage = parseInt(params.get("page")) || 1

    const urlProductId = params.get("productId")
    state.activeProductId = urlProductId ? parseInt(urlProductId) : null

    const categorySelect = document.getElementById("category-select")
    const priceMinInput = document.getElementById("price-min")
    const priceMaxInput = document.getElementById("price-max")
    const sortSelect = document.getElementById("sort-select")

    if (categorySelect) categorySelect.value = state.filters.category
    if (priceMinInput) priceMinInput.value = state.filters.minPrice
    if (priceMaxInput) priceMaxInput.value = state.filters.maxPrice
    if (sortSelect) sortSelect.value = state.filters.sortBy
}