// Utility to export current coordinates from localStorage
// Run this in browser console to get the coordinates

export function exportCoordinates() {
  if (typeof window === 'undefined') return null
  
  const saved = localStorage.getItem('fieldCoordinates')
  if (!saved) {
    console.log('No coordinates found in localStorage')
    return null
  }
  
  try {
    const parsed = JSON.parse(saved)
    const formatted = JSON.stringify(parsed, null, 2)
    console.log('Current coordinates:')
    console.log(formatted)
    return formatted
  } catch (error) {
    console.error('Error parsing coordinates:', error)
    return null
  }
}

// To use in browser console:
// import { exportCoordinates } from './utils/exportCoordinates'
// exportCoordinates()
