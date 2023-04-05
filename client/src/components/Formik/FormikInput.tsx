import { ErrorMessage, Field } from "formik";

import Input from "../Input/Input";
import { InputHTMLAttributes } from "react";
import styled from "styled-components";

type Props = {
  type: string;
  name: string;
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"];
};

const FormikInput = ({ name, ...restProps }: Props) => {
  return (
    <div>
      <Field name={name} as={Input} {...restProps} />
      <StyledErrorMessage name={name} component="div" />
    </div>
  );
};

export default FormikInput;

const StyledErrorMessage = styled(ErrorMessage)`
  color: red;
`;
