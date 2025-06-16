document.addEventListener('DOMContentLoaded', () => {
    // Elementos de entrada
    const estimatedSavingsInput = document.getElementById('estimatedSavings');
    const caeMarketPriceInput = document.getElementById('caeMarketPrice');
    const administrativeCostValueInput = document.getElementById('administrativeCostValue');
    const administrativeCostTypeSelect = document.getElementById('administrativeCostType'); // Fixed ID
    const verificationCostValueInput = document.getElementById('verificationCostValue');
    const verificationCostTypeSelect = document.getElementById('verificationCostType');
    const calculateBtn = document.getElementById('calculateBtn');

    // Elementos de resultados
    const totalCAEValueSpan = document.getElementById('totalCAEValue');
    const totalManagementCostsSpan = document.getElementById('totalManagementCosts');
    const ownerNetSpan = document.getElementById('ownerNet');
    const messageBox = document.getElementById('messageBox');

    // Valores predeterminados para los campos eliminados
    const sujetoDelegadoShare = 80; // 80%
    const intermediaryCommission = 11.3; // 11.3%

    // Función para mostrar mensajes
    const displayMessage = (message, type = 'error') => {
        messageBox.textContent = message;
        messageBox.className = `mt-6 p-3 rounded-md ${type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`;
        messageBox.classList.remove('hidden');
    };

    // Función para ocultar mensajes
    const hideMessage = () => {
        messageBox.classList.add('hidden');
    };

    // Función de cálculo
    const calculateCAE = () => {
        hideMessage(); // Ocultar mensajes previos

        // Obtener valores de entrada
        const estimatedSavings = parseFloat(estimatedSavingsInput.value);
        const caeMarketPrice = parseFloat(caeMarketPriceInput.value);
        const administrativeCostValue = parseFloat(administrativeCostValueInput.value);
        const administrativeCostType = administrativeCostTypeSelect.value;
        const verificationCostValue = parseFloat(verificationCostValueInput.value);
        const verificationCostType = verificationCostTypeSelect.value;

        // Depuración
        console.log('Entradas:', {
            estimatedSavings,
            caeMarketPrice,
            administrativeCostValue,
            administrativeCostType,
            verificationCostValue,
            verificationCostType
        });

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

        // Cálculos
        const totalCAEValue = estimatedSavings * caeMarketPrice;

        // Calcular Costes Administrativos
        let administrativeCost = 0;
        if (administrativeCostType === 'fixed') {
            administrativeCost = administrativeCostValue;
        } else { // percentage
            administrativeCost = totalCAEValue * (administrativeCostValue / 100);
        }

        // Calcular Coste de Verificación
        let verificationCost = 0;
        if (verificationCostType === 'fixed') {
            verificationCost = verificationCostValue;
        } else { // percentage
            verificationCost = totalCAEValue * (verificationCostValue / 100);
        }

        // Calcular Valor Neto para Reparto
        const valueAfterAllCosts = totalCAEValue - administrativeCost - verificationCost;

        // Asegurarse de que el valor para reparto no sea negativo
        if (valueAfterAllCosts < 0) {
            displayMessage('La suma de los costes administrativos y de verificación supera el valor total de los CAEs generados. Ajusta los valores.', 'error');
            totalCAEValueSpan.textContent = `${totalCAEValue.toFixed(2)} €`;
            totalManagementCostsSpan.textContent = `0.00 €`;
            ownerNetSpan.textContent = `0.00 €`;
            return;
        }

        // Calcular Beneficio del Propietario (bruto)
        const ownerGross = valueAfterAllCosts * (sujetoDelegadoShare / 100);

        // Calcular Comisión del Intermediario
        const intermediaryCut = ownerGross * (intermediaryCommission / 100);

        // Calcular Beneficio del Propietario (neto)
        const ownerNet = ownerGross - intermediaryCut;

        // Calcular Beneficio del Sujeto Delegado
        const sdBenefit = valueAfterAllCosts - ownerGross;

        // Calcular Gastos Totales de Gestión
        const totalManagementCosts = administrativeCost + verificationCost + sdBenefit + intermediaryCut;

        // Depuración
        console.log('Resultados:', {
            totalCAEValue,
            administrativeCost,
            verificationCost,
            valueAfterAllCosts,
            ownerGross,
            intermediaryCut,
            ownerNet,
            sdBenefit,
            totalManagementCosts
        });

        // Mostrar resultados
        totalCAEValueSpan.textContent = `${totalCAEValue.toFixed(2)} €`;
        totalManagementCostsSpan.textContent = `${totalManagementCosts.toFixed(2)} €`;
        ownerNetSpan.textContent = `${ownerNet.toFixed(2)} €`;
    };

    // Event Listeners
    calculateBtn.addEventListener('click', calculateCAE);
    administrativeCostTypeSelect.addEventListener('change', calculateCAE);
    verificationCostTypeSelect.addEventListener('change', calculateCAE);

    // Realizar un cálculo inicial al cargar la página con los valores por defecto
    calculateCAE();
});
