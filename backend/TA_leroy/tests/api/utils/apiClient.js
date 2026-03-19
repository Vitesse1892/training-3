export class ApiClient {
  constructor(request) {
    this.request = request;
  }

  get(path) {
    return this.request.get(path);
  }

  post(path, data) {
    console.log("API CLIENT RECEIVED:", data);
    return this.request.post(path, { data });
  }

  put(path, data) {
    return this.request.put(path, { data });
  }

  delete(path) {
    return this.request.delete(path);
  }
}

