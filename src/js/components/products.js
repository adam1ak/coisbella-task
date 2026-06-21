import { createPriceHTML } from "../utils/utils.js"

function createProductCardHTML(product, priceFormatter) {
    const formattedPriceHTML = createPriceHTML(product.price, priceFormatter, "product-card__price-decimals")
    
    return `
        <article class="product-card" data-id="${product.id}" aria-label="Otwórz szczegóły ${product.name}">
            <div class="product-card__top">
                <p class="product-card__category">${product.category}</p>

                <div class="product-card__stock">
                    <span class="stock-dot ${product.stock ? "stock-dot--available" : "stock-dot--empty"}" aria-hidden="true"></span>
                    <p>${product.stock ? "Dostępny" : "Niedostępny"}</p>
                </div>
            </div>

            <h3 class="product-card__name">${product.name}</h3>

            <p class="product-card__price">${formattedPriceHTML}</p>

            <div class="product-card__foot">
                <p class="product-card__id">#${product.id}</p>
                <p class="product-card__cta">Szczegóły</p>
            </div>
        </article>
    `
}

export function updateProductsCount(count) {
    const countElement = document.getElementById("products-count")

    if (!countElement) {
        console.error("Missing DOM element: products-count")
        return
    }

    let text = ""
    if (count <= 0) {
        text = "Nie znaleziono produktów"
    } else text = `Znaleziono ${count} produktów`

    countElement.textContent = text
}

export function renderProducts(products) {
    if (!products) {
        console.error("Required products")
        return
    }

    const container = document.getElementById("products-container")

    if (!container) {
        console.log("Missing DOM element: products-container")
        return
    }

    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-results-feedback" role="alert">
                Brak produktów spełniających wybrane kryteria.
            </div>
        `
        return
    }

    const priceFormatter = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN"
    })

    container.innerHTML = products.map((product) => createProductCardHTML(product, priceFormatter)).join("")
}