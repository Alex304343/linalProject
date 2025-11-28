class FormatterforLATEX{
    /**
     * Приводит все элементы матрицы к обыкновенным дробям
     * @param {array[][]} matrix 
     */
    static normalizeMatrix(matrix){
         return matrix.map(row => {
    // row — это отдельная строка (массив чисел)
    return row.map(num => {
        // num — это конкретное число
        return new Fraction(num).toLatex().replace(/\\frac/g, '\\dfrac');
        });
    });
    }
    static normalizeNumber(number){
        return new Fraction(number).toLatex().replace(/\\frac/g, '\\dfrac');
    }
    /**
     * Превращает переданную матрицу (массив массивов) в LaTeX строку
     * @param {array [][]} matrix 
     */
    static formatMatrix(matrix) {
        const fractionMatrix=this.normalizeMatrix(matrix)
        return `\\begin{pmatrix} ${fractionMatrix
            .map((row) => row.join(" & "))
            .join(" \\\\[8pt] ")} \\\\ \\end{pmatrix}`;
    }
    /**
     * Превращает переданную матрицу определить (массив массивов) в LaTeX строку
     * @param {array [][]} matrix  
     */
    static formatDeterminant(matrix) {
        const fractionMatrix=this.normalizeMatrix(matrix)
     return `\\begin{vmatrix} ${fractionMatrix
        .map((row) => row.join(" & "))
        .join(" \\\\[8pt] ")} \\\\ \\end{vmatrix}`;
    }

    /**
     * Превращает число в строку с учетом знака 
     * @param {number} num 
     * @param {bool} bracketNegatives - скобки для отрицательных
     */
    static formatInt(num, bracketNegatives = false) {
        if (num >= 0) return "+" + num;
        const fractionNumber=this.normalizeNumber(num)
        return (bracketNegatives ? "(" : "") + fractionNumber + (bracketNegatives ? ")" : "");
    }
    
    /**
     * Форматирует СЛАУ на основе матрицы коэффициентов (A) и столбца свободных членов (B)
     * @param {array [][]} matrixA 
     * @param {array [][]} matrixB 
     */
    static formatSystem(matrixA, matrixB) {
        let lines = [];
        for(let row=0; row < matrixA.length; row++){
            let line = "";
            let not0 = false;
            for(let col=0; col < matrixA[row].length; col++){
                if(matrixA[row][col] == 0) continue;
                not0 = true;
                // Красивый вывод знаков: если это не первый элемент и число положительное, ставим +
                line += `${(matrixA[row][col] > 0 && line !== "") ? `+` : ``}${matrixA[row][col]}x_{${col+1}}`;
            }
            if (!not0) line += `0`;
            line += `=${matrixB[row][0]}`;
            lines.push(line);
        }
        return `\\left\\{\\begin{array}{l}${lines.join(` \\\\ `)}\\end{array}\\right.`;
    }
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
     * Генерирует матрицу
     * @param {number} rows - количество строк
     * @param {number} cols - количество столбцов
     * @param {number} min - минимальное значение элемента
     * @param {number} max - максимальное значение элемента
     */
    getMatrix(rows, cols=rows, min = -10, max = 10) {
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
}