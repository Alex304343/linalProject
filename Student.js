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

class Random {
    constructor(seedString) {
        // Инициализируем сид через хеш-функцию
        this.seed = this._hash(String(seedString));
        this.counter = 0;
    }

    /**
     * Внутренний метод хеширования (DJB2 algorithm)
     */
    _hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Возвращает псевдослучайное число от 0 до 1
     */
    next() {
        this.counter++;
        // Используем сид + счетчик, чтобы получать разные числа при каждом вызове
        const x = Math.sin(this.seed + this.counter);
        return x - Math.floor(x);
    }

    /**
     * Возвращает целое число в диапазоне [min, max]
     */
    getInt(min=-10, max=10) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    /**
     * Возвращает целое число в диапазоне [min, max] в LaTeX формате
     */
    getfInt(min, max, allowZero = true, bracketNegatives = false) {
        let x = this.getInt(min, max);
        while (!allowZero && x === 0) x = this.getInt(min, max);
        if (x >= 0) {
            return "+" + x;
        } else {
            return (
                (bracketNegatives ? "(" : "") +
                x +
                (bracketNegatives ? ")" : "")
            );
        }
    }

    /**
     * Генерирует матрицу
     * @param {number} rows - количество строк
     * @param {number} cols - количество столбцов
     * @param {number} min - минимальное значение элемента
     * @param {number} max - максимальное значение элемента
     */
    getMatrix(rows, cols, min = -10, max = 10) {
        let lines = [];

        for (let i = 0; i < rows; i++) {
            let rowElements = [];
            for (let j = 0; j < cols; j++) {
                rowElements.push(this.getInt(min, max));
            }
            lines.push(rowElements);
        }

        return lines;
    }

    /**
     * Возвращает матрицу в LaTeX формате
     * @param {number} rows - количество строк
     * @param {number} cols - количество столбцов
     * @param {number} min - минимальное значение элемента
     * @param {number} max - максимальное значение элемента
     */
    getfMatrix(rows, cols, min = -10, max = 10) {
        let lines = this.getMatrix(rows, cols, min, max);
        return `\\begin{pmatrix} ${lines
            .map((row) => row.join(" & "))
            .join(" \\\\ ")} \\\\ \\end{pmatrix}`;
    }
    /**
     * Возвращает матрицу определитель в LaTeX формате
     * @param {number} size 
     * @param {number} min 
     * @param {number} max 
     */
    getfDeterminant(size,min=-10,max=10){
        let lines = this.getMatrix(size, size, min, max);
        return `\\begin{vmatrix} ${lines
            .map((row) => row.join(" & "))
            .join(" \\\\ ")} \\\\ \\end{vmatrix}`;
    }
    /**
     * Возвращает Систему уравнений в LaTeX формате
     * @param {number} rows - кол-во уравнений
     * @param {number} cols - кол-во переменных
     * @param {number} min 
     * @param {number} max 
     */
    getfSystem(rows, cols=rows, min = -10, max = 10){
        let lines = this.getMatrix(rows, cols, min, max);
        let ans = this.getMatrix(rows,1,min,max);
        for(let row=0; row<lines.length;row++){
            let line=""
            let not0 = false
            for(let col=0; col<lines[row].length;col++){
                if(lines[row][col]==0){
                    continue
                }
                not0=true
                line+=`${lines[row][col]>0 && col!=0? `+`:``}${lines[row][col]}x_{${col+1}}`
            }
            if (!not0){
                line+=`0`
            }
            line+=`=${ans[row][0]}\\\\`
            lines[row]=line;
            
        }
        return `\\left\\{\\begin{array}{l}${lines.join(` \\\\ `)}\\end{array}\\right.`
    }
}

// --- Пример использования ---

/**
 * @param {string} seed
 * @param {string} stringcode
 */
function generateVariant(seed, stringcode) {
    // Инициализируем генератор с сидом
    const rng = new Random(seed + stringcode);

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
            gen: (rng, block) => `${rng.getfMatrix(block[0], block[0])}${rng.getfInt(-10, 10)}`
        },
        {
            // №2: Умножение матрицы на число
            taskIdx: 1, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfInt(-10, 10)} * ${rng.getfMatrix(block[0], block[1])}`
        },
        {
            // №3: Линейная комбинация
            taskIdx: 2, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfMatrix(block[0], block[1])} + ${rng.getfMatrix(block[0], block[1])}`
        },
        {
            // №4.1 Нахождение определителя матрицы Любым способом
            taskIdx: 3, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfDeterminant(block[0])}`
        },
        {
            // №4.2 Нахождение определителя матрицы Любым способом
            taskIdx: 3, 
            childIdx: 1,
            gen: (rng, block) => `${rng.getfDeterminant(block[0])}`
        },
        {
            // №5: Транспонирование
            taskIdx: 4, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfMatrix(block[0], block[1])} ^{T}`
        },
        {
            // №6: Нахождение обратной матрицы Любым способом
            taskIdx: 5, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfMatrix(block[0], block[0])} ^{-1}`
        },
        {
            // №6: Нахождение обратной матрицы Методом Жордана-Гаусса
            taskIdx: 5, 
            childIdx: 1,
            gen: (rng, block) => `${rng.getfMatrix(block[0], block[0])} ^{-1}`
        },
        {
            // №7: Умножение матриц
            taskIdx: 6, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfMatrix(block[0], block[1])} * ${rng.getfMatrix(block[1], block[2])}`
        },
        {
            // №8: Решение матричных функций
            taskIdx: 7, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfInt(-10, 10)}${rng.getfMatrix(block[0], block[0])}${rng.getfInt(-10, 10)}${rng.getfMatrix(block[0], block[0])}${rng.getfInt(-10, 10)}`
        },
        {
            // №9: Решение матричных уравнений A⋅X=B
            taskIdx: 8, 
            childIdx: 0,
            gen: (rng, block) => `A=${rng.getfMatrix(block[0], block[0])}, B=${rng.getfMatrix(block[0], block[1])}`
        },
        {
            // №9: Решение матричных уравнений X⋅A=B
            taskIdx: 8, 
            childIdx: 1,
            gen: (rng, block) => `A=${rng.getfMatrix(block[0], block[0])}, B=${rng.getfMatrix(block[1], block[0])}`
        },
        {
            // №9: Решение матричных уравнений A⋅X⋅B=C
            taskIdx: 8, 
            childIdx: 2,
            gen: (rng, block) => `A=${rng.getfMatrix(block[0], block[0])}, B=${rng.getfMatrix(block[1], block[1])}, C=${rng.getfMatrix(block[0], block[1])}`
        },
        {
            // №10: Нахождение ранга матрицы
            taskIdx: 9, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfMatrix(block[0], block[1])}`
        },
        {
            // №11: Решение СЛАУ любым способом
            taskIdx: 10, 
            childIdx: 0,
            gen: (rng, block) => `${rng.getfSystem(block[0])}`
        },
        {
            // №11: Решение СЛАУ с помощью обратной матрицы.
            taskIdx: 10, 
            childIdx: 1,
            gen: (rng, block) => `${rng.getfSystem(block[0])}`
        },
        {
            // №11: Решение СЛАУ методом Крамера
            taskIdx: 10, 
            childIdx: 2,
            gen: (rng, block) => `${rng.getfSystem(block[0])}`
        },
        {
            // №11: Решение СЛАУ методом Гаусса, нахождение ФСР, частного решения
            taskIdx: 10, 
            childIdx: 3,
            gen: (rng, block) => `${rng.getfSystem(block[1],block[0])}`
        },

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
