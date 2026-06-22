// app state
export const state = {
    // data from server
    products: [],

    // data after applying filters
    filteredProducts: [],

    // current configuration
    filters: {
        category: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "default"
    },

    // layout config
    pagination: {
        currentPage: 1,
        itemsPerPage: 5
    },

    activeProductId: null
}