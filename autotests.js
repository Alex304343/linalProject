// ==========================================
// 🛠️ ДВИЖОК ТЕСТИРОВАНИЯ
// ==========================================
const Tester = {
    total: 0, passed: 0, failed: 0, epsilon: 0.0001,

    isClose(a, b) { return Math.abs(a - b) < this.epsilon; },

    areMatricesEqual(m1, m2) {
        if (!m1 || !m2 || m1.length !== m2.length || m1[0].length !== m2[0].length) return false;
        for (let i = 0; i < m1.length; i++) {
            for (let j = 0; j < m1[0].length; j++) {
                if (!this.isClose(m1[i][j], m2[i][j])) return false;
            }
        }
        return true;
    },

    test(name, fn) {
        this.total++;
        try {
            if (fn()) {
                // console.log(`✅ ${name}`); // Раскомментировать для детального лога
                this.passed++;
            } else {
                console.error(`❌ FAILED: ${name}`);
                this.failed++;
            }
        } catch (e) {
            console.error(`❌ ERROR in ${name}: ${e.message}`);
            this.failed++;
        }
    },

    // Утилиты для проверок внутри тестов
    eq(a, b) { return this.isClose(a, b); },
    eqMat(a, b) { return this.areMatricesEqual(a, b); },
    eqBool(a, b) { return a === b; },
    isNull(a) { return a === null; },
    printReport() {
        console.log(`\n📊 ИТОГ: Всего: ${this.total} | ✅ OK: ${this.passed} | ❌ FAIL: ${this.failed}`);
    }
};

