import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CORE_GENRES, FLAVORS, POVS, EMOTIONS,
  PREMISES, EAR_CANDIES, ENERGY_CONTOURS, DELIVERIES,
  VOCAL_ARCHETYPES, TWISTS,
  STRUCTURES, TITLE_ADJ, TITLE_NOUNS, INST,
  GENRE_COLORS
} from './utils/constants';
import { makeRng, pick, generateMusic } from './utils/rng';
import EditableKeyValue from './components/EditableKeyValue';
import EditableStep from './components/EditableStep';
import LockButton from './components/LockButton';
import ToggleButton from './components/ToggleButton';

const App = () => {
  const [seedInput, setSeedInput] = useState("");
  const [chaos, setChaos] = useState(20);
  const [batch, setBatch] = useState([]);
  const [batchIdx, setBatchIdx] = useState(0);
  const [saves, setSaves] = useState([]);
  const [toastMsg, setToastMsg] = useState({ text: "", visible: false });

  const currentBp = batch[batchIdx] || null;

  const [locks, setLocks] = useState({
    title: false, premise: false, genre: false, flavor: false, music: false, inst: false, earCandy: false, pov: false, vibe: false, energy: false,
    delivery: false, vocal: false,
    twist: false, structure: false
  });

  const [enabled, setEnabled] = useState({
    title: true, premise: true, genre: true, flavor: true, music: true, inst: true, earCandy: true, pov: true, vibe: true, energy: true,
    delivery: true, vocal: true,
    twist: true, structure: true
  });

  const toggleLock = (key) => setLocks(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleEnable = (key) => setEnabled(prev => ({ ...prev, [key]: !prev[key] }));

  const showToast = (msg) => {
    setToastMsg({ text: msg, visible: true });
    setTimeout(() => setToastMsg(prev => ({ ...prev, visible: false })), 2000);
  };

  const handleOverrideSave = (key, customText) => {
    const newBatch = [...batch];
    newBatch[batchIdx] = {
      ...currentBp,
      overrides: { ...(currentBp.overrides || {}), [key]: customText }
    };
    setBatch(newBatch);
    setLocks(prev => ({ ...prev, [key]: true }));
    showToast("Custom edit locked! 🔒✨");
  };

  const handleStructureStepEdit = (stepIndex, newDesc) => {
    const newSteps = [...currentBp.structure.steps];
    newSteps[stepIndex] = [newSteps[stepIndex][0], newSteps[stepIndex][1], newDesc];

    const newBatch = [...batch];
    newBatch[batchIdx] = {
      ...currentBp,
      structure: { ...currentBp.structure, steps: newSteps }
    };
    setBatch(newBatch);
    setLocks(prev => ({ ...prev, structure: true }));
    showToast("Structure edit locked! 🔒✨");
  };

  // Dynamic Color Sync
  useEffect(() => {
    if (currentBp && currentBp.genre) {
      const colors = GENRE_COLORS[currentBp.genre] || { main: "#b38cff", glow: "rgba(179, 140, 255, 0.2)" };
      document.documentElement.style.setProperty('--accent-purple', colors.main);
      document.documentElement.style.setProperty('--glow-purple', colors.glow);
    }
  }, [currentBp]);



  const handleGenerate = (count = 1, isInitial = false) => {
    const { seed: baseSeed, rand: baseRand } = makeRng(seedInput);
    const newBatchItems = [];

    for (let i = 0; i < count; i++) {
      const currentSeed = count > 1 ? `${baseSeed}-${i + 1}` : baseSeed;
      const { seed, rand } = makeRng(currentSeed);
      const rng = { seed, rand };

      const shouldLock = (key) => !isInitial && currentBp && locks[key];

      const activeOverrides = {};
      if (!isInitial && currentBp && currentBp.overrides) {
        Object.keys(currentBp.overrides).forEach(k => {
          if (locks[k]) activeOverrides[k] = currentBp.overrides[k];
        });
      }

      const isCohesive = (rng.rand() * 100) > chaos;

      const safeCoreGenres = CORE_GENRES;
      const safeFlavors = FLAVORS.slice(0, 30);
      let primaryGenre = pick(rng, CORE_GENRES);
      let secondaryGenre = isCohesive ? pick(rng, safeFlavors) : pick(rng, FLAVORS);

      const newBp = {
        seed: seed,
        chaos: chaos,
        mode: chaos <= 25 ? "Studio" : chaos <= 60 ? "Hybrid" : "Experimental",
        createdAt: new Date().toISOString(),

        title: shouldLock('title') ? currentBp.title : `Project: ${pick(rng, TITLE_ADJ)} ${pick(rng, TITLE_NOUNS)}`,
        premise: shouldLock('premise') ? currentBp.premise : pick(rng, PREMISES),
        genre: shouldLock('genre') ? currentBp.genre : primaryGenre,
        flavor: shouldLock('flavor') ? currentBp.flavor : secondaryGenre,
        music: shouldLock('music') ? currentBp.music : generateMusic(rng, chaos),
        inst: shouldLock('inst') ? currentBp.inst : pick(rng, INST),
        earCandy: shouldLock('earCandy') ? currentBp.earCandy : pick(rng, EAR_CANDIES),

        pov: shouldLock('pov') ? currentBp.pov : pick(rng, POVS),
        vibe: shouldLock('vibe') ? currentBp.vibe : pick(rng, EMOTIONS),
        energy: shouldLock('energy') ? currentBp.energy : pick(rng, ENERGY_CONTOURS),

        delivery: shouldLock('delivery') ? currentBp.delivery : pick(rng, DELIVERIES),
        vocal: shouldLock('vocal') ? currentBp.vocal : pick(rng, VOCAL_ARCHETYPES),

        structure: shouldLock('structure') ? currentBp.structure : pick(rng, STRUCTURES),
        twist: shouldLock('twist') ? currentBp.twist : pick(rng, TWISTS),

        overrides: activeOverrides
      };
      newBatchItems.push(newBp);
    }

    setBatch(newBatchItems);
    setBatchIdx(0);
  };

  useEffect(() => {
    try {
      const loaded = JSON.parse(localStorage.getItem("lyricalchemy_saves_v11") || "[]");
      setSaves(loaded);
    } catch (e) { console.error("Could not load saves", e); }
    setTimeout(() => handleGenerate(true), 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (!currentBp) return showToast("Generate first! 🎲");
    const newSaves = [currentBp, ...saves];
    setSaves(newSaves);
    localStorage.setItem("lyricalchemy_saves_v11", JSON.stringify(newSaves));
    showToast("Saved to Studio ✨");
  };

  const handleLoad = (bp) => {
    setBatch([bp]);
    setBatchIdx(0);
    setSeedInput(bp.seed);
    setChaos(bp.chaos);
    showToast("Loaded blueprint 📥");
  };

  const handleCopyPrompt = async () => {
    if (!currentBp) return showToast("Generate first! 🎲");
    const title = getVal('title', currentBp.title);
    const genre = getVal('genre', currentBp.genre);
    const flavor = getVal('flavor', currentBp.flavor);
    const tone = getVal('vibe', currentBp.vibe);
    const vocal = currentBp.vocal.name;
    const premise = getVal('premise', currentBp.premise);
    const delivery = getVal('delivery', currentBp.delivery);
    const twist = getVal('twist', currentBp.twist);

    const prompt = `Write a song titled "${title}". 
Genre: ${genre} (${flavor} style). 
Emotional Core: ${tone}. 
Vocal Style: ${vocal}.
Lyrical Delivery: ${delivery}.
Core Premise: ${premise}.
Plot Twist to include: ${twist}.
Structure: ${currentBp.structure.name}.
Follow the instructions for each section:
${currentBp.structure.steps.map(s => `- ${s[0]} (${s[1]}): ${s[2]}`).join('\n')}
Make the lyrics evocative, avoid cliches, and focus on concrete imagery.`;

    try {
      await navigator.clipboard.writeText(prompt);
      showToast("Copied Master Prompt 🧠");
    } catch (err) {
      showToast("Copy failed! ❌");
    }
  };

  const handleCopyJson = async () => {
    if (!currentBp) return showToast("Generate first! 🎲");
    const exportData = {};
    Object.keys(currentBp).forEach(key => {
      if (enabled[key] !== false) {
        exportData[key] = currentBp[key];
      }
    });
    try {
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      showToast("Copied JSON 📋");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showToast("Copy failed! ❌");
    }
  };

  const formatVocal = (v) => {
    if (!v || !v.name) return String(v);
    return `${v.name}\nVerse: ${v.verse}\nChorus: ${v.chorus}\nBridge: ${v.bridge}`;
  };

  const handleCopyText = async () => {
    if (!currentBp) return showToast("Generate first! 🎲");
    let text = `Blueprint: ${getVal('title', currentBp.title) || currentBp.seed}\n\n`;

    if (enabled.premise !== false) text += `Premise: ${getVal('premise', currentBp.premise)}\n`;
    if (enabled.genre !== false) text += `Main Genre: ${getVal('genre', currentBp.genre)}\n`;
    if (enabled.flavor !== false) text += `Flavor: ${getVal('flavor', currentBp.flavor)}\n`;
    if (enabled.music !== false) text += `BPM, Key & Scale: ${getVal('music', currentBp.music)}\n`;
    if (enabled.inst !== false) text += `Instrumentation Palette: ${getVal('inst', currentBp.inst)}\n`;
    if (enabled.earCandy !== false) text += `Signature Sound (Ear Candy): ${getVal('earCandy', currentBp.earCandy)}\n`;
    if (enabled.pov !== false) text += `Narrative POV: ${getVal('pov', currentBp.pov)}\n`;
    if (enabled.vibe !== false) text += `Emotional Core: ${getVal('vibe', currentBp.vibe)}\n`;
    if (enabled.energy !== false) text += `Energy Contour: ${getVal('energy', currentBp.energy)}\n`;
    if (enabled.delivery !== false) text += `Lyrical Delivery: ${getVal('delivery', currentBp.delivery)}\n`;
    if (enabled.vocal !== false) text += `Vocal Tone: ${getVal('vocal', formatVocal(currentBp.vocal))}\n`;
    if (enabled.twist !== false) text += `Plot Twist: ${getVal('twist', currentBp.twist)}\n`;

    if (enabled.structure !== false) {
      text += `\nStructure: ${currentBp.structure.name}\n`;
      currentBp.structure.steps.forEach(step => {
        text += `- ${step[0]} (${step[1]}): ${step[2]}\n`;
      });
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied Text 📋");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showToast("Copy failed! ❌");
    }
  };

  const handleLockAll = () => {
    const newLocks = {};
    Object.keys(locks).forEach(k => newLocks[k] = true);
    setLocks(newLocks);
    showToast("Everything Locked 🔒");
  };

  const handleUnlockAll = () => {
    const newLocks = {};
    Object.keys(locks).forEach(k => newLocks[k] = false);
    setLocks(newLocks);
    showToast("Everything Unlocked 🔓");
  };

  const getVal = (key, defaultVal) => {
    if (currentBp && currentBp.overrides && currentBp.overrides[key] !== undefined) {
      return currentBp.overrides[key];
    }
    return defaultVal;
  };

  return (
    <div className="wrap">
      <header>
        <div className="brand">
          <h1>LyricAlchemy ✨</h1>
          <p>The Final Boss. All arrays verified, unlocked, and firing at max capacity.</p>
        </div>
        <div className="pillrow">
          <div className="pill">Seed: <b>{currentBp ? currentBp.seed : "—"}</b></div>
          <div className="pill">Mode: <b>{currentBp ? currentBp.mode : "—"}</b></div>
        </div>
      </header>

      <div className="grid">
        <section className="glass-panel">
          <div className="card-hd">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2>Studio Generator</h2>
              {batch.length > 1 && (
                <div className="pill" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-purple)' }}>
                  <button className="lock-btn" onClick={() => setBatchIdx(prev => Math.max(0, prev - 1))} disabled={batchIdx === 0}>◀</button>
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{batchIdx + 1} / {batch.length}</span>
                  <button className="lock-btn" onClick={() => setBatchIdx(prev => Math.min(batch.length - 1, prev + 1))} disabled={batchIdx === batch.length - 1}>▶</button>
                </div>
              )}
            </div>
            <div className="row">
              <button className="primary" onClick={() => handleGenerate(1, false)}>🎲 Generate</button>
              <button className="primary" style={{ background: 'linear-gradient(135deg, var(--accent-gold), #ffb703)', color: '#000' }} onClick={() => handleGenerate(3, false)}>🎲 Gen 3</button>
              <button className="small" onClick={handleSave}>💾 Save</button>
              <button className="small" onClick={handleLockAll}>🔒 Lock All</button>
              <button className="small" onClick={handleUnlockAll}>🔓 Unlock All</button>
              <button className="small" style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }} onClick={handleCopyPrompt}>🧠 Copy Prompt</button>
              <button className="small" onClick={handleCopyJson}>📋 JSON</button>
              <button className="small" onClick={handleCopyText}>📝 Text</button>
            </div>
          </div>

          <div className="card-bd" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '30px' }}>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <label>
                <span>Seed (Repeatable Base)</span>
                <input type="text" value={seedInput} onChange={(e) => setSeedInput(e.target.value)} placeholder="Leave blank for random magic..." />
              </label>
              <label>
                <span>Chaos Factor: <b>{chaos}</b></span>
                <input type="range" min="0" max="100" value={chaos} onChange={(e) => setChaos(Number(e.target.value))} />
              </label>
            </div>
          </div>

          {currentBp && (
            <motion.div
              className="card-bd"
              style={{ paddingTop: 0 }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              key={currentBp.seed} // Forces re-animation on new generate
            >

              <div className="blueprint-section" style={{ borderColor: 'var(--accent-purple)', background: 'rgba(179,140,255,0.05)' }}>
                <h3 style={{ color: 'var(--text)' }}>The Blueprint Identity</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Working Title" value={getVal('title', currentBp.title)} lockKey="title" locks={locks} toggleLock={toggleLock} isEnabled={enabled.title} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Premise" value={getVal('premise', currentBp.premise)} lockKey="premise" locks={locks} toggleLock={toggleLock} isEnabled={enabled.premise} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className="blueprint-section">
                <h3>The Vibe</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Main Genre" value={getVal('genre', currentBp.genre)} lockKey="genre" locks={locks} toggleLock={toggleLock} isEnabled={enabled.genre} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Flavor" value={getVal('flavor', currentBp.flavor)} lockKey="flavor" locks={locks} toggleLock={toggleLock} isEnabled={enabled.flavor} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="BPM, Key & Scale" value={getVal('music', currentBp.music)} lockKey="music" locks={locks} toggleLock={toggleLock} isEnabled={enabled.music} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Instrumentation Palette" value={getVal('inst', currentBp.inst)} lockKey="inst" locks={locks} toggleLock={toggleLock} isEnabled={enabled.inst} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Signature Sound (Ear Candy)" value={getVal('earCandy', currentBp.earCandy)} lockKey="earCandy" locks={locks} toggleLock={toggleLock} isEnabled={enabled.earCandy} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className="blueprint-section">
                <h3>The Core</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Narrative POV" value={getVal('pov', currentBp.pov)} lockKey="pov" locks={locks} toggleLock={toggleLock} isEnabled={enabled.pov} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Emotional Core" value={getVal('vibe', currentBp.vibe)} lockKey="vibe" locks={locks} toggleLock={toggleLock} isEnabled={enabled.vibe} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Energy Contour" value={getVal('energy', currentBp.energy)} lockKey="energy" locks={locks} toggleLock={toggleLock} isEnabled={enabled.energy} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className="blueprint-section">
                <h3>The Voice</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Lyrical Delivery" value={getVal('delivery', currentBp.delivery)} lockKey="delivery" locks={locks} toggleLock={toggleLock} isEnabled={enabled.delivery} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Vocal Tone" value={getVal('vocal', formatVocal(currentBp.vocal))} lockKey="vocal" locks={locks} toggleLock={toggleLock} isEnabled={enabled.vocal} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className="blueprint-section">
                <h3>The Curveball</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Plot Twist" value={getVal('twist', currentBp.twist)} lockKey="twist" locks={locks} toggleLock={toggleLock} isEnabled={enabled.twist} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className={`blueprint-section ${locks.structure ? 'locked' : ''} ${!enabled.structure ? 'disabled' : ''}`}>
                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>The Structure: {currentBp.structure.name}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <ToggleButton isEnabled={enabled.structure} onToggle={() => toggleEnable('structure')} />
                    <LockButton isLocked={locks.structure} onToggle={() => toggleLock('structure')} />
                  </div>
                </h3>
                <div className="structure-list">
                  {currentBp.structure.steps.map((step, i) => (
                    <EditableStep key={i} step={step} index={i} onStepEditSave={handleStructureStepEdit} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </section>

        <aside className="glass-panel" style={{ alignSelf: 'start' }}>
          <div className="card-hd">
            <h2>Saved Blueprints</h2>
            {saves.length > 0 && <button className="small danger" onClick={() => { setSaves([]); localStorage.removeItem("lyricalchemy_saves_v11"); showToast("Cleared 🗑️"); }}>Clear</button>}
          </div>
          <div className="card-bd">
            {saves.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "14px" }}>Nothing saved yet.</p>
            ) : (
              <motion.div
                className="saved-list"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
              >
                <AnimatePresence>
                  {saves.map((bp, i) => {
                    const title = (bp.overrides && bp.overrides.title) ? bp.overrides.title : bp.title;
                    return (
                      <motion.div
                        key={bp.seed + i}
                        className="fav"
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 }
                        }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        layout
                      >
                        <div className="fav-title" style={{ color: 'var(--accent-gold)' }}>{title}</div>
                        <div className="fav-meta">
                          <span>{bp.genres ? `${bp.genres.primary} / ${bp.genres.secondary}` : `${bp.genre} / ${bp.flavor}`}</span><br />
                          <span>Seed: {bp.seed}</span>
                        </div>
                        <div className="fav-actions">
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </aside>
      </div>
      <div className={`toast ${toastMsg.visible ? 'show' : ''}`}>{toastMsg.text}</div>
    </div>
  );
};

export default App;
