import './scss/main.scss'
import { fetchProducts } from './api.js'

console.log("Main js loaded")

fetchProducts()

const appDiv = document.getElementById("app")
appDiv.innerHTML = "<h1>Works</h1>"