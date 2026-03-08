export type Project = {
  title: string;
  description: string;
  link: string;
  technologies: string[];
  featured?: boolean;
};

export const projectList: Project[] = [
  {
    title: "NeuralNet Dashboard",
    description: "Visualizing model drift and performance metrics in real-time.",
    link: "",
    technologies: ["Next.js", "Tailwind", "Python"],
    featured: true
  },
  {
    title: "Sentinel.sh",
    description: "Automated reconnaissance and vulnerability scanning tool for local networks.",
    link: "",
    technologies: ["Python", "Bash", "Nmap"],
    featured: true
  },
  {
    title: "Quantum State Visualizer",
    description: "An interactive web app demystifying fundamental quantum logic gates.",
    link: "",
    technologies: ["React", "Three.js", "TypeScript"],
  },
  {
    title: "Project Entropy",
    description: "Led a 4-person team to build a secure, end-to-end encrypted chat protocol for our university club.",
    link: "",
    technologies: ["Node.js", "WebSockets", "Cryptography"],
  },
  {
    title: "Personal Knowledge Base",
    description: "Core maintainer of a growing knowledge base indexing algorithms, security CTF writeups, and philosophical reflections.",
    link: "",
    technologies: ["Next.js", "MDX", "Tailwind"],
  }
];