import asyncForEach from '../utils/asyncForEach.js';
import isEmpty from 'lodash/isEmpty.js';
import Shop from '../models/Shops.js';
import CTask from '../models/CompletedTasks.js';
import QTask from '../models/queuedTasks.js';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

const updateProducts = async (req, res, session) => {
  try {
    const {
      editOption,
      editValue,
      variants,
      variantFilterOptions,
      products,
    } = req.body;

    const shopOrigin = session.shop;
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();

    const variantsWithProductDetails = variants.map((variant) => {
      const product = products.filter(
        (product) => variant.product_id === product.id
      )[0];
      return {
        ...variant,
        product: { ...product }
      };
    });

    let filteredVariants = variantsWithProductDetails;
    if (
      !(
        isEmpty(variantFilterOptions.filter) ||
        variantFilterOptions.filter === 'allVariants'
      )
    ) {
      filteredVariants =[]
      variantsWithProductDetails.forEach((variant) =>{
        if(shouldAdd(variant, variantFilterOptions)===true){
              filteredVariants.push(variant)
        }
      }
      );
    }

    let response = {};
    let errors = [];
    const queuedTasks = new QTask({
      _id: new mongoose.Types.ObjectId(),
      shopOrigin: session.shop,
      type: 'price',
      editOption: editOption,
      editValue: editValue,
      variantFilterOptions: variantFilterOptions,
      variants: filteredVariants,
      status: 'queued',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await queuedTasks.save();

    const variantList = await QTask.findOne({
      shopOrigin: shopOrigin,
      _id: queuedTasks._id,
    }).exec();

    async function updateFiltreedVariants() {
      await asyncForEach(variantList.variants, async (variant) => {

        const updatedPrice = getUpdatedPrice(
          editOption,
          Number(variant.price),
          Number(editValue)
        );

        const url = `https://${shopOrigin}/admin/api/2022-07/variants/${variant.id}.json`;

        const payload = {
          variant: {
            id: variant.id,
            price: `${updatedPrice}`,
          },
        };

        response = await fetch(url, {
          headers: {
            'Content-type': 'application/json; charset=UTF-8', // Indicates the content
            'X-Shopify-Access-Token': shopDetails[0].accessToken,
          },
          method: 'put',
          body: JSON.stringify(payload),
        });

        if (response.status !== 200) {
          errors.push({
            status: response.status,
            msg: response.statusText,
            data: variant,
          });
        }

        const completedTasks = new CTask({
          _id: new mongoose.Types.ObjectId(),
          queueId: queuedTasks._id,
          shopOrigin: session.shop,
          type: 'price',
          editOption: editOption,
          editValue: editValue,
          variantFilterOptions: variantFilterOptions,
          variant: variant,
          status: response.status,
          status: response.statusText,
          created_at: new Date(),
          updated_at: new Date(),
        });
        await completedTasks.save();
      });

      console.log(queuedTasks._id, 'completed');
      await QTask.updateOne(
        { shopOrigin: shopOrigin, _id: queuedTasks._id },
        {
          $set: {
            status: 'completed',
            updated_at: new Date(),
          },
        }
      );
    }

    res.status = 200;
    res.body = {
      status: true,
      data: { id: variantList._id },
    };

    await updateFiltreedVariants();
    if (!isEmpty(errors)) {
      throw errors;
    }

    const result = [];
    res.status = 200;
    res.body = {
      status: true,
      data: { id: queuedTasks._id },
    };

  } catch (err) {
    console.log(err, 'err');
    res.status = 400;
    res.body = {
      status: false,
      errors: err.msg,
    };
  }

};

export default updateProducts;
//helpers
const getUpdatedPrice = (editOption, currentPrice, editValue) => {
  switch (editOption) {
    case 'changeToCustomValue':
      return editValue;
    case 'addPriceByAmount':
      return currentPrice + editValue;
    case 'addPriceByPercentage':
      const offsetToBeAdded = (currentPrice * editValue) / 100;
      return currentPrice + offsetToBeAdded;
    default:
      return editValue;
  }
};

const filterByProduct = (products, filterOptions) => {
  const { filter, filterAction } = filterOptions;
  const filteredProducts = products.filter((product) => {
    return shouldAdd(product, filterOptions);
  });
  return filteredProducts;
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
      return Number(product[`${filter}`]) <= Number(filterValue);
    case 'n<':
      return Number(product[`${filter}`]) >= Number(filterValue);
    case 'n!==':
      return !(Number(product[`${filter}`]) === Number(filterValue));
    case 'n===':
      return Number(product[`${filter}`]) === Number(filterValue);
    case 's===':
      return product[`${filter}`].indexOf(filterValue) !== -1;
    case 's!==':
      return !(product[`${filter}`].indexOf(filterValue) !== -1);
    case 's!':
      return isEmpty(product[`${filter}`]);
    default:
      return false;
  }
};
