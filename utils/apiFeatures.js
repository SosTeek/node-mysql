// class ApiFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   // filter() {
//   //   const queryObj = { ...this.queryString };
//   //   const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   //   excludedFields.forEach((el) => {
//   //     delete queryObj[el];
//   //   });
//   // }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(',').join('');
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort('-createdAt');
//     }
//     return this;
//   }

//   paginate() {
//     const page = this.queryString.page * 1;
//     const limit = this.queryString.limit * 1;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);

//     return this;
//   }
// }

// module.exports = ApiFeatures;
