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
