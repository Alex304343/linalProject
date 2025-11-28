let seedInput = document.getElementById("seedInput");
let stringcodeInput = document.getElementById("stringcodeInput");
let generateVarBtn = document.getElementById("generateVarBtn");

function checkInputs() {
    if (seedInput.value.trim() === "" || stringcodeInput.value.trim() === "") {
        alert("Пожалуйста, заполните все поля.");
        return false;
    }
    return true;
}

function handler_generateVarBtn() {
    if (!checkInputs()) return;
    let variant = generateVariant(
        seedInput.value.trim(),
        stringcodeInput.value.trim()
    );

    let variantEl = document.getElementById("variant");
    let tasksEl = document.getElementById("tasks");
    tasksEl.innerHTML = "";
    for (let i = 0; i < variant.tasks.length; i++) {
        let task = variant.tasks[i];
        let taskEl = document.createElement("div");
        taskEl.className = "task";
        taskEl.id = `task_${i + 1}`;

        let taskTitle = document.createElement("h3");
        taskTitle.innerHTML = `№${i + 1}`;
        taskEl.appendChild(taskTitle);

        if (task.description) {
            let taskDescription = document.createElement("p");
            taskDescription.innerHTML = task.description;
            taskEl.appendChild(taskDescription);
        }

        let childrenEl = document.createElement("div");
        childrenEl.className = "task_children";

        for (let j = 0; j < task.children.length; j++) {
            let child = task.children[j];
            let childEl = document.createElement("div");
            childEl.className = "task_child";
            childEl.id = `task_${i + 1}_${j + 1}`;

            if (task.children.length > 1) {
                let childTitle = document.createElement("h4");
                childTitle.innerHTML = `№${i + 1}.${j + 1}`;
                childEl.appendChild(childTitle);
            }

            if (child.description) {
                let childDescriptionEl = document.createElement("p");
                childDescriptionEl.innerHTML = child.description;
                childEl.appendChild(childDescriptionEl);
            }

            let instanceParentEl = document.createElement("ol");
            instanceParentEl.type = "a";
            child.instances.forEach((instance) => {
                let instanceEl = document.createElement("li");
                instanceEl.innerHTML = "$" + instance.formula + "$";
                instanceParentEl.appendChild(instanceEl);
            });
            childEl.appendChild(instanceParentEl);

            childrenEl.appendChild(childEl);
        }
        taskEl.appendChild(childrenEl);

        tasksEl.appendChild(taskEl);
    }

    renderMathInElement(variantEl, {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
    });
    if (variantEl.hasAttribute("hidden")) variantEl.removeAttribute("hidden");
}


/**
 * @param {string} seed
 * @param {string} stringcode
 */
