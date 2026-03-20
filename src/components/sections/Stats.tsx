import { motion } from "framer-motion";
import { SectionWrapper } from "../../hoc";
import AnimatedCounter from "../atoms/AnimatedCounter";
import { Header } from "../atoms/Header";

const stats = [
  { end: 3, suffix: "+", label: "Years Experience" },
  { end: 15, suffix: "+", label: "Projects Completed" },
  { end: 10, suffix: "+", label: "Technologies" },
  { end: 100, suffix: "%", label: "Client Satisfaction" },
];

const Stats = () => {
  return (
    <>
      <Header useMotion={true} p="Achievements" h2="Stats." />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <AnimatedCounter
            key={index}
            end={stat.end}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </motion.div>
    </>
  );
};

export default SectionWrapper(Stats, "stats");
