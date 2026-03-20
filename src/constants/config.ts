type TSection = {
  p: string;
  h2: string;
  content?: string;
};

type TConfig = {
  html: {
    title: string;
    fullName: string;
    email: string;
  };
  hero: {
    name: string;
    p: string[];
  };
  contact: {
    form: {
      name: {
        span: string;
        placeholder: string;
      };
      email: {
        span: string;
        placeholder: string;
      };
      message: {
        span: string;
        placeholder: string;
      };
    };
  } & TSection;
  sections: {
    about: Required<TSection>;
    experience: TSection;
    feedbacks: TSection;
    works: Required<TSection>;
  };
};

export const config: TConfig = {
  html: {
    title: "Sunny — Portfolio",
    fullName: "Sunny",
    email: "sunny@mail.com",
  },
  hero: {
    name: "Sunny",
    p: ["", ""],
  },
  contact: {
    p: "Get in touch",
    h2: "Contact.",
    form: {
      name: {
        span: "Your Name",
        placeholder: "What's your name?",
      },
      email: { span: "Your Email", placeholder: "What's your email?" },
      message: {
        span: "Your Message",
        placeholder: "What do you want to say?",
      },
    },
  },
  sections: {
    about: {
      p: "Introduction",
      h2: "Overview.",
      content: `Hi, I'm Sunny Kumar, a Cyber Security undergraduate with strong knowledge in cryptography, network security, and ethical hacking. I'm passionate about safeguarding digital systems and exploring emerging security trends.`,
    },
    experience: {
      p: "What I have done so far",
      h2: "Work Experience.",
    },
    feedbacks: {
      p: "Most",
      h2: "Recommended.",
    },
    works: {
      p: "My work",
      h2: "Projects.",
      content: `I am working to improve my skills in cybersecurity and development by learning AI-based security, ethical hacking, and modern web technologies, with the goal of building simple solutions for real-world problems.`,
    },
  },
};
