import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";
import * as React from "react";
import { saveAs } from "file-saver";
import "./extensions/figures";
import RescalingTool from "./extensions/RescalingTool";
import DrawCommandHandler from "./extensions/DrawCommandHandler";
import GuidedDraggingTool from "./extensions/GuidedDraggingTool";
import LinkLabelDraggingTool from "./extensions/LinkLabelDraggingTool";
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

  const [selectedOption, setSelectedOption] = React.useState("option1");

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  let nodeDataArray: any;
  switch (selectedOption) {
    case "option1":
      nodeDataArray = [
        { key: "0", color: "white", text: "Start", shape: "Start" },
        { key: "1", color: "white", text: "Yes/No", shape: "Decision" },
        { key: "2", color: "white", text: "Process", shape: "Process" },
        { key: "3", color: "white", text: "Input", shape: "Input" },
      ];
      break;
    case "option2":
      nodeDataArray = [
        {
          key: "0",
          color: "white",
          text: "",
          shape: "Initial State",
        },
        { key: "1", color: "white", text: "State-Box", shape: "State Box" },
        { key: "2", color: "white", text: "Condition", shape: "Guard" },
        { key: "3", color: "white", text: "", shape: "EndState" },
      ];
      break;
    case "option3":
      nodeDataArray = [
        { key: "0", color: "white", text: "Block", shape: "Block" },
      ];
      break;
    default:
      nodeDataArray = [];
  }

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
      diagram.toolManager.mouseMoveTools.insertAt(
        0,
        new LinkLabelDraggingTool()
      );
      diagram.toolManager.draggingTool.gridSnapCellSize = new go.Size(5, 5);
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
      draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.js
      "draggingTool.horizontalGuidelineColor": "blue",
      "draggingTool.verticalGuidelineColor": "blue",
      "draggingTool.centerGuidelineColor": "green",
      "draggingTool.guidelineWidth": 1,
      "undoManager.isEnabled": true,
      commandHandler: $(DrawCommandHandler), // defined in DrawCommandHandler.js
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
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
        gridCellSize: new go.Size(10, 10),
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
    diagram.toolManager.mouseDownTools.add(new RescalingTool());

    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      { minSize: new go.Size(30, 30) },
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
              return "Input";
            case "Initial State":
              return "Circle";
            case "State Box":
              return "RoundedRectangle";
            case "EndState":
              return "EndState";
            case "Guard":
              return "Diamond";
            // Add more shape mappings as needed
            default:
              return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
          }
        }),
        new go.Binding("fill", "color")
      ),
      $(go.Shape, {
        width: 40,
        height: 25,
        strokeWidth: 0,
        fill: "transparent",
      }),
      $(
        go.TextBlock,
        {
          textAlign: "center",
          overflow: go.TextBlock.OverflowEllipsis,
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

    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        curve: go.Link.Orthogonal,
        adjusting: go.Link.Stretch,
        reshapable: true,
        corner: 10,
        toShortLength: 4,
        fromShortLength: 4,
        fromEndSegmentLength: 20,
        toEndSegmentLength: 20,
        layerName: "Background",
        visible: true,
      },
      new go.Binding("points").makeTwoWay(),
      new go.Binding("relinkableFrom", "canRelink").ofModel(),
      new go.Binding("relinkableTo", "canRelink").ofModel(),
      $(go.Shape, { stroke: "white" }),
      $(go.Shape, { toArrow: "Standard", stroke: "white", fill: "white" }),
      $(
        go.Panel,
        "Auto",
        { cursor: "move" },
        // $(
        //   go.Shape, // the label background, which becomes transparent around the edges
        //   {
        //     fill: $(go.Brush, "Radial", {
        //       0.2: "rgb(13, 13, 13)",
        //       0.3: "rgb(13, 13, 13)",
        //       0.5: "rgba(13, 13, 13, 0)",
        //     }),
        //     stroke: null,
        //   }
        // ),
        $(
          go.TextBlock,
          "Label", // the label text
          {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "white",
            margin: 4,
            editable: true, // editing the text automatically updates the model data
          },
          new go.Binding("text", "text").makeTwoWay()
        ),
        new go.Binding(
          "segmentOffset",
          "segmentOffset",
          go.Point.parse
        ).makeTwoWay(go.Point.stringify)
      )
    );
    return diagram;
  };

  const initPalette = () => {
    const $ = go.GraphObject.make;
    const palette = $(go.Palette);

    palette.nodeTemplate = $(
      go.Node,
      "Vertical",
      $(
        go.Shape,
        {
          strokeWidth: 1,
          fill: "white",
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
              return "Input";
            case "Initial State":
              return "Circle";
            case "State Box":
              return "RoundedRectangle";
            case "EndState":
              return "EndState";
            case "Guard":
              return "Diamond";
            // Add more shape mappings as needed
            default:
              return "RoundedRectangle"; // Default to RoundedRectangle if shape is not recognized
          }
        })
      ),
      $(
        go.TextBlock,
        {
          textAlign: "center",
          margin: 6,
          font: "400 1rem Tahoma, sans-serif",
          stroke: "black",
        },
        new go.Binding("text", "shape")
      )
    );

    return palette;
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
      <div className="container">
        <ReactPalette
          initPalette={initPalette}
          divClassName="palette-component"
          nodeDataArray={nodeDataArray || []}
        />
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="option1">Flowchart</option>
          <option value="option2">State Chart</option>
          <option value="option3">Block Diagram</option>
        </select>
      </div>
      <div className="fixed flex justify-center items-center left-4 bottom-4 z-50">
        <input
          type="file"
          onChange={(e) => handleFileChange(e)}
          accept=".json"
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="btn cursor-pointer">
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
