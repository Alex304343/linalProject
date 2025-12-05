// Render all KaTeX formulas with one listener and schedule work during idle
// This avoids adding many DOMContentLoaded listeners and reduces main-thread jank
// by using requestIdleCallback when available (falls back to setTimeout).

function safeRender(tex, placeId) {
    const el = document.getElementById(placeId);
    if (!el) {
        console.warn('KaTeX target element not found:', placeId);
        return;
    }
    try {
        // Use displayMode for these formulas (matrices/equations are block content).
        // Set throwOnError:false so a bad TeX doesn't break script execution.
        katex.render(tex, el, {displayMode: true, throwOnError: false});
    } catch (err) {
        // As a last resort, show raw TeX.
        el.textContent = tex;
        console.error('KaTeX render error for', placeId, err);
    }
}
const fmt = FormatterforLATEX;
ArrFormulas = [
    [fmt.r`\begin{pmatrix}
    3 & 2 & 1 \\
    0 & 4 & 3\\
    2 & -1 & 3\\
    \end{pmatrix}
    +1
    `,
    "formula_1_1"],
    [fmt.r`\begin{pmatrix}
    3 & 2 \\
    0 & 4 \\
    2 & -1 \\
    \end{pmatrix}
    *1
    `,
    "formula_2_1"],
    [fmt.r`3A + 2B=?\\
    A = \begin{pmatrix}
    2 & 1 & -1 \\
    0 & 1 & 4 
    \end{pmatrix}, 
    \quad 
    B = \begin{pmatrix}
    1 & 0 & -2 \\
    4 & 1 & 0 
    \end{pmatrix}
    `,
    "formula_3_1"],
    [fmt.r`\begin{vmatrix}
    3 & 2 & 1 \\
    0 & 4 & 3\\
    2 & -1 & 3\\
    \end{vmatrix}
    `,
    "formula_4_1"],
    [fmt.r`\begin{vmatrix}
    3 & 2 & 1 \\
    0 & 4 & 3\\
    2 & -1 & 3\\
    \end{vmatrix}
    `,
    "formula_4_2"],
    [fmt.r`\begin{pmatrix}
    3 & 2 \\
    0 & 4 \\
    2 & -1 \\
    \end{pmatrix}
    ^{T}
    `,
    "formula_5_1"],
    [fmt.r`\begin{pmatrix}
    3 & 2 & 1 \\
    0 & 4 & 3\\
    2 & -1 & 3\\
    \end{pmatrix}
    ^{-1}
    `,
    "formula_6_1"],
    [fmt.r`\begin{pmatrix}
    3 & 2 & 1 \\
    0 & 4 & 3\\
    2 & -1 & 3\\
    \end{pmatrix}
    ^{-1}
    `,
    "formula_6_2"],
    [fmt.r`\begin{pmatrix}
    3 & 2 \\
    0 & 4 \\
    2 & -1 \\
    \end{pmatrix}
    *
    \begin{pmatrix}
    3 & 2 \\
    0 & 4 \\
    \end{pmatrix}
    `,
    "formula_7_1"],
    [fmt.r`\begin{aligned}
    f(x)&=2x^2+1x+3 \\
    f(A)&=?\\
    A&=\begin{pmatrix}
    3 & 2 & 1 \\
    0 & 4 & 3\\
    2 & -1 & 3\\
    \end{pmatrix}
    \end{aligned}
    `,
    "formula_8_1"],
    [fmt.r`A \cdot X = B\\
    A = \begin{pmatrix}
    5 & 6 \\
    -2 & -3
    \end{pmatrix}, \quad
    B = \begin{pmatrix}
    -1 & 7 & 0 \\
    1 & 2 & -6
    \end{pmatrix}
    `,
    "formula_9_1"],
    [fmt.r`X \cdot A = B\\
    A = \begin{pmatrix}
    2 & 3 \\
    2 & 4
    \end{pmatrix}, \quad
    B = \begin{pmatrix}
    -2 & 6 \\
    2 & -3 \\
    0 & -3
    \end{pmatrix}
    `,
    "formula_9_2"],
    [fmt.r`A\cdot X\cdot B = C\\
    A = \begin{pmatrix} 
    1 & 2 & 1 \\ 
    2 & 3 & 0 \\ 
    0 & 1 & -1 
    \end{pmatrix}, \quad
    B = \begin{pmatrix} 
    2 & 2 \\ 
    4 & 3 
    \end{pmatrix}, \quad
    C = \begin{pmatrix} 
    2 & 1 \\ 
    -3 & -1 \\ 
    -3 & 2 
    \end{pmatrix}
    `,
    "formula_9_3"],
    [fmt.r`A = \begin{pmatrix}
    4 & -2 & 3 & 11 \\
    7 & 8 & 9 & 10 \\
    -6 & 5 & 0 & -13
    \end{pmatrix}
    `,
    "formula_10_1"],
    [fmt.r`\left\{
    \begin{aligned}
    x_1 - 2x_2 + x_3 - 3x_4 &= 6 \\
    2x_1 - 5x_2 - 3x_3 + x_4 &= -11 \\
    5x_1 - 8x_2 + 6x_3 - 4x_4 &= 24 \\
    3x_1 - x_2 + x_3 + 12x_4 &= -4
    \end{aligned}
    \right.
    `,
    "formula_11_1"],
    [fmt.r`\left\{
    \begin{aligned}
    x_1 - 2x_2 + x_3 - 3x_4 &= 6 \\
    2x_1 - 5x_2 - 3x_3 + x_4 &= -11 \\
    5x_1 - 8x_2 + 6x_3 - 4x_4 &= 24 \\
    3x_1 - x_2 + x_3 + 12x_4 &= -4
    \end{aligned}
    \right.
    `,
    "formula_11_2"],
    [fmt.r`\left\{
    \begin{aligned}
    x_1 - 2x_2 + x_3 - 3x_4 &= 6 \\
    2x_1 - 5x_2 - 3x_3 + x_4 &= -11 \\
    5x_1 - 8x_2 + 6x_3 - 4x_4 &= 24 \\
    3x_1 - x_2 + x_3 + 12x_4 &= -4
    \end{aligned}
    \right.
    `,
    "formula_11_3"],
    [fmt.r`\left\{
    \begin{aligned}
    x_1 - 2x_2 + x_3 - 3x_4 &= 6 \\
    2x_1 - 5x_2 - 3x_3 + x_4 &= -11 \\
    5x_1 - 8x_2 + 6x_3 - 4x_4 &= 24 \\
    \end{aligned}
    \right.
    `,
    "formula_11_4"],
    [fmt.r`\vec{m} = (2, 8, 4), \quad \vec{n} = (-5, -20, -10), \quad \vec{a} = 4\vec{m} + \vec{n}, \quad \vec{b} = 3\vec{m} - 2\vec{n}.`,
    "formula_12_1"],
    [fmt.r`\left|\vec{m}\right| = 8\sqrt{3}, \; \left|\vec{n}\right| = 3, \; \angle(\vec{m}, \vec{n}) = 30^\circ, \; \vec{a} = \vec{m} + 3\vec{n}`,
    "formula_13_1"
    ],
    [fmt.r`A(5; 9; -6), B(3; 12; 0), C(2; 10; 2)`,
    "formula_14_1"
    ],
    [fmt.r`\vec{c} = 4\vec{a} + \vec{b}, \quad \vec{d} = -\vec{a} + 7\vec{b}, \quad \vec{a}(-1;1;2), \quad \vec{b}(1;3; 8)`,
    "formula_15_1"
    ],
    [fmt.r`\vec{a} = \vec{m} + 4\vec{n}, \quad \vec{b} = \vec{m} + \vec{n}, \quad \left|\vec{m}\right| = 7\sqrt{2}, \quad \left|\vec{n}\right| = 6, \quad \angle(\vec{m}, \vec{n}) = 45^\circ`,
    "formula_16_1"
    ],
    [fmt.r`A(2; 8; 3), B(-2; 3; 0), C(6; 11; 6)`,
    "formula_17_1"
    ],
    [fmt.r`\vec{a}(-7;-11;9), \vec{b}(12;9;10), \vec{c}(5;-2;19)`,
    "formula_18_1"
    ],
    [fmt.r`A(1,2,-1), B(5,5,1), C(3,8,-3), D(6,8,1)`,
    "formula_19_1"
    ],
    [fmt.r`M(2; -1; -3), \quad l:\frac{x + 1}{2} = \frac{y - 1}{0} = \frac{z + 3}{5}`,
    "formula_20_1"
    ],
    [fmt.r`\frac{x - 5}{1} = \frac{y + 4}{-3} = \frac{z - 2}{5}, \quad
    \begin{cases}
    x = -3 + 6t \\
    y = -1 + 2t \\
    z = 4
    \end{cases}`,
    "formula_21_1"
    ],
    [fmt.r`M(1;2;1), \vec{a}(2;-3;4), \vec{b}(3;2;-2)`,
    "formula_22_1"
    ],
    [fmt.r`A(2;1;3), \quad \alpha: 2x - 3y + 4z + 5 = 0`,
    "formula_23_1"
    ],
    [fmt.r`A(2, -1, 33), \quad  B(-1, 2, 5)`,
    "formula_24_1"
    ],
    [fmt.r`A(2;1;3), \quad \alpha: 2x -y + 3z = -23`,
    "formula_25_1"
    ],
    [fmt.r`A(4;-3;1), \quad \alpha: x+2y-z-3=0`,
    "formula_26_1"
    ],
    [fmt.r`A(4, 3, 10),  \quad
    l:\begin{cases}
    x = 1 + 2t \\
    y = 2 + 4t \\
    z = 3 + 5t
    \end{cases}
    `,
    "formula_27_1"
    ]
]

// Batch render once DOM is ready and schedule each render on idle (or next tick)
document.addEventListener('DOMContentLoaded', () => {
    ArrFormulas.forEach(([tex, place]) => {
        if (typeof window.requestIdleCallback === 'function') {
            requestIdleCallback(() => safeRender(tex, place));
        } else {
            // Minimal yield to allow the browser to finish initial rendering
            setTimeout(() => safeRender(tex, place), 0);
        }
    });
});
