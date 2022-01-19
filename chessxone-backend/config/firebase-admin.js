const admin = require("firebase-admin");

try {
    console.log('firebase admin initialisation')
    var serviceAccount = require(`${ process.cwd()}/serviceAccountKey.json`);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.log('error initilising admin firebase')
    console.log(error.message);
}

module.exports = admin;