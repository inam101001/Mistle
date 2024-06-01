let Default = {
  // Default diagram data
  nodeDataArray: [],
  linkDataArray: [],
  modelData: {
    canRelink: true,
  },
  selectedData: null,
  skipsDiagramUpdate: false,
};

const retreiveDiagram = async (diagramID: string, userID: string) => {
  try {
    const response = await fetch(
      `/api/diagrams/retreiveDiagram?diagramID=${diagramID}&userID=${userID}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.diagram;
  } catch (error) {
    console.error(error);
    return Default;
  }
};

export default async function DiagramIDProvider( // Diagram ID provider
  diagramID: string,
  userID: string
) {
  try {
    const retreivedDiagram = await retreiveDiagram(diagramID, userID);
    return retreivedDiagram;
  } catch (err: any) {
    console.error(err.message);
  }
}
