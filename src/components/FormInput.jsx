import React, { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { importChassisFromExcel } from '../utils/excelImport'
import './FormInput.css'

function FormInput({ formData, onInputChange, onChassisAdd, onChassisRemove, onChassisImport, onPrint, fields, onFieldCoordinateChange, onResetCoordinates, fields2, onFieldCoordinateChange2, onResetCoordinates2 }) {
  const chassisInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const [showCoordinates, setShowCoordinates] = useState(() => {
    const saved = localStorage.getItem('showCoordinates')
    return saved ? JSON.parse(saved) : false
  })
  const [coordinatesPosition, setCoordinatesPosition] = useState(() => {
    const saved = localStorage.getItem('coordinatesPosition')
    return saved ? JSON.parse(saved) : { x: 50, y: 50 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const coordinatesRef = useRef(null)
  const dragStartRef = useRef(null)
  const lastPositionRef = useRef(null) // آخر موضع أثناء السحب للحفظ عند الإفلات

  const [showCoordinates2, setShowCoordinates2] = useState(() => {
    const saved = localStorage.getItem('showCoordinates2')
    return saved ? JSON.parse(saved) : false
  })
  const [coordinatesPosition2, setCoordinatesPosition2] = useState(() => {
    const saved = localStorage.getItem('coordinatesPosition2')
    return saved ? JSON.parse(saved) : { x: 420, y: 50 }
  })
  const [isDragging2, setIsDragging2] = useState(false)
  const coordinatesRef2 = useRef(null)
  const dragStartRef2 = useRef(null)
  const lastPositionRef2 = useRef(null)

  const handleFileImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const numbers = await importChassisFromExcel(file)
      onChassisImport(numbers)
      alert(`تم استيراد ${numbers.length} رقم شاسيه`)
    } catch (error) {
      alert('خطأ في استيراد الملف: ' + error.message)
    }
    
    // Reset file input
    e.target.value = ''
  }

  const handleChassisSubmit = (e) => {
    e.preventDefault()
    const value = chassisInputRef.current?.value
    if (value) {
      onChassisAdd(value)
      chassisInputRef.current.value = ''
    }
  }

  // إنهاء السحب (إفلات) للنافذة الأولى
  const endDrag1 = () => {
    if (lastPositionRef.current) {
      localStorage.setItem('coordinatesPosition', JSON.stringify(lastPositionRef.current))
      lastPositionRef.current = null
    }
    dragStartRef.current = null
    setIsDragging(false)
  }

  const endDrag2 = () => {
    if (lastPositionRef2.current) {
      localStorage.setItem('coordinatesPosition2', JSON.stringify(lastPositionRef2.current))
      lastPositionRef2.current = null
    }
    dragStartRef2.current = null
    setIsDragging2(false)
  }

  // دراج أند دروب: استخدام pointer events + capture حتى الإفلات يلتقط دائماً
  const handlePointerDown = (e) => {
    if (e.target.closest('.coordinates-drag-handle')) {
      e.preventDefault()
      e.currentTarget.setPointerCapture?.(e.pointerId)
      dragStartRef.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startLeft: coordinatesPosition.x,
        startTop: coordinatesPosition.y
      }
      setIsDragging(true)
    }
  }

  const handlePointerMove = (e) => {
    const start = dragStartRef.current
    if (!start) return
    const dx = e.clientX - start.startClientX
    const dy = e.clientY - start.startClientY
    const newPosition = {
      x: Math.max(0, Math.min(start.startLeft + dx, window.innerWidth - 400)),
      y: Math.max(0, Math.min(start.startTop + dy, window.innerHeight - 100))
    }
    lastPositionRef.current = newPosition
    setCoordinatesPosition(newPosition)
  }

  const handlePointerUp = () => endDrag1()

  const handlePointerDown2 = (e) => {
    if (e.target.closest('.coordinates-drag-handle')) {
      e.preventDefault()
      e.currentTarget.setPointerCapture?.(e.pointerId)
      dragStartRef2.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startLeft: coordinatesPosition2.x,
        startTop: coordinatesPosition2.y
      }
      setIsDragging2(true)
    }
  }

  const handlePointerMove2 = (e) => {
    const start = dragStartRef2.current
    if (!start) return
    const dx = e.clientX - start.startClientX
    const dy = e.clientY - start.startClientY
    const newPosition = {
      x: Math.max(0, Math.min(start.startLeft + dx, window.innerWidth - 400)),
      y: Math.max(0, Math.min(start.startTop + dy, window.innerHeight - 100))
    }
    lastPositionRef2.current = newPosition
    setCoordinatesPosition2(newPosition)
  }

  const handlePointerUp2 = () => endDrag2()

  // مستمعات السحب: pointer events مع capture + mouseleave لضمان الإفلات
  const opts = { capture: true }
  useEffect(() => {
    if (!isDragging) return
    document.body.classList.add('coordinates-dragging')
    const move = (e) => handlePointerMove(e)
    const up = handlePointerUp
    const cancel = () => endDrag1()
    const leave = () => endDrag1()
    document.addEventListener('pointermove', move, opts)
    document.addEventListener('pointerup', up, opts)
    document.addEventListener('pointercancel', cancel, opts)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      document.body.classList.remove('coordinates-dragging')
      document.removeEventListener('pointermove', move, opts)
      document.removeEventListener('pointerup', up, opts)
      document.removeEventListener('pointercancel', cancel, opts)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [isDragging])

  useEffect(() => {
    if (!isDragging2) return
    document.body.classList.add('coordinates-dragging')
    const move = (e) => handlePointerMove2(e)
    const up = handlePointerUp2
    const cancel = () => endDrag2()
    const leave = () => endDrag2()
    document.addEventListener('pointermove', move, opts)
    document.addEventListener('pointerup', up, opts)
    document.addEventListener('pointercancel', cancel, opts)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      document.body.classList.remove('coordinates-dragging')
      document.removeEventListener('pointermove', move, opts)
      document.removeEventListener('pointerup', up, opts)
      document.removeEventListener('pointercancel', cancel, opts)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [isDragging2])

  // استعادة ظهور النوافذ من localStorage بعد أي إعادة تركيب (مثلاً React Strict Mode)
  useEffect(() => {
    const s = localStorage.getItem('showCoordinates')
    if (s !== null) setShowCoordinates(JSON.parse(s))
    const s2 = localStorage.getItem('showCoordinates2')
    if (s2 !== null) setShowCoordinates2(JSON.parse(s2))
  }, [])

  return (
    <div className="form-input">
      <h1>مولد فواتير PDF</h1>
      
      <div className="form-section">
        <h2>معلومات المركبة</h2>
        <div className="form-group">
          <label>العلامة التجارية</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => onInputChange('brand', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>الموديل</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => onInputChange('model', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>الفئة / الدرجة</label>
          <input
            type="text"
            value={formData.trim}
            onChange={(e) => onInputChange('trim', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>السنة</label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) => onInputChange('year', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>اللون</label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => onInputChange('color', e.target.value)}
          />
        </div>
      </div>

      <div className="form-section">
        <h2>معلومات المشتري</h2>
        <div className="form-group">
          <label>اسم الصالة</label>
          <input
            type="text"
            value={formData.showroomName}
            onChange={(e) => onInputChange('showroomName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>جهة التعميد / اسم البنك</label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) => onInputChange('bankName', e.target.value)}
            placeholder="مثال: بنك الجزيرة"
          />
        </div>
      </div>

      <div className="form-section">
        <h2>التسعير</h2>
        <div className="form-group">
          <label>سعر المركبة</label>
          <input
            type="number"
            step="0.01"
            value={formData.vehiclePrice}
            onChange={(e) => onInputChange('vehiclePrice', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>دعم المبيعات (رسوم DIC)</label>
          <select
            value={formData.salesSupport}
            onChange={(e) => onInputChange('salesSupport', e.target.value)}
          >
            <option value="-950">-950</option>
            <option value="-0">-0</option>
          </select>
        </div>
        <div className="form-group">
          <label>نسبة الدعم المالي</label>
          <select
            value={formData.financialSupportPercent}
            onChange={(e) => onInputChange('financialSupportPercent', e.target.value)}
          >
            <option value="0">0%</option>
            <option value="3">3%</option>
            <option value="5">5%</option>
            <option value="6">6%</option>
            <option value="11">11%</option>
            <option value="19">19%</option>
          </select>
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            تُحسب قيمة الدعم: -(النسبة) × (سعر السيارة + التسجيل)
          </small>
        </div>
        <div className="form-group">
          <label>رسوم التسجيل</label>
          <input
            type="number"
            step="0.01"
            value={formData.registrationFees}
            onChange={(e) => onInputChange('registrationFees', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>المقدم</label>
          <input
            type="number"
            step="0.01"
            value={formData.downPayment}
            onChange={(e) => onInputChange('downPayment', e.target.value)}
          />
        </div>
      </div>

      <div className="form-section">
        <h2>تفاصيل الطلب</h2>
        <div className="form-group">
          <label>رقم الطلب الأولي</label>
          <input
            type="number"
            value={formData.documentNo}
            onChange={(e) => onInputChange('documentNo', e.target.value)}
            placeholder="سيبدأ التسلسل من هذا الرقم"
          />
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            سيبدأ التسلسل من هذا الرقم ويتزايد لكل صفحة
          </small>
        </div>
        <div className="form-group">
          <label>مرجع العميل</label>
          <input
            type="text"
            value={formData.customerRef}
            onChange={(e) => onInputChange('customerRef', e.target.value)}
          />
        </div>
      </div>

      <div className="form-section">
        <h2>أرقام الشاسيه</h2>
        <div className="form-group">
          <label>استيراد من Excel (.xlsx)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileImport}
          />
        </div>
        <form onSubmit={handleChassisSubmit} className="chassis-input-form">
          <input
            ref={chassisInputRef}
            type="text"
            placeholder="أدخل رقم الشاسيه"
          />
          <button type="submit">إضافة</button>
        </form>
        <div className="chassis-list">
          {formData.chassisNumbers.map((chassis, index) => (
            <div key={index} className="chassis-item">
              <span>{chassis}</span>
              <button onClick={() => onChassisRemove(index)}>×</button>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="toggle-coordinates-btn" onClick={(e) => {
        e.stopPropagation()
        const newState = !showCoordinates
        setShowCoordinates(newState)
        localStorage.setItem('showCoordinates', JSON.stringify(newState))
      }}>
        {showCoordinates ? '🔽 إخفاء إحداثيات الصفحة الأولى' : '⚙️ إظهار إحداثيات الصفحة الأولى'}
      </button>

      <button type="button" className="toggle-coordinates-btn toggle-coordinates-btn-2" onClick={(e) => {
        e.stopPropagation()
        const newState = !showCoordinates2
        setShowCoordinates2(newState)
        localStorage.setItem('showCoordinates2', JSON.stringify(newState))
      }}>
        {showCoordinates2 ? '🔽 إخفاء إحداثيات الصفحة الثانية' : '⚙️ إظهار إحداثيات الصفحة الثانية'}
      </button>

      {showCoordinates && createPortal(
        <div 
          ref={coordinatesRef}
          className="floating-coordinates"
          style={{
            left: `${coordinatesPosition.x}px`,
            top: `${coordinatesPosition.y}px`
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
            handlePointerDown(e)
          }}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="coordinates-header">
            <span className="coordinates-drag-handle" title="اسحب لتحريك النافذة">⋮⋮</span>
            <h3>⚙️ ضبط الإحداثيات</h3>
            <button 
              className="close-coordinates-btn"
              onClick={() => {
                setShowCoordinates(false)
                localStorage.setItem('showCoordinates', JSON.stringify(false))
              }}
            >
              ×
            </button>
          </div>
          <div className="coordinates-content">
            <div style={{ marginBottom: '15px' }}>
              <button 
                onClick={onResetCoordinates}
                className="reset-coordinates-btn"
              >
                🔄 إعادة تعيين
              </button>
            </div>
            <div className="coordinates-editor" style={{ maxHeight: 'none', overflowY: 'visible' }}>
              {fields && Object.keys(fields).map(fieldName => (
                <div key={fieldName} className="coordinate-group">
                  <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50', fontSize: '14px', textTransform: 'capitalize' }}>
                    📍 {fieldName}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px' }}>من الأعلى (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parseFloat(fields[fieldName].top)}
                        onChange={(e) => onFieldCoordinateChange(fieldName, 'top', `${e.target.value}%`)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px' }}>من اليسار (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parseFloat(fields[fieldName].left)}
                        onChange={(e) => onFieldCoordinateChange(fieldName, 'left', `${e.target.value}%`)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px' }}>العرض (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parseFloat(fields[fieldName].width)}
                        onChange={(e) => onFieldCoordinateChange(fieldName, 'width', `${e.target.value}%`)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px' }}>المحاذاة</label>
                      <select
                        value={fields[fieldName].align || 'left'}
                        onChange={(e) => onFieldCoordinateChange(fieldName, 'align', e.target.value)}
                      >
                        <option value="left">يسار</option>
                        <option value="center">وسط</option>
                        <option value="right">يمين</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {showCoordinates2 && fields2 && createPortal(
        <div 
          ref={coordinatesRef2}
          className="floating-coordinates floating-coordinates-2"
          style={{
            left: `${coordinatesPosition2.x}px`,
            top: `${coordinatesPosition2.y}px`
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
            handlePointerDown2(e)
          }}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="coordinates-header">
            <span className="coordinates-drag-handle" title="اسحب لتحريك النافذة">⋮⋮</span>
            <h3>⚙️ ضبط إحداثيات الصفحة الثانية</h3>
            <button 
              className="close-coordinates-btn"
              onClick={() => {
                setShowCoordinates2(false)
                localStorage.setItem('showCoordinates2', JSON.stringify(false))
              }}
            >
              ×
            </button>
          </div>
          <div className="coordinates-content">
            <div style={{ marginBottom: '15px' }}>
              <button 
                onClick={onResetCoordinates2}
                className="reset-coordinates-btn"
              >
                🔄 إعادة تعيين
              </button>
            </div>
            <div className="coordinates-editor" style={{ maxHeight: 'none', overflowY: 'visible' }}>
              {Object.keys(fields2).map(fieldName => (
                <div key={fieldName} className="coordinate-group">
                  <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2c3e50', fontSize: '14px', textTransform: 'capitalize' }}>
                    📍 {fieldName}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px' }}>من الأعلى (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parseFloat(fields2[fieldName].top)}
                        onChange={(e) => onFieldCoordinateChange2(fieldName, 'top', `${e.target.value}%`)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px' }}>من اليسار (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parseFloat(fields2[fieldName].left)}
                        onChange={(e) => onFieldCoordinateChange2(fieldName, 'left', `${e.target.value}%`)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px' }}>العرض (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={parseFloat(fields2[fieldName].width)}
                        onChange={(e) => onFieldCoordinateChange2(fieldName, 'width', `${e.target.value}%`)}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px' }}>المحاذاة</label>
                      <select
                        value={fields2[fieldName].align || 'left'}
                        onChange={(e) => onFieldCoordinateChange2(fieldName, 'align', e.target.value)}
                      >
                        <option value="left">يسار</option>
                        <option value="center">وسط</option>
                        <option value="right">يمين</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      <button className="print-button" onClick={onPrint}>
        طباعة / حفظ كـ PDF
      </button>
    </div>
  )
}

export default FormInput
