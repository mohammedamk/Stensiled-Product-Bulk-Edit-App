import { Toast, AppProvider } from '@shopify/polaris';

const ToastWrapper = ({
  active = false,
  message = '',
  error = false,
  config = {},
  onDismiss = () => {
    console.log('not configured');
  },
}) => {
  const toastMarkup = active ? (
    <Toast content={message} error={error} onDismiss={onDismiss} />
  ) : null;

  // console.log(config, 'config');
  return (
    // <AppProvider apiKey={config.apiKey} i18n={{}} shopOrigin={config.shopOrigin}>
    <>{toastMarkup}</>
    // </AppProvider>
  );
};

export default ToastWrapper;
