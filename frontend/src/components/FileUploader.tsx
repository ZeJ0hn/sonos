
import React, { ReactNode, useEffect, useRef, useState, DragEvent, ChangeEvent, useMemo } from 'react';
import classnames from 'classnames';

import './FileUploader.scss';

type FileProps = {
  dragging: boolean;
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
  onDrop: (files: FileList) => void;
};

const FileUploader = ({ onDrop }: Props): React.ReactElement<'div'> => {
  const [dragging, setDragging] = useState(false);
  const [counter, setCounter] = useState(0);
  const [files, setFiles] = useState<FileList>();
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

    if (event.dataTransfer.files) {
      setFiles(event.dataTransfer.files);
      onDrop(event.dataTransfer.files);
    }
  };

  const overrideEventDefaults = (event: Event | DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onFileChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
      onDrop(event.target.files);
    }
  };

  const fileList = useMemo(() => {
    if (files)
      return Array.from(files).map((f) => <div key={f.name}>{f.name}</div>)
    return null;
  }, [files]);

  return (
    <FileUploaderComponent
      dragging={dragging}
      onDrag={overrideEventDefaults}
      onDragStart={overrideEventDefaults}
      onDragEnd={overrideEventDefaults}
      onDragOver={overrideEventDefaults}
      onDragEnter={dragenterListener}
      onDragLeave={dragleaveListener}
      onDrop={dropListener}>
      {fileList}
      <input
        ref={ref}
        type='file'
        className='file_uploader__input'
        onChange={onFileChanged} 
        multiple />
    </FileUploaderComponent>
  );
};

export default FileUploader;