import moment from 'moment';


const prettyDate = (date,toFormat = "YYYY-MMM-DD hh:mm A") =>
  moment(date).format(toFormat);
  
export default prettyDate;