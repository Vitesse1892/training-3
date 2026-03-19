import { ApiClient } from '../api/utils/apiClient';

console.log(">>> API FIXTURE LOADED <<<");

export const apiFixture = {
  api: async ({ playwright, baseURL }, use) => {
    console.log("BASE URL USED:", baseURL);
    const requestContext = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });
    

    console.log(">>> API FIXTURE LOADED <<<");

    requestContext.on('request', req => {
      console.log('PW REQUEST:', req.method(), req.url());
      console.log('PW HEADERS:', req.headers());
      try {
        console.log('PW BODY:', req.postDataJSON());
      } catch {
        console.log('PW BODY: <not JSON>');
      }
    });

    const client = new ApiClient(requestContext);
    await use(client);

    await requestContext.dispose();
  }
};





// import { ApiClient } from '../api/utils/apiClient';

// export const apiFixture = {
//   api: async ({ playwright, baseURL }, use) => {
//     const requestContext = await playwright.request.newContext({
//       baseURL,
//       extraHTTPHeaders: {
//         'Content-Type': 'application/json'
//       }
//     });

//     const client = new ApiClient(requestContext, baseURL);
//     await use(client);

//     await requestContext.dispose();
//   }
// };
