import { skeletonPageLoad } from "@shopify/app-bridge/actions/Performance";

const EditCard = (props) => {

    // console.log(props);
    const { cardColor, title, navigationPath } = props;

    return (
        <div style={styles.card}>
            <div
                onClick={() => {props.setPage(navigationPath)}}
                style={{ ...styles.container, backgroundColor: cardColor }}
            >
                <div style={styles.content}>{title}</div>
                <div style={styles.footer}>Edit</div>
            </div>
        </div>
    )
};

const styles = {
    card: {
        backgroundColor: "white",
        boxShadow: "0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.15)",
        outline: "0.1rem solid transparent",
        borderRadius: 3

    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'red',
        minHeight: 150,
        color: 'white',
        cursor: 'pointer',
    },
    content: {
        flex: 9,
        padding: '25px 12px 12px 12px',
        fontSize: 23,
    },
    footer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.1)",
        textAlign: 'center',
    },
};
EditCard.defaultprops = {
    cardColor: 'yellow',
    title: 'Test Title',
    navigationPath: '/edit-product',
};

export default EditCard;