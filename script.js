const canvas = document.getElementById('balanceWheelCanvas');
const ctx = canvas.getContext('2d');
const segmentNames = [
    'Здоровье и энергия',
    'Работа, бизнес',
    'Финансы',
    'Личные отношения, семья',
    'Творчество',
    'Личностный рост',
    'Отдых и развлечение',
    'Друзья, окружение'
];

const segments = 8; // Количество сегментов
const maxLevels = 10; // Максимум делений в каждом сегменте
const levelsFilled = Array(segments).fill(0); // Массив для отслеживания заполненности каждого сегмента

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас перед перерисовкой
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150; // Радиус круга
    const angleStep = (2 * Math.PI) / segments;

    for (let i = 0; i < segments; i++) {
        const startAngle = i * angleStep;
        const endAngle = startAngle + angleStep;

        // Рисуем деления и закрашиваем в соответствии с заполненностью
        for (let j = 1; j <= maxLevels; j++) {
            const innerRadius = (radius / maxLevels) * j;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
            ctx.closePath();
            if (j <= levelsFilled[i]) {
                ctx.fillStyle = 'rgba(0, 128, 255, 0.3)'; // Цвет закрашивания
                ctx.fill();
            }
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }

        // Подпись для сегмента в два ряда
        const textAngle = startAngle + angleStep / 2;
        const textX = centerX + (radius + 40) * Math.cos(textAngle); // Увеличиваем радиус для текста
        const textY = centerY + (radius + 40) * Math.sin(textAngle);
        
        const segmentText = segmentNames[i];
        const words = segmentText.split(' ');
        
        let line1 = words[0];
        let line2 = words.slice(1).join(' ');

        ctx.save();
        ctx.translate(textX, textY);
        ctx.textAlign = "center";
        ctx.font = "14px Arial";
        ctx.fillStyle = '#000';
        
        // Рисуем первую строку
        ctx.fillText(line1, 0, -8); // Небольшой сдвиг вверх для первой строки
        // Рисуем вторую строку
        if (line2) {
            ctx.fillText(line2, 0, 8); // Небольшой сдвиг вниз для второй строки
        }

        ctx.restore();
    }
}

// Обработка кликов для заполнения сегментов
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - canvas.width / 2;
    const y = event.clientY - rect.top - canvas.height / 2;
    const angle = (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI);
    const distance = Math.sqrt(x * x + y * y);
    const segmentIndex = Math.floor(angle / ((2 * Math.PI) / segments));
    const level = Math.floor(distance / (150 / maxLevels)) + 1;

    if (segmentIndex >= 0 && segmentIndex < segments && level <= maxLevels) {
        levelsFilled[segmentIndex] = level;
        drawWheel();
    }
});

drawWheel();

// Добавляем обработчик события для кнопки "Выгрузить в PDF"
document.getElementById('downloadPdf').addEventListener('click', function() {
    const element = document.body; // Выбираем весь документ для сохранения в PDF
    const options = {
        margin:       0.5,
        filename:     'training_page.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(options).from(element).save();
});
