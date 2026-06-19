import './scss/main.scss'
import { fetchProducts } from './api.js'

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

        const products = await fetchProducts()

        console.log("Products fetched successfully: ")
        console.log(products)

        loader.classList.add("hidden")
    } catch (error) {
        console.log("Initialization failed in main.js: ", error)

        loader.classList.add("hidden")
        errorMessage.classList.remove("hidden")
    }
}

init()