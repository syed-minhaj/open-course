"use client"
import React, { useState, useRef, useEffect } from 'react';

const ExpandableDescription = ({ description, maxHeight = 60 } : {description:string, maxHeight?:number}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const isContentOverflowing = contentRef.current.scrollHeight > maxHeight;
      setIsOverflowing(isContentOverflowing);
    }
  }, [description, maxHeight]);

  const containerStyle = {
    maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
  };

  return (
    <div className="w-full">
      <div
        className={`relative overflow-hidden transition-all duration-300`}
        style={containerStyle}
      >
        <p ref={contentRef} className="text-base opacity-60">
          {description}
        </p>
        
      </div>

      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 hover:text-blue-800 font-medium focus:outline-none opacity-65 "
        >
          {isExpanded ? 'hide' : '...more'}
        </button>
      )}
    </div>
  );
};

export default ExpandableDescription;