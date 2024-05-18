const HelpModal = () => {
  const shortcuts = [
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Copy Selection",
      shortcut: "Ctrl + C",
    },
    {
      name: "Cut Selection",
      shortcut: "Ctrl + X",
    },
    {
      name: "Paste Selection",
      shortcut: "Ctrl + V",
    },
    {
      name: "Undo",
      shortcut: "Ctrl + Z",
    },
    {
      name: "Redo",
      shortcut: "Ctrl + Y",
    },
    {
      name: "Delete Selection",
      shortcut: "Delete",
    },
    {
      name: "Center Selection",
      shortcut: "Spacebar",
    },
    {
      name: "Go to Full Screen",
      shortcut: "F11",
    },
    {
      name: "Add new node on canvas",
      shortcut: "Double Left Click",
    },
    {
      name: "Add label on link",
      shortcut: "Double Click on Link",
    },
    {
      name: "Open Context Menu",
      shortcut: "Right Click on Selection",
    },
    {
      name: "Selection Box",
      shortcut: "Left Click Hold & Drag",
    },
    {
      name: "Move Selection",
      shortcut: "Arrow Keys",
    },
    {
      name: "Precise Selection Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Free Rotation",
      shortcut: "Shift + Rotate",
    },
    {
      name: "Multiple Selection",
      shortcut: "Shift/Ctrl + Select",
    },
    {
      name: "Group Selection",
      shortcut: "Ctrl + G",
    },
    {
      name: "Ungroup Selection",
      shortcut: "Ctrl + Shift + G",
    },
    {
      name: "Zoom In/Out",
      shortcut: "+ & -",
    },
    {
      name: "Zoom to Fit",
      shortcut: "Shift + Z",
    },
  ];
  return (
    <ul
      className="h-screen pb-32 md:pb-80"
      style={{ scrollbarWidth: "none", overflowY: "scroll" }}
    >
      {shortcuts.map((shortcut, index) => (
        <li
          key={index}
          className="flex items-center justify-between px-1 mb-6 border-b border-white border-opacity-5 pb-2"
        >
          <p className="py-0.5 text-white">{shortcut.name}</p>
          <span className="bg-neutral-800 text-neutral-300 py-1 px-1.5 rounded-md font-medium shadow-black shadow-md">
            {shortcut.shortcut}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default HelpModal;
