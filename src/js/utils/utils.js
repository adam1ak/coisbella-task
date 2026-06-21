export function debounce(fun, delay = 300) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fun(...args), delay)
    }
}

export function createPriceHTML(price, priceFormatter, decimalClassName = "price-decimals") {
    const parts = priceFormatter.formatToParts(price)
    
    let mainPrice = ""
    let restPrice = ""

    parts.forEach((part) => {
        if (part.type === "integer" || part.type === "group") {
            mainPrice += part.value
        } else {
            restPrice += part.value
        }
    })

    return `${mainPrice}<span class="${decimalClassName}">${restPrice}</span>`
}