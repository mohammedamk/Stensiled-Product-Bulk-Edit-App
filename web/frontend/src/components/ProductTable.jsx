import { useState } from 'react';
import get from 'lodash/get';
import { Pagination } from '@shopify/polaris';
import './styles.css';

const ProductTable = (props) => {
  const { products } = props;



  const initialPaginationParams = {
    data: products.slice(0, 10),
    pageCount: Math.ceil(products.length / 10),
    perPage: 10,
    selected: 0,
  };
  const [paginationParams, setPaginationParams] = useState(
    initialPaginationParams
  );
  const { pageCount, perPage, data, selected } = paginationParams;
  const handlPageClick = (action) => {
    let selectedPage = action === 'next' ? selected + 1 : selected - 1;
    const offset = Math.ceil(selectedPage * perPage);
    loadData(offset, selectedPage);
  };
  const loadData = (offset, selected) => {
    const updatedProducts = products.slice(offset, offset + perPage);
    setPaginationParams({
      ...paginationParams,
      data: updatedProducts,
      pageCount: Math.ceil(products.length / perPage),
      selected: selected,
    });
  };
  return (
    <>
      <div style={styles.tableWrapper}>
        <div style={styles.headerWrapper}>
          <div style={styles.columnItem}>Avatar</div>
          <div style={styles.columnItem}>Title</div>
          <div style={styles.columnItem}>Product Type</div>
          <div style={styles.columnItem}>Vendors</div>
          <div style={{ ...styles.columnItem, flex: 3 }}>Variants</div>
        </div>
        <div style={styles.listWrapper}>
          {data.map((product,index) => {
            return (
              <div key={index} style={styles.rowWrap}>
                <div style={styles.columnItem}>
                  <img
                    src={get(product, 'images[0].src') || null}
                    width={50}
                    height={50}
                  />
                </div>
                <div style={styles.columnItem}>{product.title}</div>
                <div style={styles.columnItem}>{product.type}</div>
                <div style={styles.columnItem}>{product.vendor}</div>
                <div
                  style={{
                    ...styles.columnItem,
                    flex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={styles.variantHeaderWrapper}>
                    <div style={styles.variantItem}>options|size</div>
                    <div style={styles.variantItem}>price</div>
                    <div style={styles.variantItem}>compared price</div>
                    <div style={styles.variantItem}>weight</div>
                  </div>
                  {product.variants.map((variant,index) => {
                    return (
                      <div key={index} style={styles.rowWrap}>
                        <div style={styles.variantItem}>{variant.title}</div>
                        <div style={styles.variantItem}>{variant.price}</div>
                        <div style={styles.variantItem}>
                          {variant.compare_at_price}
                        </div>
                        <div style={styles.variantItem}>
                          {variant.weight} {variant.weight_unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={styles.pagination}>
        <Pagination
          label={`Page ${selected + 1} of ${pageCount}`}
          hasPrevious={selected + 1 !== 1}
          onPrevious={() => {
            handlPageClick('previous');
          }}
          hasNext={selected + 1 !== pageCount}
          onNext={() => {
            handlPageClick('next');
          }}
        />
      </div>
    </>
  );
};

const styles = {
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    padding: 15,
  },
  tableWrapper: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    overflowWrap: 'break-word',
  },
  rowWrap: {
    display: 'flex',
  },
  headerWrapper: {
    display: 'flex',
    borderBottom: '1px solid lightgray',
    padding: 20,
  },
  variantHeaderWrapper: {
    display: 'flex',
    borderBottom: '1px solid lightgray',
  },
  listWrapper: {
    backgroundColor: '#FAFBFC',
    padding: 20,
    overflowY: 'scroll',
    maxHeight: 300,
  },
  columnItem: {
    flex: 1,
    marginBottom: 10,
    marginRight: 10,
    overflow: 'auto',
    // width:100,
  },
  variantItem: {
    marginRight: 10,
    marginBottom: 10,
    flex: 1,
    minWidth: 100,
  },
};
export default ProductTable;
