import re

with open("src/utils/constants.js", "r", encoding="utf-8") as f:
    text = f.read()

# Add TWISTS array if missing
if "export const TWISTS =" not in text:
    twists = """export const TWISTS = [
  "A sudden key change downwards in the final chorus",
  "The beat drops out completely for the most important lyrical reveal",
  "A completely unrelated genre takes over for the bridge",
  "The perspective shifts from the victim to the perpetrator halfway through",
  "Ending exactly as the song began, implying a repetitive cycle",
  "An extended, chaotic instrumental outro that contradicts the happy lyrics",
  "The song abruptly cuts off mid-sentence",
  "A hidden, acoustic version of the chorus plays after a long silence",
  "The narrator's voice slowly distorts until it becomes unrecognizable",
  "The tempo completely halves for the last 30 seconds",
  "A frantic, double-time rap finishes a slow ballad",
  "The chorus lyrics change entirely in the final repetition",
  "A massive orchestral swell that ends in a single, dry cough",
  "The intro plays backwards to end the track",
  "A bright, cheerful children's choir suddenly sings the darkest lyric",
  "The main instrument breaks or goes severely out of tune",
  "The vocal track deliberately glitches and stutters off-beat",
  "A 30-second field recording of rain interrupts the track",
  "The final chord resolves to a deeply unsettling dissonance",
  "The song loops perfectly so the end is identical to the beginning",
  "A spoken word monologue replaces the final chorus",
  "The beat switches to a waltz rhythm for the bridge only",
  "The lead vocal is suddenly replaced by a synthesized robot voice",
  "A massive, booming bass drop happens under a tiny, plucked acoustic guitar",
  "The key modulates up every single time the chorus hits"
];
"""
    # Insert before EMOTIONS
    text = text.replace("export const EMOTIONS =", twists + "export const EMOTIONS =")

# Let's use regex to replace the arrays if needed. I will just do exact replacements or regex replacements.
# POVs
povs_pattern = r"export const POVS = \[.*?\];"
povs_repl = """export const POVS = [
  "The Direct Confession (First Person: I/You)", 
  "The Storyteller (Third Person: He/She/They)", 
  "The Unreliable Narrator (Lying to the listener/themselves)", 
  "The Inner Monologue (Talking strictly to yourself)", 
  "The Ghost (Singing from beyond the relationship or life)", 
  "The Accuser (Second Person: Dictating exactly what they did)", 
  "The Fly on the Wall (Detached, clinical, emotionless observation)",
  "The Inanimate Object (Singing from the perspective of a place or thing)",
  "The Collective We (Singing on behalf of a generation or group)",
  "The Letter Writer (Addressing someone who will never hear it)",
  "The Future Self (Warning your younger self)",
  "The Bystander (Present for the tragedy, but powerless to stop it)",
  "The Manipulator (Gaslighting the listener with charm)",
  "The AI (A machine attempting to understand human emotion)",
  "The Interrogator (Asking relentless, unanswerable questions)"
];"""
text = re.sub(povs_pattern, povs_repl, text, flags=re.DOTALL)

# DELIVERIES
deliveries_pattern = r"export const DELIVERIES = \[.*?\];"
deliveries_repl = """export const DELIVERIES = [
  "Fast, triplet-heavy rhythmic flow with simple end rhymes",
  "Conversational, dragging slightly behind the beat with slant rhymes",
  "Long, sweeping, theatrical legato notes with vivid imagery",
  "Staccato, punchy, aggressive delivery with dense internal rhymes",
  "Slightly slurred, exhausted delivery with sparse rhymes",
  "Crisp, fast-paced enunciation with rhythmic wordplay",
  "Breathless and rushed, like running out of time, no-rhyme free verse",
  "Soulful, heavy melismatic runs with call-and-response phrasing",
  "Deadpan, spoken-word style with sharp modern phrasing",
  "Soft, breathy, close proximity delivery with internal echoes",
  "Chanted, monotonous, almost robotic recitation",
  "Wide, operatic vibrato with dramatic volume swells",
  "Scream-sung, tearing the vocal cords with raw emotion",
  "Mumbled, barely audible over the beat, forcing the listener to lean in",
  "Hyper-enunciated, musical theater-style projection",
  "A lazy, sung-spoken drawl dripping with sarcasm",
  "Frantic, overlapping vocal takes interrupting each other",
  "Pin-drop quiet whispering directly into the microphone",
  "Massive, gospel-choir supported belting",
  "Folk-style yodeling or sudden register flips into falsetto",
  "Aggressive, percussive grunts emphasizing the downbeat",
  "A smooth, buttery croon that never raises its volume",
  "Hysterical, crying delivery where the pitch frequently breaks",
  "Pitch-shifted down to sound like a demonic entity",
  "Sung entirely in a fragile, breaking head voice"
];"""
text = re.sub(deliveries_pattern, deliveries_repl, text, flags=re.DOTALL)

