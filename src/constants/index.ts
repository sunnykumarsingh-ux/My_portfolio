import type {
  TNavLink,
  TService,
  TTechnology,
  TExperience,
  TTestimonial,
  TProject,
} from "../types";

import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

export const navLinks: TNavLink[] = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services: TService[] = [
  {
    title: "Frontend Developer",
    icon: web,
  },
  {
    title: "Cyber Security Student",
    icon: mobile,
  },
  {
    title: "CTF Player",
    icon: backend,
  },
  {
    title: "Network Security Basics",
    icon: creator,
  },
];

const technologies: TTechnology[] = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences: TExperience[] = [
  {
    title: "Cybersecurity Experience",
    companyName: "CTF Challenges",
    icon: starbucks,
    iconBg: "#383E56",
    date: "Labs / Practice",
    points: [
      "Cybersecurity Enthusiast (CTF Player)",
      "Participated in Capture The Flag (CTF) competitions",
      "Solved challenges related to cryptography, web security, and networking",
      "Gained hands-on experience in ethical hacking tools and techniques",
    ],
  },
  {
    title: "College Work",
    companyName: "Cyber Security Lab Work",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "Lab",
    points: [
      "Performed network security analysis and vulnerability testing",
      "Worked on encryption and decryption models",
      "Learned basics of secure communication protocols",
    ],
  },
  {
    title: "Education",
    companyName: "Advance Diploma in Computer Application (ADCA)",
    icon: shopify,
    iconBg: "#383E56",
    date: "MTCL Computer Center | 2021",
    points: [
      "Covered fundamentals of computer applications, MS Office, and basic programming",
      "Built strong foundation in IT and software usage",
    ],
  },
];

const testimonials: TTestimonial[] = [
  {
    testimonial:
      "Build secure web applications\nLearn and apply cybersecurity concepts\nWork on real-world projects\nExplore AI in security",
    name: "What I Do",
    designation: "",
    company: "",
    image: "",
  },
  {
    testimonial:
      "Participated in CTF challenges\nBuilt AI-based IDS project\nDeveloped secure data wiping tool\nStrong foundation in cybersecurity & development",
    name: "My Highlights",
    designation: "",
    company: "",
    image: "",
  },
  {
    testimonial:
      "AI in Cybersecurity\nEthical Hacking\nWeb Security\nMachine Learning Basics",
    name: "What I'm Learning",
    designation: "",
    company: "",
    image: "",
  },
];

const projects: TProject[] = [
  {
    name: "AI-Based Intrusion Detection System (IDS)",
    description:
      "Started with the idea of detecting cyber attacks using AI and machine learning. Focused on analyzing network traffic and identifying suspicious patterns in real time. Currently improving accuracy and reducing false positives to make it more reliable.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "machine-learning",
        color: "green-text-gradient",
      },
      {
        name: "cybersecurity",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    sourceCodeLink: "https://github.com/",
  },
  {
    name: "Cross-Platform Data Wiping Tool",
    description:
      "Began with the goal of securely deleting sensitive data across multiple platforms. Implemented advanced overwriting techniques to ensure data cannot be recovered. Expanded support to external devices like USB and SD cards for complete data protection.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "security",
        color: "green-text-gradient",
      },
      {
        name: "data-protection",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    sourceCodeLink: "https://github.com/",
  },
  {
    name: "WhatsApp Auto Message Transfer Tool",
    description:
      "Started to simplify the process of transferring WhatsApp data between devices. Developed an automated solution to handle message backup and migration. Improved speed and reduced manual effort for seamless data transfer.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "automation",
        color: "green-text-gradient",
      },
      {
        name: "nodejs",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    sourceCodeLink: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };
