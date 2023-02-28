import { useEffect, useState } from 'react';
import { Frame, Spinner } from '@shopify/polaris';
import Dashboard from './dashboard/Dashboard';
import Pricing from './pricing/Pricing';
import ContactForm from './contactus/ContactUs';
import PriceEdit from './dashboard/PriceEdit';
import TabComponent from '../components/TabComponent';

export default function BulkEdit() {

  const [page, setPage] = useState('/')

  const items = [
    {
      url: '/',
      label: 'Dashboard',
      onClick: (e) => { setPage('/') },
      exactMatch: true
    },
    {
      url: '/PriceEdit',
      label: 'Price',
      onClick: (e) => { setPage('/PriceEdit') },
      exactMatch: true
    }
  ]

  let PageMarkup = Dashboard;

  switch (page) {
    case '/':
      PageMarkup = Dashboard;
      break;
    case '/PriceEdit':
      PageMarkup = PriceEdit;
      break;
    case '/Pricing':
      PageMarkup = Pricing;
      break;
    case '/ContactForm':
      PageMarkup = ContactForm;
      break;
    default:
      PageMarkup = Dashboard;
      break;
  }


  const [isAuthSuccess, setAuthSuccess] = useState(false);
  useEffect(() => {
    getAuth();
  });
  const getAuth = async () => {
    try {
      //   const response = await api.get('test');
      // console.log('auth success', response);
      //   const { status, data } = response.data
      //   if (status === "billing") {
      //     console.log(data, "url")
      //     window.parent.location.href = data;
      //   }
      setAuthSuccess(true);
      // return response;
    } catch (error) {
      // console.log("error", error.response.statusText)
      console.log(error, 'error while auth');
    }
  };
  const tabs = [
    {
      id: 'Dashboard',
      content: 'Dashboard',
      accessibilityLabel: 'Dashboard',
      panelID: 'dashboard',
      page: '/'
      // children: <Dashboard config={props.config} setPage={setPage} />,
    },
    {
      id: 'Pricing',
      content: 'Pricing',
      panelID: 'pricing',
      page: '/Pricing'
      //   children: <Pricing config={props.config} />,
    },
    {
      id: 'Contact us',
      content: 'Contact us',
      accessibilityLabel: 'contact-us',
      panelID: 'contact-us',
      page: '/ContactForm'
      //   children: <ContactForm config={props.config} />,
    },
  ];

  return (
    <Frame>
      {/* {isAuthSuccess && <ProductsCard />} */}
      {isAuthSuccess && <TabComponent setPage={setPage} tabs={tabs} />}
      {isAuthSuccess && <PageMarkup setPage={setPage} />}
      {!isAuthSuccess && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            {' '}
            <Spinner
              accessibilityLabel="Loading App ..."
              size="large"
              color="teal"
            />
          </div>
          <div>Loading App ...</div>
        </div>
      )}
    </Frame>


  );
}