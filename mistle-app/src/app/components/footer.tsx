
import React from 'react';

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-between items-center bg-darkbg text-white p-4 bg-opacity-80">
      <div className="gap-4 flex items-center">
          <a href="#" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Microsoft</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Google</a>
      </div>
      <div>
        <p>Logo</p>
      </div>
    </footer>
  );
}

export default Footer;
