document.addEventListener('DOMContentLoaded', function() {
    const mesAnoElement = document.getElementById('mes-ano');
    const calendarioElement = document.querySelector('.calendario');
    const modal = document.getElementById('modal');
    const eventModal = document.getElementById('event-modal');
    const closeModal = document.getElementById('close');
    const closeEventModal = document.getElementById('event-close');
    const eventForm = document.getElementById('event-form');
    const eventDateInput = document.getElementById('event-date');
    const eventDescriptionInput = document.getElementById('event-description');
    const eventDetails = document.getElementById('event-details');
    const addEventButton = document.getElementById('add-event');
    const anteriorButton = document.getElementById('anterior');
    const proximoButton = document.getElementById('proximo');

    let currentDate = new Date(2024, 0); // Começa em janeiro de 2024

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function atualizarCalendario() {
        // Limpa o calendário
        calendarioElement.innerHTML = `
            <div class="dia-nome">Dom</div>
            <div class="dia-nome">Seg</div>
            <div class="dia-nome">Ter</div>
            <div class="dia-nome">Qua</div>
            <div class="dia-nome">Qui</div>
            <div class="dia-nome">Sex</div>
            <div class="dia-nome">Sáb</div>
        `;

        const mes = currentDate.getMonth();
        const ano = currentDate.getFullYear();

        // Atualiza o span do mês e ano
        mesAnoElement.textContent = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

        // Primeiro dia do mês
        const primeiroDia = new Date(ano, mes, 1).getDay();
        const diasNoMes = new Date(ano, mes + 1, 0).getDate();

        // Adiciona os dias vazios antes do primeiro dia do mês
        for (let i = 0; i < primeiroDia; i++) {
            calendarioElement.innerHTML += '<div class="vazio"></div>';
        }

        // Adiciona os dias do mês
        for (let i = 1; i <= diasNoMes; i++) {
            const dataFormatada = formatDate(new Date(ano, mes, i));
            calendarioElement.innerHTML += `<div class="dia" data-date="${dataFormatada}">${i}</div>`;
        }

        // Adiciona eventos aos dias
        const eventos = JSON.parse(localStorage.getItem('eventos')) || {};
        document.querySelectorAll('.dia').forEach(dia => {
            const date = dia.getAttribute('data-date');
            if (eventos[date]) {
                dia.setAttribute('data-event', eventos[date]);
            }
            dia.addEventListener('click', function() {
                mostrarEvento(date);
            });
        });
    }

    function mostrarEvento(date) {
        const eventos = JSON.parse(localStorage.getItem('eventos')) || {};
        const evento = eventos[date];
        if (evento) {
            eventDetails.textContent = evento;
        } else {
            eventDetails.textContent = 'Nenhum evento para hoje.';
        }
        modal.style.display = 'block';
    }

    function adicionarEvento(date, descricao) {
        const eventos = JSON.parse(localStorage.getItem('eventos')) || {};
        eventos[date] = descricao;
        localStorage.setItem('eventos', JSON.stringify(eventos));
        atualizarCalendario();
    }

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    closeEventModal.addEventListener('click', function() {
        eventModal.style.display = 'none';
    });

    addEventButton.addEventListener('click', function() {
        eventModal.style.display = 'block';
    });

    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = eventDateInput.value;
        const descricao = eventDescriptionInput.value;
        if (date && descricao) {
            adicionarEvento(date, descricao);
            eventModal.style.display = 'none';
        }
    });

    anteriorButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        atualizarCalendario();
    });

    proximoButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        atualizarCalendario();
    });

    // Inicializa o calendário
    atualizarCalendario();
});
