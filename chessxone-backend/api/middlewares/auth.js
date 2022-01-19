const admin = require('../../config/firebase-admin');

module.exports = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session || '';
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

    req.userPayload = decodedClaims;
    if(!decodedClaims.email){
      const {providerData} = await admin.auth().getUser(decodedClaims.uid)  
       req.userPayload.email = providerData[0].email || '';
    }

    next();
    return;    
  } catch (error) {
    console.log(error.message)
    res.status(401).send("{'error':'unauthorized'}");
    return;
  }
      
}