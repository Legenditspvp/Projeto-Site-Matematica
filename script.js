document.addEventListener('DOMContentLoaded', () => {
    const courtGrid = document.getElementById('court-grid');
    const modalOverlay = document.getElementById('modal-overlay');
    const quickAddModal = document.getElementById('quick-add-modal');
    const fab = document.getElementById('fab');
    const closeButtons = document.querySelectorAll('.close-modal');
    const chips = document.querySelectorAll('.chip');

    // Dados Mockados
    const courts = [
        { id: 1, name: 'Arena Central', sport: 'basquete', address: 'Rua Principal, 10', rating: 4.8, status: 'free', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400' },
        { id: 2, name: 'Parque do Ibirapuera', sport: 'basquete', address: 'Av. Pedro Álvares Cabral', rating: 4.9, status: 'occupied', img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400' },
        { id: 3, name: 'Ginásio Municipal', sport: 'volei', address: 'Rua do Esporte, 50', rating: 4.5, status: 'free', img: 'https://images.unsplash.com/photo-1592656094267-764a45160876?w=400' },
        { id: 4, name: 'Campo da Vila', sport: 'futebol', address: 'Rua da Vila, 100', rating: 4.2, status: 'free', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400' },
        { id: 5, name: 'Quadra de Elite', sport: 'basquete', address: 'Av. Paulista, 1500', rating: 4.7, status: 'occupied', img: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400' }
    ];

    // Simulação de Loading
    setTimeout(() => {
        renderCourts(courts);
    }, 1500);

    function renderCourts(data) {
        courtGrid.innerHTML = '';
        data.forEach(court => {
            const card = document.createElement('div');
            card.className = 'court-card';

            // Container de Imagem
            const imageContainer = document.createElement('div');
            imageContainer.className = 'court-image';

            const badge = document.createElement('span');
            badge.className = `badge badge-${court.sport}`;
            const sportIcons = {
                'basquete': '🏀 BASQUETE',
                'futebol': '⚽ FUTEBOL',
                'volei': '🏐 VÔLEI'
            };
            badge.textContent = sportIcons[court.sport] || court.sport.toUpperCase();

            const statusIndicator = document.createElement('div');
            statusIndicator.className = 'status-indicator';
            const pulse = document.createElement('span');
            pulse.className = `pulse ${court.status}`;
            statusIndicator.appendChild(pulse);
            statusIndicator.appendChild(document.createTextNode(court.status === 'free' ? ' Livre' : ' Ocupada'));

            const img = document.createElement('img');
            img.src = court.img;
            img.alt = court.name;

            imageContainer.appendChild(badge);
            imageContainer.appendChild(statusIndicator);
            imageContainer.appendChild(img);

            // Container de Informações
            const infoContainer = document.createElement('div');
            infoContainer.className = 'court-info';

            const title = document.createElement('h3');
            title.textContent = court.name;

            const address = document.createElement('p');
            address.className = 'address';
            address.textContent = court.address;

            const ratingContainer = document.createElement('div');
            ratingContainer.className = 'rating';
            const starIcon = document.createElement('i');
            starIcon.className = 'fas fa-star';
            const ratingValue = document.createElement('span');
            ratingValue.textContent = ` ${court.rating}`;

            ratingContainer.appendChild(starIcon);
            ratingContainer.appendChild(ratingValue);

            infoContainer.appendChild(title);
            infoContainer.appendChild(address);
            infoContainer.appendChild(ratingContainer);

            card.appendChild(imageContainer);
            card.appendChild(infoContainer);

            card.addEventListener('click', () => openDetailModal(court));
            courtGrid.appendChild(card);
        });
    }

    // Filtros
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const filter = chip.dataset.filter;

            if (filter === 'all') {
                renderCourts(courts);
            } else if (filter === 'proximas' || filter === 'avaliadas') {
                // Simples demonstração de ordenação
                const sorted = [...courts].sort((a, b) => b.rating - a.rating);
                renderCourts(sorted);
            } else {
                const filtered = courts.filter(c => c.sport === filter);
                renderCourts(filtered);
            }
        });
    });

    // Modais
    function openDetailModal(court) {
        document.getElementById('modal-title').textContent = court.name;
        document.getElementById('modal-address').textContent = court.address;
        document.getElementById('modal-img').src = court.img.replace('w=400', 'w=800');
        modalOverlay.style.display = 'flex';
    }

    fab.addEventListener('click', () => {
        quickAddModal.style.display = 'flex';
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
            quickAddModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.style.display = 'none';
        if (e.target === quickAddModal) quickAddModal.style.display = 'none';
    });

    // Form Submit
    document.getElementById('quick-add-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Obrigado pela sugestão! Nossa equipe irá validar a quadra.');
        quickAddModal.style.display = 'none';
    });
});
