import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
     
      products: "Products",
      login: "Login",
      register: "Register",
      cart: "Cart",
      primaryButton: "Primary Button",
      secondaryButton: "Secondary Button",
      footer: {
        about: {
          title: "About SNIPES",
          terms: "Terms & Conditions",
          privacy: "Privacy Policy",
          imprint: "Imprint",
          press: "Press",
          jobs: "Jobs at SNIPES",
          responsibility: "Responsibility",
          dataSettings: "Data Protection Settings",
        },
        
        service: {
          title: "Service",
          snipesClique: "SNIPES CLIQUE",
          contact: "Contact",
          storeFinder: "Store Finder",
          newsletter: "Newsletter",
          klarnaInfo: "Information about Klarna",
          affiliate: "Affiliate Program",
        },
        help: {
          title: "Help",
          raffles: "Raffles",
          faq: "Help/FAQ",
          delivery: "Delivery",
          returns: "Returns",
        },
        contact: {
          title: "Service Mail",
          contactUs: "Contact Us!",
        },
        payment: {
          title: "Payment Methods",
        },
        security: {
          title: "Secure Shopping",
        },
        app: {
          title: "SNIPES App",
        },
        social: {
          title: "Follow Us",
        },
        categories: {
          allBrands: "All Brands",
          sneakers: "Sneakers",
          hoodies: "Hoodies",
          jeans: "Jeans",
          tShirts: "T-Shirts",
        },
        rights: "All rights reserved.",
      },
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
      footer: {
        about: {
          title: "درباره SNIPES",
          terms: "شرایط و ضوابط",
          privacy: "سیاست حفظ حریم خصوصی",
          imprint: "نقش",
          press: "مطبوعات",
          jobs: "فرصت‌های شغلی در SNIPES",
          responsibility: "مسئولیت",
          dataSettings: "تنظیمات حفاظت از داده",
        },
        service: {
          title: "خدمات",
          snipesClique: "SNIPES CLIQUE",
          contact: "تماس",
          storeFinder: "یافتن فروشگاه",
          newsletter: "خبرنامه",
          klarnaInfo: "اطلاعات در مورد Klarna",
          affiliate: "برنامه همکاری",
        },
        help: {
          title: "راهنما",
          raffles: "قرعه کشی‌ها",
          faq: "راهنما/پرسش و پاسخ",
          delivery: "تحویل",
          returns: "بازگشت",
        },
        contact: {
          title: "ایمیل خدمات",
          contactUs: "با ما تماس بگیرید!",
        },
        payment: {
          title: "روش‌های پرداخت",
        },
        security: {
          title: "خرید ایمن",
        },
        app: {
          title: "اپلیکیشن SNIPES",
        },
        social: {
          title: "ما را دنبال کنید",
        },
        categories: {
          allBrands: "تمام برندها",
          sneakers: "کفش‌های کتانی",
          hoodies: "هودی‌ها",
          jeans: "شلوار جین",
          tShirts: "تی‌شرت‌ها",
        },
        rights: "کلیه حقوق محفوظ است.",
      },
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
      footer: {
        about: {
          title: "Über SNIPES",
          terms: "Allgemeine Geschäftsbedingungen",
          privacy: "Datenschutzrichtlinie",
          imprint: "Impressum",
          press: "Presse",
          jobs: "Jobs bei SNIPES",
          responsibility: "Verantwortung",
          dataSettings: "Datenschutzeinstellungen",
        },
        service: {
          title: "Service",
          snipesClique: "SNIPES CLIQUE",
          contact: "Kontakt",
          storeFinder: "Ladenfinder",
          newsletter: "Newsletter",
          klarnaInfo: "Informationen über Klarna",
          affiliate: "Affiliate-Programm",
        },
        help: {
          title: "Hilfe",
          raffles: "Verlosungen",
          faq: "Hilfe/FAQ",
          delivery: "Lieferung",
          returns: "Rückversand",
        },
        contact: {
          title: "Service-Mail",
          contactUs: "Kontaktieren Sie uns!",
        },
        payment: {
          title: "Zahlungsmethoden",
        },
        security: {
          title: "Sicheres Einkaufen",
        },
        app: {
          title: "SNIPES App",
        },
        social: {
          title: "Folgen Sie uns",
        },
        categories: {
          allBrands: "Alle Marken",
          sneakers: "Sneaker",
          hoodies: "Hoodies",
          jeans: "Jeans",
          tShirts: "T-Shirts",
        },
        rights: "Alle Rechte vorbehalten.",
      },
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue dans mon application à thème",
      products: "Produits",
      login: "Connexion",
      register: "S'inscrire",
      cart: "Panier",
      primaryButton: "Bouton principal",
      secondaryButton: "Bouton secondaire",
      footer: {
        about: {
          title: "À propos de SNIPES",
          terms: "Conditions générales",
          privacy: "Politique de confidentialité",
          imprint: "Mentions légales",
          press: "Presse",
          jobs: "Emplois chez SNIPES",
          responsibility: "Responsabilité",
          dataSettings: "Paramètres de protection des données",
        },
        service: {
          title: "Service",
          snipesClique: "SNIPES CLIQUE",
          contact: "Contact",
          storeFinder: "Trouver un magasin",
          newsletter: "Newsletter",
          klarnaInfo: "Informations sur Klarna",
          affiliate: "Programme d'affiliation",
        },
        help: {
          title: "Aide",
          raffles: "Tirages au sort",
          faq: "Aide/FAQ",
          delivery: "Livraison",
          returns: "Retours",
        },
        contact: {
          title: "Courriel du service",
          contactUs: "Contactez-nous !",
        },
        payment: {
          title: "Méthodes de paiement",
        },
        security: {
          title: "Achats sécurisés",
        },
        app: {
          title: "Application SNIPES",
        },
        social: {
          title: "Suivez-nous",
        },
        categories: {
          allBrands: "Toutes les marques",
          sneakers: "Baskets",
          hoodies: "Sweats à capuche",
          jeans: "Jeans",
          tShirts: "T-shirts",
        },
        rights: "Tous droits réservés.",
      },
    },
  },
  it: {
    translation: {
      welcome: "Benvenuto nella mia app a tema",
      products: "Prodotti",
      login: "Accedi",
      register: "Registrati",
      cart: "Carrello",
      primaryButton: "Pulsante primario",
      secondaryButton: "Pulsante secondario",
      footer: {
        about: {
          title: "Informazioni su SNIPES",
          terms: "Termini e condizioni",
          privacy: "Informativa sulla privacy",
          imprint: "Impronta",
          press: "Stampa",
          jobs: "Lavori presso SNIPES",
          responsibility: "Responsabilità",
          dataSettings: "Impostazioni di protezione dei dati",
        },
        service: {
          title: "Servizio",
          snipesClique: "SNIPES CLIQUE",
          contact: "Contatto",
          storeFinder: "Trova un negozio",
          newsletter: "Newsletter",
          klarnaInfo: "Informazioni su Klarna",
          affiliate: "Programma di affiliazione",
        },
        help: {
          title: "Aiuto",
          raffles: "Lotterie",
          faq: "Aiuto/FAQ",
          delivery: "Consegna",
          returns: "Resi",
        },
        contact: {
          title: "Email di servizio",
          contactUs: "Contattaci!",
        },
        payment: {
          title: "Metodi di pagamento",
        },
        security: {
          title: "Shopping sicuro",
        },
        app: {
          title: "App SNIPES",
        },
        social: {
          title: "Seguici",
        },
        categories: {
          allBrands: "Tutti i marchi",
          sneakers: "Sneakers",
          hoodies: "Felpe con cappuccio",
          jeans: "Jeans",
          tShirts: "T-shirt",
        },
        rights: "Tutti i diritti riservati.",
      },
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido a mi aplicación con tema",
      products: "Productos",
      login: "Iniciar sesión",
      register: "Registrarse",
      cart: "Carrito",
      primaryButton: "Botón principal",
      secondaryButton: "Botón secundario",
      footer: {
        about: {
          title: "Acerca de SNIPES",
          terms: "Términos y condiciones",
          privacy: "Política de privacidad",
          imprint: "Impronta",
          press: "Prensa",
          jobs: "Trabajos en SNIPES",
          responsibility: "Responsabilidad",
          dataSettings: "Configuración de protección de datos",
        },
        service: {
          title: "Servicio",
          snipesClique: "SNIPES CLIQUE",
          contact: "Contacto",
          storeFinder: "Buscar tienda",
          newsletter: "Boletín informativo",
          klarnaInfo: "Información sobre Klarna",
          affiliate: "Programa de afiliación",
        },
        help: {
          title: "Ayuda",
          raffles: "Sorteos",
          faq: "Ayuda/Preguntas frecuentes",
          delivery: "Entrega",
          returns: "Devoluciones",
        },
        contact: {
          title: "Correo del servicio",
          contactUs: "¡Contáctenos!",
        },
        payment: {
          title: "Métodos de pago",
        },
        security: {
          title: "Compra segura",
        },
        app: {
          title: "Aplicación SNIPES",
        },
        social: {
          title: "Síguenos",
        },
        categories: {
          allBrands: "Todas las marcas",
          sneakers: "Zapatillas",
          hoodies: "Sudaderas",
          jeans: "Jeans",
          tShirts: "Camisetas",
        },
        rights: "Todos los derechos reservados.",
      },
    },
  },
  jp: {
    translation: {
      welcome: "テーマ付きアプリへようこそ",
      products: "製品",
      login: "ログイン",
      register: "登録",
      cart: "カート",
      primaryButton: "メインボタン",
      secondaryButton: "セカンダリーボタン",
      footer: {
        about: {
          title: "SNIPESについて",
          terms: "利用規約",
          privacy: "プライバシーポリシー",
          imprint: "インプリント",
          press: "プレス",
          jobs: "SNIPESの求人",
          responsibility: "責任",
          dataSettings: "データ保護設定",
        },
        service: {
          title: "サービス",
          snipesClique: "SNIPES CLIQUE",
          contact: "お問い合わせ",
          storeFinder: "店舗検索",
          newsletter: "ニュースレター",
          klarnaInfo: "Klarnaに関する情報",
          affiliate: "アフィリエイトプログラム",
        },
        help: {
          title: "ヘルプ",
          raffles: "抽選",
          faq: "ヘルプ/FAQ",
          delivery: "配送",
          returns: "返品",
        },
        contact: {
          title: "サービスメール",
          contactUs: "お問い合わせください！",
        },
        payment: {
          title: "支払い方法",
        },
        security: {
          title: "安全なショッピング",
        },
        app: {
          title: "SNIPESアプリ",
        },
        social: {
          title: "フォローしてください",
        },
        categories: {
          allBrands: "すべてのブランド",
          sneakers: "スニーカー",
          hoodies: "フーディー",
          jeans: "ジーンズ",
          tShirts: "Tシャツ",
        },
        rights: "全著作権所有。",
      },
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
      footer: {
        about: {
          title: "Over SNIPES",
          terms: "Algemene voorwaarden",
          privacy: "Privacybeleid",
          imprint: "Impressum",
          press: "Pers",
          jobs: "Banen bij SNIPES",
          responsibility: "Verantwoordelijkheid",
          dataSettings: "Gegevensbeschermingsinstellingen",
        },
        service: {
          title: "Service",
          snipesClique: "SNIPES CLIQUE",
          contact: "Contact",
          storeFinder: "Winkelzoeker",
          newsletter: "Nieuwsbrief",
          klarnaInfo: "Informatie over Klarna",
          affiliate: "Partnerprogramma",
        },
        help: {
          title: "Hulp",
          raffles: "Verlotingen",
          faq: "Hulp/FAQ",
          delivery: "Bezorging",
          returns: "Retourneren",
        },
        contact: {
          title: "Servicemail",
          contactUs: "Neem contact met ons op!",
        },
        payment: {
          title: "Betaalmethoden",
        },
        security: {
          title: "Veilig winkelen",
        },
        app: {
          title: "SNIPES App",
        },
        social: {
          title: "Volg ons",
        },
        categories: {
          allBrands: "Alle merken",
          sneakers: "Sneakers",
          hoodies: "Hoodies",
          jeans: "Jeans",
          tShirts: "T-shirts",
        },
        rights: "Alle rechten voorbehouden.",
      },
    },
  },
  ru: {
    translation: {
      welcome: "Добро пожаловать в моё тематическое приложение",
      products: "Продукты",
      login: "Войти",
      register: "Регистрация",
      cart: "Корзина",
      primaryButton: "Основная кнопка",
      secondaryButton: "Вторичная кнопка",
      footer: {
        about: {
          title: "О SNIPES",
          terms: "Условия использования",
          privacy: "Политика конфиденциальности",
          imprint: "Импрессум",
          press: "Пресса",
          jobs: "Вакансии в SNIPES",
          responsibility: "Ответственность",
          dataSettings: "Настройки защиты данных",
        },
        service: {
          title: "Сервис",
          snipesClique: "SNIPES CLIQUE",
          contact: "Контакт",
          storeFinder: "Найти магазин",
          newsletter: "Новостная рассылка",
          klarnaInfo: "Информация о Klarna",
          affiliate: "Партнёрская программа",
        },
        help: {
          title: "Помощь",
          raffles: "Лотереи",
          faq: "Помощь/FAQ",
          delivery: "Доставка",
          returns: "Возврат",
        },
        contact: {
          title: "Сервисная почта",
          contactUs: "Свяжитесь с нами!",
        },
        payment: {
          title: "Методы оплаты",
        },
        security: {
          title: "Безопасные покупки",
        },
        app: {
          title: "Приложение SNIPES",
        },
        social: {
          title: "Следите за нами",
        },
        categories: {
          allBrands: "Все бренды",
          sneakers: "Кроссовки",
          hoodies: "Худи",
          jeans: "Джинсы",
          tShirts: "Футболки",
        },
        rights: "Все права защищены.",
      },
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
      footer: {
        about: {
          title: "O SNIPES",
          terms: "Warunki",
          privacy: "Polityka prywatności",
          imprint: "Impresum",
          press: "Prasa",
          jobs: "Praca w SNIPES",
          responsibility: "Odpowiedzialność",
          dataSettings: "Ustawienia ochrony danych",
        },
        service: {
          title: "Usługi",
          snipesClique: "SNIPES CLIQUE",
          contact: "Kontakt",
          storeFinder: "Znajdź sklep",
          newsletter: "Newsletter",
          klarnaInfo: "Informacje o Klarna",
          affiliate: "Program partnerski",
        },
        help: {
          title: "Pomoc",
          raffles: "Losowania",
          faq: "Pomoc/FAQ",
          delivery: "Dostawa",
          returns: "Zwroty",
        },
        contact: {
          title: "Poczta serwisowa",
          contactUs: "Skontaktuj się z nami!",
        },
        payment: {
          title: "Metody płatności",
        },
        security: {
          title: "Bezpieczne zakupy",
        },
        app: {
          title: "Aplikacja SNIPES",
        },
        social: {
          title: "Śledź nas",
        },
        categories: {
          allBrands: "Wszystkie marki",
          sneakers: "Trampki",
          hoodies: "Bluzy",
          jeans: "Dżinsy",
          tShirts: "Koszulki",
        },
        rights: "Wszelkie prawa zastrzeżone.",
      },
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
      footer: {
        about: {
          title: "关于 SNIPES",
          terms: "条款和条件",
          privacy: "隐私政策",
          imprint: "印记",
          press: "新闻",
          jobs: "SNIPES 工作机会",
          responsibility: "责任",
          dataSettings: "数据保护设置",
        },
        service: {
          title: "服务",
          snipesClique: "SNIPES CLIQUE",
          contact: "联系",
          storeFinder: "商店查找器",
          newsletter: "通讯",
          klarnaInfo: "关于 Klarna 的信息",
          affiliate: "联盟计划",
        },
        help: {
          title: "帮助",
          raffles: "抽奖",
          faq: "帮助/常见问题",
          delivery: "交货",
          returns: "退货",
        },
        contact: {
          title: "服务邮件",
          contactUs: "联系我们！",
        },
        payment: {
          title: "支付方式",
        },
        security: {
          title: "安全购物",
        },
        app: {
          title: "SNIPES 应用",
        },
        social: {
          title: "关注我们",
        },
        categories: {
          allBrands: "所有品牌",
          sneakers: "运动鞋",
          hoodies: "连帽衫",
          jeans: "牛仔裤",
          tShirts: "T 恤",
        },
        rights: "版权所有。",
      },
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
      footer: {
        about: {
          title: "Про SNIPES",
          terms: "Умови використання",
          privacy: "Політика конфіденційності",
          imprint: "Імпрессум",
          press: "Преса",
          jobs: "Робота в SNIPES",
          responsibility: "Відповідальність",
          dataSettings: "Налаштування захисту даних",
        },
        service: {
          title: "Сервіс",
          snipesClique: "SNIPES CLIQUE",
          contact: "Контакт",
          storeFinder: "Пошук магазину",
          newsletter: "Розсилка",
          klarnaInfo: "Інформація про Klarna",
          affiliate: "Партнерська програма",
        },
        help: {
          title: "Допомога",
          raffles: "Розіграші",
          faq: "Допомога/FAQ",
          delivery: "Доставка",
          returns: "Повернення",
        },
        contact: {
          title: "Сервісна пошта",
          contactUs: "Зв'яжіться з нами!",
        },
        payment: {
          title: "Способи оплати",
        },
        security: {
          title: "Безпечні покупки",
        },
        app: {
          title: "SNIPES Додаток",
        },
        social: {
          title: "Слідкуйте за нами",
        },
        categories: {
          allBrands: "Усі бренди",
          sneakers: "Кросівки",
          hoodies: "Толстовки",
          jeans: "Джинси",
          tShirts: "Футболки",
        },
        rights: "Усі права захищені.",
      },
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
      footer: {
        about: {
          title: "SNIPES Hakkında",
          terms: "Şartlar ve Koşullar",
          privacy: "Gizlilik Politikası",
          imprint: "İzlenim",
          press: "Basın",
          jobs: "SNIPES'ta İş",
          responsibility: "Sorumluluk",
          dataSettings: "Veri Koruma Ayarları",
        },
        service: {
          title: "Hizmet",
          snipesClique: "SNIPES CLIQUE",
          contact: "İletişim",
          storeFinder: "Mağaza Bulucu",
          newsletter: "Bülten",
          klarnaInfo: "Klarna Hakkında Bilgi",
          affiliate: "Ortaklık Programı",
        },
        help: {
          title: "Yardım",
          raffles: "Çekilişler",
          faq: "Yardım/SSS",
          delivery: "Teslimat",
          returns: "İadeler",
        },
        contact: {
          title: "Servis Postası",
          contactUs: "Bizimle iletişime geçin!",
        },
        payment: {
          title: "Ödeme Yöntemleri",
        },
        security: {
          title: "Güvenli Alışveriş",
        },
        app: {
          title: "SNIPES Uygulaması",
        },
        social: {
          title: "Bizi takip edin",
        },
        categories: {
          allBrands: "Tüm Markalar",
          sneakers: "Spor Ayakkabılar",
          hoodies: "Kapüşonlular",
          jeans: "Kot Pantolonlar",
          tShirts: "Tişörtler",
        },
        rights: "Tüm hakları saklıdır.",
      },
    },
  },

  pt: {
    translation: {
      welcome: "Bem-vindo ao Meu Aplicativo Temático",
      products: "Produtos",
      login: "Entrar",
      register: "Registrar",
      cart: "Carrinho",
      primaryButton: "Botão Primário",
      secondaryButton: "Botão Secundário",
      footer: {
        about: {
          title: "Sobre a SNIPES",
          terms: "Termos e Condições",
          privacy: "Política de Privacidade",
          imprint: "Impressão",
          press: "Imprensa",
          jobs: "Trabalhe na SNIPES",
          responsibility: "Responsabilidade",
          dataSettings: "Configurações de Proteção de Dados",
        },
        service: {
          title: "Serviço",
          snipesClique: "SNIPES CLIQUE",
          contact: "Contato",
          storeFinder: "Localizador de Lojas",
          newsletter: "Boletim Informativo",
          klarnaInfo: "Informações sobre Klarna",
          affiliate: "Programa de Afiliados",
        },
        help: {
          title: "Ajuda",
          raffles: "Sorteios",
          faq: "Ajuda/FAQ",
          delivery: "Entrega",
          returns: "Devoluções",
        },
        contact: {
          title: "Correio de Serviço",
          contactUs: "Contate-nos!",
        },
        payment: {
          title: "Métodos de Pagamento",
        },
        security: {
          title: "Compras Seguras",
        },
        app: {
          title: "Aplicativo SNIPES",
        },
        social: {
          title: "Siga-nos",
        },
        categories: {
          allBrands: "Todas as Marcas",
          sneakers: "Tênis",
          hoodies: "Moletom com Capuz",
          jeans: "Jeans",
          tShirts: "Camisetas",
        },
        rights: "Todos os direitos reservados.",
      },
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
      'nl-NL': ['nl'], // اضافه کردن هلندی
      'ru-RU': ['ru'], // اضافه کردن روسی
      'pl-PL': ['pl'], // اضافه کردن لهستانی
      'zh-CN': ['zh'], // اضافه کردن چینی
      'uk-UA': ['uk'], // اضافه کردن اوکراینی
      'tr-TR': ['tr'], // اضافه کردن ترکی
      'fr-FR': ['fr'],
      'it-IT': ['it'],
      'es-ES': ['es'],
      'ja-JP': ['jp'],
      'pt-BR': ['pt'],
      default: ['en'], // زبان پیش‌فرض در صورت نبود مطابقت
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

