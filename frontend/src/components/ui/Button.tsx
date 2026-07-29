"use client";

import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
};

export default function Button({
  title,
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`primary-btn ${className ?? ""}`}
    >
      {title}
    </button>
  );
}
