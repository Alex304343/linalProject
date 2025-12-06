class FormatterforLATEX {
    /**
     * Приводит все элементы матрицы к обыкновенным дробям
     * @param {array[][]} matrix
     */
    static normalizeMatrix(matrix) {
        return matrix.map((row) => {
            // row — это отдельная строка (массив чисел)
            return row.map((num) => {
                // num — это конкретное число
                return new Fraction(num)
                    .toLatex()
                    .replace(/\\frac/g, String.raw`\dfrac`);
            });
        });
    }
    static normalizeNumber(number) {
        return new Fraction(number)
            .toLatex()
            .replace(/\\frac/g, String.raw`\dfrac`);
    }
    /**
     * Превращает переданную матрицу (массив массивов) в LaTeX строку матрицы
     * @param {array [][]} matrix
     */
    static formatMatrix(matrix) {
        const fractionMatrix = this.normalizeMatrix(matrix);
        return String.raw`\begin{pmatrix} ${fractionMatrix
            .map((row) => row.join(" & "))
            .join(String.raw` \\[8pt] `)} \\ \end{pmatrix}`;
    }
    /**
     * Превращает переданную матрицу (массив массивов) в LaTeX строку определителя
     * @param {array [][]} matrix
     */
    static formatDeterminant(matrix) {
        const fractionMatrix = this.normalizeMatrix(matrix);
        return String.raw`\begin{vmatrix} ${fractionMatrix
            .map((row) => row.join(" & "))
            .join(String.raw` \\[8pt] `)} \\ \end{vmatrix}`;
    }

    /**
     * Превращает число в строку с учетом знака
     * @param {number} num
     * @param {bool} bracketNegatives - скобки для отрицательных
     */
    static formatInt(num, bracketNegatives = false) {
        if (num >= 0) return "+" + num;
        const fractionNumber = this.normalizeNumber(num);
        return (
            (bracketNegatives ? "(" : "") +
            fractionNumber +
            (bracketNegatives ? ")" : "")
        );
    }

    /**
     * Форматирует СЛАУ на основе матрицы коэффициентов (A) и столбца свободных членов (B)
     * @param {array [][]} matrixA
     * @param {array [][]} matrixB
     */
    static formatSystem(matrixA, matrixB) {
        let lines = [];
        for (let row = 0; row < matrixA.length; row++) {
            let line = "";
            let not0 = false;
            for (let col = 0; col < matrixA[row].length; col++) {
                if (matrixA[row][col] == 0) continue;
                not0 = true;
                // Красивый вывод знаков: если это не первый элемент и число положительное, ставим +
                line += `${matrixA[row][col] > 0 && line !== "" ? `+` : ``}${
                    matrixA[row][col]
                }x_{${col + 1}}`;
            }
            if (!not0) line += `0`;
            line += `=${matrixB[row][0]}`;
            lines.push(line);
        }
        return String.raw`\left\{\begin{array}{l}${lines.join(
            String.raw` \\ `
        )}\end{array}\right.`;
    }
    /**
     * Форматирует вектор на основе 3 координат и его имени
     * @param {array[3]} vector
     * @param {string} name
     */
    static formatVector(vector = null, name = null) {
        if (vector != null && name == null) {
            return String.raw`(${vector[0]},${vector[1]},${vector[2]})`;
        } else if (vector == null && name != null) {
            return String.raw`\vec{${name}}`;
        } else if (vector != null && name != null) {
            return String.raw`\vec{${name}}=(${vector[0]},${vector[1]},${vector[2]})`;
        } else {
            console.error("Все аргументы функции formatVector = null");
            return `error`;
        }
    }

    /**
     * Форматирует модуль вектора
     * @param {string} vname
     */
    static formatVectorModule(vname) {
        return String.raw`\left|\vec{${vname}}\right|`;
    }

    /**
     * Форматирует угол между векторами
     * @param {string} v1name
     * @param {string} v2name
     */
    static formatVectorAngle(v1name, v2name) {
        const s1 = this.formatVector(null, v1name);
        const s2 = this.formatVector(null, v2name);
        return String.raw`\angle(${s1},${s2})`;
    }

    /**
     * Форматирует угол в радианах/градусах
     */
    static formatAngle(rad, showDegrees = true) {
        if (showDegrees) {
            let deg = (rad * 180) / Math.PI;
            return String.raw`${Math.round(deg * 100) / 100}^{\circ}`;
        } else {
            return `${rad} радиан`;
        }
    }

    /**
     * Форматирует точку на основе 3 координат и её имени
     * @param {array[3]} dot
     * @param {string} name
     */
    static formatDot(dot = null, name = null) {
        if (dot != null && name == null) {
            return String.raw`(${dot[0]},${dot[1]},${dot[2]})`;
        } else if (dot == null && name != null) {
            return String.raw`${name}`;
        } else if (dot != null && name != null) {
            return String.raw`${name}(${dot[0]},${dot[1]},${dot[2]})`;
        } else {
            console.error("Все аргументы функции formatDot = null");
            return `error`;
        }
    }

    /**
     * Пробельный символ
     */
    static space(){
        return String.raw` \quad `;
    }
    /**
    * Альфа
    */
    static Alpha(){
        return String.raw` \alpha `;
    }
     /**
      * Форматирует каноническое уравнение прямой на основе точки и направляющего вектора
      * @param {array[3]} dot точка
      * @param {array[3]} vector направляющий вектор 
      */
    static formatKanonLine(dot,vector){
        return String.raw`l : \frac{x${this.formatInt(-dot[0])}}{${vector[0]}}=\frac{y${this.formatInt(-dot[1])}}{${vector[1]}}=\frac{z${this.formatInt(-dot[2])}}{${vector[2]}}`;
    }
    /**
      * Форматирует параметрическое уравнение прямой на основе 
      * @param {array[3]} dot точка
      * @param {array[3]} vector направляющий вектор 
      */
    static formatSystemParamLine(dot,vector){
        return String.raw`\begin{cases} x=${this.formatInt(dot[0])}${this.formatInt(vector[0])}t \\ y=${this.formatInt(dot[1])}${this.formatInt(vector[1])}t \\ z=${this.formatInt(dot[2])}${this.formatInt(vector[2])}t \end{cases}`
    }
    /**
     * Округление числа 
     * @param {number} num 
     */
    static Round(num){
        return parseFloat((num.toFixed(5)))
    }
    /**
     * Форматирует плоскость в латех
     * @param {number} A 
     * @param {number} B 
     * @param {number} C 
     * @param {number} D 
     * @returns 
     */
    static formatPlane(A,B,C,D){
        return String.raw` ${this.formatInt(A)}${this.formatDot(null,"x")}${this.formatInt(B)}${this.formatDot(null,"y")}${this.formatInt(C)}${this.formatDot(null,"z")}${this.formatInt(D)}=0 `; 
    }


}

