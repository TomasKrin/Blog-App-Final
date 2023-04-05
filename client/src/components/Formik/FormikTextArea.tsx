import { ErrorMessage, Field } from "formik";

import { InputHTMLAttributes } from "react";
import { smallBorderRadius } from "../../consts/styles";
import styled from "styled-components";

type Props = {
  name: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"];
};

const FormikTextArea = ({ name, ...restProps }: Props) => {
  return (
    <div>
      <Field name={name} as={StyledArea} {...restProps} />
      <StyledErrorMessage name={name} component="div" />
    </div>
  );
};

export default FormikTextArea;

const StyledArea = styled.textarea`
  font-size: 16px;
  border-radius: ${smallBorderRadius};
  color: black;
  background-color: lightgray;
  border: 1px solid lightgray;
  padding: 10px 14px;
  outline: none;
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  margin-bottom: 8px;
`;

const StyledErrorMessage = styled(ErrorMessage)`
  color: red;
`;
