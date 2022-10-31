module.exports = {
  getRequestType: (type) => {
    return `https://imdb-api.com/en/API/${type}/${process.env.IMDB_KEY}`;
  }
};
