const ERRORS = {
  bad_phone: "الرقم غير صحيح، تأكد من الدولة والرقم.",
  country_not_allowed: "هذي الدولة غير مدعومة حالياً.",
  phone_limit: "وصلت الحد المسموح لهذا الرقم اليوم.",
  ip_limit: "طلبات كثيرة، حاول بعد ساعة.",
  daily_cap: "الخدمة وصلت حدها اليومي، حاول بكرة.",
  country_quota: "الخدمة غير متاحة لهذه الدولة حالياً.",
  captcha: "فشل التحقق، حدّث الصفحة وحاول مرة ثانية.",
  send_failed: "تعذر إرسال الرسالة، حاول لاحقاً.",
  origin: "هذا الموقع غير مصرح له.",
  channel_unavailable: "الإرسال لهذه الدولة غير متاح حالياً.",
  bad_email: "البريد الإلكتروني غير صحيح.",
};

const form = document.getElementById("form");
const msg = document.getElementById("msg");
const btn = document.getElementById("btn");

// مصر SMS برقم الجوال، وباقي الدول يدخل العميل إيميله
const SMS_COUNTRIES = window.CONFIG.SMS_COUNTRIES || ["EG"];
const lbl = document.querySelector('label[for="phone"]');
const isEmailMode = () => !SMS_COUNTRIES.includes(form.country.value);
function applyMode() {
  const em = isEmailMode();
  form.phone.type = em ? "email" : "tel";
  form.phone.inputMode = em ? "email" : "tel";
  form.phone.placeholder = em ? "name@example.com" : "5xxxxxxxx";
  form.phone.value = "";
  if (lbl) lbl.textContent = em ? "البريد الإلكتروني" : "رقم الجوال";
}
form.country.addEventListener("change", applyMode);
applyMode();

let captchaToken = "";
if (window.CONFIG.TURNSTILE_SITEKEY) {
  const s = document.createElement("script");
  s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  s.async = true;
  document.head.appendChild(s);
  const d = document.createElement("div");
  d.className = "cf-turnstile";
  d.dataset.sitekey = window.CONFIG.TURNSTILE_SITEKEY;
  d.dataset.callback = "onCaptcha";
  btn.before(d);
  window.onCaptcha = (t) => (captchaToken = t);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.className = "";
  msg.textContent = "";
  btn.disabled = true;
  try {
    const r = await fetch(window.CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: window.CONFIG.KIND,
        country: form.country.value,
        ...(isEmailMode() ? { email: form.phone.value } : { phone: form.phone.value }),
        captcha: captchaToken,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok && data.ok) {
      msg.className = "ok";
      msg.textContent = isEmailMode() ? "تم الإرسال ✅ تفقد بريدك (وصندوق الرسائل غير المرغوبة)." : "تم الإرسال ✅ تفقد رسائلك.";
      form.phone.value = "";
    } else {
      msg.className = "err";
      msg.textContent = ERRORS[data.error] || "صار خطأ، حاول مرة ثانية.";
    }
  } catch {
    msg.className = "err";
    msg.textContent = "تعذر الاتصال بالخدمة.";
  } finally {
    btn.disabled = false;
    if (window.turnstile) window.turnstile.reset();
    captchaToken = "";
  }
});