function runAllTests() {
    console.log("🚀 ЗАПУСК ПОЛНОГО НАБОРА ТЕСТОВ...");

    // ==========================================
    // 1. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // ==========================================
    Tester.test("comparable & cz", () => {
        let ok = true;
        ok &= Tester.eqBool(comparable(0.1 + 0.2, 0.3), true); // 0.30000000000000004
        ok &= Tester.eqBool(comparable(5, 5.1), false);
        ok &= Tester.eqBool(cz(0.00000001), true);
        ok &= Tester.eqBool(cz(0.1), false);
        ok &= Tester.eqBool(cz(-0.00000001), true);
        return ok;
    });

    // ==========================================
    // 2. ЛИНЕЙНАЯ АЛГЕБРА (БАЗА)
    // ==========================================
    
    // --- Создание матриц и арифметика ---
    Tester.test("DiagonalMatrixByNumber", () => {
        let m = DiagonalMatrixByNumber(5, 3);
        return Tester.eqMat(m, [[5,0,0],[0,5,0],[0,0,5]]) 
            && m.length === 3 
            && m[0][1] === 0;
    });

    Tester.test("SumMatrixes", () => {
        let A = [[1, 2], [3, 4]];
        let B = [[10, 20], [30, 40]];
        return Tester.eqMat(SumMatrixes(A, B), [[11, 22], [33, 44]])
            && Tester.eqMat(SumMatrixes(A, [[-1, -2], [-3, -4]]), [[0,0],[0,0]]);
    });

    Tester.test("MatrixByNumber", () => {
        let A = [[1, -2], [0.5, 0]];
        return Tester.eqMat(MatrixByNumber(A, 2), [[2, -4], [1, 0]])
            && Tester.eqMat(MatrixByNumber(A, 0), [[0, 0], [0, 0]]);
    });

    Tester.test("Transpose", () => {
        let A = [[1, 2, 3], [4, 5, 6]]; // 2x3
        let T = Transpose(A); // 3x2
        return Tester.eqMat(T, [[1, 4], [2, 5], [3, 6]])
            && Tester.eqMat(Transpose(T), A); // (A^T)^T = A
    });

    Tester.test("MatrixMultiplication", () => {
        let A = [[1, 2], [3, 4]];
        let I = [[1, 0], [0, 1]];
        let B = [[2, 0], [1, 2]];
        return Tester.eqMat(MatrixMultiplication(A, I), A) // A * I = A
            && Tester.eqMat(MatrixMultiplication(I, A), A) // I * A = A
            && Tester.eqMat(MatrixMultiplication(A, B), [[4, 4], [10, 8]]); // Проверка значений
    });

    // ==========================================
    // 3. СЛОЖНАЯ ЛИНЕЙНАЯ АЛГЕБРА
    // ==========================================

    Tester.test("Det (Определитель)", () => {
        let ok = true;
        ok &= Tester.eq(Det([[5]]), 5);
        ok &= Tester.eq(Det([[1, 2], [3, 4]]), -2); // 4 - 6
        ok &= Tester.eq(Det([[1, 0, 0], [0, 1, 0], [0, 0, 1]]), 1); // Identity
        ok &= Tester.eq(Det([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), 0); // Линейно зависимые
        return ok;
    });

    Tester.test("InverseMatrix", () => {
        let A = [[4, 7], [2, 6]];
        let InvA = InverseMatrix(A);
        let I = MatrixMultiplication(A, InvA); // Должна быть единичной
        
        let ok = true;
        ok &= Tester.eqMat(I, [[1, 0], [0, 1]]);
        ok &= InverseMatrix([[1, 1], [2, 2]]) === "determinant = 0";
        ok &= Tester.eqMat(InverseMatrix([[2]]), [[0.5]]);
        return ok;
    });

    Tester.test("RangMatrix (Ранг)", () => {
        let ok = true;
        ok &= Tester.eq(RangMatrix([[1, 0], [0, 1]]), 2); // Полный
        ok &= Tester.eq(RangMatrix([[1, 1], [2, 2]]), 1); // Зависимые
        ok &= Tester.eq(RangMatrix([[0, 0], [0, 0]]), 0); // Нулевая
        ok &= Tester.eq(RangMatrix([[1, 0, 0], [0, 1, 0]]), 2); // Прямоугольная
        return ok;
    });

    // ==========================================
    // 4. МАТРИЧНЫЕ УРАВНЕНИЯ
    // ==========================================

    Tester.test("SolvingEquations (AX=B методом Гаусса/Inv)", () => {
        let A = [[2, 0], [0, 2]];
        let B = [[4], [6]];
        let X = SolvingEquations(A, B); // X = [[2], [3]]
        return Tester.eqMat(X, [[2], [3]]);
    });

    Tester.test("EquationAXB (AX=B)", () => {
        let A = [[1, 1], [0, 1]];
        let B = [[2], [3]];
        // x + y = 2, y = 3 => x = -1
        let X = EquationAXB(A, B);
        return Tester.eqMat(X, [[-1], [3]]);
    });

    Tester.test("EquationXAB (XA=B)", () => {
        // X * 2I = B => X = B * 0.5
        let A = [[2, 0], [0, 2]];
        let B = [[4, 6]];
        let X = EquationXAB(A, B);
        return Tester.eqMat(X, [[2, 3]]);
    });

    Tester.test("EquationAXBC (AXB=C)", () => {
        // 2I * X * 2I = 4I => 4X = 4I => X = I
        let A = [[2, 0], [0, 2]];
        let B = [[2, 0], [0, 2]];
        let C = [[4, 0], [0, 4]];
        let X = EquationAXBC(A, B, C);
        return Tester.eqMat(X, [[1, 0], [0, 1]]);
    });

    Tester.test("calculateMatrixPolynomial (aM^2 + bM + cI)", () => {
        let M = [[1, 0], [0, 1]]; // E
        // 2*E^2 + 3*E + 5*E = 2+3+5 = 10E
        let Res = calculateMatrixPolynomial(2, 3, 5, M);
        return Tester.eqMat(Res, [[10, 0], [0, 10]]);
    });

    // ==========================================
    // 5. АНАЛИТИЧЕСКАЯ ГЕОМЕТРИЯ: Dot & Vector
    // ==========================================

    let d0 = new Dot(0,0,0);
    let d1 = new Dot(3,4,0);
    let vx = new Vector(1,0,0);
    let vy = new Vector(0,1,0);
    let vz = new Vector(0,0,1);

    Tester.test("Dot", () => {
        return Tester.eq(d0.DistanceToDot(d1), 5) // 3-4-5 треугольник
            && Tester.eq(d0.DistanceToDot(d0), 0);
    });

    Tester.test("Vector basics", () => {
        let v = Vector.ByDots(d0, d1); // (3, 4, 0)
        return Tester.eq(v.x, 3) && Tester.eq(v.length, 5);
    });

    Tester.test("Vector operations", () => {
        let ok = true;
        ok &= Tester.eq(vx.dot(vy), 0); // Перпендикулярные
        ok &= Tester.eq(vx.dot(vx), 1); // Единичный
        ok &= Tester.eqMat([vx.cross(vy).z], [1]); // X x Y = Z
        ok &= Tester.eq(vx.cross(vx).length, 0); // Параллельные = 0
        return ok;
    });

    Tester.test("Vector.AngleBetweenVectors", () => {
        let ok = true;
        ok &= Tester.eq(vx.AngleBetweenVectors(vy), Math.PI / 2); // 90 градусов
        ok &= Tester.eq(vx.AngleBetweenVectors(vx), 0); // 0 градусов
        ok &= Tester.eq(vx.AngleBetweenVectors(new Vector(-1,0,0)), Math.PI); // 180 градусов
        ok &= Tester.isNull(vx.AngleBetweenVectors(new Vector(0,0,0))); // Ошибка длины
        return ok;
    });

    // ==========================================
    // 6. АНАЛИТИЧЕСКАЯ ГЕОМЕТРИЯ: Line
    // ==========================================
    let lineZ = new Line(vz, d0); // Ось Z
    let lineX = new Line(vx, d0); // Ось X

    Tester.test("Line.ByDots", () => {
        let l = Line.ByDots(d0, new Dot(0,0,5));
        return Tester.eq(l.vector.x, 0) && Tester.eq(l.vector.z, 5);
    });

    Tester.test("Line.DistanceToDot", () => {
        // Расстояние от оси Z до точки (3,0,10) должно быть 3
        return Tester.eq(lineZ.DistanceToDot(new Dot(3,0,10)), 3)
            && Tester.eq(lineZ.DistanceToDot(new Dot(0,0,100)), 0) // Точка на прямой
            && Tester.isNull(new Line(new Vector(0,0,0), d0).DistanceToDot(d1)); // 0 вектор
    });

    Tester.test("Line.AngleBetweenLines", () => {
        // Между X и Z = 90 градусов
        return Tester.eq(lineX.AngleBetweenLines(lineZ), Math.PI / 2)
            // Между параллельными = 0
            && Tester.eq(lineX.AngleBetweenLines(new Line(new Vector(2,0,0), d1)), 0);
    });

    Tester.test("Line.By2Planes", () => {
        let p1 = new Plane(1, 0, 0, 0); // x=0
        let p2 = new Plane(0, 1, 0, 0); // y=0
        // Пересечение x=0 и y=0 это ось Z
        let l = Line.By2Planes(p1, p2); 
        // Направляющий должен быть (0,0,1) или (0,0,-1)
        return Tester.eq(l.vector.x, 0) && Tester.eq(l.vector.y, 0) && !cz(l.vector.z);
    });
    

    // ==========================================
    // 7. АНАЛИТИЧЕСКАЯ ГЕОМЕТРИЯ: Plane
    // ==========================================
    let planeXY = new Plane(0, 0, 1, 0); // z=0
    let planeYZ = new Plane(1, 0, 0, 0); // x=0

    Tester.test("Plane.Methods", () => {
        let ok = true;
        // ByNormalAndDot
        let p = Plane.ByNormalAndDot(vz, d0); 
        ok &= Tester.eq(p.c, 1) && Tester.eq(p.d, 0);
        
        // By3Dots (0,0,0), (1,0,0), (0,1,0) -> XY plane
        let p3 = Plane.By3Dots(d0, new Dot(1,0,0), new Dot(0,1,0));
        ok &= !cz(p3.c) && cz(p3.a) && cz(p3.b);
        
        // InSegments (1, 1, 1) -> x+y+z-1=0
        let pSeg = Plane.InSegments(1,1,1);
        
        // !!! ИСПРАВЛЕНИЕ ЗДЕСЬ (DistanceToDot с большой буквы) !!!
        ok &= Tester.eq(pSeg.DistanceToDot(new Dot(1,0,0)), 0); 
        
        return ok;
    });

    Tester.test("Plane.DistanceToDot", () => {
        // От XY (z=0) до (0,0,10) = 10
        return Tester.eq(planeXY.DistanceToDot(new Dot(0,0,10)), 10)
            && Tester.eq(planeXY.DistanceToDot(d0), 0);
    });

    Tester.test("Plane.AngleBetweenPlanes", () => {
        // Между z=0 и x=0 угол 90
        return Tester.eq(planeXY.AngleBetweenPlanes(planeYZ), Math.PI / 2)
            // Между параллельными 0
            && Tester.eq(planeXY.AngleBetweenPlanes(new Plane(0,0,1, -5)), 0);
    });

    Tester.test("Plane.AngleBetweenPlaneAndLine", () => {
        // Угол между плоскостью z=0 и осью Z (перпендикуляр) = 90 градусов
        let angle1 = planeXY.AngleBetweenPlaneAndLine(lineZ);
        
        // Угол между плоскостью z=0 и осью X (лежит в плоскости) = 0 градусов
        let angle2 = planeXY.AngleBetweenPlaneAndLine(lineX);

        return Tester.eq(angle1, Math.PI / 2) && Tester.eq(angle2, 0);
    });
    // ==========================================
    // 8. НОВЫЕ ТЕСТЫ: Расстояния между фигурами
    // ==========================================

    // Подготовка переменных для тестов
    let lineX_axis = new Line(vx, d0); // Прямая по оси X
    let lineY_axis = new Line(vy, d0); // Прямая по оси Y
    let lineY_up = new Line(vy, new Dot(0, 0, 10)); // Прямая Y, поднятая на высоту z=10
    
    // ТЕСТ 1: Расстояние между двумя прямыми (метод в классе Line)
    Tester.test("Line.DistanceToLine", () => {
        let ok = true;
        
        // 1. Скрещивающиеся прямые
        // Ось X (на полу) и Ось Y (на высоте 10). Расстояние должно быть 10.
        ok &= Tester.eq(lineX_axis.DistanceToLine(lineY_up), 10);

        // 2. Параллельные прямые
        // Ось X и Ось X сдвинутая на y=5. Расстояние 5.
        let lineX_parallel = new Line(vx, new Dot(0, 5, 0));
        ok &= Tester.eq(lineX_axis.DistanceToLine(lineX_parallel), 5);
        
        // 3. Пересекающиеся прямые
        // Ось X и Ось Y пересекаются в (0,0,0). Расстояние 0.
        ok &= Tester.eq(lineX_axis.DistanceToLine(lineY_axis), 0);

        return ok;
    });

    // ТЕСТ 2: Расстояние от плоскости до прямой (метод в классе Plane)
    Tester.test("Plane.DistanceToLine", () => {
        let planeFloor = new Plane(0, 0, 1, 0);    // Пол (z=0)
        let planeCeiling = new Plane(0, 0, 1, -10); // Потолок (z=10)
        let planeWall = new Plane(1, 0, 0, 0);     // Стена (x=0)

        let ok = true;

        // 1. Прямая (Ось X) лежит в плоскости (Пол). Расстояние 0.
        ok &= Tester.eq(planeFloor.DistanceToLine(lineX_axis), 0);

        // 2. Прямая (Ось X) параллельна плоскости (Потолок). Расстояние 10.
        // (Расстояние от z=0 до z=10)
        ok &= Tester.eq(planeCeiling.DistanceToLine(lineX_axis), 10);

        // 3. Прямая (Ось X) пересекает плоскость (Стена). Расстояние 0.
        // Прямая протыкает стену, расстояние 0.
        ok &= Tester.eq(planeWall.DistanceToLine(lineX_axis), 0);

        return ok;
    });

    Tester.printReport();
}

// Запуск
runAllTests();