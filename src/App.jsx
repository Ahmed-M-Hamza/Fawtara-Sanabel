import { useState, useMemo, Fragment } from 'react'
import FormInput from './components/FormInput'
import PrintPage from './components/PrintPage'
import PrintPage2 from './components/PrintPage2'
import { calculatePricing, calculatePricingForInvoice2 } from './utils/calculations'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    // Vehicle Info
    model: '',
    year: '',
    color: '',
    
    // Buyer Info
    showroomName: '',
    bankName: '', // جهة التعميد
    
    // Pricing
    vehiclePrice: '',
    salesSupport: '-0',
    financialSupportPercent: '6', // نسبة الدعم المالي: 0%, 3%, 5%, 6%, 11%, 19%
    registrationFees: '400',
    downPayment: '0',
    
    // Supplier Info
    nameAr: '',
    nameEn: '',
    addressAr: '',
    addressEn: '',
    
    // Order Details
    documentNo: '',
    customerRef: '',
    
    // Chassis Numbers
    chassisNumbers: []
  })

  // Load coordinates from localStorage or use defaults
  // These are the saved coordinates from localStorage
  const defaultFields = {
    documentNo: { top: '19.9%', left: '72%', width: '8%', align: 'center' },
    pageNo: { top: '22.8%', left: '72%', width: '8%', align: 'center' },
    date: { top: '25.9%', left: '64%', width: '25%', align: 'center' },
    customerRef: { top: '28.9%', left: '70.3%', width: '8.6%', align: 'center' },
    showroomName: { top: '32.8%', left: '31.4%', width: '50%', align: 'right', rtl: true },
    bankName: { top: '35.2%', left: '31.5%', width: '50%', align: 'right', rtl: true },
    chassis: { top: '42.1%', left: '64.5%', width: '15.3%', align: 'left', multiline: true },
    model: { top: '42%', left: '24.5%', width: '20%', align: 'left' },
    year: { top: '45.5%', left: '24.7%', width: '8%', align: 'left' },
    color: { top: '45.6%', left: '70.5%', width: '15%', align: 'left', rtl: true },
    vehiclePrice: { top: '52.1%', left: '63.2%', width: '18%', align: 'center' },
    dicCharges: { top: '54.5%', left: '63%', width: '18%', align: 'center' },
    agentCommission: { top: '56.9%', left: '63.2%', width: '18%', align: 'center' },
    priceExclVat: { top: '60.2%', left: '65.9%', width: '20%', align: 'center' },
    vat15: { top: '63.6%', left: '65.8%', width: '20%', align: 'center' },
    netIncVat: { top: '66.8%', left: '65.9%', width: '20%', align: 'center' },
    registrationFees: { top: '69.7%', left: '66.1%', width: '20%', align: 'center' },
    downPayment: { top: '72.5%', left: '66.1%', width: '20%', align: 'center' },
    netDue: { top: '76%', left: '66%', width: '20%', align: 'center' }
  }

  // إحداثيات الفاتورة الثانية (سنابل الحديثة - VEHICLE VAT INVOICE)
  const defaultFields2 = {
    documentNo: { top: '22.7%', left: '68%', width: '12%', align: 'center' },
    pageNo: { top: '25.8%', left: '68%', width: '12%', align: 'center' },
    date: { top: '28.8%', left: '65%', width: '18%', align: 'center' },
    customerRef: { top: '25.5%', left: '80%', width: '15%', align: 'center' },
    showroomName: { top: '37%', left: '45%', width: '58%', align: 'center', rtl: true },
    vehicleDescription: { top: '44%', left: '20.1%', width: '58%', align: 'center', rtl: true },
    color: { top: '46.3%', left: '28.9%', width: '40%', align: 'center', rtl: true },
    chassis: { top: '48.5%', left: '24.2%', width: '50%', align: 'center', multiline: true },
    vehiclePrice: { top: '55%', left: '39.6%', width: '14%', align: 'center' },
    vat15: { top: '55%', left: '58.4%', width: '12%', align: 'center' },
    amount: { top: '55%', left: '76%', width: '14%', align: 'center' },
    subsidyPercent: { top: '58%', left: '32%', width: '12%', align: 'center' },
    priceExclVat: { top: '58.3%', left: '65%', width: '18%', align: 'center' },
    vatAmount: { top: '61.2%', left: '65%', width: '18%', align: 'center' },
    netIncVat: { top: '66.7%', left: '65%', width: '18%', align: 'center' },
    registrationFees: { top: '64.1%', left: '65%', width: '18%', align: 'center' },
    downPayment: { top: '69.5%', left: '65%', width: '18%', align: 'center' },
    netDue: { top: '71.9%', left: '65%', width: '18%', align: 'center' }
  }

  const [fields, setFields] = useState(() => {
    const saved = localStorage.getItem('fieldCoordinates')
    if (saved) {
      const parsed = JSON.parse(saved)
      const mergedFields = { ...defaultFields, ...parsed }
      Object.keys(mergedFields).forEach(key => {
        if (parsed[key]) {
          defaultFields[key] = { ...defaultFields[key], ...parsed[key] }
        }
      })
      return mergedFields
    }
    return defaultFields
  })

  const [fields2, setFields2] = useState(() => {
    const saved = localStorage.getItem('fieldCoordinates2')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...defaultFields2, ...parsed }
    }
    return defaultFields2
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleChassisAdd = (chassis) => {
    if (chassis.trim()) {
      setFormData(prev => ({
        ...prev,
        chassisNumbers: [...prev.chassisNumbers, chassis.trim()]
      }))
    }
  }

  const handleChassisRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      chassisNumbers: prev.chassisNumbers.filter((_, i) => i !== index)
    }))
  }

  const handleChassisImport = (numbers) => {
    setFormData(prev => ({
      ...prev,
      chassisNumbers: [...prev.chassisNumbers, ...numbers]
    }))
  }

  const pricing = useMemo(() => {
    return calculatePricing({
      vehiclePrice: parseFloat(formData.vehiclePrice) || 0,
      salesSupport: formData.salesSupport,
      financialSupportPercent: formData.financialSupportPercent,
      registrationFees: parseFloat(formData.registrationFees) || 0,
      downPayment: parseFloat(formData.downPayment) || 0
    })
  }, [formData.vehiclePrice, formData.salesSupport, formData.financialSupportPercent, formData.registrationFees, formData.downPayment])

  // الفاتورة الثانية: الضريبة على سعر السيارة فقط (بدون DIC وبدون نسبة الدعم)
  const pricing2 = useMemo(() => {
    return calculatePricingForInvoice2({
      vehiclePrice: parseFloat(formData.vehiclePrice) || 0,
      registrationFees: parseFloat(formData.registrationFees) || 0,
      downPayment: parseFloat(formData.downPayment) || 0
    })
  }, [formData.vehiclePrice, formData.registrationFees, formData.downPayment])

  const handlePrint = () => {
    window.print()
  }

  const handleFieldCoordinateChange = (fieldName, property, value) => {
    setFields(prev => {
      const updated = {
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          [property]: value
        }
      }
      localStorage.setItem('fieldCoordinates', JSON.stringify(updated))
      return updated
    })
  }

  const resetCoordinates = () => {
    setFields(defaultFields)
    localStorage.setItem('fieldCoordinates', JSON.stringify(defaultFields))
  }

  const handleFieldCoordinateChange2 = (fieldName, property, value) => {
    setFields2(prev => {
      const updated = {
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          [property]: value
        }
      }
      localStorage.setItem('fieldCoordinates2', JSON.stringify(updated))
      return updated
    })
  }

  const resetCoordinates2 = () => {
    setFields2(defaultFields2)
    localStorage.setItem('fieldCoordinates2', JSON.stringify(defaultFields2))
  }

  return (
    <div className="app-container">
      <div className="form-section">
        <FormInput
          formData={formData}
          onInputChange={handleInputChange}
          onChassisAdd={handleChassisAdd}
          onChassisRemove={handleChassisRemove}
          onChassisImport={handleChassisImport}
          onPrint={handlePrint}
          fields={fields}
          onFieldCoordinateChange={handleFieldCoordinateChange}
          onResetCoordinates={resetCoordinates}
          fields2={fields2}
          onFieldCoordinateChange2={handleFieldCoordinateChange2}
          onResetCoordinates2={resetCoordinates2}
        />
      </div>
      <div className="preview-section">
        {formData.chassisNumbers.length > 0 ? (
          // كل رقم شاسيه يُصدر فاتورتين: الأولى (القديمة) والثانية (فاتورة الضريبة)
          formData.chassisNumbers.map((chassisNumber, index) => {
            const startDocNo = formData.documentNo ? parseInt(formData.documentNo) || 1 : 1
            const documentNumber = startDocNo + index
            const page1 = index * 2 + 1
            const page2 = index * 2 + 2

            return (
              <Fragment key={index}>
                <PrintPage
                  formData={formData}
                  pricing={pricing}
                  fields={fields}
                  chassisNumber={chassisNumber}
                  pageNumber={page1}
                  documentNumber={documentNumber}
                />
                <PrintPage2
                  formData={formData}
                  pricing={pricing2}
                  fields={fields2}
                  chassisNumber={chassisNumber}
                  pageNumber={page2}
                  documentNumber={documentNumber}
                />
              </Fragment>
            )
          })
        ) : (
          <>
            <PrintPage
              formData={formData}
              pricing={pricing}
              fields={fields}
              chassisNumber={null}
              pageNumber={1}
              documentNumber={formData.documentNo ? parseInt(formData.documentNo) || 1 : 1}
            />
            <PrintPage2
              formData={formData}
              pricing={pricing2}
              fields={fields2}
              chassisNumber={null}
              pageNumber={2}
              documentNumber={formData.documentNo ? parseInt(formData.documentNo) || 1 : 1}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
