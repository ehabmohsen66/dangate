import React from 'react';

export function NextMoveAnimation({ className = '' }: { className?: string }) {
  return (
    <div className={`next-move-loader-wrap ${className}`} aria-hidden="true">
      <div className="next-move-loader">
        <div className="nm-strich1">
          <div className="nm-strich2">
            <div className="nm-bubble nm-bubble0" />
            <div className="nm-bubble nm-bubble1" />
            <div className="nm-bubble nm-bubble2" />
            <div className="nm-bubble nm-bubble3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NextMoveAnimation;
