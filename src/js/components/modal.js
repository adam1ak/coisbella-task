import { createPriceHTML } from "../utils/utils.js"

const priceFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN"
})

function createTagsHTML(tags) {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return ""
    return `
        <div class="modal__tags-container">
            ${tags.map(tag => `<span class="modal__tag">#${tag}</span>`).join("")}
        </div>
    `
}

function createModalInnerHTML(product, priceFormatter, tagsSectionHTML) {
    const formattedPriceHTML = createPriceHTML(product.price, priceFormatter, "modal__price-decimals")
    
    return `
        <div class="modal__content" role="document">
            <div class="modal__header">
                <button class="modal__close-btn" aria-label="Zamknij szczegóły">&times;</button>
            
                <div class="modal__meta-row">
                    <p class="modal__category">${product.category}</p>
                    <span class="modal__meta-id">ID ${product.id}</span>
                </div>
            </div>

            <h2 class="modal__title">${product.name}</h2>

            ${tagsSectionHTML}

            <div class="modal__price-row">
                <p class="modal__price">${formattedPriceHTML}</p>
                
                <div class="stock-status ${product.stock ? "stock-status--available" : "stock-status--empty"}">
                    <span class="stock-status__dot" aria-hidden="true"></span>
                    <p class="stock-status__text">${product.stock ? "na stanie" : "brak produktu"}</p>
                </div>
            </div>

            <div class="modal__body">
                <p class="modal__desc">${product.description}</p>
            </div>
        </div>
    `
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

    const tagsSectionHTML = createTagsHTML(product.tags)
    modal.innerHTML = createModalInnerHTML(product, priceFormatter, tagsSectionHTML)
}