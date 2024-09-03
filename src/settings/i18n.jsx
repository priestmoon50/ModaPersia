import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to My Themed App",
      products: "Products",
      login: "Login",
      register: "Register",
      cart: "Cart",
      primaryButton: "Primary Button",
      secondaryButton: "Secondary Button",
    },
  },
  fa: {
    translation: {
      welcome: "به برنامه تم دار من خوش آمدید",
      products: "محصولات",
      login: "ورود",
      register: "ثبت نام",
      cart: "سبد خرید",
      primaryButton: "دکمه اصلی",
      secondaryButton: "دکمه ثانویه",
    },
  },
  de: {
    translation: {
      welcome: "Willkommen in meiner Themen-App",
      products: "Produkte",
      login: "Anmelden",
      register: "Registrieren",
      cart: "Warenkorb",
      primaryButton: "Primärknopf",
      secondaryButton: "Sekundärknopf",
    },
  },
  nl: {
    translation: {
      welcome: "Welkom bij mijn thematoepassing",
      products: "Producten",
      login: "Inloggen",
      register: "Registreren",
      cart: "Winkelwagen",
      primaryButton: "Primaire knop",
      secondaryButton: "Secundaire knop",
    },
  },
  ru: {
    translation: {
      welcome: "Добро пожаловать в мое тематическое приложение",
      products: "Продукты",
      login: "Войти",
      register: "Регистрация",
      cart: "Корзина",
      primaryButton: "Основная кнопка",
      secondaryButton: "Вторичная кнопка",
    },
  },
  pl: {
    translation: {
      welcome: "Witamy w mojej tematycznej aplikacji",
      products: "Produkty",
      login: "Zaloguj się",
      register: "Zarejestruj się",
      cart: "Koszyk",
      primaryButton: "Przycisk główny",
      secondaryButton: "Przycisk drugorzędny",
    },
  },
  zh: {
    translation: {
      welcome: "欢迎使用我的主题应用",
      products: "产品",
      login: "登录",
      register: "注册",
      cart: "购物车",
      primaryButton: "主要按钮",
      secondaryButton: "次要按钮",
    },
  },
  uk: {
    translation: {
      welcome: "Ласкаво просимо до моєї тематичної програми",
      products: "Продукти",
      login: "Увійти",
      register: "Реєстрація",
      cart: "Кошик",
      primaryButton: "Основна кнопка",
      secondaryButton: "Другорядна кнопка",
    },
  },
  tr: {
    translation: {
      welcome: "Temalı Uygulama'ma Hoş Geldiniz",
      products: "Ürünler",
      login: "Giriş Yap",
      register: "Kayıt Ol",
      cart: "Sepet",
      primaryButton: "Birincil Düğme",
      secondaryButton: "İkincil Düğme",
    },
  },
};

// دریافت زبان از localStorage یا تنظیم زبان پیش‌فرض
const language = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: language, // استفاده از زبان ذخیره شده یا پیش‌فرض
    fallbackLng: {
      'en-US': ['en'],
      'fa-IR': ['fa'],
      'de-DE': ['de'],
      // دیگر کدهای زبان
      default: ['en']
    },
    interpolation: {
      escapeValue: false, // جلوگیری از تزریق XSS
    },
  });

// ذخیره زبان جدید در localStorage هنگام تغییر زبان
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
