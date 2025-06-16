import { useState, useEffect } from 'react';
import { calculateValue } from './utils/calc';
import Select from 'react-select';

const growthOptions = ['None', 'Gold', 'Rainbow'];
const tempOptions = ['None', 'Wet', 'Chilled', 'Frozen'];
const envOptions = [
    'Chocolate', 'Moonlit', 'Pollinated', 'Bloodlit',
    'Plasma', 'HoneyGlazed', 'Heavenly', 'Baked', 'Zombified',
    'Molten', 'Shocked', 'Celestial', 'Disco', 'Meteoric',
    'VoidTouched', 'Dawnbound'
];

export default function GrowCalculator() {
    const [seeds, setSeeds] = useState([]);
    const [selectedSeed, setSelectedSeed] = useState(null);
    const [growth, setGrowth] = useState('none');
    const [temperature, setTemperature] = useState('none');
    const [mutations, setMutations] = useState([]);
    const [friendBoost, setFriendBoost] = useState(0);
    const [weight, setWeight] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [result, setResult] = useState(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        fetch('/data/seeds.json')
            .then(res => res.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setSeeds(sorted);
                setSelectedSeed(sorted[0]);
            });
    }, []);

    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        return () => observer.disconnect();
    }, []);

    const toggleMutation = (mut) => {
        setMutations(prev =>
            prev.includes(mut)
                ? prev.filter(m => m !== mut)
                : [...prev, mut]
        );
    };

    useEffect(() => {
        if (!selectedSeed) return;
        const res = calculateValue(selectedSeed, {
            growth,
            temperature,
            env: mutations,
            friendBoost,
            weight: parseFloat(weight),
            quantity: parseInt(quantity)
        });
        setResult(res);
    }, [selectedSeed, growth, temperature, mutations, friendBoost, weight, quantity]);

    return (
        <div className="p-4 max-w-xl mx-auto space-y-4 bg-white dark:bg-gray-800 rounded shadow">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Check your crop</h1>

            <div>
                <label className="font-semibold block mb-2 text-gray-700 dark:text-white">Seed:</label>
                <Select
                    options={seeds.map(seed => ({ value: seed, label: seed.name }))}
                    value={selectedSeed ? { value: selectedSeed, label: selectedSeed.name } : null}
                    onChange={option => {
                        setSelectedSeed(option.value);
                        setWeight(option.value.minWeight);
                    }}
                    classNamePrefix="react-select"
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: isDark ? '#1f2937' : '#fff',
                            borderColor: isDark ? '#4b5563' : '#ccc',
                            color: isDark ? '#fff' : '#000'
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: isDark ? '#374151' : '#fff',
                            color: isDark ? '#fff' : '#000'
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                                ? (isDark ? '#4b5563' : '#f3f4f6')
                                : (isDark ? '#374151' : '#fff'),
                            color: isDark ? '#fff' : '#000'
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: isDark ? '#fff' : '#000'
                        }),
                        input: (base) => ({
                            ...base,
                            color: isDark ? '#fff' : '#000'
                        })
                    }}
                />
            </div>

            <div>
                <label className="font-semibold block mb-1 text-gray-700 dark:text-white">Growth Mutation:</label>
                <select className="w-full p-2 rounded border bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600" value={growth} onChange={e => setGrowth(e.target.value)}>
                    {growthOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            <div>
                <label className="font-semibold block mb-1 text-gray-700 dark:text-white">Temperature Mutation:</label>
                <select className="w-full p-2 rounded border bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600" value={temperature} onChange={e => setTemperature(e.target.value)}>
                    {tempOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <div>
                <label className="font-semibold block mb-2 text-gray-700 dark:text-white">Environmental Mutations:</label>
                <div className="flex flex-wrap gap-2">
                    {envOptions.map(env => (
                        <button
                            key={env}
                            className={`px-3 py-1 rounded text-sm transition-colors
                ${mutations.includes(env)
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600'}
              `}
                            onClick={() => toggleMutation(env)}
                        >
                            {env}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="font-semibold block mb-1 text-gray-700 dark:text-white">Weight (kg):</label>
                    <input
                        type="number"
                        className="w-full p-2 rounded border bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <label className="font-semibold block mb-1 text-gray-700 dark:text-white">Quantity:</label>
                    <input
                        type="number"
                        className="w-full p-2 rounded border bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="font-semibold block mb-2">
                    Friend Boost: {Math.round(friendBoost * 100)}%
                </label>
                <input
                    type="range"
                    min={0}
                    max={0.5}
                    step={0.1}
                    value={friendBoost}
                    onChange={e => setFriendBoost(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>


            {result && (
                <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Total Value :</h3>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">{result.name}</p>
                    <p className="text-center text-3xl">
                        <span
                            className={`font-bold ${growth === 'rainbow'
                                    ? 'bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent'
                                    : growth === 'gold'
                                        ? 'text-yellow-500'
                                        : 'text-green-600'
                                }`}
                        >
                            {result.value.toLocaleString()}
                        </span>
                    </p>
                    <p className="text-center text-gray-800 dark:text-gray-300">Multiplier: x{result.totalMul}</p>
                </div>
            )}

            <div>
                <p className="text-center font-light">buy me coffee <a className="font-semibold text-indigo-700 dark:text-indigo-300" href="https://mayicu.id/donate" target="_blank">here!</a> </p>
            </div>
        </div>
    );
}
