import Auth from "../components/Auth";
import Quote from "../components/Quote";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signin() {
    const handleLoginError = () => {
        toast.error("Invalid username or password. Please try again.");
    };

    return (
        <>
            <ToastContainer />
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div>
                    <Auth type="signin" onError={handleLoginError} />
                </div>
                <div className="hidden lg:block"><Quote /></div>
            </div>
        </>
    );
}
