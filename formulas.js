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

ArrFormulas = [
    [`\\begin{pmatrix}
    3 & 2 & 1 \\\\
    0 & 4 & 3\\\\
    2 & -1 & 3\\\\
    \\end{pmatrix}
    +1
    `,
    "formula_1_1"],
    [`\\begin{pmatrix}
    3 & 2 \\\\
    0 & 4 \\\\
    2 & -1 \\\\
    \\end{pmatrix}
    *1
    `,
    "formula_2_1"],
    [`3A + 2B=?\\\\
    A = \\begin{pmatrix}
    2 & 1 & -1 \\\\
    0 & 1 & 4 
    \\end{pmatrix}, 
    \\quad 
    B = \\begin{pmatrix}
    1 & 0 & -2 \\\\
    4 & 1 & 0 
    \\end{pmatrix}
    `,
    "formula_3_1"],
    [`\\begin{vmatrix}
    3 & 2 & 1 \\\\
    0 & 4 & 3\\\\
    2 & -1 & 3\\\\
    \\end{vmatrix}
    `,
    "formula_4_1"],
    [`\\begin{vmatrix}
    3 & 2 & 1 \\\\
    0 & 4 & 3\\\\
    2 & -1 & 3\\\\
    \\end{vmatrix}
    `,
    "formula_4_2"],
    [`\\begin{pmatrix}
    3 & 2 \\\\
    0 & 4 \\\\
    2 & -1 \\\\
    \\end{pmatrix}
    ^{T}
    `,
    "formula_5_1"],
    [`\\begin{pmatrix}
    3 & 2 & 1 \\\\
    0 & 4 & 3\\\\
    2 & -1 & 3\\\\
    \\end{pmatrix}
    ^{-1}
    `,
    "formula_6_1"],
    [`\\begin{pmatrix}
    3 & 2 & 1 \\\\
    0 & 4 & 3\\\\
    2 & -1 & 3\\\\
    \\end{pmatrix}
    ^{-1}
    `,
    "formula_6_2"],
    [`\\begin{pmatrix}
    3 & 2 \\\\
    0 & 4 \\\\
    2 & -1 \\\\
    \\end{pmatrix}
    *
    \\begin{pmatrix}
    3 & 2 \\\\
    0 & 4 \\\\
    \\end{pmatrix}
    `,
    "formula_7_1"],
    [`\\begin{aligned}
    f(x)&=2x^2+1x+3 \\\\
    f(A)&=?\\\\
    A&=\\begin{pmatrix}
    3 & 2 & 1 \\\\
    0 & 4 & 3\\\\
    2 & -1 & 3\\\\
    \\end{pmatrix}
    \\end{aligned}
    `,
    "formula_8_1"],
    [`A \\cdot X = B\\\\
    A = \\begin{pmatrix}
    5 & 6 \\\\
    -2 & -3
    \\end{pmatrix}, \\quad
    B = \\begin{pmatrix}
    -1 & 7 & 0 \\\\
    1 & 2 & -6
    \\end{pmatrix}
    `,
    "formula_9_1"],
    [`X \\cdot A = B\\\\
    A = \\begin{pmatrix}
    2 & 3 \\\\
    2 & 4
    \\end{pmatrix}, \\quad
    B = \\begin{pmatrix}
    -2 & 6 \\\\
    2 & -3 \\\\
    0 & -3
    \\end{pmatrix}
    `,
    "formula_9_2"],
    [`A\\cdot X\\cdot B = C\\\\
    A = \\begin{pmatrix} 
    1 & 2 & 1 \\\\ 
    2 & 3 & 0 \\\\ 
    0 & 1 & -1 
    \\end{pmatrix}, \\quad
    B = \\begin{pmatrix} 
    2 & 2 \\\\ 
    4 & 3 
    \\end{pmatrix}, \\quad
    C = \\begin{pmatrix} 
    2 & 1 \\\\ 
    -3 & -1 \\\\ 
    -3 & 2 
    \\end{pmatrix}
    `,
    "formula_9_3"],
    [`A = \\begin{pmatrix}
    4 & -2 & 3 & 11 \\\\
    7 & 8 & 9 & 10 \\\\
    -6 & 5 & 0 & -13
    \\end{pmatrix}
    `,
    "formula_10_1"],
    [`\\left\\{
    \\begin{aligned}
    x_1 - 2x_2 + x_3 - 3x_4 &= 6 \\\\
    2x_1 - 5x_2 - 3x_3 + x_4 &= -11 \\\\
    5x_1 - 8x_2 + 6x_3 - 4x_4 &= 24 \\\\
    3x_1 - x_2 + x_3 + 12x_4 &= -4
    \\end{aligned}
    \\right.
    `,
    "formula_11_1"],
    [`\\left\\{
    \\begin{aligned}
    x_1 - 2x_2 + x_3 - 3x_4 &= 6 \\\\
    2x_1 - 5x_2 - 3x_3 + x_4 &= -11 \\\\
    5x_1 - 8x_2 + 6x_3 - 4x_4 &= 24 \\\\
    3x_1 - x_2 + x_3 + 12x_4 &= -4
    \\end{aligned}
    \\right.
    `,
    "formula_11_2"],
    [`\\left\\{
    \\begin{aligned}
    x_1 - 2x_2 + x_3 - 3x_4 &= 6 \\\\
    2x_1 - 5x_2 - 3x_3 + x_4 &= -11 \\\\
    5x_1 - 8x_2 + 6x_3 - 4x_4 &= 24 \\\\
    3x_1 - x_2 + x_3 + 12x_4 &= -4
    \\end{aligned}
    \\right.
    `,
    "formula_11_3"],
    [`\\left\\{
    \\begin{aligned}
    x_1 - 2x_2 + x_3 - 3x_4 &= 6 \\\\
    2x_1 - 5x_2 - 3x_3 + x_4 &= -11 \\\\
    5x_1 - 8x_2 + 6x_3 - 4x_4 &= 24 \\\\
    \\end{aligned}
    \\right.
    `,
    "formula_11_4"],
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