# PREMISES
premises_pattern = r"export const PREMISES = \[.*?\];"
premises_repl = """export const PREMISES = [
  "A breakup song that sounds like a massive celebration",
  "A song about realizing you are the villain of the story",
  "A love song for a city you're leaving permanently",
  "A track about the terrifying freedom of failing entirely",
  "An upbeat dance anthem with devastatingly sad lyrics",
  "A slow, romantic ballad about someone you haven't met yet",
  "A confrontational track aimed directly at your past self",
  "A song about staying in a comfortable but dead relationship",
  "An ode to midnight drives to avoid going home",
  "A track detailing the specific grief of outgrowing your best friend",
  "A love song to the version of you that existed before the trauma",
  "A bitter anthem about watching the person who broke you succeed",
  "A song about the exact moment you realize you're turning into your parents",
  "A track romanticizing a toxic, co-dependent friendship",
  "An apology you know they'll never accept",
  "A narrative about finding your ex's old shirt and burning it",
  "A song capturing the electric anxiety of a first date in a new city",
  "A hymn for the burnouts who peaked in high school",
  "A chaotic track about making a spectacularly bad decision on purpose",
  "A love letter to the stranger who smiled at you on the subway",
  "A song about the paranoia that everything is going 'too well'",
  "An eerie track about moving into a house where someone died",
  "A song about pretending you don't care to win an argument",
  "A ballad for the specific loneliness of being surrounded by people",
  "A track about the awkwardness of running into an ex at the grocery store",
  "A defiant anthem about finally quitting a job you hate",
  "A song about the comforting numbness of depression",
  "A love song where the 'lover' is actually an addiction",
  "A narrative track about a heist gone wrong",
  "A song dedicated to the feeling of your phone dying when you're lost",
  "A track about the sheer exhaustion of having to 'be strong'",
  "An ode to the euphoria of canceling weekend plans to sleep",
  "A song about realizing your idol is actually a terrible person",
  "A track dealing with the imposter syndrome of sudden success",
  "A love song written from the perspective of a ghost haunting its widow",
  "A song about the exact moment you lose respect for someone",
  "An anthem about the terrifying realization that you are the adult in the room",
  "A track about trying to recreate a perfect memory and failing",
  "A song about the bittersweet relief of dropping a burdensome secret",
  "A narrative about a small-town scandal involving the mayor",
  "A love song to a fictional character you wish was real",
  "A track about the specific despair of a Sunday evening",
  "A song about falling out of love slowly, one papercut at a time",
  "An ode to the bizarre camaraderie of the smoking section",
  "A track about the jarring experience of waking up from anesthesia",
  "A song about forgiving someone who never even apologized",
  "A love song for the peace found at the bottom of the ocean",
  "An anthem for the aggressively mediocre and perfectly content",
  "A narrative about discovering a family secret hidden in the attic",
  "A song about the crushing finality of signing divorce papers"
];"""
text = re.sub(premises_pattern, premises_repl, text, flags=re.DOTALL)

# EAR_CANDIES
ear_candies_pattern = r"export const EAR_CANDIES = \[.*?\];"
ear_candies_repl = """export const EAR_CANDIES = [
  "A heavily distorted 808 bass slide",
  "A pitched-down, slowed vocal sample in the chorus",
  "A sweeping, cinematic cello solo in the bridge",
  "A hyper-compressed, punchy acoustic drum break",
  "A glitched-out, stuttering synthesizer lead",
  "A massive, gated-reverb 80s snare drum",
  "A lo-fi, crackling vinyl atmosphere underlying the whole track",
  "A sudden, completely dry vocal with all instruments dropping out",
  "A melodic, high-register walking bassline",
  "A shimmering, wide-panned acoustic guitar stereo track",
  "A heavily flanged drum fill leading into the hook",
  "A reverse cymbal crash leading into the first verse",
  "A vocal ad-lib run through a megaphone effect",
  "A syncopated cowbell pattern buried deep in the mix",
  "A massive, room-shaking sub-bass drop on the first beat of the chorus",
  "A cascading, arpeggiated harp glissando",
  "A layer of crowd noise or cheering underneath the solo",
  "A heavily autotuned harmony panned hard left and right",
  "A sudden, stark silence before the final chord",
  "A detuned, wobbly tape-stop effect on the master track",
  "A subtle, rhythmic breathing loop acting as percussion",
  "A screeching, feedback-drenched guitar harmonic",
  "A delicate music box melody tinkling in the background",
  "A panning laser synth zapping from ear to ear",
  "A heavy, metallic anvil strike used as a snare drum",
  "A choir of synthesized monks chanting a long drone",
  "A rapidly auto-panned shaker that makes you dizzy",
  "A heavily sidechained, swelling white noise riser",
  "A vocal chop melody that sounds like seagulls crying",
  "A deep, rumbling cinematic impact boom",
  "A frantic, unquantized jazzy snare fill",
  "A delicate acoustic squeak from fingers sliding on guitar strings",
  "A layer of distorted police sirens in the background",
  "A bubbly, formant-shifted alien vocal layer",
  "A bitcrushed, 8-bit explosion sound effect",
  "A perfectly clean, jazzy ride cymbal playing swing time",
  "A monstrous, roaring vocoder chord progression",
  "A subtle, rhythmic clicking of a pen or lighter",
  "A massive, cavernous church bell tolling on the downbeat",
  "A fluttering, tremolo-picked mandolin adding texture"
];"""
text = re.sub(ear_candies_pattern, ear_candies_repl, text, flags=re.DOTALL)

