import * as XLSX from 'xlsx'

export function importChassisFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to JSON, assuming column A
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: ''
        })
        
        // Extract column A (first column, index 0)
        const chassisNumbers = jsonData
          .map(row => row[0])
          .filter(cell => cell && typeof cell === 'string' && cell.trim() !== '')
          .map(cell => cell.toString().trim())
        
        // Deduplicate
        const uniqueChassis = [...new Set(chassisNumbers)]
        
        resolve(uniqueChassis)
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}
