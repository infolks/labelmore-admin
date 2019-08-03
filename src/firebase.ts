// import firebase
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
// import firebase config
import config from './env/firebase.config'

// init firebase
const app = firebase.initializeApp(config)

export const auth = app.auth()
export const db = app.firestore()
export const storage = app.storage()

export default app