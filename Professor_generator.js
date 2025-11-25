// Универсальная логика: все кнопки с id начинающимся на "add_" создают блоки
// на соответствующем контейнере с id заменой префикса на "Task_".
document.addEventListener("DOMContentLoaded", () => {
    // Устанавливаем фильтр только-цифры и очищаем значения для всех существующих полей
    function makeNumericInput(input) {
        try { input.value = input.value || ""; } catch (e) {}
        input.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    document.querySelectorAll('.InputContainer input').forEach(makeNumericInput);

    // Пройдём по всем кнопкам добавления и привяжем обработчики
    document.querySelectorAll('button[id^="add_"]').forEach(addBtn => {
        addBtn.addEventListener('click', () => {
            const targetId = addBtn.id.replace(/^add_/, 'Task_');
            const taskContainer = document.getElementById(targetId);
            if (!taskContainer) {
                console.warn('Target container not found for', addBtn.id, 'expected', targetId);
                return;
            }

            // Шаблон — первый .InputContainer внутри соответствующего блока
            const template = taskContainer.querySelector('.InputContainer');
            if (!template) {
                console.warn('Template .InputContainer not found inside', targetId);
                return;
            }

            // Создаем новый блок, копируя поля из шаблона
            const inputBlock = document.createElement('div');
            inputBlock.className = 'input-block';

            // Клонируем каждое поле из шаблона
            template.querySelectorAll('input').forEach(inp => {
                const clone = inp.cloneNode(true);
                clone.value = '';
                makeNumericInput(clone);
                inputBlock.appendChild(clone);
            });

            // Кнопка удаления
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'delete-btn';
            deleteButton.ariaLabel = 'Удалить блок';
            deleteButton.textContent = '✕';
            deleteButton.addEventListener('click', () => inputBlock.remove());
            inputBlock.appendChild(deleteButton);

            taskContainer.appendChild(inputBlock);

            // Фокус на первом поле нового блока
            const first = inputBlock.querySelector('input');
            if (first) first.focus();
        });
    });
});





// Сбор всей информации из всех input на странице в структуру
function gatherAllInputs() {
    const result = {
        generatedAt: new Date().toISOString(),
        tasks: []
    };

    // Проходим по всем контейнерам задач верхнего уровня (Task_*)
    document.querySelectorAll('div[id^="Task_"]:has(> div.Task_child)').forEach(taskEl => {
        // Игнорируем кнопки/ненужные контейнеры, берём только те, у кого внутри есть .Task_child или заголовок
        const taskObj = {
            id: taskEl.id,
            title: taskEl.querySelector('h2') ? taskEl.querySelector('h2').textContent.trim() : null,
            children: []
        };

        // Для каждой дочерней области (Task_child) собираем её input'ы
        taskEl.querySelectorAll('.Task_child').forEach(child => {
            const childObj = {
                id: child.id,
                title: child.querySelector('h4') ? child.querySelector('h4').textContent.trim() : null,
                formulaId: (child.querySelector('[id^="formula_"]') || {}).id || null,
                blocks: []
            };

            // Шаблон (оригинальная .InputContainer) — положим её первой записью
            const template = child.querySelector('.InputContainer');
            if (template) {
                const tpl = { type: 'template', inputs: [] };
                template.querySelectorAll('input').forEach(inp => {
                    tpl.inputs.push({
                        placeholder: inp.placeholder || null,
                        value: inp.value || ''
                    });
                });
                childObj.blocks.push(tpl);
            }

            // Добавленные блоки имеют класс .input-block и находятся внутри child
            child.querySelectorAll('.input-block').forEach(block => {
                const blk = { type: 'added', inputs: [] };
                block.querySelectorAll('input').forEach(inp => {
                    blk.inputs.push({
                        placeholder: inp.placeholder || null,
                        value: inp.value || ''
                    });
                });
                childObj.blocks.push(blk);
            });

            taskObj.children.push(childObj);
        });
        result.tasks.push(taskObj);
    });

    return result;
}

// Привязка кнопки "Сгенерировать" — сохраняет структуру в localStorage и выводит в консоль
function wireGenerateButton() {
    const btn = document.getElementById('Getline');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const data = gatherAllInputs();
        try {
            localStorage.setItem('generatedTasks', JSON.stringify(data));
        } catch (e) {
            console.warn('Не удалось сохранить в localStorage:', e);
        }
        console.log('Collected input data:', data);
        let line="";
        //Пробежка по taskam
        for(let task of data.tasks){
            if(task.children.every(child=>!child.blocks[0].inputs[0].value)){
                line+="00";
                continue;
            }
            //Записываем кол-во task..._... в task...
            line+=(task.children.length.toString(16)).padStart(2,'0');
            //Пробежка по полям в task..._...
            for(let child of task.children){
                if(!child.blocks[0].inputs[0].value){
                    line+="00";
                    continue;
                }
                //Записываем кол-во полей в task..._...
                line+=(child.blocks.length.toString(16)).padStart(2,'0')
                //Записываем кол-во inputs в task..._...
                line+=(child.blocks[0].inputs.length.toString(16)).padStart(2,'0')
                //Пробежка по inpus в поле
                for(let block of child.blocks){
                    for(let input of block.inputs){
                        //Записываем значение input
                        if(!parseInt(input.value)){
                            printError("Ошибка ввода! Проверьте, что все поля заполнены корректно.");
                            return -1;
                        } 
                        line+=(parseInt(input.value).toString(16)).padStart(2,'0')
                    }
                }
                
            }
        }
        placeString(line);
    });
}

function placeString(line){
    const displayString = document.getElementById('stringcode');
    const stringTitle = document.getElementById('stringtitle');
    displayString.textContent = line;
    stringTitle.textContent="Код варианта:";

    const displayQR = document.getElementById('stringqr');
    displayQR.innerHTML = "";
    new QRCode(displayQR, line);
    
    if(displayString.parentElement.hasAttribute('hidden')){
        displayString.parentElement.removeAttribute('hidden');
    }
    displayQR.scrollIntoView({behavior: "smooth"});
    navigator.clipboard.writeText(displayString.textContent).then(function() {
        console.log('Скопировано в буфер обмена');
    }, function(err) {
        console.error('Не удалось скопировать текст: ', err);
    });
}

function printError(message){
    const displayString = document.getElementById('stringcode');
    displayString.textContent = message;
    displayString.parentElement.firstChild.textContent="Ошибка:";

    if(displayString.parentElement.hasAttribute('hidden')){
        displayString.parentElement.removeAttribute('hidden');
    }
    displayString.scrollIntoView({behavior: "smooth"});
}

// Если DOM уже готов — привязываем, иначе ждём
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireGenerateButton);
} else {
    wireGenerateButton();
}
