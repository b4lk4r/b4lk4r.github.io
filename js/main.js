import { promos } from "./data.js";
import { generateCard } from "./card-generator.js";

document.addEventListener("DOMContentLoaded", function () {
  // ---- Telegram Mini App glue ----
  const TMA = {
    isAvailable: !!(window.Telegram && Telegram.WebApp),
    get tg() { return Telegram.WebApp; }
  };

  function initTelegram() {
    if (!TMA.isAvailable) return;

    const tg = TMA.tg;
    tg.ready();
    tg.expand(); // занять всю доступную высоту

    // Применим цвета темы к :root (можешь использовать их в CSS)
    document.documentElement.style.setProperty("--tg-bg", tg.backgroundColor || "#fff");
    document.documentElement.style.setProperty("--tg-text", tg.colorScheme === "dark" ? "#fff" : "#000");

    // Главная кнопка: по нажатию показываем все карточки
    tg.MainButton.setText("Показать все");
    tg.MainButton.onClick(() => {
      filterCards("all");
      try { tg.HapticFeedback.impactOccurred("light"); } catch (_) {}
    });
    tg.MainButton.show();

    // Кнопка «Назад» (если понадобится внутренняя навигация)
    // tg.BackButton.show();
    // tg.BackButton.onClick(() => { /* ваша логика */ });
  }

  // Если мини-аппа запущена по deep link с параметром (?startapp=...)
  function getStartParam() {
    if (!TMA.isAvailable) return "";
    // initDataUnsafe безопасно читать на клиенте для UI (не для авторизации)
    return TMA.tg?.initDataUnsafe?.start_param || "";
  }

  // ---- Ваш существующий код (с минимальными правками) ----
  let allCards = []; // Сохраняем все карточки для фильтрации

  function isPromoActive(promo) {
    return promo.toggle === true;
  }

  function renderAllPromos() {
    const container = document.querySelector(".cards");
    const template = document.getElementById("cardTemp");

    if (!container || !template) {
      console.error("Container or template not found");
      return;
    }

    container.innerHTML = "";

    const activePromos = promos.filter(isPromoActive);
    allCards = []; // Очищаем предыдущие карточки

    if (activePromos.length === 0) {
      container.innerHTML = '<p class="no-promos">Нет активных акций</p>';
      return;
    }

    activePromos.forEach((promo) => {
      const card = generateCard(promo, template);
      container.appendChild(card);
      allCards.push({
        element: card,
        categories: promo.categories,
      });
    });
  }

  // Функция фильтрации
  function filterCards(category) {
    const container = document.querySelector(".cards");
    if (!container) return;

    if (category === "all") {
      allCards.forEach((card) => {
        card.element.style.display = "block";
      });
    } else {
      allCards.forEach((card) => {
        if (card.categories.includes(category)) {
          card.element.style.display = "block";
        } else {
          card.element.style.display = "none";
        }
      });
    }

    updateActiveButton(category);
  }

  // Обновление активной кнопки
  function updateActiveButton(activeCategory) {
    const buttons = document.querySelectorAll(".navbar-button");
    buttons.forEach((btn) => {
      if (btn.dataset.category === activeCategory) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Инициализация фильтрации
  function initFilter() {
    const filterButtons = document.querySelectorAll(".navbar-button");

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const category = this.dataset.category;
        filterCards(category);

        // Небольшой тик в Telegram при выборе фильтра
        if (TMA.isAvailable) {
          try { TMA.tg.HapticFeedback.selectionChanged(); } catch (_) {}
        }
      });
    });
  }

  // Анимация появления карточек
  function animateCards() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "all 0.5s ease";

      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });
  }

  // Основная инициализация
  function init() {
    initTelegram();        // <- добавили
    renderAllPromos();
    initFilter();
    setTimeout(animateCards, 100);

    // 1) Если мини-аппа запущена со start_param, применим его как фильтр
    const startParam = getStartParam();
    if (startParam && allCards.some(c => c.categories.includes(startParam))) {
      filterCards(startParam);
    } else {
      // 2) Иначе показываем все
      filterCards("all");
    }
  }

  // Запуск
  init();
});
