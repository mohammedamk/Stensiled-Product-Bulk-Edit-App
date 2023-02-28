import { useState, useEffect } from 'react';
import { editOptions } from './EditOptions';
import { styles } from './styles';
import EditCard from './EditCard';
import InfoCard from './InfoCard';
import { useAppQuery, useAuthenticatedFetch } from '../../../hooks';

const Dashboard = (props) => {
  const fetch = useAuthenticatedFetch();

  const [completedTasks, setCompletedTasks] = useState([]);
  useEffect(() => {
    getCompletedTasks();
  }, [completedTasks.length]);

  const getCompletedTasks = async (req, res) => {
    const data = await fetch('/api/getCompletedTask')
    .then(data => data.json());
    setCompletedTasks(data.data.ctasks);
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>Account Overview</div>
      <div style={styles.eidtCardContainer}>
        <div style={styles.editCardItem}>
          <InfoCard count={completedTasks && completedTasks.length} />
        </div>
      </div>
      <div style={styles.header}>Start Editing Products</div>
      <div key={new Date()} style={styles.eidtCardContainer}>
        {editOptions.map((item, index) => {
          return (
            <div key={index} style={styles.editCardItem}>
              <EditCard
                cardColor={item.cardColor}
                title={item.title}
                navigationPath={item.navigationPath}

                setPage={props.setPage}


              />
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default Dashboard;