function generateVariant(seed, stringcode) {
    // Инициализируем генератор с сидом
    const rng = new Random(seed + stringcode);
    const fmt = FormatterforLATEX;
    let variant = {
        seed: seed,
        stringcode: stringcode,
        tasks: [
            {
                description: "Сложите матрицу и число:",
                children: [
                    {
                        description: null,
                        instances: [],
                    },
                ],
            },
            {
                description: "Умножьте матрицу на число:",
                children: [
                    {
                        description: null,
                        instances: [],
                    },
                ],
            },
            {
                description: "Найдите линейную комбинацию матриц:",
                children: [
                    {
                        description: null,
                        instances: [],
                    },
                ],
            },
            {
                description: null,
                children: [
                    {
                        description:
                            "Найдите определитель матрицы любым способом:",
                        instances: [],
                    },
                    {
                        description:
                            "Найдите определитель матрицы используя его свойства:",
                        instances: [],
                    },
                ],
            },
            {
                description: "Транспонируйте матрицу:",
                children: [
                    {
                        description: null,
                        instances: [],
                    },
                ],
            },
            {
                description: null,
                children: [
                    {
                        description: "Найдите обратную матрицу любым способом:",
                        instances: [],
                    },
                    {
                        description:
                            "Найдите обратную матрицу методом Жордана-Гaусса:",
                        instances: [],
                    },
                ],
            },
            {
                description: "Найдите произведение матриц:",
                children: [
                    {
                        description: null,
                        instances: [],
                    },
                ],
            },
            {
                description: "Найдите значение функции:",
                children: [
                    {
                        description: null,
                        instances: [],
                    },
                ],
            },
            {
                description: null,
                children: [
                    {
                        description:
                            "Решите матричное уравнение вида $A \\cdot X = B$:",
                        instances: [],
                    },
                    {
                        description:
                            "Решите матричное уравнение вида $X \\cdot A = B$:",
                        instances: [],
                    },
                    {
                        description:
                            "Решите матричное уравнение вида $A \\cdot X \\cdot B = C$:",
                        instances: [],
                    },
                ],
            },
            {
                description: "Определите ранг матрицы:",
                children: [
                    {
                        description: null,
                        instances: [],
                    },
                ],
            },
            {
                description: null,
                children: [
                    {
                        description: "Решите СЛАУ любым способом:",
                        instances: [],
                    },
                    {
                        description: "Решите СЛАУ с помощью обратной матрицы:",
                        instances: [],
                    },
                    {
                        description: "Решите СЛАУ методом Крамера:",
                        instances: [],
                    },
                    {
                        description:
                            "Решите СЛАУ методом Гаусса, найдите ФСР и частное решение неоднородной системы, если применимо:",
                        instances: [],
                    },
                ],
            },
        ],
    };

    let tasks = parseStringCode(stringcode);

    // region tasks
    // Конфигурация генераторов
    const generators = [
        {
            // №1: Сложение матрицы и числа
            taskIdx: 0, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 
                const number = rng.getInt(-10, 10);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}${fmt.formatInt(number)}`;
            }
        },
        {
            // №2: Умножение матрицы на число
            taskIdx: 1, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0], block[1]); 
                const number = rng.getInt(-10, 10);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatInt(number)}*${fmt.formatMatrix(matrix)}`;
            }
        },
        {
            // №3: Линейная комбинация
            taskIdx: 2, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix1 = rng.getMatrix(block[0], block[1]); 
                const matrix2 = rng.getMatrix(block[0], block[1]); 
                const number1 = rng.getInt(-10, 10);
                const number2 = rng.getInt(-10, 10);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatInt(number1)}*${fmt.formatMatrix(matrix1)}${fmt.formatInt(number2)}*${fmt.formatMatrix(matrix2)}`;
            }
        },
        {
            // №4.1 Нахождение определителя матрицы Любым способом
            taskIdx: 3, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDeterminant(matrix)}`;
            }
        },
        {
            // №4.2 Нахождение определителя матрицы Любым способом
            taskIdx: 3, 
            childIdx: 1,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDeterminant(matrix)}`;
            }
        },
        {
            // №5: Транспонирование
            taskIdx: 4, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0],block[1]); 

                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}^{T}`;
            }
        },
        {
            // №6: Нахождение обратной матрицы Любым способом
            taskIdx: 5, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 

                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}^{-1}`;
            }
        },
        {
            // №6: Нахождение обратной матрицы Методом Жордана-Гаусса
            taskIdx: 5, 
            childIdx: 1,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 

                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}^{-1}`;
            }
        },
        {
            // №7: Умножение матриц
            taskIdx: 6, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix1 = rng.getMatrix(block[0], block[1]); 
                const matrix2 = rng.getMatrix(block[1], block[2]); 

                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix1)}*${fmt.formatMatrix(matrix2)}`;
            }
        },
        {
            // №8: Решение матричных функций
            taskIdx: 7, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 
                const a = rng.getInt(-10,10); 
                const b = rng.getInt(-10,10); 
                const c = rng.getInt(-10,10); 

                // Форматируем в LaTeX (static call)
                return `${fmt.formatInt(a)}${fmt.formatMatrix(matrix)}${fmt.formatInt(b)}${fmt.formatMatrix(matrix)}${fmt.formatInt(c)}`;
            }
        },
        {
            // №9: Решение матричных уравнений A⋅X=B
            taskIdx: 8, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix1 = rng.getMatrix(block[0]); 
                const matrix2 = rng.getMatrix(block[0], block[1]); 

                // Форматируем в LaTeX (static call)
                return `A=${fmt.formatMatrix(matrix1)}, B=${fmt.formatMatrix(matrix2)}`;
            }
        },
        {
            // №9: Решение матричных уравнений X⋅A=B
            taskIdx: 8, 
            childIdx: 1,
            gen: (rng, block) => {
                const matrix1 = rng.getMatrix(block[0]); 
                const matrix2 = rng.getMatrix(block[1], block[0]); 

                // Форматируем в LaTeX (static call)
                return `A=${fmt.formatMatrix(matrix1)}, B=${fmt.formatMatrix(matrix2)}`;
            }
        },
        {
            // №9: Решение матричных уравнений A⋅X⋅B=C
            taskIdx: 8, 
            childIdx: 2,
            gen: (rng, block) => {
                const matrix1 = rng.getMatrix(block[0]); 
                const matrix2 = rng.getMatrix(block[1]); 
                const matrix3 = rng.getMatrix(block[0], block[1]);

                // Форматируем в LaTeX (static call)
                return `A=${fmt.formatMatrix(matrix1)}, B=${fmt.formatMatrix(matrix2)}, C=${fmt.formatMatrix(matrix3)}`;
            }
        },
        {
            // №10: Нахождение ранга матрицы
            taskIdx: 9, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0],block[1]); 

                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}`;
            }
        },
        {
            // №11: Решение СЛАУ любым способом
            taskIdx: 10, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 
                const ans = rng.getMatrix(block[0],1);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatSystem(matrix,ans)}`;
            }
        },
        {
            // №11: Решение СЛАУ с помощью обратной матрицы.
            taskIdx: 10, 
            childIdx: 1,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 
                const ans = rng.getMatrix(block[0],1);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatSystem(matrix,ans)}`;
            }
        },
        {
            // №11: Решение СЛАУ методом Крамера
            taskIdx: 10, 
            childIdx: 2,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 
                const ans = rng.getMatrix(block[0],1);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatSystem(matrix,ans)}`;
            }
        },
        {
            // №11: Решение СЛАУ методом Гаусса, нахождение ФСР, частного решения
            taskIdx: 10, 
            childIdx: 3,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[1],block[0]); 
                const ans = rng.getMatrix(block[0],1);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatSystem(matrix,ans)}`;
            }
        }

    ];

    // Единый цикл обработки
    generators.forEach(({ taskIdx, childIdx, gen }) => {
        // Проверяем существование данных для задачи и подзадачи
        if (tasks[taskIdx] && tasks[taskIdx][childIdx]) {
            tasks[taskIdx][childIdx].forEach((block) => {
                // Последний элемент блока — количество повторений (count)
                const count = block[block.length - 1];
                for (let i = 0; i < count; i++) {
                    variant.tasks[taskIdx].children[childIdx].instances.push({
                        formula: gen(rng, block),
                    });
                }
            });
        }
    });
    // endregion

    // Делаем "prune" варианта. Если у ребёнка нет instances - удаляем. Если у task нет детей или их не стало в результате прошлого действия - удаляем.
    variant.tasks.forEach((task) => {
        task.children = task.children.filter(
            (child) => child.instances.length > 0
        );
    });
    variant.tasks = variant.tasks.filter((task) => task.children.length > 0);
    console.log(variant)
    return variant;
}