# ENERGY_CONTOURS
energy_contours_pattern = r"export const ENERGY_CONTOURS = \[.*?\];"
energy_contours_repl = """export const ENERGY_CONTOURS = [
  "A slow burn that explodes only in the final chorus",
  "Relentless, driving energy from start to finish",
  "Starts massive, drops to a whisper, ends in chaotic noise",
  "A steady, hypnotic groove that slowly adds layers",
  "Quiet verses with sudden, jarringly loud choruses",
  "Rolling waves of intensity that build and recede cyclically",
  "High energy up until a stark, stripped-back bare acoustic bridge",
  "A constantly accelerating tempo that reaches a frantic peak",
  "A flat, stoic, unchanging groove that relies on lyrical tension",
  "A chaotic, unpredictable structure jumping between loud and soft",
  "A rapid, breathless sprint that collapses into a slow halftime outro",
  "Starts acoustic and intimate, gradually becoming a full stadium rock anthem",
  "A massive wall of sound that slowly peels away instruments until only a vocal remains",
  "Two slow, moody verses leading to an absolutely unhinged, double-time dance break",
  "A false ending of total silence followed by a blistering guitar solo",
  "Consistently medium energy, feeling like a comfortable, easy drive",
  "A frantic, jarring intro that settles into a smooth R&B groove",
  "Starts with a massive drop, then spends the rest of the song trying to rebuild that energy",
  "An eerie, tension-filled build that never actually drops, leaving the listener unresolved",
  "A bouncy, playful energy that suddenly turns intensely dark and heavy in the bridge"
];"""
text = re.sub(energy_contours_pattern, energy_contours_repl, text, flags=re.DOTALL)

# VOCAL_ARCHETYPES
vocal_archetypes_pattern = r"export const VOCAL_ARCHETYPES = \[.*?\];"
vocal_archetypes_repl = """export const VOCAL_ARCHETYPES = [
  { name: "The Confessor", verse: "close-mic, intimate, restrained", chorus: "open tone, warm lift", bridge: "nearly spoken, vulnerable" },
  { name: "The Rebel", verse: "gritty, forward, rhythmic phrasing", chorus: "bigger edge, punch consonants", bridge: "half-sung grit, tension" },
  { name: "The Dreamer", verse: "airy, soft, floating vowels", chorus: "soaring, layered harmonies", bridge: "breathy clarity, emotional crack" },
  { name: "The Villain", verse: "low and controlled, theatrical", chorus: "dramatic lift, sharp dynamics", bridge: "cold whisper → sudden snap" },
  { name: "The Storyteller", verse: "clear articulation, narrative drive", chorus: "anthemic, singalong", bridge: "pause-heavy, honest delivery" },
  { name: "The Diva", verse: "soulful runs, confident tone", chorus: "massive belting, extreme vibrato", bridge: "high-register acrobatic melisma" },
  { name: "The Ghost", verse: "fragile head voice, distant", chorus: "reverb-drenched, ethereal choir", bridge: "wordless, haunting wailing" },
  { name: "The Robot", verse: "flat pitch, hyper-quantized", chorus: "thick vocoder chords, synthetic", bridge: "glitching, stuttering robotic syllables" },
  { name: "The Punk", verse: "sneering, out-of-breath fast", chorus: "shouted gang vocals", bridge: "raw, throat-shredding scream" },
  { name: "The Lounge Singer", verse: "buttery smooth, behind the beat", chorus: "classic crooning, wide vibrato", bridge: "playful scatting and ad-libs" }
];"""
text = re.sub(vocal_archetypes_pattern, vocal_archetypes_repl, text, flags=re.DOTALL)


with open("src/utils/constants.js", "w", encoding="utf-8") as f:
    f.write(text)
