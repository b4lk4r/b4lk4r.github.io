import { promos } from "./data.js";
import { generateCard } from "./card-generator.js";

document.addEventListener('DOMContentLoaded', function() {
    function renderAllPromos() {
        const container = document.querySelector(".cards");
        
        if (!container) {
            console.error('Container not found');
            return;
        }

        container.innerHTML = '';

        const activePromos = promos.filter(promo => promo.toggle === true);
  
        if (activePromos.length === 0) {
            container.innerHTML = '<p class="no-promos">Нет активных акций</p>';
            return;
        }

        activePromos.forEach(promo => {
            const card = generateCard(promo);
            container.appendChild(card);
        });
    }

    renderAllPromos();
});