# Fawtara PDF Generator

A React + Vite web application that generates pixel-perfect PDF documents matching a provided template. The app uses a **background template image with absolute-positioned text overlays** to ensure exact alignment with the original template.

## Features

- **Form-based Input**: Comprehensive form for vehicle info, buyer info, pricing, supplier info, order details, and chassis numbers
- **Excel Import**: Import chassis numbers from Excel (.xlsx) files
- **Live Preview**: Real-time preview of the generated document
- **Pixel-Perfect Output**: Uses template background image with absolutely positioned text overlays
- **Browser Print**: Uses native browser print dialog to save as PDF

## Prerequisites

- Node.js 16+ and npm/yarn/pnpm

## Installation

1. Install dependencies:
```bash
npm install
```

2. **CRITICAL**: Place your template image:
   - The template image must be named `template_600dpi.png`
   - Place it in the `public/` directory
   - The image should be a high-resolution PNG (600 DPI recommended)
   - Page dimensions should match 9in x 10.5in

   To convert PDF to PNG:
   ```bash
   # Using ImageMagick
   convert -density 600 input.pdf public/template_600dpi.png
   
   # Using pdftoppm
   pdftoppm -png -r 600 input.pdf public/template
   mv public/template-1.png public/template_600dpi.png
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

Quick deployment options:
- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repo or upload `dist` folder
- **GitHub Pages**: Deploy from `dist` folder
- **Traditional Hosting**: Upload `dist` contents to `public_html` or `www`

## Usage

1. **Fill in the Form**: Enter all required information in the left panel:
   - Vehicle Info (brand, model, trim, year, color)
   - Buyer Info (showroom name)
   - Pricing (vehicle price, sales support, agent commission, registration fees, down payment)
   - Supplier Info (Arabic and English names and addresses)
   - Order Details (document number, customer reference)
   - Chassis Numbers (add manually or import from Excel)

2. **Preview**: The right panel shows a live preview of how the document will look

3. **Print/Save as PDF**:
   - Click the "Print / Save as PDF" button
   - In the print dialog:
     - **CRITICAL**: Enable "Background graphics" or "Background images" option
       - Chrome/Edge: Settings → More settings → Background graphics
       - Firefox: Options → Print Background Colors
       - Safari: Print → Show Details → Print Backgrounds
     - Select "Save as PDF" as the destination
     - Set page size to 9in x 10.5in (or match template dimensions)
     - Click Save

## Excel Import

- Click "Choose File" under "Import from Excel"
- Select an Excel file (.xlsx or .xls)
- The app will read chassis numbers from column A of the first sheet
- Duplicate and empty entries are automatically removed

## Adjusting Overlay Coordinates

The app uses absolute positioning with percentage-based coordinates. To adjust field positions:

1. Open `src/components/PrintPage.jsx`
2. Find the `fields` object (around line 30)
3. Adjust the `top`, `left`, and `width` percentage values for each field
4. Coordinates are in percentage format (e.g., `top: '25%'` means 25% from the top)
5. Set `align` to 'left', 'right', or 'center' based on template alignment
6. For Arabic text, add `rtl: true` to enable right-to-left direction

Example:
```javascript
const fields = {
  documentNo: { top: '12%', left: '68%', width: '8%', align: 'left' },
  model: { top: '32%', left: '3%', width: '20%', align: 'left' },
  // Adjust these values to match your template_600dpi.png
}
```

**Important**: Measure the template image precisely and adjust coordinates accordingly. Use browser DevTools to fine-tune positions.

## Calculations

The app automatically calculates:
- **DIC Charges**: Either -950 or 0 (based on selection)
- **Agent Commission**: 6% of vehicle price as negative amount, or 0
- **Price Excl VAT**: vehiclePrice + dicCharges + agentCommission
- **VAT 15%**: priceExclVat × 0.15
- **Net Inc VAT**: priceExclVat + vat15
- **Net Due**: netIncVat + registrationFees - downPayment

All values are formatted with thousands separators (e.g., 12,345.67).

## Print Settings

The app uses CSS print media queries to:
- Hide the form UI when printing
- Set page size to A4 (210mm × 297mm)
- Remove margins
- Enable background graphics printing

**Important**: Users must enable "Background graphics" in their browser's print dialog for the template background to appear.

## Project Structure

```
Fawtara/
├── public/
│   └── template_600dpi.png       # Template background image (REQUIRED)
├── src/
│   ├── components/
│   │   ├── FormInput.jsx         # Form component
│   │   ├── FormInput.css
│   │   ├── PrintPage.jsx          # Print page with overlay fields
│   │   └── PrintPage.css         # Page size: 9in x 10.5in
│   ├── utils/
│   │   ├── calculations.js        # Pricing calculations
│   │   └── excelImport.js         # Excel import utility
│   ├── App.jsx                    # Main app component
│   ├── App.css
│   ├── main.jsx                   # Entry point
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

## Technical Details

- **Page Size**: 9in x 10.5in (as specified)
- **Background**: `template_600dpi.png` from `/public/` directory
- **Overlay Method**: Absolute positioning with percentage-based coordinates
- **Print Method**: Browser `window.print()` → "Save as PDF"

## Troubleshooting

### Template background not showing in print
- Ensure "Background graphics" is enabled in the print dialog
- Check that `template.png` exists in `public/` directory
- Verify the image path in `PrintPage.css` is correct

### Text overlays misaligned
- Adjust coordinates in `PrintPage.jsx` (see "Adjusting Overlay Coordinates" above)
- Ensure template.png dimensions match the original PDF exactly

### Excel import not working
- Ensure the file is a valid .xlsx or .xls format
- Chassis numbers should be in column A of the first sheet
- Check browser console for error messages

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT
# Fawtara
