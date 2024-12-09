import React, { useState } from 'react';

type DropzoneProps = {
  onDrop: (files: DataTransferItemList) => void;
  children: React.ReactNode;
};

const Dropzone: React.FC<DropzoneProps> = ({ onDrop, children }) => {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const { items } = event.dataTransfer;
    if (items && items.length) {
      onDrop(items);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    // setDragging(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      style={{ position: 'relative' }}
    >
      {dragging && (
        <div
          className="drag-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            textAlign: 'center',
            display: 'grid',
            alignContent: 'center'
          }}
        >Please Drag&Drop Files Here.</div>
      )}
      {children}
    </div>
  );
};

export default Dropzone;