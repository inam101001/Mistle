const HelpModal = () => {
  const shortcuts = [
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
    {
      name: "Select All",
      shortcut: "Ctrl + A",
    },
    {
      name: "Precision Movement",
      shortcut: "Ctrl + Arrow Keys",
    },
  ];
  return (
    <ul
      className="h-screen"
      style={{ scrollbarWidth: "none", overflowY: "scroll" }}
    >
      {shortcuts.map((shortcut, index) => (
        <li
          key={index}
          className="flex items-center justify-between px-1 mb-6 border-b border-white border-opacity-5 pb-1"
        >
          <p className="py-0.5">{shortcut.name}</p>
          <span className="bg-neutral-800 py-1 px-1.5 rounded-md font-semibold">
            {shortcut.shortcut}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default HelpModal;
