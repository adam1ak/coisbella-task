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