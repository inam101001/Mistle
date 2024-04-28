// TutorialContent.js
import React from "react";

const TutorialContent = ({ tutorial }: { tutorial: string }) => {
  const [content, setContent] = React.useState<any>(null);

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        setContent(null);
        const tutorialID = tutorial.toLowerCase().replace(/\s+/g, "-");
        if (typeof tutorialID === "string") {
          const module = await import(`./tutorialContent/${tutorialID}.json`);
          setContent(module.default);
        }
      } catch (error) {
        console.error("Error loading tutorial content:", error);
      }
    };

    loadContent();
  }, [tutorial]);

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <img
          src="/logo.svg"
          alt="loading"
          className="w-28 h-28 animate-bounce"
        />
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
      <p>{tutorial}</p>
      <p>{content.title}</p>
      <p>{content.description}</p>
      <img src={content.imageUrl} className="size-56" alt={content.title} />
    </div>
  );
};

export default TutorialContent;
