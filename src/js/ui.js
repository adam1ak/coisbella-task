export function populateCategories(products) {
    if (!products) {
        console.error("Required products")
        return
    }

    const categorySelect = document.getElementById("category-select")

    if (!categorySelect) {
        console.error("Missing DOM elements: category-select")
        return
    }

    const allCategories = products.map((p) => p.category)
    const uniqueCategories = [...new Set(allCategories)]

    console.log("Categories: ", uniqueCategories)

    uniqueCategories.forEach((cat) => {
        const option = document.createElement("option")
        option.value = cat
        option.textContent = cat
        categorySelect.appendChild(option)
    })
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

    const cardsHTML = products.map((product) => {
        return `
            <artice class="product-card" data-id="${product.id}">
                <div class="product-card__content">
                    <span class="product-card__id">#${product.id}</span>
                    <h3 class="product-card__title">${product.name}</h3>
                    <span class="product-card__category">${product.category}</span>
                    <p class="product-card__price">${priceFormatter.format(product.price)}</p>
                </div>
            </article>
        `
    }).join("")

    container.innerHTML = cardsHTML
}

export function renderPagination(totalItemsAmount, itemsPerPage, currentPage) {
    if (!totalItemsAmount || itemsPerPage < 0 || currentPage < 0) {
        console.error("Some attributes are wrong")
        return
    }

    const container = document.getElementById("pagination-container")

    if (!container) {
        console.error("Missing DOM element: pagination container")
    }

    const totalPages = Math.ceil(totalItemsAmount / itemsPerPage)

    if (totalPages <= 1) {
        container.innerHTML = ""
        return
    }

    let html = ""

    html += `
        <button class="pagination-btn pagination-btn--prev" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>
        &lt;
        </button>
    `

    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage ? "pagination-btn--active" : ""

        html += `
            <button class="pagination-btn ${isActive}" data-page="${i}">
                    ${i}
            </button>
        `
    }

    html += `
        <button class="pagination-btn pagination-btn--next" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>
        &gt;
        </button>
    `

    container.innerHTML = html
}

export function renderModalContent(product) {
    if (!product) {
        console.error("Missing product element")
        return
    }

    const modal = document.getElementById("product-modal")

    if (!modal) {
        console.error("Missing DOM element: modal-body")
        return
    }

    const priceFormatter = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN"
    })

    modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: 100px auto; position: relative;">
            <button class="modal-close-btn" style="position: absolute; top: 10px; right: 10px; cursor: pointer;">&times;</button>
            <p>Nazwa z API: <strong>${product.name}</strong></p>
            <p>Odczytane ID: #${product.id}</p>
        </div>
    `
}