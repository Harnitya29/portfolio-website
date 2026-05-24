export type Project = {
  title: string;
  description: string;
  link: string;
  technologies: string[];
  featured?: boolean;
};

export const projectList: Project[] = [
  {
    title: "DataVerse Datathon 2026 Winner",
    description: "Built a causal ML-driven analytics platform for churn intervention and profit optimization using uplift modeling and prescriptive analytics.",
    link: "https://threed2y.github.io/DataVerse-2026/winners.html",
    technologies: ["Python", "Causal ML", "Prescriptive Analytics"],
    featured: true
  },
  {
    title: "Cosmic Portfolio",
    description: "An ultra-clean, data-dense cyberpunk portfolio engineered with React, Next.js, and framer-motion for an immersive terminal experience.",
    link: "https://github.com/Harnitya29/portfolio-website",
    technologies: ["Next.js", "Tailwind", "Framer Motion"],
    featured: true
  },
  {
    title: "NeuralNet Dashboard",
    description: "Visualizing model drift and performance metrics in real-time.",
    link: "https://github.com/Harnitya29/neuralnet-dashboard",
    technologies: ["Next.js", "Tailwind", "Python"],
  },
  {
    title: "Sentinel.sh",
    description: "Automated reconnaissance and vulnerability scanning tool for local networks.",
    link: "https://github.com/Harnitya29/sentinel",
    technologies: ["Python", "Bash", "Nmap"],
  },
  {
    title: "Quantum State Visualizer",
    description: "An interactive web app demystifying fundamental quantum logic gates.",
    link: "https://github.com/Harnitya29/quantum-state-visualizer",
    technologies: ["React", "Three.js", "TypeScript"],
  }
];