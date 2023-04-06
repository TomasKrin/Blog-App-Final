import * as Yup from "yup";

import { Form, Formik } from "formik";

import Button from "../../components/Button/Button";
import FormikInput from "../../components/Formik/FormikInput";
import { LOGIN_PATH } from "../../routes/consts";
import { NewUser } from "../../types/userTypes";
import { required } from "../../consts/validations";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useCreateUser } from "../../hooks/user";
import { useNavigate } from "react-router-dom";

const initialValues: NewUser = {
  name: "",
  last_name: "",
  email: "",
  nickname: "",
  password: "",
  confirm_password: "",
};

const validationSchema: Yup.ObjectSchema<NewUser> = Yup.object().shape({
  name: Yup.string().required(required),
  last_name: Yup.string().required(required),
  email: Yup.string().email("Invalid Email").required(required),
  nickname: Yup.string().required(required),
  password: Yup.string().required(required),
  confirm_password: Yup.string()
    .required("Please retype your password.")
    .oneOf([Yup.ref("password")], "Your passwords do not match."),
});

const Register = () => {
  const navigate = useNavigate();
  const { mutateAsync: createUser } = useCreateUser();

  const handleSubmit = (values: NewUser) => {
    const { confirm_password, ...user } = values;
    createUser(user)
      .then(() => {
        toast.success("Successfully registered!");
        setTimeout(() => {
          navigate(LOGIN_PATH);
        }, 500);
      })
      .catch((response) => {
        console.error(response.response.data);
        toast.error("User already exists..");
      });
  };

  return (
    <PageContainer>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <h1>Register</h1>
            <RowContainer>
              <FormikInput type="text" name="name" placeholder="Name" />
            </RowContainer>
            <RowContainer>
              <FormikInput type="text" name="last_name" placeholder="Last Name" />
            </RowContainer>
            <RowContainer>
              <FormikInput type="email" name="email" placeholder="Email" />
            </RowContainer>
            <RowContainer>
              <FormikInput type="text" name="nickname" placeholder="Nickname" />
            </RowContainer>
            <RowContainer>
              <FormikInput type="password" name="password" placeholder="Password" />
            </RowContainer>
            <RowContainer>
              <FormikInput type="password" name="confirm_password" placeholder="Confirm Password" />
            </RowContainer>
            <RowContainer>
              <Button variant="primary" disabled={isSubmitting}>
                Register
              </Button>
              <span onClick={() => navigate(LOGIN_PATH)}>Login</span>
            </RowContainer>
          </StyledForm>
        )}
      </Formik>
    </PageContainer>
  );
};

export default Register;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  overflow: hidden;
  h1 {
    text-align: center;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 350px;
  gap: 16px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  span {
    margin-top: 15px;
    align-self: center;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
