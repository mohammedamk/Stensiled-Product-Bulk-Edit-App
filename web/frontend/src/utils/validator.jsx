import isEmpty from 'lodash/isEmpty';

const validator = (values) => {
  // console.log(values, 'values in validator');
  let errors = {};
  const { editOption, editValue } = values;
  if (isEmpty(editValue)) {
    errors['editValue'] = 'Required!';
  }
  if (isEmpty(editOption)) {
    errors['editOption'] = 'Required!';
  }
  if (isEmpty()) return errors;
};

export default validator;
