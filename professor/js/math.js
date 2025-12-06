//Линейная алгебра
//Решение матричных уравнений вида AXB=C
function EquationAXBC(A, B, C) {
    let InversA = InverseMatrix(A);
    let InversB = InverseMatrix(B);
    if (InversA == "determinant = 0" || InversB == "determinant = 0") {
        return "determinant = 0";
    }
    return MatrixMultiplication(MatrixMultiplication(InversA, C), InversB);
}
//Решение матричных уравнений вида AX=B
function EquationAXB(A, B) {
    let InversA = InverseMatrix(A);
    if (InversA == "determinant = 0") {
        return "determinant = 0";
    }
    return MatrixMultiplication(InversA, B);
}
//Решение матричных уравнений вида XA=B
function EquationXAB(A, B) {
    let InversA = InverseMatrix(A);
    if (InversA == "determinant = 0") {
        return "determinant = 0";
    }
    return MatrixMultiplication(B, InversA);
}
//Создание диагональной матрицы из числа
function DiagonalMatrixByNumber(num, len) {
    let matrix = [];
    for (let i = 0; i < len; i++) {
        matrix[i] = [];
        for (let j = 0; j < len; j++) {
            matrix[i][j] = 0;
        }
    }
    for (let i = 0; i < len; i++) {
        matrix[i][i] = num;
    }
    return matrix;
}
// Матрица + число
function MatrixPlusNomber(matrix, num) {
    return SumMatrixes(matrix, DiagonalMatrixByNumber(num, matrix.length));
}
//Сумма матриц (Матрицы ОДИНАКОВОЙ РАЗМЕРНОСТИ)
function SumMatrixes(matrix1, matrix2) {
    let matrix = [];
    let Line = [];
    for (let i = 0; i < matrix1.length; i++) {
        for (let j = 0; j < matrix1[0].length; j++) {
            Line.push(matrix1[i][j] + matrix2[i][j]);
        }
        matrix.push(Line);
        Line = [];
    }
    return matrix;
}
// Умножение матрицы на число
function MatrixByNumber(matrix, num) {
    let NewMatrix = JSON.parse(JSON.stringify(matrix));
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            NewMatrix[i][j] = NewMatrix[i][j] * num;
        }
    }
    return NewMatrix;
}
//Решение линейных комбинаций матриц вида 2A+3B
function MatrixLinearCombination(num1, matrix1, num2, matrix2) {
    return SumMatrixes(MatrixByNumber(matrix1,num1),MatrixByNumber(matrix2,num2))
}
//Транспонирование матрицы
function Transpose(matrix) {
    let NewMatrix = [];
    let Line = [];
    for (let j = 0; j < matrix[0].length; j++) {
        for (let i = 0; i < matrix.length; i++) {
            Line.push(matrix[i][j]);
        }
        NewMatrix.push(Line);
        Line = [];
    }
    return NewMatrix;
}
//Умножение матриц
function MatrixMultiplication(matrix1, matrix2) {
    let NewMatrix = [];
    let num;
    let Line = [];
    for (let row = 0; row < matrix1.length; row++) {
        Line = [];
        for (let col = 0; col < matrix2[0].length; col++) {
            num = 0;
            for (let both = 0; both < matrix1[0].length; both++) {
                num += matrix1[row][both] * matrix2[both][col];
            }
            Line.push(num);
        }
        NewMatrix.push(Line);
    }
    return NewMatrix;
}
//Нахождение Матрицы Минора КВАДРАТНОЙ МАТРИЦЫ по a[i][j] элементу
function MinorFind(matrix, row = 0, col = 0) {
    let Minor = [];
    let Line = [];
    for (let i = 0; i < matrix.length; i++) {
        if (i != row) {
            for (let j = 0; j < matrix.length; j++) {
                if (j != col) {
                    Line.push(matrix[i][j]);
                }
            }
        }
        if (Line.length != 0) {
            Minor.push(Line);
            Line = [];
        }
    }
    return Minor;
}
//Нахождение алгебраического дополнения матрицы
function AlgebraicComplement(matrix, row = 0, col = 0) {
    return (-1) ** (row + col) * Det(MinorFind(matrix, row, col));
}
//Нахождение определителя матрицы
function Det(matrix) {
    let determinant = 0;
    if (matrix.length == 1) {
        return matrix[0][0];
    }
    for (let i = 0; i < matrix.length; i++) {
        determinant += matrix[0][i] * AlgebraicComplement(matrix, 0, i);
    }
    return determinant;
}
//Нахождение обратной матрицы
function InverseMatrix(matrix) {
    let determinant = Det(matrix);
    if (determinant == 0) {
        return "determinant = 0";
    }
    if (matrix.length == 1) {
        return [[1 / matrix[0][0]]];
    }
    let TransMatrix = Transpose(matrix);
    let NewMatrix = [];
    let Line = [];
    for (let i = 0; i < TransMatrix.length; i++) {
        Line = [];
        for (let j = 0; j < TransMatrix[0].length; j++) {
            Line.push(AlgebraicComplement(TransMatrix, i, j));
        }
        NewMatrix.push(Line);
    }
    return MatrixByNumber(NewMatrix, 1 / determinant);
}
//Решений уравнений вида ax^2+bx+c
function calculateMatrixPolynomial(a, b, c, matrix) {
    return SumMatrixes(
        SumMatrixes(
            MatrixByNumber(MatrixMultiplication(matrix, matrix), a),
            MatrixByNumber(matrix, b)
        ),
        DiagonalMatrixByNumber(c, matrix.length)
    );
}
//Решение Слау обратной матрицей
function SolvingEquations(leftmatrix, rightmatrix) {
    let NewMatrix = InverseMatrix(leftmatrix);
    if (NewMatrix == "determinant = 0") {
        return "determinant = 0";
    }
    return MatrixMultiplication(NewMatrix, rightmatrix);
}
//вспомогательная функция для RangMatrix по созданию матрицы по индексам
function MatrixCreatorByIndexes(matrix, indexes) {
    if (indexes.length == 1) {
        return [[matrix[indexes[0][0]][indexes[0][1]]]];
    }
    //новая матрица образованная пересечением строк и столбов
    let matrixindexes = [];
    let NewMatrix = [];
    let Line = [];
    for (let i = 0; i < indexes.length; i++) {
        matrixindexes.push(indexes[i]);
        for (let j = i + 1; j < indexes.length; j++) {
            matrixindexes.push([indexes[i][0], indexes[j][1]]);
            matrixindexes.push([indexes[j][0], indexes[i][1]]);
        }
    }
    matrixindexes.sort();
    for (let i = 0; i < matrixindexes.length; i++) {
        Line.push(matrix[matrixindexes[i][0]][matrixindexes[i][1]]);
        if (Math.pow(Line.length, 2) == matrixindexes.length) {
            NewMatrix.push(Line);
            Line = [];
        }
    }
    return NewMatrix;
}
//нахждение ранга матрицы
function RangMatrix(matrix) {
    let maxrang = Math.max(matrix.length, matrix[0].length);
    let i = 0;
    let j = 0;
    let PartMinor = [];
    while (i < matrix.length) {
        j = 0;
        while (j < matrix[0].length) {
            let f = true;
            if (PartMinor.length == 0) {
                f = true;
            } else {
                for (let x = 0; x < PartMinor.length; x++) {
                    if (PartMinor[x][0] == i || PartMinor[x][1] == j) {
                        f = false;
                        break;
                    }
                }
            }
            if (f) {
                PartMinor.push([i, j]);
                let NewMatrix = MatrixCreatorByIndexes(matrix, PartMinor);
                if (Det(NewMatrix) == 0) {
                    PartMinor.pop();
                }
                if (PartMinor.length == maxrang) {
                    return maxrang;
                }
            }
            j++;
        }
        i++;
    }
    return PartMinor.length;
}

