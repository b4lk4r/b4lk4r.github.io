export function generateCard(promo) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.categories = Array.isArray(promo.categories) 
        ? promo.categories.join(' ') 
        : 'all';

    card.innerHTML = `
        <div class="cardLine1">
            <img src="${promo.visual || ''}" alt="${promo.name || ''}" class="cardLogo">
            <p class="cardHeader">${promo.name || ''}</p>
        </div>
        <p class="cardDescr">${promo.description || ''}</p>
    `;

    return card;
}