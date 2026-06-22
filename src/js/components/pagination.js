export function renderPagination(totalItemsAmount, itemsPerPage, currentPage) {
    if (totalItemsAmount == null || itemsPerPage <= 0 || currentPage <= 0) {
        console.error("Some attributes are wrong")
        return
    }

    const container = document.getElementById("pagination-container")

    if (!container) {
        console.error("Missing DOM element: pagination container")
        return
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