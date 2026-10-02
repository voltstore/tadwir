const COUNTRIES = [
  ["EG","🇪🇬","مصر","Egypt","+20"],
  ["SA","🇸🇦","السعودية","Saudi Arabia","+966"],
  ["AE","🇦🇪","الإمارات","United Arab Emirates","+971"],
  ["KW","🇰🇼","الكويت","Kuwait","+965"],
  ["BH","🇧🇭","البحرين","Bahrain","+973"],
  ["QA","🇶🇦","قطر","Qatar","+974"],
  ["OM","🇴🇲","عُمان","Oman","+968"],
  ["JO","🇯🇴","الأردن","Jordan","+962"],
  ["LB","🇱🇧","لبنان","Lebanon","+961"],
  ["IQ","🇮🇶","العراق","Iraq","+964"],
  ["SY","🇸🇾","سوريا","Syria","+963"],
  ["YE","🇾🇪","اليمن","Yemen","+967"],
  ["PS","🇵🇸","فلسطين","Palestine","+970"],
  ["LY","🇱🇾","ليبيا","Libya","+218"],
  ["SD","🇸🇩","السودان","Sudan","+249"],
  ["TN","🇹🇳","تونس","Tunisia","+216"],
  ["DZ","🇩🇿","الجزائر","Algeria","+213"],
  ["MA","🇲🇦","المغرب","Morocco","+212"],
];

const T = {
  ar: {
    dir: "rtl",
    title: { welcome: "مرحباً بك في تدوير", order: "تأكيد طلبك في تدوير" },
    sub: {
      welcome: { sms: "أدخل رقم جوالك وراح توصلك رسالة ترحيب.", email: "أدخل بريدك الإلكتروني وراح توصلك رسالة ترحيب." },
      order: { sms: "أدخل رقم جوالك وراح توصلك رسالة تأكيد الطلب.", email: "أدخل بريدك الإلكتروني وراح توصلك رسالة تأكيد الطلب." },
    },
    langLabel: "اللغة", country: "الدولة", phone: "رقم الجوال", email: "البريد الإلكتروني",
    btn: { welcome: "أرسل الرسالة", order: "أكّد الطلب" },
    demo: "نموذج تجريبي · Demo",
    okSms: "تم الإرسال ✅ تفقد رسائلك.",
    okEmail: "تم الإرسال ✅ تفقد بريدك (وصندوق الرسائل غير المرغوبة).",
    errors: {
      bad_phone: "الرقم غير صحيح، تأكد من الدولة والرقم.",
      bad_email: "البريد الإلكتروني غير صحيح.",
      country_not_allowed: "هذي الدولة غير مدعومة حالياً.",
      phone_limit: "وصلت الحد المسموح لهذا الرقم اليوم.",
      ip_limit: "طلبات كثيرة، حاول بعد ساعة.",
      daily_cap: "الخدمة وصلت حدها اليومي، حاول بكرة.",
      country_quota: "الخدمة غير متاحة لهذه الدولة حالياً.",
      captcha: "فشل التحقق، حدّث الصفحة وحاول مرة ثانية.",
      send_failed: "تعذر إرسال الرسالة، حاول لاحقاً.",
      origin: "هذا الموقع غير مصرح له.",
      channel_unavailable: "الإرسال لهذه الدولة غير متاح حالياً.",
      other: "صار خطأ، حاول مرة ثانية.",
      network: "تعذر الاتصال بالخدمة.",
    },
  },
  en: {
    dir: "ltr",
    title: { welcome: "Welcome to Tadwir", order: "Confirm your Tadwir order" },
    sub: {
      welcome: { sms: "Enter your phone number and we'll text you a welcome message.", email: "Enter your email and we'll send you a welcome message." },
      order: { sms: "Enter your phone number and we'll text you your order confirmation.", email: "Enter your email and we'll send you your order confirmation." },
    },
    langLabel: "Language", country: "Country", phone: "Phone number", email: "Email address",
    btn: { welcome: "Send message", order: "Confirm order" },
    demo: "Demo · نموذج تجريبي",
    okSms: "Sent ✅ Check your messages.",
    okEmail: "Sent ✅ Check your inbox (and spam folder).",
    errors: {
      bad_phone: "Invalid number. Check the country and the number.",
      bad_email: "Invalid email address.",
      country_not_allowed: "This country is not supported yet.",
      phone_limit: "This number reached today's limit.",
      ip_limit: "Too many requests. Try again in an hour.",
      daily_cap: "The service reached its daily limit. Try tomorrow.",
      country_quota: "The service is currently unavailable for this country.",
      captcha: "Verification failed. Refresh the page and try again.",
      send_failed: "Could not send the message. Try again later.",
      origin: "This site is not authorized.",
      channel_unavailable: "Sending to this country is currently unavailable.",
      other: "Something went wrong. Please try again.",
      network: "Could not reach the service.",
    },
  },
};

