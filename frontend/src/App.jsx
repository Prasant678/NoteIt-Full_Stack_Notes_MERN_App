import { Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Home from './screens/Home'
import Archived from './screens/Archived'
import Deleted from './screens/Deleted'
import Footer from './components/Footer'
import About from './screens/About'
import { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal'
import { useDispatch, useSelector } from 'react-redux'
import { refreshToken } from './redux/features/authSlice'
import VerifyFailed from './components/VerifyFailed'
import VerifySuccess from './components/VerifySuccess'

const App = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifiedStatus, setVerifiedStatus] = useState(null);

  useEffect(() => {
    const param = searchParams.get("verified");
    if (param) {
      setVerifiedStatus(param);
    }
  }, [searchParams]);

  const closeVerificationModal = () => {
    setVerifiedStatus(null);
    navigate("/", { replace: true });
  };

  const dispatch = useDispatch();
  const { isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <>
      <Toaster position="bottom-right" theme="dark" toastOptions={{
        style: {
          background: "#1a1a1a",
          border: "none",
          color: "#e5e7eb",
          fontSize: "15px"
        }
      }} />
      <div className='overflow-x-hidden antialiased selection:bg-teal-300 selection:text-black'>
        <div className="fixed top-0 z-[-2] h-screen w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(200,7,81,0.5),rgba(38,1,60,0))]">
        </div>
        <Navbar openAuth={() => setAuthOpen(true)} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/archived-notes' element={<Archived />} />
          <Route path='/deleted-notes' element={<Deleted />} />
          <Route path='/about' element={<About />} />
        </Routes>
        {verifiedStatus === "true" && (
          <VerifySuccess
            openLogin={() => setAuthOpen(true)}
            onClose={closeVerificationModal}
          />
        )}

        {verifiedStatus === "false" && (
          <VerifyFailed
            openLogin={() => setAuthOpen(true)}
            onClose={closeVerificationModal}
          />
        )}
        {authOpen && (
          <AuthModal onClose={() => setAuthOpen(false)} />
        )}
        <Footer />
      </div>
    </>
  )
}

export default App