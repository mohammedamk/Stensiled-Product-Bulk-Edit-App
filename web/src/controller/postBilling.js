import Shop from '../models/Shops.js';
import adminApi from '../utils/adminApi.js';
import dotenv from 'dotenv';

dotenv.config();
const { APP_NAME, NODE_ENV } = process.env;
const postBilling = async (plan, shopOrigin, accessToken) => {
  try {
    // console.log("APP_NAME>>>",APP_NAME)
    const shopDetails = await Shop.find({
      shopOrigin: shopOrigin,
    }).exec();
    const payload = {
      recurring_application_charge: {
        name: plan.name,
        price: plan.price.split('$')[0],
        return_url: `https://${shopOrigin}/admin/apps/${APP_NAME}`,
        trial_days: plan.trial_days,
        // test: ( process.env.NODE_ENV === "production" ) ? false : true,
        test: true,
      },
    };
    adminApi.defaults.headers.common[
      'X-Shopify-Access-Token'
    ] = `${accessToken}`;

    const response = await adminApi.post(
      `https://${shopOrigin}/admin/api/2022-07/recurring_application_charges.json`,
      payload
    );

    console.log(
      response.data.recurring_application_charge,
      'RESPONSE'
    );

    return response.data.recurring_application_charge;
  } catch (err) {
    console.log(err, 'error');
  }

};

export default postBilling;
