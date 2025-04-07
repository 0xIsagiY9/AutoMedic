class APIQuery {
  constructor(queryMongoose, queryExpress) {
    this.query = queryMongoose;
    this.queryString = queryExpress;
  }

  filter() {
    // 1. Filtering
    const objQuery = { ...this.queryString };
    const deletedField = ['page', 'limit', 'sort', 'fields'];
    deletedField.forEach((element) => delete objQuery[element]);
    // 2. Advance Filtering
    let queryStr = JSON.stringify(objQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      return this;
    } else {
      return this;
    }
  }
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    if (this.queryString.page && this.queryString.limit) {
      const limit = Number(this.queryString.limit) || 10;
      const page = Number(this.queryString.page) || 1;
      const skipped = (page - 1) * limit;
      this.query = this.query.skip(skipped).limit(limit);
      return this;
    } else {
      return this;
    }
  }
}

export default APIQuery;
