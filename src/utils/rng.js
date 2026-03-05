export function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

export function mulberry32(a) {
    return function () {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function makeRng(seedStr) {
    const seed = seedStr && seedStr.trim() ? seedStr.trim() : String(Date.now());
    const a = xmur3(seed)();
    return { seed, rand: mulberry32(a) };
}

export function pick(rng, arr) {
    return arr[Math.floor(rng.rand() * arr.length)];
}

export function generateMusic(rng, chaos) {
    const isWild = (rng.rand() * 100) < chaos;
    const bpm = isWild ? Math.floor(rng.rand() * (175 - 60 + 1) + 60) : Math.floor(rng.rand() * (128 - 90 + 1) + 90);
    const keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
    const scales = isWild ? ["Major", "Minor", "Dorian", "Mixolydian", "Harmonic Minor", "Phrygian", "Lydian"] : ["Major", "Minor"];
    return `${bpm} BPM | Key: ${pick(rng, keys)} ${pick(rng, scales)}`;
}