/**
 * Сравнимость `a` с `b` при некой точности `eps`
 * @param {number} a
 * @param {number} b
 * @param {number} [eps=0.0001]
 * @returns {boolean}
 */
function comparable(a, b, eps = 0.0001) {
    return Math.abs(a - b) < eps;
}

/**
 * Сравнимость `x` с нулём при некой точности `eps`
 *
 * _CZ - Comparable to Zero_
 * @param {number} x
 * @param {number} [eps=0.0001]
 * @returns {boolean}
 */
function cz(x) {
    return comparable(x, 0);
}

//Аналитическая геометрия
class Dot {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     * Расстояние до другой точки
     * @param {Dot} dot
     */
    DistanceToDot(dot) {
        return Math.hypot(this.x - dot.x, this.y - dot.y, this.z - dot.z);
    }
    /**
     * Преобразует точку в массив
     */
    toArray() {
        return [this.x,this.y,this.z];
    }

    static ByArray(dot) {
        return new Dot(dot[0], dot[1], dot[2]);
    }
}
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static ByDots(dot1, dot2) {
        return new Vector(dot2.x - dot1.x, dot2.y - dot1.y, dot2.z - dot1.z);
    }
    /**
     * Векторное произведение через длины и угол
     * @param {number} vector1 длина 1 вектора
     * @param {number} vector2 длина 2 вектора
     * @param {number} angle 
     */
    static CrossByLensAndAngle(vector1, vector2,angle){
        return(vector1*vector2*Math.sin(angle))
    }
    /**
     * Длинна вектора, образованного 2 векторами через длины и угол
     * @param {number} vector1 длина 1 вектора
     * @param {number} vector2 длина 2 вектора
     * @param {number} angle угол
     * @param {number} a коэф при 1 векторе
     * @param {number} b коэф при 2 векторе
     */
    static SumVectorsByLensAndAngle(vector1,vector2,angle,a=1,b=1){
        const term1 = Math.pow(a * vector1, 2);
        const term2 = Math.pow(b * vector2, 2);
        const term3 = 2 * a * b * vector1 * vector2 * Math.cos(angle);
        return Math.sqrt(term1 + term2 + term3);
    }
    /**
     * Площадбь параллелограмма, образованного векторами вида \vec{c} = 4\vec{a} + \vec{b}, \quad \vec{d} = -\vec{a} + 7\vec{b}, \quad \vec{a}(-1;1;2), \quad \vec{b}(1;3; 8)
     * @param {number} vector1 длина 1 вектора
     * @param {number} vector2 длина 2 вектора
     * @param {number} angle угол
     * @param {number} a коэф при 1 векторе
     * @param {number} b коэф при 2 векторе
     * @param {number} b коэф при 2 векторе
     * @param {number} b коэф при 2 векторе
     */
    static AreaOfParallelogramByLeens(vector1,vector2,angle,a,b,c,d){
        return (Math.abs(a*d - b*c)*vector1*vector2*Math.sin(angle))
    }
    get length() {
        return Math.hypot(this.x, this.y, this.z);
    }

    /**
     * Скалярное произведение
     *
     * Использование: v1.dot(v2)
     * @param {Vector} v
     */
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Векторное произведение
     *
     * Использование: v1.cross(v2)
     * @param {Vector} v
     */
    cross(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    
    Cross3Vectors(vector1,vector2){
        let arr=[[this.x,this.y,this.z],[vector1.x,vector1.y,vector1.z],[vector2.x,vector2.y,vector2.z]]
        return Det(arr)

    }
    
    /**
     * Площадь треугольника на 2 векторах
     * @param {Vector} vector 
     */
    AreaTriangle(vector){
        let ans=this.cross(vector)
        return ans.length/2
    }
    /**
     * Угол между векторами
     * @param {Vector} vector
     */
    AngleBetweenVectors(vector) {
        let l1 = this.length;
        let l2 = vector.length;
        if (cz(l1) || cz(l2)) {
            console.log("Длина одного из векторов = 0, ошибка");
            return null;
        }
        let cosAlpha = this.dot(vector) / (l1 * l2);

        //Защита от NaN (если из-за погрешности получилось 1.0000001)
        if (cosAlpha > 1) cosAlpha = 1;
        if (cosAlpha < -1) cosAlpha = -1;
        return Math.acos(cosAlpha);
    }
    /**
     * Произведение вектора на число
     * @param {number} num 
     */
    VectorByNomber(num){
        return new Vector(this.x*num,this.y*num,this.z*num)
    }
    /**
     * Вектор - сумма векторов
     * @param {Vector} vector 2 вектор
     * @param {number} a коофицент при 1 векторе
     * @param {number} b коофицент при 2 векторе
     */
    Sum(vector, a=1, b=1){
        let vector1=this.VectorByNomber(a)
        let vector2=vector.VectorByNomber(b)
        return new Vector(vector1.x+vector2.x,vector1.y+vector2.y,vector1.z+vector2.z)
    }
    /**
     * Проверяет вектора на колиниарность
     * @param {Vector} vector 
     */
    Сollinear(vector) {
        // Если один из векторов нулевой длины - обычно считается коллинеарным всему
        if (cz(this.length) || cz(vector.length)) {
            return true; 
        }

        // Считаем векторное произведение
        let crossProduct = this.cross(vector);

        // Если его длина равна 0 (с учетом погрешности cz), то векторы коллинеарны
        if (cz(crossProduct.length)) {
            return true;
        }
        
        return false;
    }
    /**
     * Преобразует вектор в массив
     */
    toArray() {
        return [this.x,this.y,this.z];
    }
}
class Line {
    /**
     * Прямая по точке и вектору
     * @param {Vector} vector
     * @param {Dot} dot
     */
    constructor(vector, dot) {
        this.vector = vector;
        this.dot = dot;
    }
    /**
     * Прямая по точкам
     * @param {Dot} dot1
     * @param {Dot} dot2
     * @returns
     */
    static ByDots(dot1, dot2) {
        let vector = Vector.ByDots(dot1, dot2);
        return new Line(vector, dot1);
    }
    /**
     * Прямая по 2 плоскостям
     * @param {Plane} Plane1
     * @param {Plane} Plane2
     */
    static By2Planes(Plane1, Plane2) {
        let n1 = new Vector(Plane1.a, Plane1.b, Plane1.c);
        let n2 = new Vector(Plane2.a, Plane2.b, Plane2.c);
        let vector = n1.cross(n2);
        if (cz(vector.length)) {
            return null;
        }
        // Try several 2x2 projections to find a point on the intersection line.
        // Each entry: [coeffName1, coeffName2, fixedCoord]
        const attempts = [
            ["a", "b", "z"], // solve for x,y with z = 0
            ["a", "c", "y"], // solve for x,z with y = 0
            ["b", "c", "x"], // solve for y,z with x = 0
        ];

        const matrixB = [[-Plane1.d], [-Plane2.d]];

        for (const [c1, c2, fixed] of attempts) {
            const matrixA = [
                [Plane1[c1], Plane1[c2]],
                [Plane2[c1], Plane2[c2]],
            ];
            const result = SolvingEquations(matrixA, matrixB);
            if (result !== "determinant = 0") {
                const v1 = result[0][0];
                const v2 = result[1][0];
                let px = 0,
                    py = 0,
                    pz = 0;
                if (fixed === "z") {
                    px = v1;
                    py = v2;
                    pz = 0;
                } else if (fixed === "y") {
                    px = v1;
                    py = 0;
                    pz = v2;
                } else if (fixed === "x") {
                    px = 0;
                    py = v1;
                    pz = v2;
                }
                return new Line(vector, new Dot(px, py, pz));
            }
        }
        return null;
    }
    /**
     * Расстояние от точки до прямой
     * @param {Dot} dot
     */
    DistanceToDot(dot) {
        if (cz(this.vector.length)) {
            console.log("Длина направляющего вектора прямой = 0");
            return null;
        }
        let plane = Plane.ByNormalAndDot(this.vector, dot);
        let t =
            -(
                plane.a * this.dot.x +
                plane.b * this.dot.y +
                plane.c * this.dot.z +
                plane.d
            ) /
            (plane.a * this.vector.x +
                plane.b * this.vector.y +
                plane.c * this.vector.z);
        let crossdot = new Dot(
            this.vector.x * t + this.dot.x,
            this.vector.y * t + this.dot.y,
            this.vector.z * t + this.dot.z
        );
        return dot.DistanceToDot(crossdot);
    }
    /**
     * Расстояние между двумя прямыми
     * @param {Line} line
     */
    DistanceToLine(line) {
        // Считаем векторное произведение направляющих векторов
        let crossProd = this.vector.cross(line.vector);

        // Случай 1: Прямые параллельны (площадь основания параллелепипеда = 0)
        if (cz(crossProd.length)) {
            // Расстояние равно расстоянию от точки одной прямой до другой прямой
            return this.DistanceToDot(line.dot);
        }

        // Случай 2: Прямые скрещиваются
        // Вектор, соединяющий начальные точки двух прямых
        let p1p2 = Vector.ByDots(this.dot, line.dot);

        // Это объем параллелепипеда, построенного на векторах
        let numerator = Math.abs(p1p2.dot(crossProd));

        // Площадь основания (длина векторного произведения направляющих векторов)
        let denominator = crossProd.length;

        return numerator / denominator;
    }
    /**
     * Угол между прямыми;
     * @param {Line} line
     */
    AngleBetweenLines(line) {
        let vectorsangle = this.vector.AngleBetweenVectors(line.vector);
        if (vectorsangle == null) {
            console.log(
                "Длина одного из направляющих векторов прямых = 0, ошибка"
            );
            return null;
        }
        if (vectorsangle > Math.PI / 2) {
            vectorsangle = Math.PI - vectorsangle;
        }
        return vectorsangle;
    }
}
class Plane {
    constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    /**
     * Плоскость по нормали и точке
     * @param {Vector} vector
     * @param {Dot} dot
     */
    static ByNormalAndDot(vector, dot) {
        if (cz(vector.length)) {
            return null;
        }
        let d = -(dot.x * vector.x + dot.y * vector.y + dot.z * vector.z);
        return new Plane(vector.x, vector.y, vector.z, d);
    }
    /**
     * Плоскость по 2 векторам и точке
     * @param {Vector} vector1
     * @param {Vector} vector2
     * @param {Dot} dot
     */
    static By2VectorsAndDot(vector1, vector2, dot) {
        let n = vector1.cross(vector2);
        if (cz(n.length)) {
            console.log("векторы параллельны, плоскость не определить");
            return null;
        }
        return Plane.ByNormalAndDot(n, dot);
    }
    /**
     * Плоскость по 3 точкам
     * @param {Dot} dot1
     * @param {Dot} dot2
     * @param {Dot} dot3
     */
    static By3Dots(dot1, dot2, dot3) {
        let vector1 = Vector.ByDots(dot1, dot2);
        let vector2 = Vector.ByDots(dot1, dot3);
        if (cz(vector1.length) || cz(vector2.length)) {
            return null;
        }
        return Plane.By2VectorsAndDot(vector1, vector2, dot1);
    }
    /**
     * Плоскость в отрезках
     * @param {number} ax
     * @param {number} by
     * @param {number} cz
     */
    static InSegments(ax, by, czval) {
        //Здесь не cz а czval из-за глобального существования функции с таким же названием
        if (cz(Math.abs(ax)) || cz(Math.abs(by)) || cz(Math.abs(cz))) {
            return null;
        }
        let A = by * czval;
        let B = ax * czval;
        let C = ax * by;
        let D = -(ax * by * czval);
        return new Plane(A, B, C, D);
    }
    /**
     * Вектор нормали
     */
    get normal(){
        return new Vector(this.a,this.b,this.c)
    }
    /**
     * Расстояние от плоскости до точки
     * @param {Dot} dot
     */
    DistanceToDot(dot) {
        let numerator = Math.abs(
            this.a * dot.x + this.b * dot.y + this.c * dot.z + this.d
        );
        let denominator = Math.sqrt(this.a ** 2 + this.b ** 2 + this.c ** 2);
        if (cz(denominator)) {
            console.log("Длина вектора нормали=0, ошибка");
            return null;
        }
        return numerator / denominator;
    }
    /**
     * Расстояние от плоскости до прямой
     * @param {Line} line
     */
    DistanceToLine(line) {
        // Нормаль этой плоскости
        let n = new Vector(this.a, this.b, this.c);

        // Скалярное произведение нормали плоскости и вектора прямой.
        let dotProd = line.vector.dot(n);

        // 1. Если произведение НЕ 0, значит векторы НЕ перпендикулярны.
        // Следовательно, прямая пересекает плоскость. Расстояние = 0.
        if (!cz(dotProd)) {
            return 0;
        }

        // 2. Если произведение == 0, прямая параллельна плоскости (или лежит в ней).
        // Считаем расстояние от любой точки прямой (line.dot) до этой плоскости.
        return this.DistanceToDot(line.dot);
    }
    /**
     * Угол между плоскостями
     * @param {Plane} plane
     */
    AngleBetweenPlanes(plane) {
        let n1 = new Vector(this.a, this.b, this.c);
        let n2 = new Vector(plane.a, plane.b, plane.c);
        let angle = n1.AngleBetweenVectors(n2);

        if (angle === null) {
            console.log("Нормаль одной из плоскостей имеет нулевую длину");
            return null;
        }
        if (angle > Math.PI / 2) {
            angle = Math.PI - angle;
        }

        return angle;
    }
    /**
     * Угол между плоскостью и прямой
     * @param {Line} line
     */
    AngleBetweenPlaneAndLine(line) {
        let n = new Vector(this.a, this.b, this.c);
        let s = line.vector;
        let angleWithNormal = n.AngleBetweenVectors(s);

        if (angleWithNormal === null) {
            console.log("Вектор нормали или прямой имеет нулевую длинну");
            return null;
        }
        if (angleWithNormal > Math.PI / 2) {
            angleWithNormal = Math.PI - angleWithNormal;
        }
        //Искомый угол = 90 градусов (PI/2) минус угол с нормалью
        return Math.PI / 2 - angleWithNormal;
    }
    /**
     * Точка пересечения прямой и плоскости
     * @param {Line} line 
     */
    PointIntersectionLinePlane(line) {
    let denominator = this.a * line.vector.x + this.b * line.vector.y + this.c * line.vector.z;

    // Если знаменатель 0, прямая параллельна плоскости (нет пересечения или лежит в ней)
    if (cz(denominator)) {
        return null; 
    }

    let t = -(this.a * line.dot.x + this.b * line.dot.y + this.c * line.dot.z + this.d) / denominator;

    let x = line.dot.x + line.vector.x * t;
    let y = line.dot.y + line.vector.y * t;
    let z = line.dot.z + line.vector.z * t;
    return new Dot(x, y, z);
    }
    /**
     * Проекция точки на плоскость
     * @param {Dot} dot 
     */
    ProjectionPointOnPlane(dot){
        let vectorn = this.normal
        let line = new Line(vectorn, dot)
        return this.PointIntersectionLinePlane(line)

    }
}
