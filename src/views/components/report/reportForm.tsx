import React from 'react';
import { Formik, Field, Form, FormikHelpers, ErrorMessage } from 'formik';

interface ReportValues {
  username: string;
  reason: string;
  description: string;
}

const ReportForm: React.FC = () => {
  const initialValues: ReportValues = {
    username: '',
    reason: '',
    description: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors: Partial<ReportValues> = {};
        if (!values.username) {
          errors.username = 'Required';
        }
        if (!values.reason) {
          errors.reason = 'Required';
        }
        if (!values.description) {
          errors.description = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, actions) => {
        console.log({ values, actions });
        alert(JSON.stringify(values, null, 2));
        actions.setSubmitting(false);
      }}
    >
      <Form>
        <div>
          <label htmlFor="username">Username</label>
          <Field id="username" name="username" />
          <ErrorMessage name="username" component="div" />
        </div>

        <div>
          <label htmlFor="reason">Reason</label>
          <Field as="select" id="reason" name="reason">
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
          </Field>
          <ErrorMessage name="reason" component="div" />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <Field id="description" name="description" />
          <ErrorMessage name="description" component="div" />
        </div>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default ReportForm;
