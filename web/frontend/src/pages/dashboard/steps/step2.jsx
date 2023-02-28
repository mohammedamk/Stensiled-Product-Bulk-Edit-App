import ProductTable from '../../../components/ProductTable';
import { Card, Spinner } from '@shopify/polaris';
const Step2 = (props) => {
  const { products, productState, showTitle } = props;



  const getProductsTableContent = () => {
    switch (productState) {
      case 'loading':
        return (
          <div style={{ dispay: 'flex' }}>
            <div style={styles.loader}>
              <Spinner
                accessibilityLabel="Fetching Products"
                size="large"
                color="teal"
              >
                Fetching Products . . .
              </Spinner>
            </div>
          </div>
        );
      case 'empty':
        return (
          <div style={{ dispay: 'flex' }}>
            <div style={styles.emptyState}>
              Apply Filters to preview Products
            </div>
          </div>
        );
      case 'success':
        return (
          <>
            <ProductTable products={products} />
          </>
        );
      case 'error':
        return (
          <div style={{ dispay: 'flex' }}>
            <div style={styles.error}>
              Error occured while fetching products,Kindly contact the app admin
            </div>
          </div>
        );
      default:
        return <>No Products to display</>;
    }
  };
  return (
    <div>
      {showTitle && <div style={styles.step}>STEP2: Preview Products</div>}
      <Card sectioned={productState !== 'success'}>
        {getProductsTableContent()}
      </Card>
    </div>
  );
};

const styles = {
  step: {
    margin: '10px auto',
  },
  loader: {
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
};
Step2.defaultprops = {
  showTitle: true,
};
export default Step2;
