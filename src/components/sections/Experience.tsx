import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";

import { experiences } from "../../constants";
import { SectionWrapper } from "../../hoc";
import { Header } from "../atoms/Header";
import { TExperience } from "../../types";
import { config } from "../../constants/config";
import { useTheme } from "../../context/ThemeContext";

const ExperienceCard: React.FC<TExperience & { isDark: boolean }> = ({ isDark, ...experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: isDark ? "#1d1836" : "#ffffff",
        color: isDark ? "#fff" : "#1a1a2e",
        boxShadow: isDark ? undefined : "0 3px 12px rgba(0,0,0,0.08)",
      }}
      contentArrowStyle={{
        borderRight: `7px solid ${isDark ? "#232631" : "#ffffff"}`,
      }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={experience.icon}
            alt={experience.companyName}
            className="h-[60%] w-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-[24px] font-bold text-white">{experience.title}</h3>
        <p
          className="text-secondary text-[16px] font-semibold"
          style={{ margin: 0 }}
        >
          {experience.companyName}
        </p>
      </div>

      <ul className="ml-5 mt-5 list-disc space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 pl-1 text-[14px] tracking-wider"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <Header useMotion={true} {...config.sections.experience} />

      <div className="mt-20 flex flex-col">
        <VerticalTimeline lineColor={isDark ? undefined : "#c8c8d8"}>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} isDark={isDark} {...experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
