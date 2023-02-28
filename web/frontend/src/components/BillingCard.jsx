import { Card, Button, Icon } from '@shopify/polaris';
import {
  CircleCancelMajor,
  CircleTickOutlineMinor,
} from '@shopify/polaris-icons';
const BillingCard = (props) => {
  const { plan, onSelectPlan } = props;
  return (
    <Card sectioned>
      <div style={styles.wrapper}>
        <div style={{ ...styles.item, ...styles.headerItem }}>{plan.name}</div>
        <div style={styles.item}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {plan.functionalities.map((item,index) => (
              <div key={index} style={styles.detailsWrap}>
                <Icon
                  color={item.accessible !== true ? 'red' : 'green'}
                  source={
                    item.accessible !== true
                    ? CircleCancelMajor
                    : CircleTickOutlineMinor
                  }
                />
                <div style={{ marginLeft: 10 }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.item}>
          <Icon
            color={'green'}
            source={
            CircleTickOutlineMinor
            }
          />{' '}
          Activated
        </div>
        <div style={styles.item}>
          <Button
            primary
            disabled
            onClick={(e) => {
              e.preventDefault();
              onSelectPlan(plan);
            }}
          >
            Buy @ {plan.price}/Month
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BillingCard;

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailsWrap: {
    display: 'flex',
    alignSelf: 'flex-start',
    margin: 10,
  },
  item: {
    margin: '10px 0',
    alignSelf: 'center',
  },
  headerItem: {
    fontWeight: 700,
  },
  header: {
    textAlign: 'center',
  },
};
