/**
 * Lógica para determinar el tipo de temporada
 */
export const getSeasonType = (date, holidayList = []) => {
    const day = new Date(date);
    const month = day.getMonth() + 1;
    const dayOfMonth = day.getDate();

    // Convertimos la fecha actual a string YYYY-MM-DD para comparar con festivos
    const dateString = day.toISOString().split('T')[0];

    // 1. TEMPORADA ALTA (Diciembre y mitad de Enero)
    if ((month === 12 && dayOfMonth >= 15) || (month === 1 && dayOfMonth <= 15)) {
        return 'precio_temporada_alta';
    }

    // 2. SEMANA SANTA (Rango dinámico)
    // Ejemplo 2026: 29 de Marzo al 5 de Abril
    const startSS = '2026-03-29';
    const endSS = '2026-04-05';
    if (dateString >= startSS && dateString <= endSS) {
        return 'precio_semana_santa';
    }

    // 3. SEMANA DE URIBE (Octubre)
    if (month === 10 && dayOfMonth >= 5 && dayOfMonth <= 12) {
        return 'precio_semana_uribe';
    }

    // 4. FESTIVOS OFICIALES
    // Solo si la fecha está en la lista de festivos de ese año
    if (holidayList.includes(dateString)) {
        return 'precio_festivos';
    }

    // 5. POR DEFECTO: TEMPORADA BAJA
    return 'precio_temporada_baja';
};

/**
 * Calculador de Presupuesto
 */
export const calculateTotalReservation = (property, checkIn, checkOut, guests, includeCleaning = false) => {
    let totalNightsPrice = 0;
    let currentDate = new Date(checkIn);
    const end = new Date(checkOut);

    // Lista de festivos de Colombia (esto debería venir de una base de datos o API)
    const holidayList = ['2026-03-23', '2026-05-01', '2026-05-18']; // Ejemplo

    while (currentDate < end) {
        const season = getSeasonType(currentDate, holidayList);
        const pricePerNight = property[season] || property['precio_temporada_baja'];

        totalNightsPrice += Number(pricePerNight);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const wristbandFee = Number(property.costo_manilla || 0) * guests;
    const cleaningFee = includeCleaning ? Number(property.costo_aseo || 0) : 0;

    return {
        subtotalNoches: totalNightsPrice,
        manillas: wristbandFee,
        aseo: cleaningFee,
        total: totalNightsPrice + wristbandFee + cleaningFee
    };
};