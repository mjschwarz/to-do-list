import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../database';

const provider = new GoogleAuthProvider();

const Login = () => {
    const signInWithGoogle = async () => {
        signInWithPopup(auth, provider).then((result) => {
            const user = result.user;
        });
    }

    return (
        <div>
            <button onClick={signInWithGoogle}>Log In</button>
        </div>
    );
};

export default Login;