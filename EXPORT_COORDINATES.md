# تصدير الإحداثيات من localStorage

لنسخ الإحداثيات الحالية من localStorage إلى الكود:

1. افتح المتصفح وافتح Developer Console (F12)
2. انسخ هذا الأمر والصقه في Console:

```javascript
JSON.stringify(JSON.parse(localStorage.getItem('fieldCoordinates')), null, 2)
```

3. انسخ النتيجة
4. الصقها في ملف `src/App.jsx` في `defaultFields` بدلاً من القيم الحالية

أو استخدم هذا الأمر لنسخها مباشرة:

```javascript
copy(JSON.stringify(JSON.parse(localStorage.getItem('fieldCoordinates')), null, 2))
```

ثم الصقها في `defaultFields` في `src/App.jsx`
