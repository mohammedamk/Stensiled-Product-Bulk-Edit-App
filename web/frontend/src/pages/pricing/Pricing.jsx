import { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import BillingCard from '../../components/BillingCard';
import ToastWrapper from '../../components/ToastWrapper';

const defaultToastOptions = {
    active: false,
    message: '',
    error: false,
};

const Pricing = (props) => {
    const [formState, setFormState] = useState("success");
    const [toast, setToast] = useState(defaultToastOptions);
    const pricingOptions = [
        {
            price: '4.99$',
            name: 'Basic Plan',
            functionalities: [
                { name: 'Bulk Price Edit', accessible: true },
                { name: 'Filter Products Before Edit', accessible: true },
                { name: 'Multiple Price Edit Option', accessible: true },
            ],
        },
    ];
    const onSelectPlan = async (plan) => {
        try {
            console.log(plan, 'selected price');
            const response = await api.post("billing", { plan: plan });
            setToast({
                active: true,
                message: `Plan activated`,
                error: false,
            });
        } catch (err) {
            console.log(err, 'error');
            setToast({
                active: true,
                message: `${(err && err.response && err.response.statusText) || err}`,
                error: true,
            });
        }
    };
    return (
        <PageLayout title="Select Plan">
            <>
                <div key={new Date()} style={styles.eidtCardContainer}>
                    {pricingOptions.map((plan,index) => {
                        return (
                            <div key={index} style={styles.editCardItem}>
                                <BillingCard plan={plan} onSelectPlan={onSelectPlan} />
                            </div>
                        );
                    })}
                </div>
                <ToastWrapper
                    active={toast.active}
                    message={toast.message}
                    error={toast.error}
                    onDismiss={() => setToast({ defaultToastOptions })}
                />
            </>
        </PageLayout>
    );
};

export default Pricing;
const styles = {
    eidtCardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    editCardItem: {
        margin: '15px 15px 15px 0px',
        minWidth: '31%',
    },
};
