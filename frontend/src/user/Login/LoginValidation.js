function Validation(values) {

  let error = {}

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const password_pattern = /^.{8,}$/;



  if (values.email === "") {
    error.email = "Name should not be empty"
  }
  else if (!email_pattern.test(values.email)) {
    error.email = "Email Didn't match"
  }
  else {
    error.email = ""
  }
  if (values.password === "") {
    error.password = "Password should not be empty"
  }
  else if (!password_pattern.test(values.password)) {
    error.password = "Password must be at least 8 characters"
  }
  else {

    error.password = ""
  }

  return error;
}
export default Validation;