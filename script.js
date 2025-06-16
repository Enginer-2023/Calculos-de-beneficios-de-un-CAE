document.addEventListener('DOMContentLoaded', () => {
    const estimatedSavingsInput = document.getElementById('estimatedSavings');
    const caeMarketPriceInput = document.getElementById('caeMarketPrice');
    const administrativeCostValueInput = document.getElementById('administrativeCostValue');
    const administrativeCostTypeSelect = document.getElementById('administrativeCostType');
    const verificationCostValueInput = document.getElementById('verificationCostValue');
    const verificationCostTypeSelect = document.getElementById('verificationCostType');
    const sujetoDelegadoShareInput = document.getElementById('sujetoDelegadoShare');
    const intermediaryCommissionInput = document.getElementById('intermediaryCommission');
    const calculateBtn = document.getElementById('calculateBtn');

    const totalCAEValueSpan = document.getElementById('totalCAEValue');
    const administrativeCostDisplaySpan = document.getElementById('administrativeCostDisplay');
    const verificationCostDisplaySpan = document.getElementById('verificationCostDisplay');
    const valueAfterAllCostsSpan = document.getElementById('valueAfterAllCosts');
    const ownerGrossSpan = document.getElementById('ownerGross');
    const intermediaryNetSpan = document.getElementById('intermediaryNet');
    const ownerNetSpan = document.getElementById('ownerNet');
    const sdBenefitDisplaySpan = document.getElementById('sdBenefitDisplay'); // Get the new SD benefit display element
    const messageBox = document.getElementById('messageBox');

    const displayMessage = (message, type = 'error') => {
        messageBox.textContent = message;
        messageBox.className = `mt-6 p-3 rounded-md ${type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`;
        messageBox.classList.remove('hidden');
    };

    const hideMessage = () => {
        messageBox.classList.add('hidden');
    };

    const calculateCAE = () => {
        hideMessage(); // Ocultar mensajes previos

        const estimatedSavings = parseFloat(estimatedSavingsInput.value);
        const caeMarketPrice = parseFloat(caeMarketPriceInput.value);
        const administrativeCostValue = parseFloat(administrativeCostValueInput.value);
        const administrativeCostType = administrativeCostTypeSelect.value;
        const verificationCostValue = parseFloat(verificationCostValueInput.value);
        const verificationCostType = verificationCostTypeSelect.value;
        const sujetoDelegadoShare = parseFloat(sujetoDelegadoShareInput.value);
        const intermediaryCommission = parseFloat(intermediaryCommissionInput.value);

        // Validaciones de entrada
        if (isNaN(estimatedSavings) || estimatedSavings < 0) {
            displayMessage('Por favor, introduce un valor válido para el Ahorro Energético Estimado (MWh/año).');
            return;
        }
        if (isNaN(caeMarketPrice) || caeMarketPrice < 0) {
            displayMessage('Por favor, introduce un valor válido para el Precio de Mercado del CAE (€/MWh).');
            return;
        }
        if (isNaN(administrativeCostValue) || administrativeCostValue < 0) {
            displayMessage('Por favor, introduce un valor válido para los Costes de Gestión Administrativa.');
            return;
        }
        if (isNaN(verificationCostValue) || verificationCostValue < 0) {
            displayMessage('Por favor, introduce un valor válido para el Coste de Entidad de Verificación.');
            return;
        }
        if (isNaN(sujetoDelegadoShare) || sujetoDelegadoShare < 0 || sujetoDelegadoShare > 100) {
            displayMessage('El Porcentaje para el Propietario debe ser un valor entre 0 y 100.');
            return;
        }
        if (isNaN(intermediaryCommission) || intermediaryCommission < 0 || intermediaryCommission > 100) {
            displayMessage('La Comisión del Intermediario debe ser un valor entre 0 y 100.');
            return;
        }

        // Cálculos
        const totalCAEValue = estimatedSavings * caeMarketPrice;

        let administrativeCost = 0;
        if (administrativeCostType === 'fixed') {
            administrativeCost = administrativeCostValue;
        } else { // percentage
            administrativeCost = totalCAEValue * (administrativeCostValue / 100);
        }

        let verificationCost = 0;
        if (verificationCostType === 'fixed') {
            verificationCost = verificationCostValue;
        } else { // percentage
            verificationCost = totalCAEValue * (verificationCostValue / 100);
        }

        const valueAfterAllCosts = totalCAEValue - administrativeCost - verificationCost;

        // Asegurarse de que el valor para reparto no sea negativo
        if (valueAfterAllCosts < 0) {
            displayMessage('La suma de los costes administrativos y de verificación supera el valor total de los CAEs generados. Ajusta los valores.', 'error');
            totalCAEValueSpan.textContent = `${totalCAEValue.toFixed(2)} €`;
            administrativeCostDisplaySpan.textContent = `${administrativeCost.toFixed(2)} €`;
            verificationCostDisplaySpan.textContent = `${verificationCost.toFixed(2)} €`;
            valueAfterAllCostsSpan.textContent = `0.00 €`;
            ownerGrossSpan.textContent = `0.00 €`;
            intermediaryNetSpan.textContent = `0.00 €`;
            ownerNetSpan.textContent = `0.00 €`;
            sdBenefitDisplaySpan.textContent = `0.00 €`; // Also reset SD benefit
            return;
        }

        const ownerGross = valueAfterAllCosts * (sujetoDelegadoShare / 100);
        const intermediaryCut = ownerGross * (intermediaryCommission / 100);
        const ownerNet = ownerGross - intermediaryCut;
        const sdBenefit = valueAfterAllCosts - ownerGross; // Calculate SD benefit

        // Mostrar resultados
        totalCAEValueSpan.textContent = `${totalCAEValue.toFixed(2)} €`;
        administrativeCostDisplaySpan.textContent = `${administrativeCost.toFixed(2)} €`;
        verificationCostDisplaySpan.textContent = `${verificationCost.toFixed(2)} €`;
        valueAfterAllCostsSpan.textContent = `${valueAfterAllCosts.toFixed(2)} €`;
        ownerGrossSpan.textContent = `${ownerGross.toFixed(2)} €`;
        intermediaryNetSpan.textContent = `${intermediaryCut.toFixed(2)} €`;
        ownerNetSpan.textContent = `${ownerNet.toFixed(2)} €`;
        sdBenefitDisplaySpan.textContent = `${sdBenefit.toFixed(2)} €`; // Display SD benefit
    };

    calculateBtn.addEventListener('click', calculateCAE);
    administrativeCostTypeSelect.addEventListener('change', calculateCAE);
    verificationCostTypeSelect.addEventListener('change', calculateCAE);

    // Realizar un cálculo inicial al cargar la página con los valores por defecto
    calculateCAE();
});
