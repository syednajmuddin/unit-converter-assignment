const conversionData =
 {   length: {
        Meter: 1,
        CentiMeter: 0.01,
        KiloMeter: 1000,
        Inch: 0.0254,
        Foot: 0.3048,
        Mile: 1609.34
    },
    mass: {
        Gram: 1,
        Milligram: 0.001,
        Kilogram: 1000,
        Pound: 453.592,
        Ounce: 28.3495
    },
    digital: {
        Byte: 1,
        Bit: 0.125,
        Kilobyte: 1024,
        Megabyte: 1048576,
        Gigabyte: 1073741824,
        Terabyte: 1099511627776
    },
    temperature: {
        Celsius: 'C',
        Fahrenheit: 'F',
        Kelvin: 'K'
    }
};
const categorySelect = document.getElementById('category-select');
const primaryInput = document.getElementById('primary-val');
const secondaryInput = document.getElementById('secondary-val');
const primaryUnitSelect = document.getElementById('primary-unit');
const secondaryUnitSelect = document.getElementById('secondary-unit');
const dynamicScaleText = document.getElementById('dynamic-scale-text');
function setupDropdowns() {
    const category = categorySelect.value;
    const units = Object.keys(conversionData[category]);
    primaryUnitSelect.innerHTML = '';
    secondaryUnitSelect.innerHTML = '';
    units.forEach((unit, index) => {
        const opt1 = new Option(unit, unit);
        const opt2 = new Option(unit, unit);
        primaryUnitSelect.add(opt1);
        secondaryUnitSelect.add(opt2);
    });
    if (units.length > 1) {
        secondaryUnitSelect.selectedIndex = 1;
    }
    executeCalculation('primary');
}
function executeCalculation(triggerOrigin) {
    const category = categorySelect.value;
    const fromUnit = primaryUnitSelect.value;
    const toUnit = secondaryUnitSelect.value;
    if (!fromUnit || !toUnit) return;
    if (category === 'temperature') {
        convertTemp(triggerOrigin, fromUnit, toUnit);
        return;
    }
    const mapRef = conversionData[category];
    if (triggerOrigin === 'primary') {
        const inputVal = parseFloat(primaryInput.value) || 0;
        const baseValue = inputVal * mapRef[fromUnit]; // Base mein badla
        const result = baseValue / mapRef[toUnit];     // Target mein badla
        secondaryInput.value = Number(result.toFixed(5)); // Max 5 decimal digits
    } else {
        const inputVal = parseFloat(secondaryInput.value) || 0;
        const baseValue = inputVal * mapRef[toUnit];   // Base mein badla
        const result = baseValue / mapRef[fromUnit];   // Target mein badla
        primaryInput.value = Number(result.toFixed(5));
    }
    updateFooter(category, fromUnit, toUnit);
}
function convertTemp(origin, from, to) {
    let inputVal, result;
    if (origin === 'primary') {
        inputVal = parseFloat(primaryInput.value);
        if (isNaN(inputVal)) { secondaryInput.value = ''; return; }
        let celsius = inputVal;
        if (from === 'Fahrenheit') celsius = (inputVal - 32) * 5 / 9;
        if (from === 'Kelvin') celsius = inputVal - 273.15;
        if (to === 'Celsius') result = celsius;
        if (to === 'Fahrenheit') result = (celsius * 9 / 5) + 32;
        if (to === 'Kelvin') result = celsius + 273.15;
        secondaryInput.value = Number(result.toFixed(2));
    } else {
        inputVal = parseFloat(secondaryInput.value);
        if (isNaN(inputVal)) { primaryInput.value = ''; return; }

        let celsius = inputVal;
        if (to === 'Fahrenheit') celsius = (inputVal - 32) * 5 / 9;
        if (to === 'Kelvin') celsius = inputVal - 273.15;

        if (from === 'Celsius') result = celsius;
        if (from === 'Fahrenheit') result = (celsius * 9 / 5) + 32;
        if (from === 'Kelvin') result = celsius + 273.15;

        primaryInput.value = Number(result.toFixed(2));
    }

    dynamicScaleText.textContent = `Temperature Conversion Context Enabled`;
}
function updateFooter(category, from, to) {
    const mapRef = conversionData[category];
    const conversionFactor = mapRef[from] / mapRef[to];

    if (category === 'length') {
        dynamicScaleText.textContent = `multiply the length value by ${Number(conversionFactor.toFixed(4))}`;
    } else if (category === 'mass') {
        dynamicScaleText.textContent = `multiply the mass value by ${Number(conversionFactor.toFixed(4))}`;
    } else {
        dynamicScaleText.textContent = `1 ${from} = ${Number(conversionFactor.toFixed(4))} ${to}`;
    }
}
categorySelect.addEventListener('change', setupDropdowns);
primaryUnitSelect.addEventListener('change', () => executeCalculation('primary'));
secondaryUnitSelect.addEventListener('change', () => executeCalculation('primary'));
primaryInput.addEventListener('input', () => executeCalculation('primary'));
secondaryInput.addEventListener('input', () => executeCalculation('secondary'));
setupDropdowns();