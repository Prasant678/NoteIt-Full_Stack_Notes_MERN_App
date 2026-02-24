const VerifyFailed = ({ openLogin, onClose }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center 
                   bg-black/5 backdrop-blur-sm md:px-0 px-6"
            onClick={onClose}
        >
            <div
                className="bg-[#1a1a1ae3] px-4 py-5 rounded-md shadow-xl text-center 
                     max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    className="w-26 mx-auto mb-2"
                    src="/Unverified.png"
                    alt="verified"
                />

                <h1 className="text-2xl font-bold text-neutral-200 mb-3">
                    Email Verified Failed!
                </h1>

                <p className="text-neutral-300 mb-5">
                    Verification Link Expired or Invalid To again Verify Do These Steps :- <br />
                    1. Login using your email & password. <br />
                    2. Click “Resend verification link”. <br />
                    3. Check your email and verify again.
                </p>
                <button
                    onClick={() => {
                        onClose();
                        openLogin();
                    }}
                    className="bg-[#FF6347] text-black px-5 py-1.5 rounded font-semibold"
                >
                    Login
                </button>
            </div>
        </div>
    )
}

export default VerifyFailed