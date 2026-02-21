export function formatCurrency(cents) {
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
    }).format(cents / 100)
}
