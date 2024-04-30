import React from "react";

const TutorialContent = ({ linkChange }: { linkChange: string }) => {
  const [content, setContent] = React.useState<any>(null);

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        setContent(null);
        const queryParams = new URLSearchParams(window.location.search);
        const tutorialID = queryParams.get("tutorial");
        if (typeof tutorialID === "string") {
          const module = await import(`./tutorialContent/${tutorialID}.json`);
          setContent(module.default);
        } else {
          const module = await import(
            `./tutorialContent/tutorials-homepage.json`
          );
          setContent(module.default);
        }
      } catch (error) {
        console.error("Error loading tutorial content:", error);
      }
    };

    loadContent();
  }, [linkChange]);

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <img
          src="/logo.svg"
          alt="loading"
          className="w-24 h-24 animate-bounce"
        />
      </div>
    );
  }

  return (
    <div className="p-4 text-white">
      <p>{content.title}</p>
      <p>{content.description}</p>
      <img src={content.imageUrl} className="size-56" alt={content.title} />
    </div>
  );
};

export default TutorialContent;
