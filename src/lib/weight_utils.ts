const formatter = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0})

export function formatWeight(weight: number) : string {
    return formatter.format(weight).replace(',','')
}
