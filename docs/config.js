// بعد ما تنشر الـ Worker، حط رابطه هنا (مثال: https://tadwir-sms.اسمك.workers.dev)
window.CONFIG_BASE = {
  API_URL: "https://tadwir-sms.tadwir.workers.dev",
  // اختياري: Site Key من Cloudflare Turnstile (اتركه فاضي لو ما تبي كابتشا)
  TURNSTILE_SITEKEY: "",
  // الدول اللي ترسل SMS (برقم الجوال). باقي الدول إيميل. لازم تطابق الوسيط
  SMS_COUNTRIES: ["EG"],
};
