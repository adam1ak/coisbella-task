function createTagsHTML(tags) {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return ""
    return `
        <div class="modal__tags-container">
            ${tags.map(tag => `<span class="modal__tag">${tag}</span>`).join("")}
        </div>
    `
}

function createModalInnerHTML(product, priceFormatter, tagsSectionHTML) {
    return `
        <div class="modal__content" role="document">
            <div class="modal__header">
                <button class="modal__close-btn" aria-label="Zamknij szczegóły">&times;</button>
            
                <div class="modal__meta-row">
                    <p class="modal__category">${product.category}</p>
                    <span class="modal__meta-id">#${product.id}</span>
                </div>
                
                <h2 class="modal__title">${product.name}</h2>
            </div>

            <div class="modal__body">
                <h3 class="modal__price">${priceFormatter.format(product.price)}</h3>

                <dl class="modal_spec">
                    <div class="modal__spec-group">
                        <dt class="modal__label">ID produktu</dt>
                        <dd class="modal__value">${product.id}</dd>
                    </div>

                    <div class="modal__spec-group">
                        <dt class="modal__label">Kategoria</dt>
                        <dd class="modal__value">${product.category}</dd>
                    </div>

                    <div class="modal__spec-group">
                        <dt class="modal__label">Opis</dt>
                        <dd class="modal__value">${product.description || "Brak opisu dla tego produktu."}</dd>
                    </div>

                    <div class="modal__spec-group">
                        <dt class="modal__label">Stan magazynowy</dt>
                        <dd class="modal__value">${product.stock ? "Dostępny" : "Niedostępny"}</dd>
                    </div>
                </dl>

                ${tagsSectionHTML}
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

    const priceFormatter = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN"
    })

    const tagsSectionHTML = createTagsHTML(product.tags)
    modal.innerHTML = createModalInnerHTML(product, priceFormatter, tagsSectionHTML)
}