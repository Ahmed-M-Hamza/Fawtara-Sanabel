export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0'
  
  // Check if the number is a whole number (no decimal part)
  const isWholeNumber = num % 1 === 0
  
  if (isWholeNumber) {
    // For whole numbers, format without decimals
    const sign = num < 0 ? '-' : ''
    return sign + Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } else {
    // For decimal numbers, format with 2 decimal places
    const parts = Math.abs(num).toFixed(2).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const sign = num < 0 ? '-' : ''
    return sign + parts.join('.')
  }
}

export function calculatePricing({ vehiclePrice, salesSupport, financialSupportPercent, registrationFees, downPayment }) {
  const vehiclePriceNum = parseFloat(vehiclePrice) || 0
  const registrationFeesNum = parseFloat(registrationFees) || 0
  const downPaymentNum = parseFloat(downPayment) || 0
  
  // DIC Charges (salesSupport) is either -950 or -0
  const dicCharges = salesSupport === '-950' ? -950 : (salesSupport === '-0' ? -0 : 0)
  const dicChargesDisplay = salesSupport === '-950' ? '-950' : (salesSupport === '-0' ? '-0' : '0')
  
  // قيمة الدعم المالي / عمولة الوكيل = -(نسبة الدعم المالي) × (سعر السيارة + التسجيل)
  const percentNum = parseFloat(financialSupportPercent) || 0
  const agentCommissionNum = -(percentNum / 100) * (vehiclePriceNum + registrationFeesNum)
  
  // priceExclVat = vehiclePrice + dicCharges + agentCommission (الدعم سالب فيقلل السعر)
  const priceExclVat = vehiclePriceNum + dicCharges + agentCommissionNum
  
  // vat15 = priceExclVat * 0.15
  const vat15 = priceExclVat * 0.15
  
  // netIncVat = priceExclVat + vat15
  const netIncVat = priceExclVat + vat15
  
  // netDue = netIncVat + registrationFees - downPayment
  const netDue = netIncVat + registrationFeesNum - downPaymentNum
  
  return {
    vehiclePrice: formatNumber(vehiclePriceNum),
    dicCharges: dicChargesDisplay,
    agentCommission: formatNumber(agentCommissionNum),
    priceExclVat: formatNumber(priceExclVat),
    vat15: formatNumber(vat15),
    netIncVat: formatNumber(netIncVat),
    registrationFees: formatNumber(registrationFeesNum),
    downPayment: formatNumber(downPaymentNum),
    netDue: formatNumber(netDue)
  }
}

/**
 * تسعير الفاتورة الثانية فقط: الضريبة تُحسب على سعر السيارة فقط
 * (بدون DIC وبدون نسبة الدعم المالي)
 */
export function calculatePricingForInvoice2({ vehiclePrice, registrationFees, downPayment }) {
  const vehiclePriceNum = parseFloat(vehiclePrice) || 0
  const registrationFeesNum = parseFloat(registrationFees) || 0
  const downPaymentNum = parseFloat(downPayment) || 0

  const priceExclVat = vehiclePriceNum
  const vat15 = vehiclePriceNum * 0.15
  const netIncVat = vehiclePriceNum + vat15
  const netDue = netIncVat + registrationFeesNum - downPaymentNum

  return {
    vehiclePrice: formatNumber(vehiclePriceNum),
    priceExclVat: formatNumber(priceExclVat),
    vat15: formatNumber(vat15),
    netIncVat: formatNumber(netIncVat),
    registrationFees: formatNumber(registrationFeesNum),
    downPayment: formatNumber(downPaymentNum),
    netDue: formatNumber(netDue)
  }
}
