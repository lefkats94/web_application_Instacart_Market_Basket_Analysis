import axios from "./Axios";

const getStats = () =>  axios
    .get("stats/")
    .then(response => {
      return response.data;
    })
    .catch(reason => {
      console.error("Error fetching stats " , reason)
    })

export default getStats;