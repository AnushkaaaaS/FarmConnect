const API_BASE_URL = process.env.REACT_APP_API_URL;

fetch(`${API_BASE_URL}/api/your-endpoint`)
  .then(res => res.json())
  .then(data => console.log(data));
