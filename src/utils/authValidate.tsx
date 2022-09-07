import * as yup from 'yup'

export const registerValidationSchema = yup.object().shape({
  fullName: yup.string().min(3).max(30).required('Full Name is required'),
  email: yup.string().email('Please enter valid email').required('Email is required'),
  number: yup.number().required('Number is required'),
  address: yup.string().min(5).max(150).required('Address is required'),
  password: yup
    .string()
    .min(5, 'Passoword is too short')
    .matches(/[a-zA-Z0-9]/, 'Password should container Upper and loawer case letters and numbers.')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is Required')
})

export const loginValidationSchema = yup.object().shape({
  email: yup.string().email('Please enter valid email').required('Email is required'),
  password: yup
    .string()
    .min(5, 'Passoword is too short')
    .matches(/[a-zA-Z0-9]/, 'Password should container Upper and loawer case letters and numbers.')
    .required('Password is required')
})
