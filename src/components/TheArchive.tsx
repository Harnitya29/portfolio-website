"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiBookLine, RiFilmLine, RiCodeBoxLine, RiArrowRightUpLine, RiLayoutGridLine, RiNodeTree } from "@remixicon/react";
import ArchiveGraph from "./ArchiveGraph";

// Types
type Category = "ALL" | "BOOKS" | "CINEMA" | "ARCHETYPES" | "MODELS";

interface ArchiveItem {
  id: string;
  title: string;
  category: Category;
  icon: React.ReactNode;
  tag: string;
  thesis: string;
  connection: string;
  application: string;
  nugget: string;
  tooltip: string;
}

// Data Array
const archiveData: ArchiveItem[] = [
  {
    id: "meditations",
    title: "Meditations - Marcus Aurelius",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-amber-100 transition-colors" />,
    tag: "[STOICISM]",
    thesis: "Internal control over external chaos.",
    connection: "Emotional resilience in deep work.",
    application: "Debugging under pressure; maintaining focus.",
    nugget: "You have power over your mind - not outside events.",
    tooltip: "Related: Stoicism, Focus, Marcus Aurelius."
  },
  {
    id: "cosmos",
    title: "Cosmos - Carl Sagan",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-blue-300 transition-colors" />,
    tag: "[ASTROPHYSICS]",
    thesis: "We are a way for the cosmos to know itself.",
    connection: "The scale of existence vs daily problems.",
    application: "First-principles thinking in science.",
    nugget: "Extraordinary claims require extraordinary evidence.",
    tooltip: "Related: Carl Sagan, Universe, Perspective."
  },
  {
    id: "six-easy-pieces",
    title: "Six Easy Pieces - Richard Feynman",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-amber-500 transition-colors" />,
    tag: "[PHYSICS]",
    thesis: "Fundamental mechanics of the physical world.",
    connection: "Mental models for how reality computes.",
    application: "Breaking down complex systems into primitives.",
    nugget: "Matter is made of atoms.",
    tooltip: "Related: Feynman, Quantum, Mechanics."
  },
  {
    id: "almanack-naval",
    title: "The Almanack of Naval Ravikant",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-emerald-300 transition-colors" />,
    tag: "[WEALTH/HAPPINESS]",
    thesis: "Wealth is having assets that earn while you sleep.",
    connection: "Leverage via code and media.",
    application: "Building asymmetric return systems.",
    nugget: "Play iterated games. All the returns in life come from compound interest.",
    tooltip: "Related: Leverage, Compound Interest, Tech."
  },
  {
    id: "interstellar",
    title: "Interstellar",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-indigo-400 transition-colors" />,
    tag: "[RELATIVITY]",
    thesis: "Time dilation and gravity as constraints.",
    connection: "Fuels interest in Project ChronoSyn.",
    application: "Visualizing complex concepts through persistent logic.",
    nugget: "Love is the one thing that transcends time and space.",
    tooltip: "Related: Physics, Time-Series Databases, Entropy."
  },
  {
    id: "dark",
    title: "Dark",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-zinc-300 transition-colors" />,
    tag: "[DETERMINISM]",
    thesis: "The end is the beginning, and the beginning is the end.",
    connection: "Closed causal loops and recursive architecture.",
    application: "Understanding state machines and cyclic dependencies.",
    nugget: "What we know is a drop, what we don't know is an ocean.",
    tooltip: "Related: Time, Determinism, Recursion."
  },
  {
    id: "aot",
    title: "Attack on Titan",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-red-600 transition-colors" />,
    tag: "[WILLPOWER]",
    thesis: "The pursuit of freedom against deterministic walls.",
    connection: "Eren Yeager archetype: Relentless forward motion.",
    application: "Pushing through burnout and limitations.",
    nugget: "If you win, you live. If you lose, you die. If you don't fight, you can't win.",
    tooltip: "Related: Transformation, Struggle, Freedom."
  },
  {
    id: "berserk",
    title: "Berserk",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-orange-600 transition-colors" />,
    tag: "[STRUGGLE]",
    thesis: "Enduring seemingly impossible odds.",
    connection: "Guts archetype: The indomitable human spirit.",
    application: "Resilience in long-term engineering and life pursuits.",
    nugget: "He died doing what he wanted, no matter what, right? I bet he was happy.",
    tooltip: "Related: Endurance, Causality, Will."
  },
  {
    id: "nietzsche",
    title: "Nietzsche",
    category: "MODELS",
    icon: <RiCodeBoxLine size={20} className="text-zinc-400 group-hover:text-red-400 transition-colors" />,
    tag: "[META-PHYSICS]",
    thesis: "Self-overcoming and the Will to Power.",
    connection: "Mirrors the hacker/builder mindset to create rather than consume.",
    application: "Understanding underlying architectures to bypass dogma.",
    nugget: "He who has a why to live for can bear almost any how.",
    tooltip: "Related: Philosophy, Ubermensch, Ethics."
  },
  {
    id: "entropy",
    title: "Entropy",
    category: "MODELS",
    icon: <RiCodeBoxLine size={20} className="text-zinc-400 group-hover:text-purple-400 transition-colors" />,
    tag: "[THERMODYNAMICS]",
    thesis: "Systems naturally decline into disorder.",
    connection: "Software rots; code maintenance.",
    application: "Designing self-healing and robust architectures.",
    nugget: "Energy dispersion is the arrow of time.",
    tooltip: "Related: Information Theory, Physics, Time."
  },
  {
    id: "systems-thinking",
    title: "Systems Thinking",
    category: "MODELS",
    icon: <RiCodeBoxLine size={20} className="text-zinc-400 group-hover:text-cyan-400 transition-colors" />,
    tag: "[ARCHITECTURE]",
    thesis: "Focusing on interconnections rather than parts.",
    connection: "Full-stack development and devops.",
    application: "Identifying feedback loops and bottlenecks.",
    nugget: "You can't just do one thing; every action has side effects.",
    tooltip: "Related: Cybernetics, Complexity, Leverage Points."
  },
  {
    id: "time",
    title: "Time",
    category: "MODELS",
    icon: <RiCodeBoxLine size={20} className="text-zinc-400 group-hover:text-green-500 transition-colors" />,
    tag: "[PHYSICS/PERCEPTION]",
    thesis: "Time is relative, subjective, and the ultimate constraint.",
    connection: "Project ChronoSyn, asynchronous processing.",
    application: "Optimizing computation and personal efficiency.",
    nugget: "Time is the scarcest resource and unless it is managed nothing else can be managed.",
    tooltip: "Related: Relativity, ChronoSyn, Execution."
  },
  {
    id: "1984",
    title: "1984 - George Orwell",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-neutral-400 transition-colors" />,
    tag: "[DYSTOPIA]",
    thesis: "Truth is constructed by those with power.",
    connection: "Privacy, surveillance, and data security.",
    application: "Designing systems with user privacy in mind.",
    nugget: "Who controls the past controls the future.",
    tooltip: "Related: Surveillance, Truth, Control."
  },
  {
    id: "autobiography-yogi",
    title: "Autobiography of a Yogi",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-orange-400 transition-colors" />,
    tag: "[SPIRITUALITY]",
    thesis: "The science of religion and self-realization.",
    connection: "Internal optimization bridging Eastern thought and Western logic.",
    application: "Meditation as a tool for extreme cognitive clarity.",
    nugget: "You do not have to struggle to reach God, but you do have to struggle to tear away the self-created veil that hides him.",
    tooltip: "Related: Kriya Yoga, Mindfulness, Zen."
  },
  {
    id: "steve-jobs",
    title: "Steve Jobs - Walter Isaacson",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />,
    tag: "[VISION/PRODUCT]",
    thesis: "The intersection of technology and liberal arts.",
    connection: "Obsessive focus on user experience.",
    application: "Building products that feel inevitable.",
    nugget: "People don't know what they want until you show it to them.",
    tooltip: "Related: Product Design, Apple, Vision."
  },
  {
    id: "leonardo-da-vinci",
    title: "Leonardo da Vinci",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-amber-200 transition-colors" />,
    tag: "[CURIOSITY]",
    thesis: "Relentless observation across disciplines.",
    connection: "Blending engineering mechanics with visual art.",
    application: "Learning broadly to solve highly specific technical problems.",
    nugget: "Simplicity is the ultimate sophistication.",
    tooltip: "Related: Polymath, Art, Invention."
  },
  {
    id: "einstein",
    title: "Albert Einstein",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-blue-200 transition-colors" />,
    tag: "[IMAGINATION]",
    thesis: "Imagination is more important than knowledge.",
    connection: "Thought experiments as a way of conceptualizing invisible systems.",
    application: "Abstract reasoning in backend architectures.",
    nugget: "God does not play dice with the universe.",
    tooltip: "Related: Physics, Imagination, Relativity."
  },
  {
    id: "thinking-fast-slow",
    title: "Thinking, Fast and Slow",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-rose-300 transition-colors" />,
    tag: "[BEHAVIOR]",
    thesis: "The dichotomy between two modes of thought.",
    connection: "Understanding cognitive biases in user interfaces.",
    application: "Designing frictionless UX by appealing to System 1.",
    nugget: "Nothing in life is as important as you think it is, while you are thinking about it.",
    tooltip: "Related: Psychology, Heuristics, Economics."
  },
  {
    id: "upanishads",
    title: "The Upanishads",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-amber-600 transition-colors" />,
    tag: "[NON-DUALITY]",
    thesis: "The underlying unity of the observer and the observed.",
    connection: "Philosophical foundation for consciousness studies.",
    application: "Approaching AI and systemic awareness holistically.",
    nugget: "You are what your deep, driving desire is.",
    tooltip: "Related: Vedanta, Atman, Consciousness."
  },
  {
    id: "ashtavakra",
    title: "The Ashtavakra Gita",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-yellow-600 transition-colors" />,
    tag: "[AWARENESS]",
    thesis: "Pure awareness is the only reality.",
    connection: "Detachment from local variables to see the global state.",
    application: "Maintaining objectivity during catastrophic system failures.",
    nugget: "If you think you are free, you are free. If you think you are bound, you are bound.",
    tooltip: "Related: Advaita, Freedom, Self."
  },
  {
    id: "zarathustra",
    title: "Thus Spoke Zarathustra",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-red-500 transition-colors" />,
    tag: "[UBERMENSCH]",
    thesis: "Humanity is a bridge to be overcome.",
    connection: "The drive toward continuous self-iteration and versioning.",
    application: "Rejecting complacency in skill acquisition.",
    nugget: "I teach you the Overman. Man is something that shall be overcome.",
    tooltip: "Related: Nietzsche, Will, Evolution."
  },
  {
    id: "red-book",
    title: "The Red Book - Carl Jung",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-red-800 transition-colors" />,
    tag: "[UNCONSCIOUS]",
    thesis: "The confrontation with the deep psyche.",
    connection: "Uncovering the hidden layers of intent.",
    application: "Analyzing the 'shadow' in system legacy code.",
    nugget: "Who looks outside, dreams; who looks inside, awakes.",
    tooltip: "Related: Archetype, Shadow, Psychology."
  },
  {
    id: "schrodinger-life",
    title: "What is Life? - Schrödinger",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />,
    tag: "[BIOPHYSICS]",
    thesis: "Life relies on negentropy to maintain order.",
    connection: "The physics of information and biological computation.",
    application: "Inspiration for autonomous agents and resilient codebases.",
    nugget: "Living matter evades the decay to equilibrium.",
    tooltip: "Related: Information Theory, Entropy, Biology."
  },
  {
    id: "yoga-sutras",
    title: "Yoga Sutras - Patanjali",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-indigo-300 transition-colors" />,
    tag: "[MINDFULNESS]",
    thesis: "The cessation of the modifications of the mind.",
    connection: "Mental bandwidth optimization.",
    application: "Achieving deep flow states via eliminated distractions.",
    nugget: "Yoga is the settling of the mind into silence.",
    tooltip: "Related: Patanjali, Focus, Inner Engineering."
  },
  {
    id: "dune",
    title: "Dune",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-yellow-700 transition-colors" />,
    tag: "[ECOLOGY/POWER]",
    thesis: "He who controls the spice controls the universe.",
    connection: "Resource allocation and monopoly dynamics.",
    application: "Strategic infrastructure planning.",
    nugget: "Fear is the mind-killer.",
    tooltip: "Related: Sci-Fi, Strategy, Resources."
  },
  {
    id: "social-network",
    title: "The Social Network",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />,
    tag: "[AMBITION]",
    thesis: "The chaotic genesis of hyper-scale platforms.",
    connection: "Startup culture and intense shipping velocity.",
    application: "Shipping fast over pursuing perfect.",
    nugget: "A million dollars isn't cool. You know what's cool? A billion dollars.",
    tooltip: "Related: Startups, Engineering, Scale."
  },
  {
    id: "21",
    title: "21",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-red-400 transition-colors" />,
    tag: "[PROBABILITY]",
    thesis: "Exploiting systemic edges through applied math.",
    connection: "Statistical modeling and algorithms.",
    application: "Writing logic to tilt probability in your favor.",
    nugget: "Always split eights and aces.",
    tooltip: "Related: Math, Risk, Edges."
  },
  {
    id: "imitation-game",
    title: "The Imitation Game",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-green-200 transition-colors" />,
    tag: "[COMPUTATION]",
    thesis: "Machines breaking human encryption.",
    connection: "The birth of modern computer science.",
    application: "Cryptography, heuristic searches, and brute force limits.",
    nugget: "Sometimes it is the people no one imagines anything of who do the things that no one can imagine.",
    tooltip: "Related: Turing, Cryptography, CS History."
  },
  {
    id: "beautiful-mind",
    title: "A Beautiful Mind",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-teal-200 transition-colors" />,
    tag: "[GAME THEORY]",
    thesis: "Mathematical analysis of competition and cooperation.",
    connection: "Nash equilibrium in distributed networks.",
    application: "Designing incentive-aligned tokenomics or protocols.",
    nugget: "The best result will come from everyone in the group doing what's best for themselves and the group.",
    tooltip: "Related: Math, Economics, Nash."
  },
  {
    id: "fight-club",
    title: "Fight Club",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-pink-600 transition-colors" />,
    tag: "[NIHILISM]",
    thesis: "Rejecting consumer identity paradigms.",
    connection: "Minimalist philosophy in life and code.",
    application: "Stripping away all unnecessary dependencies and features.",
    nugget: "The things you own end up owning you.",
    tooltip: "Related: Identity, Consumerism, Chaos."
  },
  {
    id: "the-matrix",
    title: "The Matrix",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-green-500 transition-colors" />,
    tag: "[SIMULATION]",
    thesis: "Reality is a construct maintained by machines.",
    connection: "The foundational myth of the programmer.",
    application: "Seeing the underlying code behind interfaces.",
    nugget: "There is no spoon.",
    tooltip: "Related: AI, Reality, Hackers."
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-green-600 transition-colors" />,
    tag: "[TRANSFORMATION]",
    thesis: "The study of absolute change.",
    connection: "Chemistry as a metaphor for controlled state changes.",
    application: "Managing irreversible state mutations.",
    nugget: "I am the one who knocks.",
    tooltip: "Related: Chemistry, Power, Consequences."
  },
  {
    id: "true-detective-s1",
    title: "True Detective S1",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-yellow-600 transition-colors" />,
    tag: "[PESSIMISM]",
    thesis: "Time is a flat circle.",
    connection: "Atmospheric storytelling masking complex character flaws.",
    application: "Debugging profound architectural decay.",
    nugget: "We are things that labor under the illusion of having a self.",
    tooltip: "Related: Philosophy, Time, Nihilism."
  },
  {
    id: "blue-lock",
    title: "Blue Lock",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />,
    tag: "[EGO]",
    thesis: "Unleashing raw, unfiltered individualism.",
    connection: "The striker mindset.",
    application: "Taking extreme ownership of outcomes.",
    nugget: "Be the greatest egoist in the world.",
    tooltip: "Related: Ego, Sports, Ambition."
  },
  {
    id: "classroom-elite",
    title: "Classroom of the Elite",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-rose-500 transition-colors" />,
    tag: "[MANIPULATION]",
    thesis: "People are nothing more than tools.",
    connection: "Calculated strategies over emotional responses.",
    application: "Systemic utilization of individual strengths.",
    nugget: "I don't care what I have to sacrifice, as long as I win in the end.",
    tooltip: "Related: Strategy, Human Nature, Meritocracy."
  },
  {
    id: "death-note",
    title: "Death Note",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-zinc-600 transition-colors" />,
    tag: "[JUSTICE]",
    thesis: "The absolute corruption of absolute power.",
    connection: "Logic duels and playing god.",
    application: "The danger of unrestricted systemic access privileges.",
    nugget: "I will become the God of this new world.",
    tooltip: "Related: Morality, Logic, Hubris."
  },
  {
    id: "monster",
    title: "Monster",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-red-900 transition-colors" />,
    tag: "[MORALITY]",
    thesis: "The nature of extreme evil embedded in humanity.",
    connection: "Philosophical investigations into what makes human life equal.",
    application: "Navigating deep, complex systemic ethical issues.",
    nugget: "All lives are not created equal.",
    tooltip: "Related: Ethics, Psychology, Truth."
  },
  {
    id: "avatar-tla",
    title: "Avatar: The Last Airbender",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-cyan-500 transition-colors" />,
    tag: "[BALANCE]",
    thesis: "Equilibrium among opposing elemental forces.",
    connection: "Harmonizing diverse concepts and teams.",
    application: "Creating seamless integration between frontend and backend.",
    nugget: "In the darkest times, hope is something you give yourself.",
    tooltip: "Related: Harmony, Elements, Growth."
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-green-500 transition-colors" />,
    tag: "[HEROISM]",
    thesis: "What it means to sacrifice for the greater good.",
    connection: "Open source contributions and mentorship.",
    application: "Pushing boundaries: Plus Ultra.",
    nugget: "A hero's job is to risk his life to make his lip service a reality.",
    tooltip: "Related: Duty, Sacrifice, Effort."
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-fuchsia-500 transition-colors" />,
    tag: "[CONVICTION]",
    thesis: "Unwavering resolve shapes reality.",
    connection: "Perfecting specific fundamental techniques.",
    application: "Total concentration breathing -> Deep focus work sessions.",
    nugget: "Set your heart ablaze.",
    tooltip: "Related: Discipline, Brotherhood, Will."
  }
];

