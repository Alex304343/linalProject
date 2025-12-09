
// ==========================================
// МИНИ-ФРЕЙМВОРК ДЛЯ ТЕСТИРОВАНИЯ
// ==========================================
const Colors = {
    Reset: "\x1b[0m",
    FgGreen: "\x1b[32m",
    FgRed: "\x1b[31m",
    FgYellow: "\x1b[33m",
    FgCyan: "\x1b[36m"
};

let passedCount = 0;
let failedCount = 0;

function runTest(testName, testFn) {
    try {
        testFn();
        console.log(`${Colors.FgGreen}✓ ${testName}${Colors.Reset}`);
        passedCount++;
    } catch (e) {
        console.log(`${Colors.FgRed}✗ ${testName}${Colors.Reset}`);
        console.error(`  Error: ${e.message}`);
        failedCount++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function assertClose(actual, expected, eps = 0.0001, msg = "") {
    if (Math.abs(actual - expected) > eps) {
        throw new Error(`${msg} Expected ${expected} (+/-${eps}), got ${actual}`);
    }
}

function assertMatrixClose(m1, m2, eps = 0.0001) {
    if (m1 === "determinant = 0" && m2 === "determinant = 0") return;
    if (typeof m1 === 'string' || typeof m2 === 'string') {
        if (m1 !== m2) throw new Error(`Expected string "${m2}", got "${m1}"`);
        return;
    }
    if (m1.length !== m2.length || m1[0].length !== m2[0].length) {
        throw new Error(`Matrix dimensions mismatch: ${m1.length}x${m1[0].length} vs ${m2.length}x${m2[0].length}`);
    }
    for (let i = 0; i < m1.length; i++) {
        for (let j = 0; j < m1[0].length; j++) {
            if (Math.abs(m1[i][j] - m2[i][j]) > eps) {
                throw new Error(`Matrix mismatch at [${i}][${j}]: got ${m1[i][j]}, expected ${m2[i][j]}`);
            }
        }
    }
}

function assertVectorClose(v1, v2, eps = 0.0001) {
    if (!v1 || !v2) throw new Error("Vector is null");
    assertClose(v1.x, v2.x, eps, "X coord");
    assertClose(v1.y, v2.y, eps, "Y coord");
    assertClose(v1.z, v2.z, eps, "Z coord");
}

console.log(`${Colors.FgCyan}=== ЗАПУСК ТЕСТОВ ===${Colors.Reset}\n`);

// ==========================================
// ЛИНЕЙНАЯ АЛГЕБРА
// ==========================================

// Тестовые данные
const Identity2 = [[1, 0], [0, 1]];
const MatA = [[1, 2], [3, 4]]; // Det = -2
const MatB = [[2, 0], [0, 2]]; // Diagonal 2
const MatSingular = [[1, 2], [2, 4]]; // Det = 0

// --- EquationAXBC ---
runTest("EquationAXBC", () => {
    // 1. Identity matrices
    assertMatrixClose(EquationAXBC(Identity2, Identity2, Identity2), Identity2);
    // 2. Singular A
    assert(EquationAXBC(MatSingular, Identity2, Identity2) === "determinant = 0");
    // 3. Singular B
    assert(EquationAXBC(Identity2, MatSingular, Identity2) === "determinant = 0");
    // 4. AXB = C => X = A^-1 * C * B^-1. Let A=I, B=I, C=MatA. Res = MatA
    assertMatrixClose(EquationAXBC(Identity2, Identity2, MatA), MatA);
    // 5. Scaling: A=[2], B=[2], C=[8]. X = 0.5 * 8 * 0.5 = 2
    assertMatrixClose(EquationAXBC([[2]], [[2]], [[8]]), [[2]]);
    // 6. Real calc check
    let res = EquationAXBC([[1, 0], [0, 2]], [[1, 0], [0, 1]], [[2, 0], [0, 2]]);
    assertMatrixClose(res, [[2, 0], [0, 1]]); // Inv([1,0;0,2])=[1,0;0,0.5] -> *[2,0;0,2] -> [2,0;0,1]
});

// --- EquationAXB (AX=B => X = A^-1 B) ---
runTest("EquationAXB", () => {
    // 1. Identity A
    assertMatrixClose(EquationAXB(Identity2, MatA), MatA);
    // 2. Singular A
    assert(EquationAXB(MatSingular, MatA) === "determinant = 0");
    // 3. Scalar A=[2], B=[4]. X=[2]
    assertMatrixClose(EquationAXB([[2]], [[4]]), [[2]]);
    // 4. A=[[0,1],[1,0]] (swap), B=[[1],[2]]. X=[[2],[1]]
    assertMatrixClose(EquationAXB([[0, 1], [1, 0]], [[1], [2]]), [[2], [1]]);
    // 5. Zero B
    assertMatrixClose(EquationAXB(MatA, [[0, 0], [0, 0]]), [[0, 0], [0, 0]]);
    // 6. 3x3 Identity
    let I3 = [[1,0,0],[0,1,0],[0,0,1]];
    assertMatrixClose(EquationAXB(I3, I3), I3);
});

// --- EquationXAB (XA=B => X = B A^-1) ---
runTest("EquationXAB", () => {
    // 1. Identity A
    assertMatrixClose(EquationXAB(Identity2, MatA), MatA);
    // 2. Singular A
    assert(EquationXAB(MatSingular, MatA) === "determinant = 0");
    // 3. Scalar
    assertMatrixClose(EquationXAB([[2]], [[4]]), [[2]]);
    // 4. Dimensions check (1x2 * 2x2)
    // X * [[1,0],[0,1]] = [[3,4]] => X = [[3,4]]
    assertMatrixClose(EquationXAB(Identity2, [[3, 4]]), [[3, 4]]);
    // 5. Non-commutative check. A=[[1,1],[0,1]]. InvA=[[1,-1],[0,1]]. B=[[1,0],[0,1]].
    // X = B * InvA = InvA
    assertMatrixClose(EquationXAB([[1, 1], [0, 1]], Identity2), [[1, -1], [0, 1]]);
    // 6. Zero matrix B
    assertMatrixClose(EquationXAB(Identity2, [[0, 0], [0, 0]]), [[0, 0], [0, 0]]);
});

// --- DiagonalMatrixByNumber ---
runTest("DiagonalMatrixByNumber", () => {
    // 1. Size 1
    assertMatrixClose(DiagonalMatrixByNumber(5, 1), [[5]]);
    // 2. Size 2, val 1
    assertMatrixClose(DiagonalMatrixByNumber(1, 2), [[1, 0], [0, 1]]);
    // 3. Size 3, val 0
    assertMatrixClose(DiagonalMatrixByNumber(0, 3), [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    // 4. Negative
    let m = DiagonalMatrixByNumber(-1, 2);
    assertClose(m[0][0], -1); assertClose(m[1][1], -1);
    // 5. Check off-diagonal
    assertClose(m[0][1], 0);
    // 6. Float
    assertClose(DiagonalMatrixByNumber(0.5, 1)[0][0], 0.5);
});

// --- MatrixPlusNumber ---
runTest("MatrixPlusNumber", () => {
    let base = [[1, 2], [3, 4]];
    // 1. Add 0
    assertMatrixClose(MatrixPlusNumber(base, 0), base);
    // 2. Add 1 (adds to diagonal) -> [[2,2],[3,5]]
    assertMatrixClose(MatrixPlusNumber(base, 1), [[2, 2], [3, 5]]);
    // 3. Add negative
    assertMatrixClose(MatrixPlusNumber(base, -1), [[0, 2], [3, 3]]);
    // 4. 1x1 Matrix
    assertMatrixClose(MatrixPlusNumber([[5]], 5), [[10]]);
    // 5. Check off-diagonal untouched
    let res = MatrixPlusNumber(base, 10);
    assertClose(res[0][1], 2);
    assertClose(res[1][0], 3);
    // 6. Float add
    assertClose(MatrixPlusNumber([[0]], 0.1)[0][0], 0.1);
});

// --- SumMatrixes ---
runTest("SumMatrixes", () => {
    let m1 = [[1, 2], [3, 4]];
    let m2 = [[10, 20], [30, 40]];
    // 1. Simple sum
    assertMatrixClose(SumMatrixes(m1, m2), [[11, 22], [33, 44]]);
    // 2. With zero matrix
    assertMatrixClose(SumMatrixes(m1, [[0, 0], [0, 0]]), m1);
    // 3. With negatives
    assertMatrixClose(SumMatrixes(m1, [[-1, -2], [-3, -4]]), [[0, 0], [0, 0]]);
    // 4. 1x1
    assertMatrixClose(SumMatrixes([[1]], [[2]]), [[3]]);
    // 5. 3x1 (Vector column)
    assertMatrixClose(SumMatrixes([[1], [2]], [[3], [4]]), [[4], [6]]);
    // 6. Decimals
    assertMatrixClose(SumMatrixes([[0.1]], [[0.2]]), [[0.3]]);
});

// --- MatrixByNumber ---
runTest("MatrixByNumber", () => {
    let m = [[1, -2], [0, 5]];
    // 1. Multiply by 2
    assertMatrixClose(MatrixByNumber(m, 2), [[2, -4], [0, 10]]);
    // 2. Multiply by 0
    assertMatrixClose(MatrixByNumber(m, 0), [[0, 0], [0, 0]]);
    // 3. Multiply by 1
    assertMatrixClose(MatrixByNumber(m, 1), m);
    // 4. Multiply by -1
    assertMatrixClose(MatrixByNumber(m, -1), [[-1, 2], [0, -5]]);
    // 5. Multiply by fractional
    assertMatrixClose(MatrixByNumber([[10]], 0.5), [[5]]);
    // 6. Original matrix immutability check
    let original = [[1]];
    MatrixByNumber(original, 5);
    assertClose(original[0][0], 1);
});

// --- MatrixLinearCombination (2A + 3B) ---
runTest("MatrixLinearCombination", () => {
    let A = [[1]];
    let B = [[2]];
    // 1. 2A + 3B = 2(1) + 3(2) = 8
    assertMatrixClose(MatrixLinearCombination(2, A, 3, B), [[8]]);
    // 2. 0A + 0B
    assertMatrixClose(MatrixLinearCombination(0, A, 0, B), [[0]]);
    // 3. 1A - 1B
    assertMatrixClose(MatrixLinearCombination(1, A, -1, B), [[-1]]);
    // 4. Larger Matrix
    let M = [[1, 2], [3, 4]];
    // 1*M + 1*M = 2M
    assertMatrixClose(MatrixLinearCombination(1, M, 1, M), [[2, 4], [6, 8]]);
    // 5. Zero coeff for one
    assertMatrixClose(MatrixLinearCombination(1, M, 0, M), M);
    // 6. Negative decimals
    assertMatrixClose(MatrixLinearCombination(0.5, [[10]], -0.5, [[2]]), [[4]]); // 5 - 1 = 4
});

// --- Transpose ---
runTest("Transpose", () => {
    // 1. Square
    assertMatrixClose(Transpose([[1, 2], [3, 4]]), [[1, 3], [2, 4]]);
    // 2. Row vector to Column
    assertMatrixClose(Transpose([[1, 2, 3]]), [[1], [2], [3]]);
    // 3. Column to Row
    assertMatrixClose(Transpose([[1], [2]]), [[1, 2]]);
    // 4. 1x1
    assertMatrixClose(Transpose([[5]]), [[5]]);
    // 5. Rectangular 2x3 -> 3x2
    assertMatrixClose(Transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
    // 6. Identity (unchanged)
    assertMatrixClose(Transpose(Identity2), Identity2);
});

// --- MatrixMultiplication ---
runTest("MatrixMultiplication", () => {
    let A = [[1, 2], [3, 4]];
    let I = [[1, 0], [0, 1]];
    // 1. Identity
    assertMatrixClose(MatrixMultiplication(A, I), A);
    // 2. Zero
    assertMatrixClose(MatrixMultiplication(A, [[0, 0], [0, 0]]), [[0, 0], [0, 0]]);
    // 3. A * A
    // [1 2][1 2] = [1*1+2*3 1*2+2*4] = [7 10]
    // [3 4][3 4]   [3*1+4*3 3*2+4*4]   [15 22]
    assertMatrixClose(MatrixMultiplication(A, A), [[7, 10], [15, 22]]);
    // 4. 1x2 * 2x1 -> 1x1
    assertMatrixClose(MatrixMultiplication([[1, 2]], [[3], [4]]), [[11]]);
    // 5. 2x1 * 1x2 -> 2x2
    assertMatrixClose(MatrixMultiplication([[1], [2]], [[3, 4]]), [[3, 4], [6, 8]]);
    // 6. Chain rule order (A*B != B*A usually)
    let B = [[0, 1], [1, 0]];
    // A*B = [2 1][4 3], B*A = [3 4][1 2]
    let AB = MatrixMultiplication(A, B);
    assertClose(AB[0][0], 2);
    let BA = MatrixMultiplication(B, A);
    assertClose(BA[0][0], 3);
});

// --- MinorFind (возвращает матрицу без строки и столбца) ---
runTest("MinorFind", () => {
    let M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    // 1. Remove 0,0 -> [[5,6],[8,9]]
    assertMatrixClose(MinorFind(M, 0, 0), [[5, 6], [8, 9]]);
    // 2. Remove 1,1 -> [[1,3],[7,9]]
    assertMatrixClose(MinorFind(M, 1, 1), [[1, 3], [7, 9]]);
    // 3. Remove 2,1 -> [[1,3],[4,6]]
    assertMatrixClose(MinorFind(M, 2, 1), [[1, 3], [4, 6]]);
    // 4. 2x2 -> 1x1
    assertMatrixClose(MinorFind([[1, 2], [3, 4]], 0, 0), [[4]]);
    // 5. Default params (0,0)
    assertMatrixClose(MinorFind([[1, 2], [3, 4]]), [[4]]);
    // 6. Check values not changed in original (implied by creation of new array)
    assertClose(M[0][0], 1);
});

// --- AlgebraicComplement ---
runTest("AlgebraicComplement", () => {
    let M = [[1, 2], [3, 4]]; // Det minor 0,0 is 4. Sign +
    // 1. pos 0,0 -> +4
    assertClose(AlgebraicComplement(M, 0, 0), 4);
    // 2. pos 0,1 -> -3
    assertClose(AlgebraicComplement(M, 0, 1), -3);
    // 3. pos 1,0 -> -2
    assertClose(AlgebraicComplement(M, 1, 0), -2);
    // 4. pos 1,1 -> +1
    assertClose(AlgebraicComplement(M, 1, 1), 1);
    // 5. 3x3 check. M=[[1,0,0],[0,1,0],[0,0,1]]. AlgComp(1,1) -> + Det([[1,0],[0,1]]) = 1
    let I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    assertClose(AlgebraicComplement(I3, 1, 1), 1);
    // 6. 3x3 sign check. AlgComp(0,1) for I3 is 0, but check logic.
    // Let M3 = [[1,2,3],[0,4,0],[0,0,5]]. AlgComp(0,1) -> - Det([[0,0],[0,5]]) = 0
    assertClose(AlgebraicComplement([[1,2,3],[0,4,0],[0,0,5]], 0, 1), 0);
});

// --- Det (Определитель) ---
runTest("Det", () => {
    // 1. 1x1
    assertClose(Det([[5]]), 5);
    // 2. 2x2 [[1,2],[3,4]] = 4-6 = -2
    assertClose(Det([[1, 2], [3, 4]]), -2);
    // 3. Identity 3x3
    assertClose(Det([[1, 0, 0], [0, 1, 0], [0, 0, 1]]), 1);
    // 4. Singular
    assertClose(Det([[1, 2], [2, 4]]), 0);
    // 5. Triangular [[2,1],[0,3]] = 6
    assertClose(Det([[2, 1], [0, 3]]), 6);
    // 6. Row of zeros
    assertClose(Det([[1, 2], [0, 0]]), 0);
});

// --- InverseMatrix ---
runTest("InverseMatrix", () => {
    // 1. Identity
    assertMatrixClose(InverseMatrix(Identity2), Identity2);
    // 2. Diagonal [[2,0],[0,4]] -> [[0.5,0],[0,0.25]]
    assertMatrixClose(InverseMatrix([[2, 0], [0, 4]]), [[0.5, 0], [0, 0.25]]);
    // 3. Singular
    assert(InverseMatrix(MatSingular) === "determinant = 0");
    // 4. 1x1
    assertMatrixClose(InverseMatrix([[5]]), [[0.2]]);
    // 5. Known 2x2. [[1,2],[3,4]] det=-2. Inv = -0.5 * [[4,-2],[-3,1]] = [[-2,1],[1.5,-0.5]]
    assertMatrixClose(InverseMatrix([[1, 2], [3, 4]]), [[-2, 1], [1.5, -0.5]]);
    // 6. Transposed relationship: Inv(A^T) = (Inv(A))^T
    let A = [[1, 2], [3, 4]];
    let InvAT = InverseMatrix(Transpose(A));
    let TInvA = Transpose(InverseMatrix(A));
    assertMatrixClose(InvAT, TInvA);
});

// --- calculateMatrixPolynomial (aA^2 + bA + cI) ---
runTest("calculateMatrixPolynomial", () => {
    let A = [[1, 0], [0, 2]]; // A^2=[1,0; 0,4]
    // 1. a=1, b=0, c=0 -> A^2
    assertMatrixClose(calculateMatrixPolynomial(1, 0, 0, A), [[1, 0], [0, 4]]);
    // 2. a=0, b=1, c=0 -> A
    assertMatrixClose(calculateMatrixPolynomial(0, 1, 0, A), A);
    // 3. a=0, b=0, c=1 -> I
    assertMatrixClose(calculateMatrixPolynomial(0, 0, 1, A), [[1, 0], [0, 1]]);
    // 4. 2A^2 + 1A + 1I = 2*[1,4] + [1,2] + [1,1] = [2,8]+[1,2]+[1,1] = [4, 11] (diag)
    assertMatrixClose(calculateMatrixPolynomial(2, 1, 1, A), [[4, 0], [0, 11]]);
    // 5. Zero params
    assertMatrixClose(calculateMatrixPolynomial(0, 0, 0, A), [[0, 0], [0, 0]]);
    // 6. 1x1 check
    assertMatrixClose(calculateMatrixPolynomial(1, 1, 1, [[2]]), [[4+2+1]]); // 7
});

// --- SolvingEquations (AX = B) ---
runTest("SolvingEquations", () => {
    // It uses InverseMatrix internally, basically EquationAXB
    // 1. I * X = I => X=I
    assertMatrixClose(SolvingEquations(Identity2, Identity2), Identity2);
    // 2. Singular
    assert(SolvingEquations(MatSingular, Identity2) === "determinant = 0");
    // 3. 2x = 10
    assertMatrixClose(SolvingEquations([[2]], [[10]]), [[5]]);
    // 4. System: x+y=3, x-y=1. Matrix [[1,1],[1,-1]] * X = [[3],[1]]. Det=-2.
    // X = [[2],[1]]
    assertMatrixClose(SolvingEquations([[1, 1], [1, -1]], [[3], [1]]), [[2], [1]]);
    // 5. Zero RHS
    assertMatrixClose(SolvingEquations(Identity2, [[0], [0]]), [[0], [0]]);
    // 6. Rectangular B (multiple systems)
    assertMatrixClose(SolvingEquations(Identity2, [[1, 2], [3, 4]]), [[1, 2], [3, 4]]);
});

// --- MatrixCreatorByIndexes (Helper) ---
runTest("MatrixCreatorByIndexes", () => {
    let M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    // 1. Single element [0,0]
    assertMatrixClose(MatrixCreatorByIndexes(M, [[0, 0]]), [[1]]);
    // 2. Submatrix 2x2 from corners? 
    // Logic in code: takes list of [row, col]. 
    // Actually, reading the code: it creates square matrix from k indices representing diagonal positions or intersection?
    // The code `MatrixCreatorByIndexes` sorts indexes and builds intersection.
    // Let's test picking indices [0,0] and [1,1] -> should extract intersection of rows 0,1 and cols 0,1 -> [[1,2],[4,5]]
    assertMatrixClose(MatrixCreatorByIndexes(M, [[0, 0], [1, 1]]), [[1, 2], [4, 5]]);
    // 3. Indices [0,0], [2,2] -> rows 0,2 cols 0,2 -> [[1,3],[7,9]]
    assertMatrixClose(MatrixCreatorByIndexes(M, [[0, 0], [2, 2]]), [[1, 3], [7, 9]]);
    // 4. Indices unsorted input
    assertMatrixClose(MatrixCreatorByIndexes(M, [[1, 1], [0, 0]]), [[1, 2], [4, 5]]);
    // 5. 3 indices -> full matrix
    assertMatrixClose(MatrixCreatorByIndexes(M, [[0, 0], [1, 1], [2, 2]]), M);
    // 6. From rectangular matrix [[1,2,3],[4,5,6]]. Indices [0,0],[1,1] -> [[1,2],[4,5]]
    assertMatrixClose(MatrixCreatorByIndexes([[1, 2, 3], [4, 5, 6]], [[0, 0], [1, 1]]), [[1, 2], [4, 5]]);
});

// --- RangMatrix ---
runTest("RangMatrix", () => {
    // 1. Identity 2x2 -> Rank 2
    assertClose(RangMatrix([[1, 0], [0, 1]]), 2);
    // 2. Zero matrix -> Rank 0
    assertClose(RangMatrix([[0, 0], [0, 0]]), 0);
    // 3. Rank 1 (proportional rows)
    assertClose(RangMatrix([[1, 2], [2, 4]]), 1);
    // 4. Rectangular 2x3 full rank
    assertClose(RangMatrix([[1, 0, 0], [0, 1, 0]]), 2);
    // 5. Rectangular 3x2 full rank
    assertClose(RangMatrix([[1, 0], [0, 1], [0, 0]]), 2);
    // 6. 3x3 Rank 2
    assertClose(RangMatrix([[1, 0, 0], [0, 1, 0], [0, 0, 0]]), 2);
});

// --- comparable / cz ---
runTest("comparable / cz", () => {
    // 1. Equal
    assert(comparable(1, 1) === true);
    // 2. Close
    assert(comparable(1, 1.00000001) === true);
    // 3. Not equal
    assert(comparable(1, 1.1) === false);
    // 4. Zero check
    assert(cz(0.00000001) === true);
    // 5. Not zero
    assert(cz(0.1) === false);
    // 6. Negative zero check
    assert(cz(-0.00000001) === true);
});

// ==========================================
// АНАЛИТИЧЕСКАЯ ГЕОМЕТРИЯ
// ==========================================

// --- Dot Class ---
runTest("Dot Class", () => {
    let d1 = new Dot(0, 0, 0);
    let d2 = new Dot(3, 4, 0);
    // 1. Constructor
    assertClose(d2.y, 4);
    // 2. Distance to Dot (3-4-5 triangle)
    assertClose(d1.DistanceToDot(d2), 5);
    // 3. Distance zero
    assertClose(d1.DistanceToDot(d1), 0);
    // 4. toArray
    let arr = d2.toArray();
    assertClose(arr[0], 3); assertClose(arr[1], 4);
    // 5. ByArray
    let d3 = Dot.ByArray([1, 2, 3]);
    assertClose(d3.z, 3);
    // 6. 3D distance
    assertClose(new Dot(1,1,1).DistanceToDot(new Dot(2,2,2)), Math.sqrt(3));
});

// --- Vector Class Basics ---
runTest("Vector Class Basics", () => {
    let v = new Vector(3, 4, 0);
    // 1. Length
    assertClose(v.length, 5);
    // 2. ByDots
    let v2 = Vector.ByDots(new Dot(1, 1, 1), new Dot(4, 5, 1)); // (3,4,0)
    assertVectorClose(v2, v);
    // 3. ByArray
    assertVectorClose(Vector.ByArray([3, 4, 0]), v);
    // 4. toArray
    assert(v.toArray()[1] === 4);
    // 5. VectorByNumber
    assertVectorClose(v.VectorByNumber(2), new Vector(6, 8, 0));
    // 6. Sum
    assertVectorClose(v.Sum(new Vector(1, 1, 1)), new Vector(4, 5, 1));
});

// --- Vector Static Math ---
runTest("Vector Static Math", () => {
    // 1. CrossByLensAndAngle (Area of parallelogram). a=2, b=3, angle=90(PI/2) -> 6
    assertClose(Vector.CrossByLensAndAngle(2, 3, Math.PI / 2), 6);
    // 2. SumVectorsByLensAndAngle (Cosine thm basically). a=3, b=4, angle=90 -> 5
    assertClose(Vector.SumVectorsByLensAndAngle(3, 4, Math.PI / 2), 5);
    // 3. AreaOfParallelogramByLengths. Formula: |ad-bc| * |v1 x v2|. 
    // Test abstract: coeff a=1,b=0, c=0,d=1 -> |1| * area.
    assertClose(Vector.AreaOfParallelogramByLengths(2, 3, Math.PI/2, 1, 0, 0, 1), 6);
    // 4. Zero angle -> 0 cross product
    assertClose(Vector.CrossByLensAndAngle(2, 3, 0), 0);
    // 5. 180 angle -> 0 cross product
    assertClose(Vector.CrossByLensAndAngle(2, 3, Math.PI), 0);
    // 6. Sum vectors collinear
    assertClose(Vector.SumVectorsByLensAndAngle(1, 1, 0), 2);
});

// --- Vector Operations (Instance) ---
runTest("Vector Operations", () => {
    let i = new Vector(1, 0, 0);
    let j = new Vector(0, 1, 0);
    let k = new Vector(0, 0, 1);
    // 1. Dot product (orthogonal)
    assertClose(i.dot(j), 0);
    // 2. Dot product (parallel)
    assertClose(i.dot(i), 1);
    // 3. Cross product i x j = k
    assertVectorClose(i.cross(j), k);
    // 4. Cross product j x i = -k
    assertVectorClose(j.cross(i), new Vector(0, 0, -1));
    // 5. Cross3Vectors (Mixed product). Vol of unit cube = 1
    assertClose(i.Cross3Vectors(j, k), 1);
    // 6. AreaTriangle (half cross len). Triangle ((1,0),(0,1),(0,0)) area 0.5
    assertClose(i.AreaTriangle(j), 0.5);
});

// --- Vector Angles & Collinearity ---
runTest("Vector Angles & Collinearity", () => {
    let v1 = new Vector(1, 0, 0);
    let v2 = new Vector(0, 1, 0);
    // 1. Angle 90 deg
    assertClose(v1.AngleBetweenVectors(v2), Math.PI / 2);
    // 2. Angle 0 deg
    assertClose(v1.AngleBetweenVectors(v1), 0);
    // 3. Angle 180 deg
    assertClose(v1.AngleBetweenVectors(new Vector(-1, 0, 0)), Math.PI);
    // 4. Collinear true
    assert(v1.Сollinear(new Vector(2, 0, 0)) === true);
    // 5. Collinear false
    assert(v1.Сollinear(v2) === false);
    // 6. Zero vector collinear check
    assert(v1.Сollinear(new Vector(0, 0, 0)) === true);
});

// --- Line Class ---
runTest("Line Class", () => {
    let l = new Line(new Vector(1, 0, 0), new Dot(0, 0, 0)); // X-axis
    // 1. ByDots
    let l2 = Line.ByDots(new Dot(0,0,0), new Dot(1,0,0));
    assertVectorClose(l2.vector, new Vector(1,0,0));
    // 2. DistanceToDot (on line)
    assertClose(l.DistanceToDot(new Dot(5, 0, 0)), 0);
    // 3. DistanceToDot (off line, (0,1,0) -> 1)
    assertClose(l.DistanceToDot(new Dot(0, 1, 0)), 1);
    // 4. DistanceToLine (Parallel lines, dist 1)
    let l_parallel = new Line(new Vector(1, 0, 0), new Dot(0, 1, 0));
    assertClose(l.DistanceToLine(l_parallel), 1);
    // 5. AngleBetweenLines (Parallel -> 0)
    assertClose(l.AngleBetweenLines(l_parallel), 0);
    // 6. AngleBetweenLines (Perpendicular -> PI/2)
    let l_perp = new Line(new Vector(0, 1, 0), new Dot(0, 0, 0));
    assertClose(l.AngleBetweenLines(l_perp), Math.PI / 2);
});

// --- Line Advanced ---
runTest("Line Advanced", () => {
    let l = new Line(new Vector(1, 0, 0), new Dot(0, 0, 0));
    // 1. ProjectPointOnLine (5, 5, 5) -> (5, 0, 0)
    let p = l.ProjectPointOnLine(new Dot(5, 5, 5));
    assertVectorClose(p, new Dot(5, 0, 0)); // Dot behaves like vector for check
    // 2. By2Planes (Intersection of x=0 and y=0 is z-axis)
    // Plane x=0: n(1,0,0) d=0. Plane y=0: n(0,1,0) d=0
    let pl1 = new Plane(1, 0, 0, 0);
    let pl2 = new Plane(0, 1, 0, 0);
    let intLine = Line.By2Planes(pl1, pl2);
    // Direction should be z (0,0,1) or (0,0,-1)
    assert(cz(intLine.vector.x) && cz(intLine.vector.y) && !cz(intLine.vector.z), "Vector is along Z");
    // 3. Skew lines distance. X-axis and line y=1, z || y (parallel to Y at height Z=1?)
    // Line 1: axis X. Line 2: at (0,0,1) dir Y. Min dist is 1.
    let skew = new Line(new Vector(0, 1, 0), new Dot(0, 0, 1));
    assertClose(l.DistanceToLine(skew), 1);
    // 4. By2Planes Parallel -> null
    assert(Line.By2Planes(pl1, new Plane(1, 0, 0, 5)) === null);
    // 5. Angle Skew lines (90 deg)
    assertClose(l.AngleBetweenLines(skew), Math.PI/2);
    // 6. Project point on line (0,0,0) -> (0,0,0)
    assertVectorClose(l.ProjectPointOnLine(new Dot(0,0,0)), new Dot(0,0,0));
});

// --- Plane Class Basics ---
runTest("Plane Class Basics", () => {
    let pl = new Plane(0, 0, 1, -5); // z = 5
    // 1. ByNormalAndDot
    let pl2 = Plane.ByNormalAndDot(new Vector(0, 0, 1), new Dot(0, 0, 5));
    assertClose(pl2.d, -5);
    // 2. By3Dots (XY plane)
    let pl3 = Plane.By3Dots(new Dot(0,0,0), new Dot(1,0,0), new Dot(0,1,0));
    // Normal is Z. D=0.
    assertClose(pl3.c, 1); assertClose(pl3.d, 0);
    // 3. InSegments (x/1 + y/1 + z/1 = 1) -> x+y+z-1=0
    let plSeg = Plane.InSegments(1, 1, 1);
    // Note: implementation calculates coefficients.
    // A=1*1=1, B=1*1=1, C=1*1=1, D=-(1*1*1)=-1
    assertClose(plSeg.a, 1); assertClose(plSeg.d, -1);
    // 4. Normal getter
    assertVectorClose(pl.normal, new Vector(0, 0, 1));
    // 5. DistanceToDot. z=5 plane to (0,0,0) -> 5
    assertClose(pl.DistanceToDot(new Dot(0, 0, 0)), 5);
    // 6. DistanceToDot on plane
    assertClose(pl.DistanceToDot(new Dot(10, 20, 5)), 0);
});

// --- Plane Interactions ---
runTest("Plane Interactions", () => {
    let xy = new Plane(0, 0, 1, 0); // z=0
    let xz = new Plane(0, 1, 0, 0); // y=0
    // 1. AngleBetweenPlanes (90 deg)
    assertClose(xy.AngleBetweenPlanes(xz), Math.PI / 2);
    // 2. Parallel planes angle 0
    assertClose(xy.AngleBetweenPlanes(new Plane(0, 0, 1, -10)), 0);
    // 3. AngleBetweenPlaneAndLine. Plane z=0, Line Z-axis -> 90 deg
    let zAxis = new Line(new Vector(0, 0, 1), new Dot(0, 0, 0));
    assertClose(xy.AngleBetweenPlaneAndLine(zAxis), Math.PI / 2);
    // 4. Line parallel to plane (angle 0)
    let xAxis = new Line(new Vector(1, 0, 0), new Dot(0, 0, 1));
    assertClose(xy.AngleBetweenPlaneAndLine(xAxis), 0);
    // 5. PointIntersectionLinePlane. Z-axis intersects z=0 at (0,0,0)
    assertVectorClose(xy.PointIntersectionLinePlane(zAxis), new Dot(0, 0, 0));
    // 6. ProjectionPointOnPlane. (0,0,5) on z=0 -> (0,0,0)
    assertVectorClose(xy.ProjectionPointOnPlane(new Dot(0, 0, 5)), new Dot(0, 0, 0));
});

// --- Plane Advanced ---
runTest("Plane Advanced", () => {
    let pl = new Plane(0, 0, 1, -10); // z=10
    // 1. DistanceToLine (Parallel line z=0) -> 10
    let l = new Line(new Vector(1, 0, 0), new Dot(0, 0, 0));
    assertClose(pl.DistanceToLine(l), 10);
    // 2. DistanceToLine (Intersecting) -> 0
    let l_int = new Line(new Vector(0, 0, 1), new Dot(0, 0, 0));
    assertClose(pl.DistanceToLine(l_int), 0);
    // 3. By2VectorsAndDot
    let plVec = Plane.By2VectorsAndDot(new Vector(1,0,0), new Vector(0,1,0), new Dot(0,0,5));
    // Should be z=5 (or parallel)
    assertClose(plVec.a, 0); assertClose(plVec.b, 0); assert(!cz(plVec.c));
    // 4. Intersection parallel line -> null
    let l_par = new Line(new Vector(1,0,0), new Dot(0,0,0));
    assert(pl.PointIntersectionLinePlane(l_par) === null);
    // 5. By3Dots collinear -> null
    assert(Plane.By3Dots(new Dot(0,0,0), new Dot(1,0,0), new Dot(2,0,0)) === null);
    // 6. InSegments zeroes -> null
    assert(Plane.InSegments(0, 1, 1) === null);
});

console.log(`\n${Colors.FgCyan}=== РЕЗУЛЬТАТЫ ===${Colors.Reset}`);
console.log(`Всего тестов (групп): ${passedCount + failedCount}`);
console.log(`${Colors.FgGreen}Успешно: ${passedCount}${Colors.Reset}`);
if (failedCount > 0) {
    console.log(`${Colors.FgRed}Провалено: ${failedCount}${Colors.Reset}`);
} else {
    console.log(`${Colors.FgGreen}Все тесты пройдены!${Colors.Reset}`);
}