document.addEventListener('DOMContentLoaded', () => {
    // Elementos de entrada
    const estimatedSavingsInput = document.getElementById('estimatedSavings');
    const caeMarketPriceInput = document.getElementById('caeMarketPrice');
    const administrativeCostValueInput = document.getElementById('administrativeCostValue');
    const administrativeCostTypeSelect = document.getElementById('administrativeCostType');
    const verificationCostValueInput = document.getElementById('verificationCostValue');
    const verificationCostTypeSelect = document.getElementById('verificationCostType');
    const calculateBtn = document.getElementById('calculateBtn');

    // Elementos de resultados
    const totalCAEValueSpan = document.getElementById('totalCAEValue');
    const totalManagementCostsSpan = document.getElementById('totalManagementCosts');
    const ownerNetSpan = document.getElementById('ownerNet');
    const messageBox = document.getElementById('messageBox');

    // Valores predeterminados
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
        hideMessage();

        // Obtener valores de entrada con valores por defecto si están vacíos
        const estimatedSavings = parseFloat(estimatedSavingsInput.value) || 30;
        const caeMarketPrice = parseFloat(caeMarketPriceInput.value) || 120;
        const administrativeCostValue = parseFloat(administrativeCostValueInput.value) || 1200;
        const administrativeCostType = administrativeCostTypeSelect.value;
        const verificationCostValue = parseFloat(verificationCostValueInput.value) || 1000;
        const verificationCostType = verificationCostTypeSelect.value;

        // Validaciones
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
        let administrativeCost = administrativeCostType === 'fixed' 
            ? administrativeCostValue 
            : totalCAEValue * (administrativeCostValue / 100);

        // Calcular Coste de Verificación
        let verificationCost = verificationCostType === 'fixed' 
            ? verificationCostValue 
            : totalCAEValue * (verificationCostValue / 100);

        // Calcular Valor Neto para Reparto
        const valueAfterAllCosts = totalCAEValue - administrativeCost - verificationCost;

        if (valueAfterAllCosts < 0) {
            displayMessage('La suma de los costes supera el valor total de los CAEs generados. Ajusta los valores.', 'error');
            totalCAEValueSpan.textContent = `${totalCAEValue.toFixed(2)} €`;
            totalManagementCostsSpan.textContent = `0.00 €`;
            ownerNetSpan.textContent = `0.00 €`;
            return;
        }

        // Calcular Beneficios
        const ownerGross = valueAfterAllCosts * (sujetoDelegadoShare / 100);
        const intermediaryCut = ownerGross * (intermediaryCommission / 100);
        const ownerNet = ownerGross - intermediaryCut;
        const sdBenefit = valueAfterAllCosts - ownerGross;
        const totalManagementCosts = administrativeCost + verificationCost + sdBenefit + intermediaryCut;

        // Mostrar resultados
        totalCAEValueSpan.textContent = `${totalCAEValue.toFixed(2)} €`;
        totalManagementCostsSpan.textContent = `${totalManagementCosts.toFixed(2)} €`;
        ownerNetSpan.textContent = `${ownerNet.toFixed(2)} €`;
    };

    // Event Listeners
    calculateBtn.addEventListener('click', calculateCAE);
    administrativeCostTypeSelect.addEventListener('change', calculateCAE);
    verificationCostTypeSelect.addEventListener('change', calculateCAE);
    
    // Agregar event listeners para cambios en los inputs numéricos
    estimatedSavingsInput.addEventListener('input', calculateCAE);
    caeMarketPriceInput.addEventListener('input', calculateCAE);
    administrativeCostValueInput.addEventListener('input', calculateCAE);
    verificationCostValueInput.addEventListener('input', calculateCAE);

    // Ejecutar cálculo inicial después de un breve retraso para asegurar que el DOM está listo
    setTimeout(calculateCAE, 100);
});