const KIND = window.CONFIG.KIND;
const SMS_COUNTRIES = window.CONFIG.SMS_COUNTRIES || ["EG"];
const $ = (id) => document.getElementById(id);
const form = $("form"), msg = $("msg"), btn = $("btn"), phone = $("phone"), country = $("country"), dial = $("dial");

let lang = "ar";
try {
  const saved = localStorage.getItem("tadwir_lang");
  if (saved === "ar" || saved === "en") lang = saved;
  else if (!/^ar/i.test(navigator.language || "ar")) lang = "en";
} catch (e) {}

const isEmailMode = () => !SMS_COUNTRIES.includes(country.value);

function buildCountries() {
  const cur = country.value || "EG";
  country.innerHTML = "";
  for (const [code, flag, ar, en] of COUNTRIES) {
    const o = document.createElement("option");
    o.value = code;
    o.textContent = `${flag} ${lang === "ar" ? ar : en}`;
    country.appendChild(o);
  }
  country.value = cur;
}

function applyMode(clear) {
  const t = T[lang], em = isEmailMode();
  if (clear) phone.value = "";
  phone.type = em ? "email" : "tel";
  phone.inputMode = em ? "email" : "tel";
  phone.placeholder = em ? "name@example.com" : "5xxxxxxxx";
  $("phoneLabel").textContent = em ? t.email : t.phone;
  $("sub").textContent = t.sub[KIND][em ? "email" : "sms"];
  dial.hidden = em;
  if (!em) dial.textContent = (COUNTRIES.find((c) => c[0] === country.value) || [])[4] || "";
}

function applyLang() {
  const t = T[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = t.dir;
  document.title = `${t.title[KIND]} | Tadwir`;
  $("h1").textContent = t.title[KIND];
  $("countryLabel").textContent = t.country;
  btn.textContent = t.btn[KIND];
  $("demo").textContent = t.demo;
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  msg.textContent = ""; msg.className = "";
  buildCountries();
  applyMode(false);
}

document.querySelectorAll("[data-lang]").forEach((b) =>
  b.addEventListener("click", () => {
    lang = b.dataset.lang;
    try { localStorage.setItem("tadwir_lang", lang); } catch (e) {}
    applyLang();
  })
);
country.addEventListener("change", () => applyMode(true));
applyLang();

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
  window.onCaptcha = (tk) => (captchaToken = tk);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const t = T[lang];
  msg.className = ""; msg.textContent = ""; btn.disabled = true;
  const em = isEmailMode();
  try {
    const r = await fetch(window.CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: KIND,
        country: country.value,
        ...(em ? { email: phone.value } : { phone: phone.value }),
        captcha: captchaToken,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok && data.ok) {
      msg.className = "ok";
      msg.textContent = em ? t.okEmail : t.okSms;
      phone.value = "";
    } else {
      msg.className = "err";
      msg.textContent = t.errors[data.error] || t.errors.other;
    }
  } catch {
    msg.className = "err";
    msg.textContent = t.errors.network;
  } finally {
    btn.disabled = false;
    if (window.turnstile) window.turnstile.reset();
    captchaToken = "";
  }
});
