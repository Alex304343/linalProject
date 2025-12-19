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
                            fmt.r`Решите матричное уравнение вида $A \cdot X = B$:`,
                        instances: [],
                    },
                    {
                        description:
                            fmt.r`Решите матричное уравнение вида $X \cdot A = B$:`,
                        instances: [],
                    },
                    {
                        description:
                            fmt.r`Решите матричное уравнение вида $A \cdot X \cdot B = C$:`,
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
            {
                description: fmt.r`Даны векторы $\vec{m}$ и $\vec{n}$. Выясните, коллинеарны ли векторы $\vec{a}$ и $\vec{b}$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Найдите $\left|\vec{a}\right|$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description:fmt.r`Дан $\triangle ABC$. Найдите $\angle B$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description:fmt.r`Найти угол между векторами $\vec{c}$ и $\vec{d}$, если`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Найдите площадь параллелограмма, построенного на векторах $\vec{a}$ и $\vec{b}$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Найдите площадь $\triangle ABC$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Даны векторы $\vec{a}, \vec{b}, \vec{c}$. Выясните, компланарны ли векторы. Если векторы не компланарны, то найдите объем параллелепипеда, построенного на векторах $\vec{a}, \vec{b}, \vec{c}$.`,
                children: [
                    {
                        description: null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Найдите длину высоты пирамиды $ABCD$, опущенной из вершины $D$, если даны координаты вершин:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Составьте уравнение плоскости, проходящей через точку $M$ перпендикулярно прямой $l$:`,
                children: [
                    {
                        description: null,
                        instances: [],
                    }
                ],
            },
            {
                description: "Найдите угол между двумя прямыми:",
                children: [
                    {
                        description: null,
                        instances: [],
                    }
                ],
            },
            {
                description:fmt.r`Составьте уравнение плоскости, проходящей через точку $M$ параллельно векторам $\vec{a}$ и $\vec{b}$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description:fmt.r`Составьте уравнение плоскости, проходящей через точку $A$ параллельно плоскости $\alpha$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description:fmt.r`Составьте каноническое уравнение прямой, проходящей через точки $A$ и $B$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Найдите проекцию точки $A$ на плоскость $\alpha$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Найдите точку, симметричную точке $A$ относительно плоскости $\alpha$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
                ],
            },
            {
                description: fmt.r`Найдите проекцию точки $A$ на прямую $l$:`,
                children: [
                    {
                        description:null,
                        instances: [],
                    }
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

                let ans=MatrixPlusNumber(matrix,number)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);
                
                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}${fmt.formatInt(number)}=${ans}`;
            }
        },
        {
            // №2: Умножение матрицы на число
            taskIdx: 1, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0], block[1]); 
                const number = rng.getInt(-10, 10);

                let ans=MatrixByNumber(matrix,number)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatInt(number)}*${fmt.formatMatrix(matrix)}=${ans}`;
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

                let ans=MatrixLinearCombination(number1,matrix1,number2,matrix2)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatInt(number1)}*${fmt.formatMatrix(matrix1)}${fmt.formatInt(number2)}*${fmt.formatMatrix(matrix2)}=${ans}`;
            }
        },
        {
            // №4.1 Нахождение определителя матрицы Любым способом
            taskIdx: 3, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 

                let ans=Det(matrix)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatInt(ans);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDeterminant(matrix)}=${ans}`;
            }
        },
        {
            // №4.2 Нахождение определителя матрицы Любым способом
            taskIdx: 3, 
            childIdx: 1,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 

                let ans=Det(matrix)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatInt(ans);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDeterminant(matrix)}=${ans}`;
            }
        },
        {
            // №5: Транспонирование
            taskIdx: 4, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0],block[1]); 

                let ans=Transpose(matrix)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}^{T}=${ans}`;
            }
        },
        {
            // №6: Нахождение обратной матрицы Любым способом
            taskIdx: 5, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 

                let ans=InverseMatrix(matrix)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);
                
                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}^{-1}=${ans}`;
            }
        },
        {
            // №6: Нахождение обратной матрицы Методом Жордана-Гаусса
            taskIdx: 5, 
            childIdx: 1,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 

                let ans=InverseMatrix(matrix)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);
                
                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix)}^{-1}=${ans}`;
            }
        },
        {
            // №7: Умножение матриц
            taskIdx: 6, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix1 = rng.getMatrix(block[0], block[1]); 
                const matrix2 = rng.getMatrix(block[1], block[2]); 

                let ans=MatrixMultiplication(matrix1,matrix2)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatMatrix(matrix1)}*${fmt.formatMatrix(matrix2)}=${ans}`;
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

                let ans=calculateMatrixPolynomial(a ,b ,c ,matrix)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatInt(a)}${fmt.formatMatrix(matrix)}^2${fmt.formatInt(b)}${fmt.formatMatrix(matrix)}${fmt.formatInt(c)}=${ans}`;
            }
        },
        {
            // №9: Решение матричных уравнений A⋅X=B
            taskIdx: 8, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix1 = rng.getMatrix(block[0]); 
                const matrix2 = rng.getMatrix(block[0], block[1]); 

                let ans=EquationAXB(matrix1,matrix2)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);

                // Форматируем в LaTeX (static call)
                return fmt.r`A=${fmt.formatMatrix(matrix1)}, B=${fmt.formatMatrix(matrix2)}\text{; answer = }${ans}`;
            }
        },
        {
            // №9: Решение матричных уравнений X⋅A=B
            taskIdx: 8, 
            childIdx: 1,
            gen: (rng, block) => {
                const matrix1 = rng.getMatrix(block[0]); 
                const matrix2 = rng.getMatrix(block[1], block[0]); 

                let ans=EquationXAB(matrix1,matrix2)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);

                // Форматируем в LaTeX (static call)
                return fmt.r`A=${fmt.formatMatrix(matrix1)}, B=${fmt.formatMatrix(matrix2)}\text{; answer = }${ans}`;
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

                let ans=EquationAXBC(matrix1,matrix2,matrix3)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);

                // Форматируем в LaTeX (static call)
                return fmt.r`A=${fmt.formatMatrix(matrix1)}, B=${fmt.formatMatrix(matrix2)}, C=${fmt.formatMatrix(matrix3)}\text{; answer = }${ans}`;
            }
        },
        {
            // №10: Нахождение ранга матрицы
            taskIdx: 9, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0],block[1]); 

                let ans=RangMatrix(matrix)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatInt(ans);

                // Форматируем в LaTeX (static call)
                return fmt.r`${fmt.formatMatrix(matrix)}\text{; rank = }${ans}`;
            }
        },
        {
            // №11: Решение СЛАУ любым способом
            taskIdx: 10, 
            childIdx: 0,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 
                const matrixans = rng.getMatrix(block[0],1);

                let ans=SolvingEquations(matrix,matrixans)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);


                // Форматируем в LaTeX (static call)
                return fmt.r`${fmt.formatSystem(matrix,matrixans)}\text{; answer = }${ans}`;
            }
        },
        {
            // №11: Решение СЛАУ с помощью обратной матрицы.
            taskIdx: 10, 
            childIdx: 1,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 
                const matrixans = rng.getMatrix(block[0],1);

                let ans=SolvingEquations(matrix,matrixans)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);


                // Форматируем в LaTeX (static call)
                return fmt.r`${fmt.formatSystem(matrix,matrixans)}\text{; answer = }${ans}`;
            }
        },
        {
            // №11: Решение СЛАУ методом Крамера
            taskIdx: 10, 
            childIdx: 2,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[0]); 
                const matrixans = rng.getMatrix(block[0],1);

                let ans=SolvingEquations(matrix,matrixans)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatMatrix(ans);


                // Форматируем в LaTeX (static call)
                return fmt.r`${fmt.formatSystem(matrix,matrixans)}\text{; answer = }${ans}`;
            }
        },
        {
            // №11: Решение СЛАУ методом Гаусса, нахождение ФСР, частного решения
            taskIdx: 10, 
            childIdx: 3,
            gen: (rng, block) => {
                const matrix = rng.getMatrix(block[1],block[0]); 
                const ans = rng.getMatrix(block[1],1);

                // Форматируем в LaTeX (static call)
                return `${fmt.formatSystem(matrix,ans)}`;
            }
        },
        {
            // №12 Даны векторы $\vec{m}$ и $\vec{n}$ . Выясните – коллинеарны ли векторы $\vec{a}$ и $\vec{b}$
            taskIdx: 11, 
            childIdx: 0,
            gen: (rng) => {
                const vector1 = rng.getVector()
                const vector2 = rng.getVector()
                const a = rng.getInt(-5, 5, true)
                const b = rng.getInt(-5, 5, true)
                const c = rng.getInt(-5, 5, true)
                const d = rng.getInt(-5, 5, true)

                const vectorm = new Vector(vector1[0],vector1[1],vector1[2])
                const vectorn = new Vector(vector2[0],vector2[1],vector2[2])
                const vectora = vectorm.Sum(vectorn,a,b)
                const vectorb = vectorm.Sum(vectorn,c,d)
                let ans=vectora.Сollinear(vectorb)
                if (ans === "determinant = 0" || ans == null){
                    ans = fmt.r`\text{no answer}`
                }
                else if (ans){
                    ans = fmt.r`\text{Да}`
                }
                else{
                    ans = fmt.r`\text{Нет}`
                }

                // Форматируем в LaTeX (static call)
                return `${fmt.formatVector(vector1,"m")}, ${fmt.space()} ${fmt.formatVector(vector2,"n")},${fmt.space()} ${fmt.formatVector(null,"a")}=${fmt.formatInt(a)}${fmt.formatVector(null,"m")}${fmt.formatInt(b)}${fmt.formatVector(null,"n")},${fmt.space()} ${fmt.formatVector(null,"b")}=${fmt.formatInt(c)}${fmt.formatVector(null,"m")}${fmt.formatInt(d)}${fmt.formatVector(null,"n")} : ${ans}`;
            }
        },
        {
            // №13 Найдите $\left|\vec{a}\right|$:
            taskIdx: 12, 
            childIdx: 0,
            gen: (rng) => {
                const vector1= rng.getInt(0,10,true)
                const vector2= rng.getInt(0,10,true)
                const angle= rng.getAngle()
                const a = rng.getInt(-5,5,true)
                const b = rng.getInt(-5,5,true)

                let ans = Vector.SumVectorsByLensAndAngle(vector1,vector2,angle,a,b)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.formatVectorModule("a")+` = ${fmt.Round(ans)}`;
                // Форматируем в LaTeX (static call)
                return `${fmt.formatVectorModule("m")}=${vector1},${fmt.space()} ${fmt.formatVectorModule("n")}=${vector2},${fmt.space()} ${fmt.formatVectorAngle("m","n")}=${fmt.formatAngle(angle)},${fmt.space()}${fmt.formatVector(null,"a")}=${fmt.formatInt(a)}${fmt.formatVector(null,"m")}${fmt.formatInt(b)}${fmt.formatVector(null,"n")} : ${ans}`;
            }
        },
        {
            // №14 Дан $\triangle ABC$. Найдите $\angle B$
            taskIdx: 13, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const dot2 = rng.getDot()
                const dot3 = rng.getDot()

                let A = new Dot (dot1[0],dot1[1],dot1[2])
                let B = new Dot (dot2[0],dot2[1],dot2[2])
                let C = new Dot (dot3[0],dot3[1],dot3[2])
                let BA=Vector.ByDots(B,A)
                let BC=Vector.ByDots(B,C)

                let ans = BA.AngleBetweenVectors(BC)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r`\angle B = ${fmt.formatAngle(fmt.Round(ans))}`;

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(dot1,"A")},${fmt.space()}${fmt.formatDot(dot2,"B")},${fmt.space()}${fmt.formatDot(dot3,"C")},${fmt.space()}${ans}`;
            }
        },
        {
            // №15 Найти угол между векторами $\vec{c}$ и $\vec{d}$, если:
            taskIdx: 14, 
            childIdx: 0,
            gen: (rng) => {
                const vector1= rng.getVector()
                const vector2= rng.getVector()
                const a= rng.getInt(-5,5,true)
                const b= rng.getInt(-5,5,true)
                const c= rng.getInt(-5,5,true)
                const d= rng.getInt(-5,5,true)

                let v1= new Vector (vector1[0],vector1[1],vector1[2])
                let v2= new Vector (vector2[0],vector2[1],vector2[2])
                let v3= v1.Sum(v2,a,b)
                let v4= v1.Sum(v2,c,d)

                let ans= v3.AngleBetweenVectors(v4)
                ans =(ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` :fmt.r`\angle ${fmt.Alpha()}=${fmt.formatAngle(fmt.Round(ans))}`

                // Форматируем в LaTeX (static call)
                return `${fmt.formatVector(null,"c")}=${fmt.formatInt(a)}${fmt.formatVector(null,"a")}${fmt.formatInt(b)}${fmt.formatVector(null,"b")},${fmt.space()}${fmt.formatVector(null,"d")}=${fmt.formatInt(c)}${fmt.formatVector(null,"a")}${fmt.formatInt(d)}${fmt.formatVector(null,"b")},${fmt.space()}${fmt.formatVector(vector1,"a")},${fmt.space()}${fmt.formatVector(vector2,"b")},${fmt.space()}${ans}`;
            }
        },
        {
            // №16 Найдите площадь параллелограмма, построенного на векторах $\vec{a}$ и $\vec{b}$:
            taskIdx: 15, 
            childIdx: 0,
            gen: (rng) => {
                const vector1=rng.getInt(0,10,true)
                const vector2=rng.getInt(0,10,true)
                const angle= rng.getAngle()
                const a = rng.getInt(-5, 5, true)
                const b = rng.getInt(-5, 5, true)
                const c = rng.getInt(-5, 5, true)
                const d = rng.getInt(-5, 5, true)

                let ans = Vector.AreaOfParallelogramByLengths(vector1,vector2,angle,a,b,c,d)
                ans =(ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` :fmt.r`S=${fmt.Round(ans)}`

                // Форматируем в LaTeX (static call)
                return `${fmt.formatVector(null,"a")}=${fmt.formatInt(a)}${fmt.formatVector(null,"m")}${fmt.formatInt(b)}${fmt.formatVector(null,"n")},${fmt.space()}${fmt.formatVector(null,"b")}=${fmt.formatInt(c)}${fmt.formatVector(null,"m")}${fmt.formatInt(d)}${fmt.formatVector(null,"n")},${fmt.space()},${fmt.formatVectorModule("m")}=${fmt.formatInt(vector1)},${fmt.space()}${fmt.formatVectorModule("n")}=${fmt.formatInt(vector2)},${fmt.space()}${fmt.formatVectorAngle("m","n")}=${fmt.formatAngle(angle)},${fmt.space()}${ans}`;
            }
        },
        {
            // №17 Найдите площадь $\triangle ABC$:
            taskIdx: 16, 
            childIdx: 0,
            gen: (rng) => {
                const a=rng.getDot()
                const b=rng.getDot()
                const c=rng.getDot()
                
                let A=new Dot(a[0],a[1],a[2])
                let B=new Dot(b[0],b[1],b[2])
                let C=new Dot(c[0],c[1],c[2])

                let v1=Vector.ByDots(C,A)
                let v2=Vector.ByDots(C,B)
                
                let ans=v1.AreaTriangle(v2)
                ans=(ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r`S=${fmt.Round(ans)}`
                
                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(a,"A")},${fmt.space()}${fmt.formatDot(b,"B")},${fmt.space()}${fmt.formatDot(c,"C")},${fmt.space()}${ans}`;
            }
        },
        {
            // №18 Даны векторы $\vec{a}, \vec{b}, \vec{c}$. Выясните, компланарны ли векторы. Если векторы не компланарны, то найдите объем параллелепипеда, построенного на векторах $\vec{a}, \vec{b}, \vec{c}$.
            taskIdx: 17, 
            childIdx: 0,
            gen: (rng) => {
                const a=rng.getVector()
                const b=rng.getVector()
                const c=rng.getVector()

                let vector1 = new Vector(a[0],a[1],a[2])
                let vector2 = new Vector(b[0],b[1],b[2])
                let vector3 = new Vector(c[0],c[1],c[2])

                let ans = Math.abs(vector1.Cross3Vectors(vector2, vector3))
                if (ans === "determinant = 0" || ans == null){
                    ans = fmt.r`\text{no answer}`
                }
                else if (ans==0){
                    ans = fmt.r`\text{Векторы компланарны}`
                }
                else{
                    ans = fmt.r`\text{V = }${fmt.Round(ans)}`
                }

                // Форматируем в LaTeX (static call)
                return `${fmt.formatVector(a,"a")},${fmt.space()}${fmt.formatVector(b,"b")},${fmt.space()}${fmt.formatVector(c,"c")},${fmt.space()}${ans}`;
            }
        },
        {
            // №19 Найдите длину высоты пирамиды $ABCD$, опущенной из вершины $D$, если даны координаты вершин:
            taskIdx: 18, 
            childIdx: 0,
            gen: (rng) => {
                const a=rng.getDot()
                const b=rng.getDot()
                const c=rng.getDot()
                const d=rng.getDot()
                
                let A=new Dot(a[0],a[1],a[2])
                let B=new Dot(b[0],b[1],b[2])
                let C=new Dot(c[0],c[1],c[2])
                let D=new Dot(d[0],d[1],d[2])

                let plain1= Plane.By3Dots(A,B,C)
                let ans =plain1.DistanceToDot(D)
                ans=(ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r`H=${fmt.Round(ans)}`
    
                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(a,"A")},${fmt.space()}${fmt.formatDot(b,"B")},${fmt.space()}${fmt.formatDot(c,"C")},${fmt.space()}${fmt.formatDot(d,"D")},${fmt.space()}${ans}`;
            }
        },
        {
            // №20 Составьте уравнение плоскости, проходящей через точку $M$ перпендикулярно прямой $l$:
            taskIdx: 19, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const dot0 = rng.getDot()
                const vector = rng.getVector()
            
                let M = new Dot(dot1[0],dot1[1],dot1[2])
                let d0 = new Dot(dot0[0],dot0[1],dot0[2])
                let v = new Vector(vector[0],vector[1],vector[2])
                let ans = Plane.ByNormalAndDot(v,M)
                ans=(ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r`${fmt.Alpha()}:${fmt.formatPlane(ans.a,ans.d,ans.c,ans.d)}`

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(dot1,"M")},${fmt.space()}${fmt.formatKanonLine(dot0,vector)},${fmt.space()}${ans}`;
            }
        },
        {
            // №21 Найдите угол между двумя прямыми:
            taskIdx: 20, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const vector1 = rng.getVector()
                const dot2 = rng.getDot()
                const vector2 = rng.getVector()

                v1=new Vector(vector1[0],vector1[1],vector1[2])
                v2=new Vector(vector2[0],vector2[1],vector2[2])

                let ans = v1.AngleBetweenVectors(v2)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r`\angle = ${fmt.formatAngle(fmt.Round(ans))}`;

                // Форматируем в LaTeX (static call)
                return `${fmt.formatKanonLine(dot1,vector1)},${fmt.space()}k:${fmt.formatSystemParamLine(dot2,vector2)},${fmt.space()}${ans}`;
            }
        },
        {
            // №22 Составьте уравнение плоскости, проходящей через точку $M$ параллельно векторам $\vec{a}$ и $\vec{b}$:
            taskIdx: 21, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const vector1 = rng.getVector()
                const vector2 = rng.getVector()

                let d1=new Dot(dot1[0],dot1[1],dot1[2])
                let v1=new Vector(vector1[0],vector1[1],vector1[2])
                let v2=new Vector(vector2[0],vector2[1],vector2[2])

                let ans=Plane.By2VectorsAndDot(v1,v2,d1)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r`${fmt.Alpha()}:${fmt.formatPlane(ans.a,ans.b,ans.c,ans.d)}`

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(dot1,"M")},${fmt.space()}${fmt.formatVector(vector1,"a")},${fmt.space()}${fmt.formatVector(vector2,"b")},${fmt.space()}${ans}`;
            }
        },
        {
            // №23 Составьте уравнение плоскости, проходящей через точку $A$ параллельно плоскости $\alpha$:
            taskIdx: 22, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const a = rng.getInt()
                const b = rng.getInt()
                const c = rng.getInt()
                const d = rng.getInt()

                let d1= new Dot(dot1[0],dot1[1],dot1[2])
                let n1= new Vector(a,b,c)

                let ans=Plane.ByNormalAndDot(n1,d1)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r`\gamma : ${fmt.formatPlane(ans.a,ans.b,ans.c,ans.d)}`
                
                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(dot1,"A")},${fmt.space()}${fmt.Alpha()}:${fmt.formatPlane(a,b,c,d)},${fmt.space()}${ans}`
            }
        },
        {
            // №24 Составьте каноническое уравнение прямой, проходящей через точки $A$ и $B$:
            taskIdx: 23, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const dot2 = rng.getDot()

                let d1 = Dot.ByArray(dot1)
                let d2 = Dot.ByArray(dot2)

                let ans = Line.ByDots(d1,d2)

                if (ans === "determinant = 0" || ans == null){
                    ans = fmt.r`\text{no answer}`
                }
                else{
                    let dot = ans.dot.toArray()
                    let vector = ans.vector.toArray()
                    ans = fmt.r`${fmt.formatKanonLine(dot, vector)}`
                }

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(dot1,"A")},${fmt.space()}${fmt.formatDot(dot2,"B")}, ${fmt.space()} ${ans}`;
            }
        },
        {
            // №25 Найдите проекцию точки $A$ на плоскость $\alpha$:
            taskIdx: 24, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const a = rng.getInt()
                const b = rng.getInt()
                const c = rng.getInt()
                const d = rng.getInt()

                let d1 = Dot.ByArray(dot1)
                let plane = new Plane(a ,b ,c ,d)

                let ans = plane.ProjectionPointOnPlane(d1)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r` ${fmt.formatDot([fmt.Round(ans.x),fmt.Round(ans.y),fmt.Round(ans.z)],"X")}`
                
                // Форматируем в LaTeX (static call)
                 return `${fmt.formatDot(dot1,"A")},${fmt.space()}${fmt.Alpha()}:${fmt.formatPlane(a,b,c,d)},${fmt.space()}${ans}`;
            }
        },
        {
            // №26 Найдите точку, симметричную точке $A$ относительно плоскости $\alpha$:
            taskIdx: 25, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const a = rng.getInt()
                const b = rng.getInt()
                const c = rng.getInt()
                const d = rng.getInt()

                let d1 = Dot.ByArray(dot1)
                let plane = new Plane(a ,b ,c ,d)
                let projection = plane.ProjectionPointOnPlane(d1)
                
                let ans = new Dot(2*projection.x-d1.x,2*projection.y-d1.y,2*projection.z-d1.z)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r` ${fmt.formatDot([fmt.Round(ans.x),fmt.Round(ans.y),fmt.Round(ans.z)],"X")}`

                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(dot1,"A")},${fmt.space()}${fmt.Alpha()}:${fmt.formatPlane(a,b,c,d)},${fmt.space()}${ans}`;
            }
        },
        {
            // №27 Найдите проекцию точки $A$ на прямую $l$:
            taskIdx: 26, 
            childIdx: 0,
            gen: (rng) => {
                const dot1 = rng.getDot()
                const dot2 = rng.getDot()
                const vector = rng.getVector()

                let d1 = Dot.ByArray(dot1)
                let d2 = Dot.ByArray(dot2)
                let v = Vector.ByArray(vector)
                let line = new Line(v, d2) 

                let ans = line.ProjectPointOnLine(d1)
                ans = (ans === "determinant = 0" || ans == null) ? fmt.r`\text{no answer}` : fmt.r` ${fmt.formatDot([fmt.Round(ans.x),fmt.Round(ans.y),fmt.Round(ans.z)],"X")}`
             
                // Форматируем в LaTeX (static call)
                return `${fmt.formatDot(dot1,"A")},${fmt.space()}${fmt.formatSystemParamLine(dot2,vector)},${fmt.space()}${ans}`;
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
