const input = document.querySelector("input")
const example = document.querySelector("#example")

function convertHexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) { // n1
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); // n2

    return result ? {
        r: Math.round(parseInt(result[1], 16) / 2.55) / 100,
        g: Math.round(parseInt(result[2], 16) / 2.55) / 100,
        b: Math.round(parseInt(result[3], 16) / 2.55) / 100,
    } : null;
}

input.addEventListener("change", (e) => {
    const rgb = convertHexToRgb(e.target.value); //n3

    const network = new brain.NeuralNetwork()
    network.train([
        { input: { r: 0.62, g: 0.72, b: 0.88 }, output: { light: 1 } },
        { input: { r: 0.1, g: 0.84, b: 0.72 }, output: { light: 1 } },
        { input: { r: 0.74, g: 0.78, b: 0.86 }, output: { light: 1 } },
        { input: { r: 1, g: 0.99, b: 0 }, output: { light: 1 } },
        { input: { r: 0.33, g: 0.24, b: 0.29 }, output: { dark: 1 } },
        { input: { r: 0.31, g: 0.35, b: 0.41 }, output: { dark: 1 } },
        { input: { r: 1, g: 0.42, b: 0.52 }, output: { dark: 1 } },
    ])

    const backgroundColorResult = brain.likely(rgb, network) // n4
    const resultStat = network.run({ r: 0, g: 1, b: 0.65}) // n5
    example.style.backgroundColor = e.target.value
    example.style.color = backgroundColorResult === "dark" ? "white" : "black"
})


/* COMMENTS
n1: e.g output: #008080
n2: e.g output: ["#008080", "00", "80", "80", index: 0, input: "#008080", groups: undefined]
n3: e.g output: {r: 0, g: 0.5, b: 0.5}
n4: e.g output: dark or light
n5: e.g output: {light: 0.9782578945159912, dark: 0.022038040682673454} 97% of light | 02% of dark
*/