import { useMemo } from 'react'
import './PrintPage2.css'

/**
 * الفاتورة الثانية - قالب فاتورة الضريبة (فاتوره ١)
 * تُطبع بعد الفاتورة الأولى (القديمة) لكل رقم شاسيه
 */
function PrintPage2({ formData, pricing, fields, chassisNumber, pageNumber, documentNumber }) {
  const currentDateTime = useMemo(() => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const year = now.getFullYear()
    const hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const hours12 = hours % 12 || 12
    const hours12Str = String(hours12).padStart(2, '0')
    return `${month}/${day}/${year} ${hours12Str}:${minutes}:${seconds} ${ampm}`
  }, [])

  // وصف السيارة: موديل + سنة + لون
  const vehicleDescription = useMemo(() => {
    const parts = [formData.model, formData.year, formData.color].filter(Boolean)
    return parts.join(' - ') || ''
  }, [formData.model, formData.year, formData.color])

  return (
    <div className="print-page print-page-2">
      <div className="page page-2">
        {/* Document No */}
        {documentNumber && fields?.documentNo && (
          <div 
            className="field"
            style={{
              top: fields.documentNo.top,
              left: fields.documentNo.left,
              width: fields.documentNo.width,
              textAlign: fields.documentNo.align
            }}
          >
            {documentNumber}
          </div>
        )}

        {/* Page No */}
        {fields?.pageNo && (
          <div 
            className="field"
            style={{
              top: fields.pageNo.top,
              left: fields.pageNo.left,
              width: fields.pageNo.width,
              textAlign: fields.pageNo.align
            }}
          >
            {pageNumber || 1}
          </div>
        )}

        {/* Date */}
        {fields?.date && (
          <div 
            className="field"
            style={{
              top: fields.date.top,
              left: fields.date.left,
              width: fields.date.width,
              textAlign: fields.date.align
            }}
          >
            {currentDateTime}
          </div>
        )}

        {/* Showroom Name */}
        {formData.showroomName && fields?.showroomName && (
          <div 
            className="field showroom-name-field"
            style={{
              top: fields.showroomName.top,
              left: fields.showroomName.left,
              width: fields.showroomName.width,
              textAlign: fields.showroomName.align,
              direction: fields.showroomName.rtl ? 'rtl' : 'ltr'
            }}
          >
            {formData.showroomName}
          </div>
        )}

        {/* Customer Phone - رقم الجوال (الصفحة الأولى فقط - اللي فوق) */}
        {formData.customerPhone && fields?.customerPhone && (
          <div 
            className="field customer-phone-field"
            style={{
              top: fields.customerPhone.top,
              left: fields.customerPhone.left,
              width: fields.customerPhone.width,
              textAlign: fields.customerPhone.align,
              direction: fields.customerPhone.rtl ? 'rtl' : 'ltr'
            }}
          >
            {formData.customerPhone}
          </div>
        )}

        {/* Employee Number - الرقم الوظيفي (الصفحة الأولى فقط) */}
        {formData.employeeNumber && fields?.employeeNumber && (
          <div 
            className="field employee-number-field"
            style={{
              top: fields.employeeNumber.top,
              left: fields.employeeNumber.left,
              width: fields.employeeNumber.width,
              textAlign: fields.employeeNumber.align,
              direction: fields.employeeNumber.rtl ? 'rtl' : 'ltr',
              color: '#0e4e78',
              fontWeight: 'bold',
              fontSize: '0.75em'
            }}
          >
            {formData.employeeNumber}
          </div>
        )}

        {/* Customer Name - اسم العميل */}
        {formData.customerName && fields?.customerName && (
          <div 
            className="field customer-name-field"
            style={{
              top: fields.customerName.top,
              left: fields.customerName.left,
              width: fields.customerName.width,
              textAlign: fields.customerName.align,
              direction: fields.customerName.rtl ? 'rtl' : 'ltr'
            }}
          >
            {formData.customerName}
          </div>
        )}

        {/* Vehicle Description */}
        {vehicleDescription && fields?.vehicleDescription && (
          <div 
            className="field"
            style={{
              top: fields.vehicleDescription.top,
              left: fields.vehicleDescription.left,
              width: fields.vehicleDescription.width,
              textAlign: fields.vehicleDescription.align,
              direction: fields.vehicleDescription.rtl ? 'rtl' : 'ltr'
            }}
          >
            {vehicleDescription}
          </div>
        )}

        {/* Color */}
        {formData.color && fields?.color && (
          <div 
            className="field"
            style={{
              top: fields.color.top,
              left: fields.color.left,
              width: fields.color.width,
              textAlign: fields.color.align,
              direction: fields.color.rtl ? 'rtl' : 'ltr'
            }}
          >
            {formData.color}
          </div>
        )}

        {/* Chassis Number */}
        {chassisNumber && fields?.chassis && (
          <div 
            className="field chassis-field"
            style={{
              top: fields.chassis.top,
              left: fields.chassis.left,
              width: fields.chassis.width,
              textAlign: 'center',
              whiteSpace: fields.chassis.multiline ? 'pre-line' : 'nowrap'
            }}
          >
            {chassisNumber}
          </div>
        )}

        {/* Vehicle Price */}
        {fields?.vehiclePrice && (
          <div 
            className="field"
            style={{
              top: fields.vehiclePrice.top,
              left: fields.vehiclePrice.left,
              width: fields.vehiclePrice.width,
              textAlign: fields.vehiclePrice.align
            }}
          >
            {pricing.vehiclePrice}
          </div>
        )}

        {/* VAT 15% */}
        {fields?.vat15 && (
          <div 
            className="field"
            style={{
              top: fields.vat15.top,
              left: fields.vat15.left,
              width: fields.vat15.width,
              textAlign: fields.vat15.align
            }}
          >
            {pricing.vat15}
          </div>
        )}

        {/* Amount / Total with VAT in table */}
        {fields?.amount && (
          <div 
            className="field"
            style={{
              top: fields.amount.top,
              left: fields.amount.left,
              width: fields.amount.width,
              textAlign: fields.amount.align
            }}
          >
            {pricing.netIncVat}
          </div>
        )}

        {/* نسبة الدعم المالي - تظهر كتابة بجانب «دعم مالي» */}
        {fields?.subsidyPercent && (
          <div 
            className="field"
            style={{
              top: fields.subsidyPercent.top,
              left: fields.subsidyPercent.left,
              width: fields.subsidyPercent.width,
              textAlign: fields.subsidyPercent.align,
              direction: fields.subsidyPercent.rtl ? 'rtl' : 'ltr'
            }}
          >
            {formData.financialSupportPercent ? `${formData.financialSupportPercent}%` : '0%'}
          </div>
        )}

        {/* Price Excl VAT */}
        {fields?.priceExclVat && (
          <div 
            className="field"
            style={{
              top: fields.priceExclVat.top,
              left: fields.priceExclVat.left,
              width: fields.priceExclVat.width,
              textAlign: fields.priceExclVat.align
            }}
          >
            {pricing.priceExclVat}
          </div>
        )}

        {/* VAT Amount */}
        {fields?.vatAmount && (
          <div 
            className="field"
            style={{
              top: fields.vatAmount.top,
              left: fields.vatAmount.left,
              width: fields.vatAmount.width,
              textAlign: fields.vatAmount.align
            }}
          >
            {pricing.vat15}
          </div>
        )}

        {/* Net Inc VAT / Total Incl VAT */}
        {fields?.netIncVat && (
          <div 
            className="field"
            style={{
              top: fields.netIncVat.top,
              left: fields.netIncVat.left,
              width: fields.netIncVat.width,
              textAlign: fields.netIncVat.align
            }}
          >
            {pricing.netIncVat}
          </div>
        )}

        {/* Registration Fees */}
        {fields?.registrationFees && (
          <div 
            className="field"
            style={{
              top: fields.registrationFees.top,
              left: fields.registrationFees.left,
              width: fields.registrationFees.width,
              textAlign: fields.registrationFees.align
            }}
          >
            {pricing.registrationFees}
          </div>
        )}

        {/* Down Payment */}
        {fields?.downPayment && (
          <div 
            className="field"
            style={{
              top: fields.downPayment.top,
              left: fields.downPayment.left,
              width: fields.downPayment.width,
              textAlign: fields.downPayment.align
            }}
          >
            {pricing.downPayment}
          </div>
        )}

        {/* Net Due */}
        {fields?.netDue && (
          <div 
            className="field net-due-field"
            style={{
              top: fields.netDue.top,
              left: fields.netDue.left,
              width: fields.netDue.width,
              textAlign: fields.netDue.align
            }}
          >
            {pricing.netDue}
          </div>
        )}
      </div>
    </div>
  )
}

export default PrintPage2
