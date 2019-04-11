import axios from 'axios'

const api = axios.create({
  baseURL: 'https://omnistack-backend-matheus.herokuapp.com'
})

export default api
