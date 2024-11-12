

// Define pricing for each plan
const prices = {
    basic: { annual: 99.99, monthly: 9.99 },
    advanced: { annual: 199.99, monthly: 19.99 },
    pro: { annual: 299.99, monthly: 29.99 }
};

// Select elements by their IDs for easy access
const basicPrice = document.getElementById("basic");
const advancedPrice = document.getElementById("advanced");
const proPrice = document.getElementById("pro");
const checkbox = document.getElementById("checkbox");

// Function to update prices based on checkbox state
const updatePrices = () => {
    const billingCycle = checkbox.checked ? "monthly" : "annual";

    basicPrice.innerHTML = `&dollar;${prices.basic[billingCycle].toFixed(2)}`;
    advancedPrice.innerHTML = `&dollar;${prices.advanced[billingCycle].toFixed(2)}`;
    proPrice.innerHTML = `&dollar;${prices.pro[billingCycle].toFixed(2)}`;
};

// Add event listener to checkbox to update prices on toggle
checkbox.addEventListener("change", updatePrices);

// Initialize with annual prices
updatePrices();

