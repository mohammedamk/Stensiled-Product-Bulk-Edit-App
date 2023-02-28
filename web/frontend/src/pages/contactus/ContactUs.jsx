import { useState } from 'react';
import {
  Card,
  TextField,
  FormLayout,
  Button,
  InlineError,
} from '@shopify/polaris';
import { isEmpty } from 'lodash';

import ToastWrapper from '../../components/ToastWrapper';

import { useAuthenticatedFetch } from '../../../hooks';


const initialFormValues = {
  email: '',
  name: '',
  message: '',
};

const defaultToastOptions = {
  active: false,
  message: '',
  error: false,
};

const ContactForm = (props) => {
  const fetch = useAuthenticatedFetch();

  // console.log(props, 'props');
  const [formValues, setFormValues] = useState(initialFormValues);
  const { email, name, message } = formValues;
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState('success');
  const [toast, setToast] = useState(defaultToastOptions);
  const isInvalid = (name) => {
    if (isFormSubmitted && isEmpty(formValues[name])) {
      return true;
    } else {
      return false;
    }
  };
  const onFormSubmit = async () => {
    try {
      setFormSubmitted(true);
      if (isEmpty(name) || isEmpty(email) || isEmpty(message)) {
        return false;
      };
      setFormState('loading');
      const ticketId = Math.ceil((Date.now() + Math.random()) / 100000000);
      const payload = {
        mailOptions: { name, email, message, ticketId },
      };


      // const response = await api.post('/contactus', payload);
      const contactUsForm = async () => {


        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        };
        await fetch('/api/contactus/post', requestOptions)
          .then(response => response.json())
      }

      await contactUsForm();


      setFormState('success');
      setFormSubmitted(false);
      setToast({
        active: true,
        message: `Ticket submitted successfully`,
        error: false,
      });
      setFormValues(initialFormValues);
    } catch (err) {
      setFormState('failed');
      console.log(err, 'error');
      setToast({
        active: true,
        message: `${(err && err.response && err.response.statusText) || err}`,
        error: true,
      });
    }
  };
  return (
    <Card sectioned>
      <FormLayout>
        <TextField
          name="name"
          type="name"
          error={isInvalid('name')}
          label={'Full Name'}
          value={name}
          id="name"
          onChange={(value) => setFormValues({ ...formValues, name: value })}
        />
        {isFormSubmitted && isInvalid('name') && (
          <InlineError message={'Required'} fieldID={'name'} />
        )}
        <TextField
          name="email"
          type="email"
          error={isInvalid('email')}
          label={'Email'}
          id="email"
          value={email}
          onChange={(value) => setFormValues({ ...formValues, email: value })}
        />
        {isFormSubmitted && isInvalid('email') && (
          <InlineError message={'Required'} fieldID={'email'} />
        )}
        <TextField
          name="message"
          type="message"
          id="message"
          error={isInvalid('message')}
          label={'Desciption'}
          value={message}
          onChange={(value) => setFormValues({ ...formValues, message: value })}
          multiline
        />
        {isFormSubmitted && isInvalid('message') && (
          <InlineError message={'Required'} fieldID={'message'} />
        )}{' '}
        <Button primary onClick={onFormSubmit}>
          Submit Query
        </Button>
      </FormLayout>
      <ToastWrapper
        active={toast.active}
        message={toast.message}
        error={toast.error}
        onDismiss={() => setToast({ defaultToastOptions })}
      />
    </Card>
  );
};


export default ContactForm;