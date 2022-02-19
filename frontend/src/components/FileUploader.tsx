
import React, { ReactNode, useEffect, useRef, useState, DragEvent, ChangeEvent } from 'react';
import classnames from 'classnames';

import './FileUploader.scss';

type FileProps = {
  dragging: boolean;
  onSelectFileClick: () => void;
  onDrag: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  children: ReactNode;
};

const FileUploaderComponent = ({
  dragging,
  onSelectFileClick,
  onDrag,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  children,
}: FileProps) => {
  const uploaderClasses = classnames('file_uploader', { 'file_uploader__dragging': dragging });

  return (
    <div
      className={uploaderClasses}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}>
      {children}
    </div>
  );
};

type Props = {
  files: FileList | undefined,
  onDrop: (files: FileList) => void;
};

const FileUploader = ({ files, onDrop }: Props): React.ReactElement<'div'> => {
  const [dragging, setDragging] = useState(false);
  const [counter, setCounter] = useState(0);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.addEventListener('dragover', (event: Event) => {
      overrideEventDefaults(event);
    });
    window.addEventListener('drop', (event: Event) => {
      overrideEventDefaults(event);
    });

    return () => {
      window.removeEventListener('dragover', overrideEventDefaults);
      window.removeEventListener('drop', overrideEventDefaults);
    };
  }, []);

  const dragenterListener = (event: React.DragEvent<HTMLDivElement>) => {
    overrideEventDefaults(event);
    setCounter(counter + 1);
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      setDragging(true);
    } else if (
      event.dataTransfer.types
            && event.dataTransfer.types[0] === 'Files'
    ) {
      // This block handles support for IE - if you're not worried about
      // that, you can omit this
      setDragging(true);
    }
  };

  const dragleaveListener = (event: DragEvent<HTMLDivElement>) => {
    overrideEventDefaults(event);
    setCounter(counter - 1);

    if (counter === 0) {
      setDragging(true);
    }
  };

  const dropListener = (event: DragEvent<HTMLDivElement>) => {
    overrideEventDefaults(event);
    setCounter(0);
    setDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length === 1) {
      onDrop(event.dataTransfer.files);
    }
  };

  const overrideEventDefaults = (event: Event | DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onSelectFileClick = () => {
    ref.current?.click();
  };

  const onFileChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length === 1) {
      onDrop(event.target.files);
    }
  };

  return (
    <FileUploaderComponent
      dragging={dragging}
      onSelectFileClick={onSelectFileClick}
      onDrag={overrideEventDefaults}
      onDragStart={overrideEventDefaults}
      onDragEnd={overrideEventDefaults}
      onDragOver={overrideEventDefaults}
      onDragEnter={dragenterListener}
      onDragLeave={dragleaveListener}
      onDrop={dropListener}>
      <input
        ref={ref}
        type='file'
        className='file_uploader__input'
        onChange={onFileChanged} />
    </FileUploaderComponent>
  );
};

export default FileUploader;