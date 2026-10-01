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
};

const form = document.getElementById("form");
const msg = document.getElementById("msg");
const btn = document.getElementById("btn");

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
        phone: form.phone.value,
        captcha: captchaToken,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok && data.ok) {
      msg.className = "ok";
      msg.textContent = "تم الإرسال ✅ تفقد رسائلك.";
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
