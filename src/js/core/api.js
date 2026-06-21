const API_URL = "https://s5.cosibella.pl/api/test/products"

export async function fetchProducts() {
    try {
        const response = await fetch(API_URL)

        if (!response.ok){
            throw new Error("Connection error: ", response.status)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetchin data from API: ", error)
        
        throw error
    }
}