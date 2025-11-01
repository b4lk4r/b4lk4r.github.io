import { promos } from "./data.js";
import { generateCard } from "./card-generator.js";

document.addEventListener('DOMContentLoaded', function() {
    let allCards = []; // Сохраняем все карточки для фильтрации

    function isPromoActive(promo) {
        return promo.toggle === true;
    }

    function renderAllPromos() {
        const container = document.querySelector(".cards");
        const template = document.getElementById("cardTemp");
  
        if (!container || !template) {
            console.error('Container or template not found');
            return;
        }

        container.innerHTML = '';

        const activePromos = promos.filter(isPromoActive);
        allCards = []; // Очищаем предыдущие карточки
  
        if (activePromos.length === 0) {
            container.innerHTML = '<p class="no-promos">Нет активных акций</p>';
            return;
        }

        activePromos.forEach(promo => {
            const card = generateCard(promo, template);
            container.appendChild(card);
            allCards.push({
                element: card,
                categories: promo.categories
            });
        });
    }

    // Функция фильтрации
    function filterCards(category) {
        const container = document.querySelector(".cards");
        if (!container) return;

        if (category === 'all') {
            // Показываем все карточки
            allCards.forEach(card => {
                card.element.style.display = 'block';
            });
        } else {
            // Фильтруем по категории
            allCards.forEach(card => {
                if (card.categories.includes(category)) {
                    card.element.style.display = 'block';
                } else {
                    card.element.style.display = 'none';
                }
            });
        }

        // Обновляем активную кнопку
        updateActiveButton(category);
    }

    // Обновление активной кнопки
    function updateActiveButton(activeCategory) {
        const buttons = document.querySelectorAll('.navbar-button');
        buttons.forEach(btn => {
            if (btn.dataset.category === activeCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Инициализация фильтрации
    function initFilter() {
        const filterButtons = document.querySelectorAll('.navbar-button');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;
                filterCards(category);
            });
        });
    }

    // Анимация появления карточек
    function animateCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Основная функция инициализации
    function init() {
        renderAllPromos();
        initFilter();
        setTimeout(animateCards, 100); // Небольшая задержка для анимации
        
        // Показываем все карточки при загрузке
        filterCards('all');
    }

    // Запускаем всё
    init();
});