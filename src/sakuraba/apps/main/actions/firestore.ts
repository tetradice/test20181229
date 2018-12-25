import { firestore } from "firebase";

export default {
    /** Firestore DBをStateにセットする */
    setFirestore: (db: firestore.Firestore) => {
        return {firestore: db} as Partial<state.State>;
    }

}