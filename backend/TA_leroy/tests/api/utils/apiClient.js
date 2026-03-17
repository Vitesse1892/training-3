export class ApiClient {
  constructor(request) {
    this.request = request;
  }

  get(path) {
    return this.request.get(path);
  }

  post(path, data) {
    console.log("API CLIENT RECEIVED:", data);
    return this.request.post(path, { json: data });
  }

  put(path, data) {
    return this.request.put(path, { json: data });
  }

  delete(path) {
    return this.request.delete(path);
  }
}



// export class ApiClient {
//   constructor(request, baseURL) {
//     this.request = request;
//     this.baseURL = baseURL;
//   }

//   get(path) {
//     return this.request.get(`${this.baseURL}${path}`);
//   }

//   post(path, data) {
//     console.log("API CLIENT RECEIVED:", data);
//     return this.request.post(`${this.baseURL}${path}`, { json: data });
//   }

//   put(path, data) {
//     return this.request.put(`${this.baseURL}${path}`, { json: data });
//   }

//   delete(path) {
//     return this.request.delete(`${this.baseURL}${path}`);
//   }
// }