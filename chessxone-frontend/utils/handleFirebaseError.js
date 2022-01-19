const handleFirebaseError = async (auth, error) => {
    console.log(error.code)
    switch (error.code) {
        case 'auth/account-exists-with-different-credential': {
            return 'this Account exists with different credential' 
        }
        case 'auth/email-already-in-use':
            return 'the Email is already in use, try use another one';

        case 'auth/credential-already-in-use':
            return 'creadential already in use';

        case 'auth/popup-blocked':
            return 'popup failed try to re - click'

        case 'auth/wrong-password': 
        return 'wrong  password';

        case 'auth/invalid-email':{
            return 'invalid email'
        }
        case 'auth/internal-error':{
            return 'internal error'
        }
        case 'auth/invalid-credential': {
            return 'invalid credential'
        }
        case 'auth/weak-password':{
            return 'weak password'
        }
        case 'auth/user-not-found':{
            return 'user not found'
        }

        default:
            return 'Error Occured , try re-load the page'
    }
}

export default handleFirebaseError;
