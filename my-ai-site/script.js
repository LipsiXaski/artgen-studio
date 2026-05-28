console.log('✅ script.js загружен');

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM готов');
    
    // Находим элементы на странице
    const btn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('prompt');
    const resultBox = document.getElementById('result');
    
    // Проверка: если кнопка не найдена, выходим
    if (!btn) {
        console.error('❌ Кнопка #generateBtn не найдена!');
        return;
    }

    // Вешаем обработчик клика
    btn.addEventListener('click', async () => {
        console.log('🖱️ Клик по кнопке!');
        
        const prompt = promptInput.value.trim();
        
        // Проверка: пустой ли промпт
        if (!prompt) {
            alert('Пожалуйста, введите описание изображения!');
            return;
        }

        // Показываем статус загрузки
        resultBox.innerHTML = '<p>⏳ Генерация... (10-30 сек)</p>';
        btn.disabled = true; // Блокируем кнопку, чтобы не нажимали много раз
        console.log('🚀 Отправка запроса к /api/generate-image');

        try {
            // 🔥 САМОЕ ГЛАВНОЕ: запрос идёт на относительный путь "/api/..."
            // Браузер сам подставит твой домен (artgen-studio.vercel.app или .netlify.app)
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ prompt: prompt })
            });
            
            console.log('📥 Ответ от сервера:', response.status);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка при запросе');
            }

            // Если всё ок — показываем картинку
            resultBox.innerHTML = `<img src="${data.image}" alt="Сгенерированное ИИ изображение" style="max-width:100%; border-radius:10px;">`;
            console.log('✅ Изображение показано');
            
        } catch (error) {
            console.error('❌ Ошибка:', error);
            resultBox.innerHTML = `<p style="color: #ef4444;">❌ ${error.message}</p>`;
        } finally {
            // Разблокируем кнопку в любом случае
            btn.disabled = false;
            console.log('🔓 Кнопка разблокирована');
        }
    });
});