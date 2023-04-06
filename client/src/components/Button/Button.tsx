import {
  black,
  primaryColor,
  primaryColorHover,
  secondaryColor,
  secondaryColorHover,
  white,
} from "../../consts/styles";

import { ReactNode } from "react";
import styled from "styled-components";

type Props = {
  children: ReactNode;
  variant: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = ({ children, onClick, type, variant }: Props) => {
  return (
    <PrimaryButton onClick={onClick} type={type} variant={variant}>
      {children}
    </PrimaryButton>
  );
};

export default Button;

const PrimaryButton = styled.button<{
  variant: "primary" | "secondary";
}>`
  border: none;
  border-radius: 25px;
  background-color: ${({ variant }) => (variant === "primary" ? primaryColor : secondaryColor)};
  padding: 7px 23px;
  text-transform: uppercase;
  color: ${({ variant }) => (variant === "primary" ? white : black)};
  cursor: pointer;
  font-size: 16px;
  font-size: 0.8rem;
  margin: 10px 5px;
  white-space: nowrap;
  &:hover {
    background-color: ${({ variant }) =>
      variant === "primary" ? primaryColorHover : secondaryColorHover};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
