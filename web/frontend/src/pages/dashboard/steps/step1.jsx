import { useState, useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import filters from './utils/filters.jsx';
import {
  Select,
  Card,
  Button,
  TextField,
  DatePicker,
  Popover,
  Icon,
} from '@shopify/polaris';
import prettyDate from '../../../utils/prettyDate.jsx';
import { CalendarMajor } from '@shopify/polaris-icons';

// import DatePicker from '../../components/DatePicker/datepicker.js';

const Step1 = (props) => {
  const currentDate = new Date();
  const [{ month, year }, setDate] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: currentDate,
    end: currentDate,
  });

  const onMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );
  const [active, setActive] = useState(false);

  const onDateSelection = (value) => {
    console.log(value, 'selected date');
    setSelectedDates(value);
    setFormValues({ ...values, filterValue: JSON.stringify(value) });
  };
  const activator = (
    <>
      <div style={styles.calenderIcon} onClick={() => setActive(!active)}>
        <Icon
          source={CalendarMajor}
          onClick={() => setActive(!active)}
        />
      </div>
    </>
  );
  const conditionalFilterAction = () => {
    return (
      <div style={styles.formItem}>
        <Select
          key={'filter'}
          name="filterAction"
          options={getFilterOptions()}
          onChange={(value) => {
            setFormValues({ ...values, filterAction: value });
          }}
          value={values.filterAction}
        />
      </div>
    );
  };

  const daterange = () => {
    return (
      <TextField
        name="filterValue"
        type="text"
        value={`${prettyDate(selectedDates.start)} - ${prettyDate(
          selectedDates.end
        )}`}
        // onChange={(value) => setFormValues({ ...values, filterValue: value })}
      />
    );
  };
  const StringField = () => {
    return (
      <div style={styles.formItem}>
        <TextField
          name="filterValue"
          type="text"
          value={values.filterValue}
          onChange={(value) => setFormValues({ ...values, filterValue: value })}
        />
        {formSubmit === true && isEmpty(values.filterValue) && (
          <div style={{ color: 'red' }}>Please provide a value</div>
          )}
      </div>
    );
  };


  const NumberField = () => {
    return (
      <div style={styles.formItem}>
        <TextField
          name="filterValue"
          type="number"
          min="0"
          value={values.filterValue}
          onChange={(value) => setFormValues({ ...values, filterValue: value })}
        />
        {formSubmit === true && isEmpty(values.filterValue) && (
          <div style={{ color: 'red' }}>Please provide a value</div>
        )}
      </div>
    );
  };
  const DateField = () => {
    return (
      <div
        style={{
          ...styles.formItem,
          display: 'flex',
          // maxWidth: 300,
          // minWidth: 300,
        }}
      >
        <div>
          <TextField
            name="filterValue"
            type="text"
            min="0"
            disabled={true}
            value={`${prettyDate(
              selectedDates.start,
              'DD MMM YY'
            )} - ${prettyDate(selectedDates.end, 'DD MMM YY')}`}
            onChange={(value) =>
              setFormValues({ ...values, filterValue: value })
            }
          />
        </div>
        <div>
          <Popover
            active={active}
            activator={activator}
            onClose={() => setActive(!active)}
            allowRange={true}
            sectioned
            // fullWidth
          >
            <DatePicker
              month={month}
              year={year}
              onChange={onDateSelection}
              onMonthChange={onMonthChange}
              selected={selectedDates}
              allowRange={true}
            />
          </Popover>
        </div>
      </div>
      // </div>
    );
  };

  const {
    values,
    fetchProducts,
    formSubmit,
    setFormValues,
    productState,
  } = props;


  const getFilterOptions = (value) => {
    // console.log(value, 'value');
    // console.log(values.filter, 'filter value');
    const filterValue = isEmpty(value) ? values.filter : value;
    const selectedFilter = filters.filter((item) => {
      return item.value === filterValue;
    })[0];
    const { comparisontype, type } = selectedFilter;
    if (type === 'product') {
      switch (comparisontype) {
        case 'string':
          return [
            {
              label: 'contains',
              value: 's===',
              content: StringField,
              filterAction: conditionalFilterAction,
            },
            { label: 'does not contain', value: 's!==', content: StringField },
            { label: 'is empty', value: 's!', content: StringField },
          ];
        case 'number':
          return [
            {
              label: 'is equal to',
              value: 'n===',
              content: NumberField,
              filterAction: conditionalFilterAction,
            },
            { label: 'is not equal to', value: 'n!==', content: NumberField },
            { label: 'is less than', value: 'n>', content: NumberField },
            { label: 'is greater than', value: 'n<', content: NumberField },
          ];
        case 'date':
          return [
            {
              label: 'Range is',
              value: 'd===',
              content: DateField,
              filterAction: daterange,
            },
          ];
        default:
          return [];
      }
    } else if (type === 'variant') {
      switch (comparisontype) {
        case 'string':
          return [
            {
              label: 'of all variants contains',
              value: 's===',
              content: StringField,
              filterAction: conditionalFilterAction,
            },
            {
              label: 'of all variants does not contain',
              value: 's!==',
              content: StringField,
            },
            {
              label: 'of all variants is empty',
              value: 's!',
              content: StringField,
            },
          ];
        case 'number':
          return [
            {
              label: 'of all variants is equal to',
              value: 'n===',
              content: NumberField,
              filterAction: conditionalFilterAction,
            },
            {
              label: 'of all variants is not equal to',
              value: 'n!==',
              content: NumberField,
            },
            {
              label: 'of all variants is less than',
              value: 'n>',
              content: NumberField,
            },
            {
              label: 'of all variants is greater than',
              value: 'n<',
              content: NumberField,
            },
          ];
        case 'date':
          return [
            {
              label: 'Range is',
              value: 'd===',
              content: DateField,
              filterAction: daterange,
            },
          ];
        default:
          return [];
      }
    } else {
      return [];
    }
  };
  return (
    <div>
      <div style={styles.step}>STEP1: Filter Products</div>
      <Card sectioned>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={styles.formItem}>
            <Select
              key={'filter'}
              name="filter"
              options={filters.filter((item) => item.type === 'product')}
              onChange={(value) => {
                setFormValues({
                  ...values,
                  filter: value,
                  filterAction: !!getFilterOptions(value)[0]
                    ? getFilterOptions(value)[0].value
                    : 'none',
                });
              }}
              value={values.filter}
            />
          </div>
          {values.filter !== 'allProducts' && (
            <>
              <div style={styles.formItem}>
                <Select
                  key={'filter'}
                  name="filterAction"
                  options={getFilterOptions()}
                  onChange={(value) => {
                    setFormValues({ ...values, filterAction: value });
                  }}
                  value={values.filterAction}
                />
              </div>
              <div style={styles.formItem}>
                {values &&
                  values.filter &&
                  getFilterOptions(values.filter)[0].content()}
              </div>
            </>
          )}
          <div>
            <Button
              submit
              primary
              onClick={(e) => {
                // e.preventDefault();
                fetchProducts();
              }}
              disabled={
                productState === 'loading' ||
                (values.filter !== 'allProducts' && !values.filterValue)
              }
            >
              Preview Products
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const styles = {
  calenderIcon: {
    display: "flex",
    justifyContent: "center",
    padding: 5,
    border: "1px solid black",
    alignItems: "center",
    borderLeft: 0,
    borderColor: "rgb(195, 195, 195)",
    borderRadius:4

  },
  formItem: {
    marginRight: 15,
    minWidth: 200,
    maxWidth: 200,
    paddingBottom: 15,
  },
  step: {
    margin: '10px auto',
  },
};
export default Step1;
