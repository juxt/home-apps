import { useState } from "react";
import { usePopper } from "react-popper";

export function Popover({
  referenceEl,
  showPopper,
  children,
}: {
  referenceEl: any;
  showPopper: boolean;
  children: React.ReactNode;
}) {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceEl, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  return (
    <>
      {showPopper && (
        <div
          ref={setPopperElement}
          className="z-50 text-center shadow-lg rounded-md bg-blue-50 p-5"
          style={styles.popper}
          {...attributes.popper}
        >
          {children}
          <div
            className="absolute w-2.5 h-2.5 popper-arrow"
            id="arrow"
            ref={setArrowElement}
            style={styles.arrow}
          />
        </div>
      )}
    </>
  );
}
