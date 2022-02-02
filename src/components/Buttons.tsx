import classNames from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  primary?: boolean;
  className?: string;
};

export function Button({ children, className, primary, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        "relative disabled:opacity-50 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50",
        className,
        primary &&
          "w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm",
        primary ? "text-white" : "text-gray-700"
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PageButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
