import { createPriceHTML } from "../utils/utils.js"

function createProductCardHTML(product, priceFormatter) {
    const formattedPriceHTML = createPriceHTML(product.price, priceFormatter, "product-card__price-decimals")

    return `
        <article class="product-card" data-id="${product.id}" aria-label="Otwórz szczegóły ${product.name}">
            <div class="product-card__top">
                <p class="product-card__category">${product.category}</p>

                <div class="stock-status ${product.stock ? "stock-status--available" : "stock-status--empty"}">
                    <span class="stock-status__dot" aria-hidden="true"></span>
                    <p class="stock-status__text">${product.stock ? "Dostępny" : "Niedostępny"}</p>
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
    } else text = `Znaleziono <span>${count}</span> produktów`

    countElement.innerHTML = text
}

export function renderProducts(products) {
    if (!products) {
        console.error("Required products")
        return
    }

    const container = document.getElementById("products-container")
    const noResultsElement = document.getElementById("no-results")

    if (!container) {
        console.log("Missing DOM element: products-container")
        return
    }

    if (products.length === 0) {
        container.innerHTML = ""
        if (noResultsElement) noResultsElement.classList.remove("hidden")
        return
    }

    if (noResultsElement) noResultsElement.classList.add("hidden")

    const priceFormatter = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN"
    })

    container.innerHTML = products.map((product) => createProductCardHTML(product, priceFormatter)).join("")
}