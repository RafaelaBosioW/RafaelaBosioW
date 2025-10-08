// Array para armazenar os jogos
let games = [];

// Carregar jogos salvos ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadGames();
    renderGames();
});

// Função para alternar entre seções
function showSection(sectionId) {
    // Remove a classe 'active' de todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Adiciona a classe 'active' à seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Função para carregar jogos da memória
function loadGames() {
    // Jogos de exemplo iniciais
    if (games.length === 0) {
        games = [
            {
                id: 1,
                name: "Jogo da Cobrinha",
                url: "file:///C:/Users/rafab/OneDrive/Documentos/Trabalhos%20Rafa/Jogo%20Cobrinha/index.html",
                image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='180' viewBox='0 0 280 180'%3E%3Crect fill='%231a1a1a' width='280' height='180'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%2300ff00'%3E🐍%3C/text%3E%3C/svg%3E"
            }
        ];
    }
}

// Função para renderizar os jogos na página
function renderGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    
    if (!gamesGrid) return;

    // Limpa o grid antes de renderizar
    gamesGrid.innerHTML = '';

    // Se não houver jogos, mostra mensagem
    if (games.length === 0) {
        gamesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--pink-light); padding: 40px;">
                <p style="font-size: 1.2rem;">Nenhum jogo adicionado ainda. Adicione seu primeiro jogo abaixo!</p>
            </div>
        `;
        return;
    }

    // Renderiza cada jogo
    games.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

// Função para criar um card de jogo
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.onclick = () => window.open(game.url, '_blank');

    const imageUrl = game.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="180" viewBox="0 0 280 180"%3E%3Crect fill="%232a2a2a" width="280" height="180"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ff1493"%3E🎮%3C/text%3E%3C/svg%3E';

    card.innerHTML = `
        <button class="delete-btn" onclick="deleteGame(event, ${game.id})" title="Remover jogo">×</button>
        <img src="${imageUrl}" alt="${game.name}" class="game-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'280\\' height=\\'180\\' viewBox=\\'0 0 280 180\\'%3E%3Crect fill=\\'%232a2a2a\\' width=\\'280\\' height=\\'180\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\' font-size=\\'24\\' fill=\\'%23ff1493\\'%3E🎮%3C/text%3E%3C/svg%3E'">
        <h3>${game.name}</h3>
        <a href="${game.url}" class="game-link" target="_blank" onclick="event.stopPropagation()">Jogar Agora →</a>
    `;

    return card;
}

// Função para deletar um jogo
function deleteGame(event, gameId) {
    event.stopPropagation();
    
    if (confirm('Tem certeza que deseja remover este jogo?')) {
        games = games.filter(game => game.id !== gameId);
        renderGames();
        showNotification('Jogo removido com sucesso!');
    }
}

// Event listener para o formulário de adicionar jogo
const addGameForm = document.getElementById('addGameForm');
if (addGameForm) {
    addGameForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const gameName = document.getElementById('gameName').value.trim();
        const gameUrl = document.getElementById('gameUrl').value.trim();
        const gameImage = document.getElementById('gameImage').value.trim();

        // Validação básica
        if (!gameName || !gameUrl) {
            showNotification('Por favor, preencha o nome e o link do jogo!', 'error');
            return;
        }

        // Validação de URL
        try {
            new URL(gameUrl);
        } catch (e) {
            showNotification('Por favor, insira um link válido (comece com https://)', 'error');
            return;
        }

        // Adiciona o novo jogo
        const newGame = {
            id: Date.now(),
            name: gameName,
            url: gameUrl,
            image: gameImage
        };

        games.push(newGame);
        renderGames();

        // Limpa o formulário
        addGameForm.reset();

        // Mostra notificação de sucesso
        showNotification('Jogo adicionado com sucesso!');
    });
}

// Função para mostrar notificações
function showNotification(message, type = 'success') {
    // Remove notificação existente se houver
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #ff1493, #ff69b4)' : 'linear-gradient(135deg, #ff1493, #dc143c)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(255, 20, 147, 0.5);
        z-index: 1000;
        animation: slideInRight 0.5s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Adiciona animações CSS para as notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Adiciona efeito de partículas no fundo (opcional - pode ser removido se deixar pesado)
function createParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 5px;
        height: 5px;
        background: var(--pink-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.6;
        animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
    `;
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    
    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 5000);
}

// Cria partículas periodicamente
setInterval(createParticle, 500);

// Adiciona animação de float para as partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(-10px) translateX(-10px); }
        75% { transform: translateY(-30px) translateX(5px); }
    }
`;
document.head.appendChild(particleStyle);