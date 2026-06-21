function createProductCardHTML(product, priceFormatter) {
    return `
        <article class="product-card" data-id="${product.id}">
            <div class="product-card__content">
                <span class="product-card__id">#${product.id}</span>
                <h3 class="product-card__title">${product.name}</h3>
                <span class="product-card__category">${product.category}</span>
                <p class="product-card__price">${priceFormatter.format(product.price)}</p>
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