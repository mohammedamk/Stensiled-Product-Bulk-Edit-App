import { Card, Select, TextField, ProgressBar } from '@shopify/polaris';

const EditOptions = [
  { label: 'Change price to', value: 'changeToCustomValue' },
  { label: 'Adjust price by amount', value: 'addPriceByAmount' },
  { label: 'Adjust price by percentage', value: 'addPriceByPercentage' },
];
const Step4 = (props) => {

  const { values, setFormValues, formErrors, isUpdateLoading } = props;

  const getContentBasedOnEditSelection = () => {
    const editOption = { values };
    switch (editOption) {
      case 'changeToCustomValue':
        return (
          <TextField
            name="editValue"
            type="number"
            min="0"
            label={'Price'}
            value={values.editValue}
            onChange={(value) => setFormValues({ ...values, editValue: value })}
          />
        );
      case 'addPriceByAmount':
        return (
          <TextField
            name="editValue"
            type="number"
            min="0"
            label={'Price in INR'}
            value={values.editValue}
            onChange={(value) => setFormValues({ ...values, editValue: value })}
          />
        );
      case 'addPriceByPercentage':
        return (
          <>
            <TextField
              name="editValue"
              type="number"
              min="0"
              label={'Price in %'}
              value={values.editValue}
              onChange={(value) =>
                setFormValues({ ...values, editValue: value })
              }
            />
            %
          </>
        );
      default:
        return (
          <TextField
            type="number"
            name="editValue"
            min="0"
            value={values.editValue}
            onChange={(value) => setFormValues({ ...values, editValue: value })}
          />
        );
    }
  };
  return (
    <div>
      <div style={styles.step}>STEP4: Select what to Edit</div>
      <Card>
        <div style={styles.editOptionWrapper}>
          {isUpdateLoading && (
            <div style={styles.loader}>
              Please wait while Updating Products...
              <ProgressBar progress={100} size="small" />
            </div>
          )}
          {!isUpdateLoading && (
            <>
              <div style={styles.editOptionItem}>
                <Select
                  key={'editOptions'}
                  name="editOption"
                  options={EditOptions}
                  onChange={(value) => {
                    setFormValues({ ...values, editOption: value });
                  }}
                  value={values.editOption}
                />
                {formErrors && formErrors['editOption'] && (
                  <>{formErrors['editOption']}</>
                )}
              </div>
              <div style={styles.editOptionItem}>
                {getContentBasedOnEditSelection()}
                {formErrors && formErrors['editValue'] && (
                  <div style={styles.error}>{formErrors['editValue']}</div>
                )}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
const styles = {
  formContainer: {
    display: 'flex',
    width: '100%',
  },
  loader:{
   textAlign: 'center',
   display: 'flex',
   margin:20,
   justifyContent: 'center',
   alignItems: 'center',
   flexDirection: 'column'
  },
  formItem: {
    marginRight: 15,
    minWidth: 200,
  },
  step: {
    margin: '10px auto',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  editOptionWrapper: {
    display: 'flex',
    padding: 15,
    flexDirection: 'column',
  },
  editOptionItem: {
    marginBottom: 15,
    width: '50%',
  },
  emptyState: {
    padding: 15,
  },
};
export default Step4;