/**
 * Alias для String.raw
 */
FormatterforLATEX.r = String.raw;

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
    getInt(min = -10, max = 10, nonzero = false) {
        let x = Math.floor(this.next() * (max - min + 1)) + min;
        while (x==0 && nonzero)
            x = Math.floor(this.next() * (max - min + 1)) + min;
        return x;
    }

    /**
     * Генерирует матрицу
     * @param {number} rows - количество строк
     * @param {number} cols - количество столбцов
     * @param {number} min - минимальное значение элемента
     * @param {number} max - максимальное значение элемента
     */
    getMatrix(rows, cols = rows, min = -10, max = 10) {
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
     * Генерируем вектор
     * @param {number} min
     * @param {number} max
     */
    getVector(min = -10, max = 10) {
        let vector = [];
        for (let i = 0; i < 3; i++) {
            vector.push(this.getInt(min, max));
        }
        return vector;
    }
    /**
     * Генерируем точку
     * @param {number} min 
     * @param {number} max 
     */
    getDot(min = -10, max = 10){
        return this.getVector(min, max);
    }

    /**
     * Генерируем угол
     */
    getAngle() {
        let value = this.getInt(30, 179);
        while (value % 30 != 0) value = this.getInt(30, 179);
        return (value * Math.PI) / 180;
    }
}
