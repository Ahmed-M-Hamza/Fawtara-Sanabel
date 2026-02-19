# Template Images

- **template_600dpi.png** – الفاتورة الأولى (القديمة)
- **template2.png** – الفاتورة الثانية (فاتورة الضريبة - فاتوره ١)

كل رقم شاسيه يُصدر فاتورتين باستخدام القالبين.

## Instructions to Convert PDF to PNG

1. Open the PDF file in an image editor (e.g., Adobe Photoshop, GIMP, or online tools)
2. Export/save as PNG with high resolution (at least 300 DPI)
3. Ensure the PNG dimensions match the PDF page size exactly
4. Save as `template.png` in this directory

Alternatively, you can use command-line tools:
- Using ImageMagick: `convert -density 300 input.pdf template.png`
- Using pdftoppm: `pdftoppm -png -r 300 input.pdf template`

The template should be a single-page PNG that matches the PDF dimensions exactly.
