const dev = {
  VUE_APP_API_URL: '',
  VUE_APP_API_WS_URL: ''
}

const prod = {
  VUE_APP_API_URL: '',
  VUE_APP_API_WS_URL: ''
}

const config = process.env.NODE_ENV == "development" ? dev : prod;

export default config;