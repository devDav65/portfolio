export const personalInfo = {
  name: "KOKA Essowaba David",
  title: "Développeur Web et Mobile Full Stack",
  school: "IAI-TOGO",
  level: "2ème année — Génie Logiciel & Système d'Information",
  phone: "+228 71254851",
  email: "kessowaba@gmail.com",
  linkedin: "https://www.linkedin.com/in/davidkoka/",
  github: "https://github.com/devDav65",
  tagline:
    "Je conçois et développe des solutions web et mobiles innovantes avec un souci constant de performance et d'expérience utilisateur.",
};

export const services = [
  {
    id: 1,
    icon: "🌐",
    title: "Création de Sites Web",
    description:
      "Des interfaces modernes, performantes et accessibles, pensées pour convertir et engager.",
  },
  {
    id: 2,
    icon: "⚡",
    title: "Création d'API",
    description:
      "Des backends robustes et scalables avec Django REST Framework, FastAPI et ASP.NET Core.",
  },
  {
    id: 3,
    icon: "🔐",
    title: "Sécurisation d'Applications",
    description:
      "Audit, authentification sécurisée et protection des données pour des applications fiables.",
  },
  {
    id: 4,
    icon: "📱",
    title: "Développement Mobile",
    description:
      "Applications cross-platform fluides et natives avec Flutter pour iOS et Android.",
  },
];

export const skills = [
  {
    category: "Langages",
    items: ["JavaScript", "C", "C#", "Python", "Java", "SQL"],
  },
  {
    category: "Frontend",
    items: ["HTML", "CSS", "Tailwind CSS", "React"],
  },
  {
    category: "Backend",
    items: ["Django", "DRF", "FastAPI", "ASP.NET Core"],
  },
  {
    category: "Mobile",
    items: ["Flutter"],
  },
  {
    category: "Bases de données",
    items: ["MySQL", "MariaDB", "PostgreSQL"],
  },
  {
    category: "Outils",
    items: ["Docker", "Git", "GitHub", "Nginx", "Redis", "Supabase", "Postman"],
  },
  {
    category: "IDE",
    items: ["PyCharm", "Rider", "VSCode", "Android Studio", "NetBeans"],
  },
  {
    category: "Systèmes",
    items: ["Arch Linux", "Fedora", "Ubuntu", "Debian", "Windows"],
  },
];

export const projects = [
  {
    id: 1,
    title: "Droply",
    images: ["/projects/droply1.png", "/projects/droply2.png", "/projects/droply3.png"],
    description:
      "Application desktop de partage de fichiers hors ligne entre appareils sur le même réseau local. Interface épurée et transferts rapides sans connexion internet.",
    stack: ["Python", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/devDav65/miniserver",
    live: null,
  },
  {
    id: 2,
    title: "Atelier de Couture",
    images: ["/projects/couture1.png", "/projects/couture2.png", "/projects/couture3.png"],
    description:
      "Site complet pour atelier de couture : prise de rendez-vous en ligne, boutique e-commerce et catalogue de créations.",
    stack: ["Django", "HTML", "CSS", "Tailwind CSS"],
    github: "https://github.com/devDav65/Atelier_couture",
    live: null,
    
  },
  {
    id: 3,
    title: "Chatbot IA Gemini",
    images: ["/projects/chat1.png", "/projects/chat2.png", "/projects/chat3.png"],
    description:
        "Application de chatbot intelligent intégrée avec l'API Gemini de Google. Permet des conversations en temps réel avec une IA, interface web moderne et réponses dynamiques.",
    stack: ["FastAPI", "HTML", "CSS", "JavaScript", "Gemini API"],
    github: "https://github.com/Fried-06/Projet_chatbot",
    live: null,
  },
  {
    id: 4,
    title: "Todo Liste",
    images: ["/projects/todo1.png", "/projects/todo2.png", "/projects/todo3.png"],
    description:
      "Application de gestion de tâches avec authentification utilisateur, catégories et suivi de progression.",
    stack: ["Django", "HTML", "Tailwind CSS"],
    github: "https://github.com/devDav65/gestin_tache",
    live: null,
  },
  {
    id: 5,
    title: "Vibe",
    images: ["/projects/vibe1.png", "/projects/vibe2.png", "/projects/vibe3.png"],
    description:
      "Application moderne de gestion de tâches construite avec Next.js et TypeScript. UI premium avec animations fluides.",
    stack: ["Next.js", "TypeScript"],
    github: "https://github.com/devDav65/GestionStock",
    live: null,
  },

  {
    id: 6,
    title: "Gestion de Restaurant",
    images: ["/projects/resto1.jpeg", "/projects/resto2.jpeg", "/projects/resto3.jpeg"],
    description:
      "Application MVC complète pour la gestion d'un restaurant : commandes, tables, menu et tableau de bord. Projet scolaire.",
    stack: ["Java"],
    github: "https://github.com/devDav65/GestionRestaurant",
    live: null,
  },
];

export const stats = [
  { value: 7, label: "Projets réalisés", suffix: "+" },
  { value: 2, label: "Ans d'expérience", suffix: "+" },
  { value: 4, label: "Services proposés", suffix: "" },
  { value: 8, label: "Technologies maîtrisées", suffix: "+" },
];