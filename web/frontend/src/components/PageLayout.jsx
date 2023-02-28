
function PageLayout(props) {
    const { title, children } = props;
    return (
      <div>
        <div style={styles.container}>
          <div style={styles.header}>{title || ''}</div>
          {children}
        </div>
      </div>
    );
  }
  
  export default PageLayout;
  const styles = {
    container: {
      margin: 20,
    },
    header: {
      borderBottom: '1px solid black',
      padding: '20px 0px',
    },
  };
  