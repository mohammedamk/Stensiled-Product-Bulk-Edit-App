import { useState } from 'react';
import { Card, Button, Icon, Frame } from '@shopify/polaris';
import filters from './steps/utils/filters';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
import Step3 from './steps/step3';
import Step4 from './steps/step4';
import isEmpty from 'lodash/isEmpty';
import validator from '../../utils/validator';
import useInterval from '../../hooks/useInterval';
import ToastWrapper from '../../components/ToastWrapper';
import { MobileChevronMajor } from '@shopify/polaris-icons';
import { useAppQuery, useAuthenticatedFetch } from '../../../hooks';


const initialFormValues = {
  filter: 'allProducts',
  filterAction: 'is',
  editOption: `changeToCustomValue`,
  variantFilter: 'allVariants',
  variantfilterAction: 'is',

};
const defaultToastOptions = {
  active: false,
  message: '',
  error: false,
};
const PriceEdit = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const fetch = useAuthenticatedFetch();

  const [values, setFormValues] = useState(initialFormValues);
  const [formSubmit, setFormSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(defaultToastOptions);
  const [productState, setProductState] = useState('empty');
  const [queueId, setQueueId] = useState(null);
  const [taskCount, setTaskCount] = useState({ qTasks: 0, cTasks: 0 });
  const [isUpdateLoading, setUpdateLoading] = useState(false);

  useInterval(() => {
    if (queueId !== null && queueId !== undefined) {
      getQueueCallback(queueId);
    }
  }, 30000);
  const getQueueCallback = async () => {
    try {
      const response = await api.get(`taskprogress`);
      console.log(response, 'ouuter response');
      const qTasksCount = response.data.data.qtasks;
      const cTasksCount = response.data.data.ctasks;
      console.log(
        cTasksCount,
        qTasksCount,
        'outer',
        cTasksCount !== qTasksCount,
        cTasksCount != qTasksCount
      );
      if (cTasksCount !== qTasksCount) {
        console.log(cTasksCount, qTasksCount, 'inner');
        setTaskCount({ qTasks: qTasksCount, cTasks: cTasksCount });
      } else {
        setQueueId(null);
        setToast({
          active: true,
          message: `products updated successfully`,
          error: false,
        });
      }
    } catch (err) {
      console.log(err, 'error');
      setToast({
        active: true,
        message: `${(err && err.response && err.response.statusText) || err}`,
        error: true,
      });
    }
  };

  const fetchProducts = async (action = null) => {
    try {
      setProductState('loading');

      const filterType = filters.filter(
        (item) => item.value === values.filter
      )[0].type;
      const { filter, filterAction, filterValue } = values;
      // const data = await fetch('/api/products/get')
      // .then(data => data.json());

      const data = await fetch(`/api/products/get?filter=${filter}&filterType=${filterType}&filterAction=${filterAction}&filterValue=${filterValue}`)
      .then(data => data.json());
      
      

      if (data.status === false) {
        throw data.msg;
      }
      
      setToast({
        active: true,
        message: `products fetched successfully`,
        error: false,
      });


      setProducts(data.data);
      setProductState('success');
    } catch (error) {
      setProductState('error');
      setToast({
        active: true,
        message: `${error.response.statusText || error}`,
        error: true,
      });
    }
  };
  const resetForm = () => {
    setProducts([]);
    setProductState("empty");
    setFormValues(initialFormValues);
  }
  const onSubmit = (e) => {
    e.preventDefault();
  };
  const updateSelectedProducts = async () => {
    try {
      setUpdateLoading(true);
      setToast({
        active: true,
        message: `products updating...`,
        error: false,
      });
      const errors = validator(values);
      if (isEmpty(errors)) {
        const variantsToBeUpdated = products.reduce((acc, item) => {
          return [...acc, ...item.variants];
        }, []);
        const {
          editOption,
          editValue,
          variantFilter,
          variantFilterAction,
          variantFilterValue,
        } = values;

        const variantFilterOptions = {
          filter: variantFilter,
          filterAction: variantFilterAction,
          filterValue: variantFilterValue,
        };

        const paylaod = {
          variants: variantsToBeUpdated,
          variantFilterOptions,
          editOption,
          editValue,
          products: products
        };

        const updatePrice = async () => {

          const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paylaod),
          };
          await fetch('/api/products/put', requestOptions)
            .then(response => response.json())
        }

        await updatePrice();

        setToast({
          active: true,
          message: `products updated successfully`,
          error: false,
        });
        resetForm();
        setUpdateLoading(false);
      } else {
        setToast({
          active: true,
          message: `products updaing failed - ${error.response.statusText || err
            }`,
          error: true,
        });
        setFormErrors(errors);
      }
    } catch (error) {
      setToast({
        active: true,
        message: `products updaing failed - ${error.response.statusText || err
          }`,
        error: true,
      });
      setUpdateLoading(false);
      setFormErrors({ ...formErrors, updateFialed: error.response.statusText });
    }
  };

  return (
    <Frame>
      <div style={styles.pageWrapper}>
        <div
          style={styles.homeLink}
          onClick={() => { props.setPage('/') }}
        >
          <Icon source={MobileChevronMajor} />
          {'Dashboard'}
        </div>
        <div style={styles.contentWrap}>
          <form onSubmit={onSubmit}>
            <Step1
              fetchProducts={fetchProducts}
              values={values}
              formSubmit={formSubmit}
              formErrors={formErrors}
              productState={productState}
              setFormValues={setFormValues}
            />
            <Step2
              products={products}
              productState={productState}
            />
            <Step3
              values={values}
              formSubmit={formSubmit}
              formErrors={formErrors}
              setFormValues={setFormValues}
            />
            <Step4
              values={values}
              formErrors={formErrors}
              setFormValues={setFormValues}
              isUpdateLoading={isUpdateLoading}
            />
          </form>
          <br />
          <Card>
            <div style={styles.footerWrap}>
              <div style={styles.buttonWrap}>
                <Button
                  onClick={resetForm}
                  disabled={isUpdateLoading}
                >
                  Reset
                </Button>
              </div>
              <div style={styles.buttonWrap}>
                <Button
                  primary
                  onClick={() => updateSelectedProducts()}
                  loading={
                    isUpdateLoading
                  }
                  disabled={
                    isEmpty(products) ||
                    isEmpty(values.editValue)
                  }
                >
                  Start Bulk Editing
                </Button>
              </div>
              {/* <Button onClick={() => updateSelectedProducts()} disabled={true}>
            Schedule Bulk Editing
          </Button> */}
            </div>
          </Card>
          {/* <Card subdued sectioned title="Internal Form Values">
          <code>{JSON.stringify(values, null, 2)}</code>
        </Card> */}
        </div>
        <ToastWrapper
          active={toast.active}
          message={toast.message}
          error={toast.error}
          onDismiss={() => setToast({ defaultToastOptions })}
        />
      </div>
    </Frame>
  );
};
const styles = {
  pageWrapper: {
    margin: 10,
  },
  homeLink: {
    cursor: 'pointer',
    display: 'flex',
    width: 100,
  },
  contentWrap: {
    margin: 30,
  },
  footerWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  buttonWrap: {
    margin: 10,
  },
};
export default PriceEdit;
