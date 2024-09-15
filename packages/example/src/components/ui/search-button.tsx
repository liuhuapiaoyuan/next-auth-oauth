"use client";
import React, { useEffect } from "react";

interface ButtonProps {
  /**
   * 是否可用
   * @default false
   */
  disabled?: boolean;
  /**
   * 按钮文字
   * @default "Search..."
   */
  buttonText?: string;
  /**
   * 按钮提示文字
   * @default "Search documentation..."
   */
  documentationText?: string;
  /**
   * 快捷键回调函数
   */
  onShortcut?: () => void; // 用于处理快捷键事件的回调
}

const SearchButton: React.FC<ButtonProps> = ({
  disabled = false,
  buttonText = "搜索...",
  documentationText = "快捷检索功能",
  onShortcut,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        if (onShortcut) {
          onShortcut();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onShortcut]);

  return (
    <div className="w-full flex-1 md:w-auto md:flex-none">
      <button
        className={`inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
      >
        <span className="hidden lg:inline-flex">{documentationText}</span>
        <span className="inline-flex lg:hidden">{buttonText}</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    </div>
  );
};

export default SearchButton;
