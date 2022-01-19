import {initializeApp,getApps} from 'firebase/app';

import config from './firebaseConfig';

let app;
if (!getApps().length) {
   app = initializeApp(config);
}

export default app;