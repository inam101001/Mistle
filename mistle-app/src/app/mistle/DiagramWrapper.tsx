import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import * as React from "react";
import { saveAs } from "file-saver";
import "./extensions/figures";
import "./DiagramWrapper.css";

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

const DiagramWrapper: React.FC<DiagramProps> = (props) => {
  const diagramRef = React.useRef<ReactDiagram>(null);
  const diagramStyle = { backgroundColor: "#eee" };

  const [grid, setGrid] = React.useState(true);

  React.useEffect(() => {
    const diagram = diagramRef.current?.getDiagram();

    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener("ChangedSelection", props.onDiagramEvent);
    }

    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener("ChangedSelection", props.onDiagramEvent);
      }
    };
  }, [props.onDiagramEvent]);

  React.useEffect(() => {
    const diagram = diagramRef.current?.getDiagram();

    if (diagram instanceof go.Diagram) {
      diagram.grid.visible = grid;
      diagram.toolManager.draggingTool.isGridSnapEnabled = grid;
      diagram.toolManager.resizingTool.isGridSnapEnabled = grid;
    }
  }, [grid]);

  const addNode = (e: any, obj: any, shape: string) => {
    const diagram = e.diagram;
    const data = { text: "New Node", color: "white", shape };
    // Include the shape information in the node data
    const point = diagram.lastInput.documentPoint;

    diagram.startTransaction("addNode");

    try {
      diagram.model.addNodeData(data);
      const node = diagram.findPartForData(data);
      if (node) {
        node.location = point;
      }
      diagram.commitTransaction("addNode");
    } catch (error) {
      diagram.rollbackTransaction("addNode");
      console.error("Error adding node:", error);
    }
  };

  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, {
      "undoManager.isEnabled": true,
      "clickCreatingTool.archetypeNodeData": {
        text: "New Node",
        color: "white",
      },
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key",
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });

    diagram.grid = $(
      go.Panel,
      "Grid",
      {
        name: "GRID",
        visible: grid, //We'll use button to set this to true/false dynamically
        gridCellSize: new go.Size(30, 30),
        gridOrigin: new go.Point(0, 0),
      },
      $(go.Shape, "LineH", {
        stroke: "#000000",
        strokeWidth: 0.5,
        interval: 1,
      }),
      $(go.Shape, "LineH", {
        stroke: "#000000",
        strokeWidth: 0.5,
        interval: 5,
      }),
      $(go.Shape, "LineH", {
        stroke: "#000000",
        strokeWidth: 1.0,
        interval: 10,
      }),
      $(go.Shape, "LineV", {
        stroke: "#000000",
        strokeWidth: 0.5,
        interval: 1,
      }),
      $(go.Shape, "LineV", {
        stroke: "#000000",
        strokeWidth: 0.5,
        interval: 5,
      }),
      $(go.Shape, "LineV", {
        stroke: "#000000",
        strokeWidth: 1.0,
        interval: 10,
      })
    );

    diagram.toolManager.draggingTool.isGridSnapEnabled = grid;
    diagram.toolManager.resizingTool.isGridSnapEnabled = grid;
    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      { resizable: true },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Shape,
        "RoundedRectangle",
        {
          name: "SHAPE",
          strokeWidth: 0,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          fromLinkableSelfNode: true,
          toLinkableSelfNode: true,
          //fromLinkableDuplicates: true, for multiple links to one node
          //toLinkableDuplicates: true,   for multiple links to one node
          cursor: "pointer",
        },
        new go.Binding("figure", "shape", (shape) => {
          // Map the shape property to the corresponding figure property for the flowchart shape
          switch (shape) {
            case "Start":
              return "Ellipse";
            case "Process":
              return "Rectangle";
            case "Decision":
              return "Diamond";
            case "Input":
              return "Parallelogram"; // We need to build a custom shape for this, figures.js extenstion might be helpful
            // Add more shape mappings as needed
            default:
              return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
          }
        }),
        new go.Binding("fill", "color")
      ),
      $(
        go.TextBlock,
        {
          margin: 6,
          editable: true,
          font: "400 1.2rem Tahoma, sans-serif",
          stroke: "black",
        },
        new go.Binding("text").makeTwoWay()
      )
    );

    const TextStyle = {
      font: "400 .875rem Tahoma, sans-serif",
      stroke: "black",
      margin: 2,
      spacingAbove: 1,
      spacingBelow: 2,
    };

    diagram.contextMenu = $(
      go.Adornment,
      "Vertical",
      $("ContextMenuButton", $(go.TextBlock, "-- Flowchart --", TextStyle), {
        click: () => console.log("Abey Shapes Pe Click kr na!"),
      }),
      $(
        "ContextMenuButton",
        $(go.TextBlock, "Add Start/End Symbol", TextStyle),
        {
          click: (e: any, obj: any) => addNode(e, obj, "Start"),
        }
      ),
      $("ContextMenuButton", $(go.TextBlock, "Add Process Symbol", TextStyle), {
        click: (e: any, obj: any) => addNode(e, obj, "Process"),
      }),
      $(
        "ContextMenuButton",
        $(go.TextBlock, "Add Decision Symbol", TextStyle),
        {
          click: (e: any, obj: any) => addNode(e, obj, "Decision"),
        }
      ),
      $("ContextMenuButton", $(go.TextBlock, "Add Input Symbol", TextStyle), {
        click: (e: any, obj: any) => addNode(e, obj, "Input"),
      })
      // Add more options for different flowchart shapes as needed
    );

    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Normal,
        curve: go.Link.Bezier,
        corner: 10,
        toShortLength: 4,
        fromShortLength: 4,
        fromEndSegmentLength: 20,
        toEndSegmentLength: 20,
        layerName: "Background",
        visible: true,
      },
      new go.Binding("relinkableFrom", "canRelink").ofModel(),
      new go.Binding("relinkableTo", "canRelink").ofModel(),
      $(go.Shape, { stroke: "white" }),
      $(go.Shape, { toArrow: "Standard", stroke: "white", fill: "white" })
    );

    return diagram;
  };

  const saveJSON = () => {
    const diagram = diagramRef.current?.getDiagram();
    const jsonData = diagram?.model.toJson();

    if (jsonData) {
      const blob = new Blob([jsonData], { type: "application/json" });

      saveAs(blob, "mistleDiagram.json");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        importJSON(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const importJSON = (jsonString: string) => {
    const diagram = diagramRef.current?.getDiagram();
    if (diagram) {
      diagram.model = go.Model.fromJson(jsonString);
    }
  };

  return (
    <>
      <ReactDiagram
        ref={diagramRef}
        divClassName="diagram-component"
        style={diagramStyle}
        initDiagram={initDiagram}
        nodeDataArray={props.nodeDataArray}
        linkDataArray={props.linkDataArray}
        modelData={props.modelData}
        onModelChange={props.onModelChange}
        skipsDiagramUpdate={props.skipsDiagramUpdate}
      />
      <div className="fixed flex justify-center items-center left-4 bottom-4 z-50">
        <input
          type="file"
          onChange={(e) => handleFileChange(e)}
          accept=".json"
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="btn">
          Load
        </label>
        <button onClick={() => saveJSON()} className="btn">
          Save
        </button>
        <button
          className="btn"
          onClick={() => setGrid((prevGrid) => !prevGrid)}
        >
          {grid ? "Hide Grid" : "Show Grid"}
        </button>
      </div>
    </>
  );
};

export default DiagramWrapper;
