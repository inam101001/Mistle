"use client";
import * as go from "gojs";
import { produce } from "immer";
import * as React from "react";

import DiagramWrapper from "./DiagramWrapper";

interface AppState {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  selectedData: go.ObjectData | null;
  skipsDiagramUpdate: boolean;
}

const App: React.FC = () => {
  const [state, setState] = React.useState<AppState>({
    nodeDataArray: [
      { text: "Start", color: "white", shape: "Start", key: 1, loc: "10 -185" },
      {
        text: "Input Value 1",
        color: "white",
        shape: "Input",
        key: 2,
        loc: "-30.474880573361418 -100",
      },
      {
        text: "Process 1",
        color: "white",
        shape: "Process",
        key: 3,
        loc: "1.9719654349393636 -10",
      },
      {
        text: "Input Value 2",
        color: "white",
        shape: "Input",
        key: 4,
        loc: "-30.474880573361418 85",
      },
      {
        text: "Decision 1",
        color: "white",
        shape: "Decision",
        key: 5,
        loc: "-50.76237904748251 155",
      },
      {
        text: "Output Value 1",
        color: "white",
        shape: "Input",
        key: 6,
        loc: "-38.74831807336142 300",
      },
      {
        text: "Output Value 2",
        color: "white",
        shape: "Input",
        key: 7,
        loc: "190 170.61593551635744",
      },
      {
        text: "End",
        color: "white",
        shape: "Start",
        key: 8,
        loc: "244.69955311265102 292.91835482397744",
      },
    ],
    linkDataArray: [
      { from: 1, to: 2, key: -1, text: "" },
      { from: 2, to: 3, key: -2, text: "" },
      { from: 3, to: 4, key: -3, text: "" },
      { from: 4, to: 5, key: -4, text: "" },
      { from: 5, to: 7, key: -5, text: "" },
      { from: 5, to: 6, key: -6, text: "" },
      { from: 7, to: 8, key: -7, text: "" },
      { from: 6, to: 8, key: -8, text: "" },
    ],
    modelData: {
      canRelink: true,
    },
    selectedData: null,
    skipsDiagramUpdate: false,
  });

  // Maps to store key -> arr index for quick lookups
  const mapNodeKeyIdx = React.useRef(new Map<go.Key, number>());
  const mapLinkKeyIdx = React.useRef(new Map<go.Key, number>());

  React.useEffect(() => {
    // init maps
    refreshNodeIndex(state.nodeDataArray);
    refreshLinkIndex(state.linkDataArray);
  }, [state.nodeDataArray, state.linkDataArray]);

  /**
   * Update map of node keys to their index in the array.
   */
  const refreshNodeIndex = (nodeArr: Array<go.ObjectData>) => {
    mapNodeKeyIdx.current.clear();
    nodeArr.forEach((n: go.ObjectData, idx: number) => {
      mapNodeKeyIdx.current.set(n.key, idx);
    });
  };

  /**
   * Update map of link keys to their index in the array.
   */
  const refreshLinkIndex = (linkArr: Array<go.ObjectData>) => {
    mapLinkKeyIdx.current.clear();
    linkArr.forEach((l: go.ObjectData, idx: number) => {
      mapLinkKeyIdx.current.set(l.key, idx);
    });
  };

  /**
   * Handle any relevant DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedData state.
   * @param e a GoJS DiagramEvent
   */
  const handleDiagramEvent = (e: go.DiagramEvent) => {
    const name = e.name;
    switch (name) {
      case "ChangedSelection": {
        const sel = e.subject.first();
        setState(
          produce((draft: AppState) => {
            if (sel) {
              if (sel instanceof go.Node) {
                const idx = mapNodeKeyIdx.current.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const nd = draft.nodeDataArray[idx];
                  draft.selectedData = nd;
                }
              } else if (sel instanceof go.Link) {
                const idx = mapLinkKeyIdx.current.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const ld = draft.linkDataArray[idx];
                  draft.selectedData = ld;
                }
              }
            } else {
              draft.selectedData = null;
            }
          })
        );
        break;
      }
      default:
        break;
    }
  };

  /**
   * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
   * This method iterates over those changes and updates state to keep in sync with the GoJS model.
   * @param obj a JSON-formatted string
   */
  const handleModelChange = (obj: go.IncrementalData) => {
    const insertedNodeKeys = obj.insertedNodeKeys;
    const modifiedNodeData = obj.modifiedNodeData;
    const removedNodeKeys = obj.removedNodeKeys;
    const insertedLinkKeys = obj.insertedLinkKeys;
    const modifiedLinkData = obj.modifiedLinkData;
    const removedLinkKeys = obj.removedLinkKeys;
    const modifiedModelData = obj.modelData;

    // maintain maps of modified data so insertions don't need slow lookups
    const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
    const modifiedLinkMap = new Map<go.Key, go.ObjectData>();
    setState(
      produce((draft: AppState) => {
        let narr = draft.nodeDataArray;
        if (modifiedNodeData) {
          modifiedNodeData.forEach((nd: go.ObjectData) => {
            modifiedNodeMap.set(nd.key, nd);
            const idx = mapNodeKeyIdx.current.get(nd.key);
            if (idx !== undefined && idx >= 0) {
              narr[idx] = nd;
              if (draft.selectedData && draft.selectedData.key === nd.key) {
                draft.selectedData = nd;
              }
            }
          });
        }
        if (insertedNodeKeys) {
          insertedNodeKeys.forEach((key: go.Key) => {
            const nd = modifiedNodeMap.get(key);
            const idx = mapNodeKeyIdx.current.get(key);
            if (nd && idx === undefined) {
              // nodes won't be added if they already exist
              mapNodeKeyIdx.current.set(nd.key, narr.length);
              narr.push(nd);
            }
          });
        }
        if (removedNodeKeys) {
          narr = narr.filter((nd: go.ObjectData) => {
            if (removedNodeKeys.includes(nd.key)) {
              return false;
            }
            return true;
          });
          draft.nodeDataArray = narr;
          refreshNodeIndex(narr);
        }

        let larr = draft.linkDataArray;
        if (modifiedLinkData) {
          modifiedLinkData.forEach((ld: go.ObjectData) => {
            modifiedLinkMap.set(ld.key, ld);
            const idx = mapLinkKeyIdx.current.get(ld.key);
            if (idx !== undefined && idx >= 0) {
              larr[idx] = ld;
              if (draft.selectedData && draft.selectedData.key === ld.key) {
                draft.selectedData = ld;
              }
            }
          });
        }
        if (insertedLinkKeys) {
          insertedLinkKeys.forEach((key: go.Key) => {
            const ld = modifiedLinkMap.get(key);
            const idx = mapLinkKeyIdx.current.get(key);
            if (ld && idx === undefined) {
              // links won't be added if they already exist
              mapLinkKeyIdx.current.set(ld.key, larr.length);
              larr.push(ld);
            }
          });
        }
        if (removedLinkKeys) {
          larr = larr.filter((ld: go.ObjectData) => {
            if (removedLinkKeys.includes(ld.key)) {
              return false;
            }
            return true;
          });
          draft.linkDataArray = larr;
          refreshLinkIndex(larr);
        }
        // handle model data changes, for now just replacing with the supplied object
        if (modifiedModelData) {
          draft.modelData = modifiedModelData;
        }
        draft.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
      })
    );
  };

  /**
   * Handle inspector changes, and on input field blurs, update node/link data state.
   * @param path the path to the property being modified
   * @param value the new value of that property
   * @param isBlur whether the input event was a blur, indicating the edit is complete
   */
  const handleInputChange = (path: string, value: string, isBlur: boolean) => {
    setState(
      produce((draft: AppState) => {
        const data = draft.selectedData as go.ObjectData; // only reached if selectedData isn't null
        data[path] = value;
        if (isBlur) {
          const key = data.key;
          if (key < 0) {
            // negative keys are links
            const idx = mapLinkKeyIdx.current.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.linkDataArray[idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          } else {
            const idx = mapNodeKeyIdx.current.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.nodeDataArray[idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          }
        }
      })
    );
  };

  return (
    <div>
      <DiagramWrapper
        nodeDataArray={state.nodeDataArray}
        linkDataArray={state.linkDataArray}
        modelData={state.modelData}
        skipsDiagramUpdate={state.skipsDiagramUpdate}
        onDiagramEvent={handleDiagramEvent}
        onModelChange={handleModelChange}
      />
    </div>
  );
};

export default App;
