import { useAppSelector } from '@/store';
import  { LOGIN_MODAL } from '@/constants/enums';
import Forgot from './ForgotPassword';
import Login from './Login';
import Register from './Register';

function LoginRegister() {
  const { showLoginModal } = useAppSelector((state) => state.appData);
  
  return (
    <>
      {showLoginModal === LOGIN_MODAL.LOGIN && <Login />}
      {showLoginModal === LOGIN_MODAL.REGISTER && <Register />}
      {showLoginModal === LOGIN_MODAL.FORGOT_PASS && <Forgot />}
    </>
  );
}

export default LoginRegister;
