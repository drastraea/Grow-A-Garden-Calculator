const growthMutations = {
    None: 1,
    Gold: 20,
    Rainbow: 50
};

const envMutations = {
    Wet: 1, Chilled: 1, Frozen: 9,
    Chocolate: 1, Moonlit: 1,
    Pollinated: 2, Bloodlit: 3,
    Plasma: 4, HoneyGlazed: 4,
    Heavenly: 4, Zombified: 24,
    Molten: 24, Shocked: 99,
    Celestial: 119, Disco: 124,
    Meteoric: 124, VoidTouched: 134,
    Dawnbound: 149, Cooked: 9,
    Windstruck: 1, Verdant: 3,
    Twisted: 4, Paradisal: 17,
    Sundried: 84, Alienlike: 99,
    Galactic: 119
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
    const friendMul = 1 + (typeof friendBoost === 'number' ? friendBoost : 0);

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
