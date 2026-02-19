# تعليمات النشر للإنتاج (Production Deployment)

## البناء (Build)

تم بناء المشروع بنجاح! الملفات جاهزة في مجلد `dist/`

```bash
npm run build
```

## طرق النشر

### 1. Netlify (الأسهل)

1. اذهب إلى [netlify.com](https://www.netlify.com)
2. سجل دخول أو أنشئ حساب
3. اسحب مجلد `dist` إلى Netlify
4. أو استخدم Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### 2. Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول
3. ارفع مجلد `dist` أو اربط مع GitHub
4. أو استخدم Vercel CLI:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### 3. GitHub Pages

1. ارفع الكود إلى GitHub
2. اذهب إلى Settings > Pages
3. اختر Source: Deploy from a branch
4. اختر Branch: `main` و Folder: `/dist`
5. أو استخدم GitHub Actions

### 4. استضافة عادية (cPanel, FTP)

1. ارفع محتويات مجلد `dist` إلى مجلد `public_html` أو `www`
2. تأكد من وجود ملف `.htaccess` (لـ Apache) أو `nginx.conf` (لـ Nginx)
3. الملفات المطلوبة:
   - `index.html`
   - مجلد `assets/`
   - مجلد `public/` (يحتوي على `template_600dpi.png`)

### 5. استخدام Vite Preview محلياً

```bash
npm run preview
```

## ملفات مهمة للإنتاج

- ✅ `dist/index.html` - الصفحة الرئيسية
- ✅ `dist/assets/` - ملفات CSS و JS
- ✅ `public/template_600dpi.png` - يجب أن يكون في `dist/` أو `public/`

## ملاحظات مهمة

1. **الصورة الخلفية**: تأكد من أن `template_600dpi.png` موجودة في `public/` قبل البناء
2. **Base Path**: إذا نشرت في subdirectory، أضف `base` في `vite.config.js`:
   ```js
   export default defineConfig({
     base: '/your-subdirectory/',
     plugins: [react()],
   })
   ```
3. **Environment Variables**: لا توجد متغيرات بيئة حالياً
4. **API**: التطبيق يعمل بالكامل في المتصفح (client-side only)

## التحقق من البناء

بعد النشر، تأكد من:
- ✅ الصفحة تفتح بدون أخطاء
- ✅ الصورة الخلفية تظهر
- ✅ النموذج يعمل
- ✅ الطباعة تعمل
- ✅ localStorage يعمل (للإحداثيات)

## استكشاف الأخطاء

إذا كانت الصورة لا تظهر:
- تأكد من أن `template_600dpi.png` في `public/`
- تحقق من المسار في المتصفح (Network tab)
- تأكد من أن الملف موجود في `dist/` بعد البناء
