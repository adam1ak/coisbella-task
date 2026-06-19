import './scss/main.scss'
import { fetchProducts } from './api.js'

console.log("Main js loaded")

async function init() {
    try {
        const products = await fetchProducts()
        
        console.log("Products fetched successfully: ")
        console.log(products)
    } catch (error) {
        console.log("Initialization failed in main.js: ", error)

        // user error display
    }
}

init()