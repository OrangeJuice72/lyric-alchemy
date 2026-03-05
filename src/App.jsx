import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GENRES, TOPICS, POVS, EMOTIONS, IMAGERY, RHYME,
  VOCAL_ARCHETYPES, CADENCES, TWISTS, FORBIDDEN,
  STRUCTURES, TITLE_ADJ, TITLE_NOUNS, INST
} from './utils/constants';
import { makeRng, pick, generateMusic } from './utils/rng';
import EditableKeyValue from './components/EditableKeyValue';
import EditableStep from './components/EditableStep';
import LockButton from './components/LockButton';
import ToggleButton from './components/ToggleButton';

const App = () => {
  const [seedInput, setSeedInput] = useState("");
  const [chaos, setChaos] = useState(20);
  const [currentBp, setCurrentBp] = useState(null);
  const [saves, setSaves] = useState([]);
  const [toastMsg, setToastMsg] = useState({ text: "", visible: false });

  const [locks, setLocks] = useState({
    title: false, genres: false, music: false, inst: false, topic: false, pov: false, emotion: false,
    imagery: false, rhyme: false, vocal: false, cadence: false,
    twist: false, constraint: false, structure: false
  });

  const [enabled, setEnabled] = useState({
    title: true, genres: true, music: true, inst: true, topic: true, pov: true, emotion: true,
    imagery: true, rhyme: true, vocal: true, cadence: true,
    twist: true, constraint: true, structure: true
  });

  const toggleLock = (key) => setLocks(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleEnable = (key) => setEnabled(prev => ({ ...prev, [key]: !prev[key] }));

  const showToast = (msg) => {
    setToastMsg({ text: msg, visible: true });
    setTimeout(() => setToastMsg(prev => ({ ...prev, visible: false })), 2000);
  };

  const handleOverrideSave = (key, customText) => {
    setCurrentBp(prev => ({
      ...prev,
      overrides: { ...(prev.overrides || {}), [key]: customText }
    }));
    setLocks(prev => ({ ...prev, [key]: true }));
    showToast("Custom edit locked! 🔒✨");
  };

  const handleStructureStepEdit = (stepIndex, newDesc) => {
    const newSteps = [...currentBp.structure.steps];
    newSteps[stepIndex] = [newSteps[stepIndex][0], newSteps[stepIndex][1], newDesc];

    setCurrentBp(prev => ({
      ...prev,
      structure: { ...prev.structure, steps: newSteps }
    }));
    setLocks(prev => ({ ...prev, structure: true }));
    showToast("Structure edit locked! 🔒✨");
  };



  const handleGenerate = (isInitial = false) => {
    const { seed, rand } = makeRng(seedInput);
    const rng = { seed, rand };

    const shouldLock = (key) => !isInitial && currentBp && locks[key];

    const activeOverrides = {};
    if (!isInitial && currentBp && currentBp.overrides) {
      Object.keys(currentBp.overrides).forEach(k => {
        if (locks[k]) activeOverrides[k] = currentBp.overrides[k];
      });
    }

    const isCohesive = (rng.rand() * 100) > chaos;

    const safeGenres = GENRES.slice(0, 30);
    let primaryGenre = isCohesive ? pick(rng, safeGenres) : pick(rng, GENRES);
    let secondaryGenre = isCohesive ? pick(rng, safeGenres) : pick(rng, GENRES);
    if (primaryGenre === secondaryGenre) secondaryGenre = pick(rng, GENRES);

    const curatedEmotionPairs = [["Confidence", "Insecurity"], ["Nostalgia", "Resentment"], ["Hope", "Fear"], ["Relief", "Grief"], ["Tenderness", "Jealousy"], ["Calm", "Restlessness"], ["Defiance", "Guilt"], ["Longing", "Regret"]];
    let chosenEmotion = { surface: pick(rng, EMOTIONS), core: pick(rng, EMOTIONS) };
    if (isCohesive) {
      const pair = pick(rng, curatedEmotionPairs);
      chosenEmotion = { surface: pair[0], core: pair[1] };
    }

    const newBp = {
      seed: seed,
      chaos: chaos,
      mode: chaos <= 25 ? "Studio" : chaos <= 60 ? "Hybrid" : "Experimental",
      createdAt: new Date().toISOString(),

      title: shouldLock('title') ? currentBp.title : `Project: ${pick(rng, TITLE_ADJ)} ${pick(rng, TITLE_NOUNS)}`,
      genres: shouldLock('genres') ? currentBp.genres : { primary: primaryGenre, secondary: secondaryGenre },
      music: shouldLock('music') ? currentBp.music : generateMusic(rng, chaos),
      inst: shouldLock('inst') ? currentBp.inst : pick(rng, INST),

      topic: shouldLock('topic') ? currentBp.topic : pick(rng, TOPICS),
      pov: shouldLock('pov') ? currentBp.pov : pick(rng, POVS),
      emotion: shouldLock('emotion') ? currentBp.emotion : chosenEmotion,
      imagery: shouldLock('imagery') ? currentBp.imagery : pick(rng, IMAGERY),

      rhyme: shouldLock('rhyme') ? currentBp.rhyme : pick(rng, RHYME),
      vocal: shouldLock('vocal') ? currentBp.vocal : pick(rng, VOCAL_ARCHETYPES),
      cadence: shouldLock('cadence') ? currentBp.cadence : pick(rng, CADENCES),

      structure: shouldLock('structure') ? currentBp.structure : pick(rng, STRUCTURES),
      twist: shouldLock('twist') ? currentBp.twist : pick(rng, TWISTS),
      constraint: shouldLock('constraint') ? currentBp.constraint : pick(rng, FORBIDDEN),

      overrides: activeOverrides
    };

    setCurrentBp(newBp);
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
    setCurrentBp(bp); setSeedInput(bp.seed); setChaos(bp.chaos);
    showToast("Loaded blueprint 📥");
  };

  const handleExport = () => {
    if (!currentBp) return showToast("Generate first! 🎲");
    const exportData = {};
    Object.keys(currentBp).forEach(key => {
      if (enabled[key] !== false) {
        exportData[key] = currentBp[key];
      }
    });
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LyricAlchemy_${currentBp.seed}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported JSON 📤");
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
            <h2>Studio Generator</h2>
            <div className="row">
              <button className="primary" onClick={() => handleGenerate(false)}>🎲 Generate</button>
              <button className="small" onClick={handleSave}>💾 Save</button>
              <button className="small" onClick={handleExport}>📤 Export JSON</button>
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
                <h3 style={{ color: 'var(--text)' }}>🏷️ The Blueprint Identity</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Working Title" value={getVal('title', currentBp.title)} lockKey="title" locks={locks} toggleLock={toggleLock} isEnabled={enabled.title} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className="blueprint-section">
                <h3>🌌 The Vibe</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Genres" value={getVal('genres', `${currentBp.genres.primary} + ${currentBp.genres.secondary} (Flavor)`)} lockKey="genres" locks={locks} toggleLock={toggleLock} isEnabled={enabled.genres} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="BPM, Key & Scale" value={getVal('music', currentBp.music)} lockKey="music" locks={locks} toggleLock={toggleLock} isEnabled={enabled.music} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Instrumentation Palette" value={getVal('inst', currentBp.inst)} lockKey="inst" locks={locks} toggleLock={toggleLock} isEnabled={enabled.inst} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className="blueprint-section">
                <h3>🫀 The Core</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Topic" value={getVal('topic', currentBp.topic)} lockKey="topic" locks={locks} toggleLock={toggleLock} isEnabled={enabled.topic} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Narrative POV" value={getVal('pov', currentBp.pov)} lockKey="pov" locks={locks} toggleLock={toggleLock} isEnabled={enabled.pov} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Emotion (Surface / Core)" value={getVal('emotion', `${currentBp.emotion.surface} / ${currentBp.emotion.core}`)} lockKey="emotion" locks={locks} toggleLock={toggleLock} isEnabled={enabled.emotion} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Imagery Theme" value={getVal('imagery', currentBp.imagery)} lockKey="imagery" locks={locks} toggleLock={toggleLock} isEnabled={enabled.imagery} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className="blueprint-section">
                <h3>🗣️ The Voice</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Rhyme & Diction" value={getVal('rhyme', currentBp.rhyme)} lockKey="rhyme" locks={locks} toggleLock={toggleLock} isEnabled={enabled.rhyme} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Vocal Tone" value={getVal('vocal', `${currentBp.vocal.name}\nVerse: ${currentBp.vocal.verse}\nChorus: ${currentBp.vocal.chorus}\nBridge: ${currentBp.vocal.bridge}`)} lockKey="vocal" locks={locks} toggleLock={toggleLock} isEnabled={enabled.vocal} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Flow & Cadence" value={getVal('cadence', currentBp.cadence)} lockKey="cadence" locks={locks} toggleLock={toggleLock} isEnabled={enabled.cadence} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className="blueprint-section">
                <h3>🃏 The Curveball & Constraints</h3>
                <div className="kv-grid">
                  <EditableKeyValue label="Plot Twist" value={getVal('twist', currentBp.twist)} lockKey="twist" locks={locks} toggleLock={toggleLock} isEnabled={enabled.twist} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                  <EditableKeyValue label="Forbidden Words" value={getVal('constraint', currentBp.constraint)} lockKey="constraint" locks={locks} toggleLock={toggleLock} isEnabled={enabled.constraint} toggleEnable={toggleEnable} onEditSave={handleOverrideSave} />
                </div>
              </div>

              <div className={`blueprint-section ${locks.structure ? 'locked' : ''} ${!enabled.structure ? 'disabled' : ''}`}>
                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🏗️ The Structure: {currentBp.structure.name}</span>
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
                          <span>{bp.genres.primary} / {bp.genres.secondary}</span><br />
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