export default function TheArchive() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"GRID" | "NETWORK">("GRID");

  const categories: Category[] = ["ALL", "BOOKS", "CINEMA", "ARCHETYPES", "MODELS"];

  // Filter items
  const filteredData = useMemo(() => {
    if (activeCategory === "ALL") return archiveData;
    return archiveData.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div id="tech-stack" className="mb-16 relative">
      <motion.h2 
        className="text-2xl font-bold text-white mb-2 relative inline-flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-green-300">&gt;</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-green-200 to-white">
          the archive
        </span>
      </motion.h2>
      
      <motion.p 
        className="text-sm text-zinc-400 mb-8 max-w-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        A digital brain mapping the mental models, literature, and media that shape my technical philosophy.
      </motion.p>

      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10 w-full">
        {/* Filter Toggle */}
        <motion.div 
          className="flex flex-wrap gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeCategory === cat 
                  ? "bg-zinc-800 text-green-300 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div 
          className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 self-end sm:self-auto"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => {
              setViewMode("GRID");
              setExpandedId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === "GRID" 
                ? "bg-zinc-800 text-green-300 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
            }`}
          >
            <RiLayoutGridLine size={14} /> GRID
          </button>
          <button
            onClick={() => setViewMode("NETWORK")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === "NETWORK" 
                ? "bg-zinc-800 text-cyan-400 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
            }`}
          >
            <RiNodeTree size={14} /> NETWORK
          </button>
        </motion.div>
      </div>

      {/* View Matrix */}
      {viewMode === "NETWORK" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full"
        >
          <ArchiveGraph 
            data={filteredData} 
            onNodeClick={(item) => {
              // Switch back to grid view and expand the specific data fragment
              setViewMode("GRID");
              setActiveCategory("ALL"); // Reset filter safely just to ensure visibility
              
              // Small timeout ensures the DOM switches back to GRID before expanding
              setTimeout(() => setExpandedId(item.id), 50);
            }} 
          />
        </motion.div>
      ) : (
        /* Data Fragments Grid */
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          layout
        >
        <AnimatePresence mode="popLayout">
          {filteredData.map((item, i) => {
            const isExpanded = expandedId === item.id;
            
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`relative group cursor-pointer ${
                  isExpanded ? "col-span-1 md:col-span-2 lg:col-span-3" : "col-span-1"
                }`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <motion.div 
                  className={`h-full rounded-xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm overflow-hidden transition-colors hover:border-zinc-700 ${
                    isExpanded ? "bg-zinc-900/80 shadow-2xl border-green-900/30" : ""
                  }`}
                  layout
                >
                  {/* Top Bar / Header */}
                  <motion.div 
                    className="p-4 flex items-start gap-3 relative z-10"
                    layout
                  >
                    <div 
                      className="p-2 rounded-lg bg-zinc-800/50 text-zinc-100"
                    >
                      {item.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono text-zinc-500 mb-1 block">
                          {item.tag}
                        </span>
                        
                        {/* Tooltip implementation via group-hover */}
                        {!isExpanded && (
                           <div className="group/tooltip relative">
                             <RiArrowRightUpLine className="text-zinc-600 hover:text-green-300 transition-colors w-4 h-4" />
                             <div className="absolute opacity-0 group-hover/tooltip:opacity-100 transition-opacity bg-zinc-800 text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-300 right-0 top-6 w-max max-w-[200px] pointer-events-none z-50">
                               {item.tooltip}
                             </div>
                           </div>
                        )}
                        {isExpanded && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(null);
                            }}
                            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                          >
                            <RiArrowRightUpLine size={20} className="text-zinc-500 hover:text-green-300 transform rotate-180" />
                          </button>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-zinc-200">
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Expanded Content "Quick 4" */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 overflow-hidden"
                      >
                        <div className="pt-2 border-t border-zinc-800/50 space-y-3 mt-2">
                          <div>
                            <span className="text-xs font-medium text-green-300/80 uppercase tracking-wider block mb-0.5">Thesis</span>
                            <p className="text-sm text-zinc-300">{item.thesis}</p>
                          </div>
                          
                          <div>
                            <span className="text-xs font-medium text-green-300/80 uppercase tracking-wider block mb-0.5">Connection</span>
                            <p className="text-sm text-zinc-300">{item.connection}</p>
                          </div>
                          
                          <div>
                            <span className="text-xs font-medium text-green-300/80 uppercase tracking-wider block mb-0.5">Application</span>
                            <p className="text-sm text-zinc-300">{item.application}</p>
                          </div>
                          
                          <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50 mt-4">
                            <span className="text-xs font-medium text-green-300/80 uppercase tracking-wider block mb-1">The Nugget</span>
                            <p className="text-sm text-zinc-200 italic">"{item.nugget}"</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Cosmic Accent Line */}
                  <div 
                    className="absolute top-0 left-0 w-full h-[1px] opacity-20 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      )}
    </div>
  );
}
