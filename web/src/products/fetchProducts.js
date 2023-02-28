import Shop from '../models/Shops.js';
import isEmpty from 'lodash/isEmpty.js';
import moment from 'moment';
import fetch from 'node-fetch';

const fetchProducts = async (req, res, session) => {
  try {
    const { filter, filterType, filterAction, filterValue } = req.query;


    const filterOptions = {
      filterValue,
      filterAction,
      filter,
    };
    const shopOrigin = session.shop;
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();



    const countResponse = await fetch(
      `https://${shopOrigin}/admin/api/2022-07/products/count.json`,
      {
        headers: {
          'X-Shopify-Access-Token': shopDetails[0].accessToken,
        },
      }
    );
    const countJson = await countResponse.json();
    const productsCount = countJson.count;



    let productsFetched = 0;
    let productList = [];
    let url = null;
    let nextPageInfo = null;
    let response = null;
    // const limit = productsCount > 250 ? 250 : (productsCount - 1);
    const limit = productsCount > 250 ? 250 : (productsCount - 1);


    const nestedfetchProducts = async (url) => {
      response = await fetch(
        url,
        {
          headers: {
            'X-Shopify-Access-Token': shopDetails[0].accessToken,
          },
        }
      );
      const jsonResponse = await response.json();

      nextPageInfo = response.headers.get('Link');
      return { data: jsonResponse.products };
    }

    do {
      // console.log('nextPageInfo',nextPageInfo);

      if (nextPageInfo && nextPageInfo.includes('rel="next"')) {
        let the_next_url = nextPageInfo.replace('<', '').replace('>; rel="next"', '')
        url = the_next_url;
      } else {
        url = `https://${shopOrigin}/admin/api/2022-07/products.json?limit=${limit}`;
      }

      // console.log('url', url);

      const productsInfo = await nestedfetchProducts(url);
      const { data } = productsInfo;
      productsFetched = Number(productsFetched) + Number(data.length);
      productList = productList.concat(data);
      
    } while (productsCount > productsFetched)

    if (response.status !== 200) {
      throw { status: response.status, msg: response.statusText };
    }
    // console.log("products fetched completed", productList);

    let filteredProducts;
    if (filterOptions.filter === 'allProducts') {
      filteredProducts = productList;
    } else if (filterType === 'product') {
      // console.log("product test");
      filteredProducts = filterByProduct(productList, filterOptions);
    } else if (filterType === 'variant') {
      filteredProducts = filterByVariant(productList, filterOptions);
    } else {
      filteredProducts = productList;
    }
    res.status = response.status;
    res.body = {
      status: true,
      products: filteredProducts,
    };

    res.send({
      status: true,
      data: filteredProducts,
    });

    // console.log("res.body", res.body);

  } catch (err) {
    console.log(err, "error")
    res.status = 400;
    res.body = {
      status: false,
      msg: err.msg || err,
    };
  }
};

export default fetchProducts;

//helpers
const filterByProduct = (products, filterOptions) => {
  try {
    const { filter, filterAction } = filterOptions;
    // console.log(filterOptions, "options in filterby product")

    const filteredProducts = products.filter((product) => {
      return shouldAdd(product, filterOptions);
    });
    return filteredProducts;
  } catch (error) {
    console.log(error);
  }
};

const filterByVariant = (products, filterOptions) => {
  const filteredProducts = products.reduce((acc, product) => {
    const { variants } = product;
    const filteredVariants = variants.filter((variant) =>
      shouldAdd(variant, filterOptions)
    );
    if (filteredVariants.length === variants.length) {
      acc.push(product);
    }
    return acc;
  }, []);
  return filteredProducts;
};

const shouldAdd = (product, filterOptions) => {
  const { filter, filterAction, filterValue } = filterOptions;

  switch (filterAction) {
    case 'n>':
      return Number(product[`${filter}`]) === Number(filterValue);
    case 'n!==':
      return !(Number(product[`${filter}`]) === Number(filterValue));
    case 'n===':
      return Number(product[`${filter}`]) === Number(filterValue);
    case 's===':
      return product[`${filter}`].indexOf(filterValue) !== -1;
    case 's!==':
      return !(product[`${filter}`].indexOf(filterValue) !== -1);
    case 's!':
    case 'd===':
      const parsedFilterValue = JSON.parse(filterValue);
      const start_date = moment(parsedFilterValue.start, "YYYY-MM-DDTHH:mm:ss.sssZ").utc().format("YYYY-MM-DD");
      const end_date = moment(parsedFilterValue.end, "YYYY-MM-DDTHH:mm:ss.sssZ").utc().format("YYYY-MM-DD");
      const productDate = moment(product[`${filter}`]).utc().format("YYYY-MM-DD")
      // const start_date = filterValue.start.split("T")[0];
      // const end_date = filterValue.end.split("T")[0];
     
      const isDateInRange = moment(product[`${filter}`]).isBetween(start_date, end_date) || moment(productDate).isSame(start_date) || moment(productDate).isSame(end_date);
      return isDateInRange;

    default:
      return false;
  }
};