/**
 * @param {string} stringcode
 */
function parseStringCode(stringcode) {
    // 0103020c20172a0102000000000000000000040000000103010101

    // 01 03 02 0c20 172a 0102
    // 00
    // 00
    // 00
    // 00
    // 00
    // 00
    // 00
    // 00
    // 00
    // 04 00 00 00 01 03 010101

    let bytearray = stringcode.match(/.{2}/g).map((x) => parseInt(x, 16));
    let arr = [];
    let i = 0; // Указатель текущей позиции (курсор)

    // Пока не дошли до конца массива байтов
    while (i < bytearray.length) {
        let task = [];
        let childCount = bytearray[i++]; // Читаем количество child в текущем task

        for (let c = 0; c < childCount; c++) {
            let child = [];
            let blockCount = bytearray[i++]; // Читаем количество block в текущем child

            // Если блоки есть, нужно узнать их размерность
            if (blockCount > 0) {
                let blockLength = bytearray[i++]; // Длина данных внутри одного блока

                for (let b = 0; b < blockCount; b++) {
                    let block = [];
                    // Считываем данные для блока
                    for (let k = 0; k < blockLength; k++) {
                        block.push(bytearray[i++]);
                    }
                    child.push(block);
                }
            }
            task.push(child);
        }
        arr.push(task);
    }
    return arr;
}

generateVarBtn.addEventListener("click", handler_generateVarBtn);
