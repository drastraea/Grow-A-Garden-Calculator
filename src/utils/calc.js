const growthMutations = {
    none: 1,
    gold: 20,
    rainbow: 50
};

const envMutations = {
    wet: 1, chilled: 1, frozen: 9,
    chocolate: 1, moonlit: 1,
    pollinated: 2, bloodlit: 3,
    plasma: 4, honeyGlazed: 4,
    heavenly: 4, baked: 9, zombified: 24,
    molten: 24, shocked: 99,
    celestial: 119, disco: 124,
    meteoric: 124, voidTouched: 134,
    dawnbound: 149
};

export function calculateValue(seed, options = {}) {
    const {
        growth = 'none',
        temperature = 'none',
        env = [],
        friendBoost = false,
        weight = 1,
        quantity = 1
    } = options;

    const growMul = growthMutations[growth] || 1;
    const tempBonus = temperature === 'none' ? 0 : envMutations[temperature] || 0;
    const envBonus = env.reduce((sum, e) => sum + (envMutations[e] || 0), 0);
    const totalEnv = tempBonus + envBonus;
    const totalMul = growMul * (1 + totalEnv);
    const friendMul = friendBoost ? 1.5 : 1;

    const valuePerUnit = Math.max(seed.minValue, seed.k * Math.pow(weight, 2));
    const finalValue = valuePerUnit * totalMul * friendMul * quantity;

    return {
        name: seed.name,
        value: Math.round(finalValue),
        totalMul,
        friendMul,
        quantity
    };
}
