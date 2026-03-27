import React, { useState, useEffect } from "react";
import { TOTP } from "totp-generator";
import { FaKey, FaCopy, FaCheck, FaTimes } from "react-icons/fa";

function TwoFaAuthPage() {
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval;

    const updateToken = async () => {
      if (secret) {
        try {
          const cleanSecret = secret.replace(/\s+/g, "").toUpperCase();
          const { otp } = await TOTP.generate(cleanSecret);
          setToken(otp);
          const epoch = Math.floor(Date.now() / 1000);
          const timeUsed = epoch % 30;
          setTimeRemaining(30 - timeUsed);
        } catch (error) {
          setToken("Invalid Secret");
          setTimeRemaining(0);
        }
      } else {
        setToken("");
        setTimeRemaining(30);
      }
    };

    updateToken();

    interval = setInterval(() => {
      updateToken();
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  const handleCopy = () => {
    if (token && token !== "Invalid Secret") {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateProgress = () => {
    return ((30 - timeRemaining) / 30) * 100;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4 animate__animated animate__fadeIn">
      <div className="rounded-2xl shadow-xl overflow-hidden border" style={{ backgroundColor: '#25262B', borderColor: '#373A40' }}>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 rounded-2xl flex items-center justify-center shadow-inner">
              <FaKey size={26} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Greycliff CF, sans-serif', letterSpacing: '0.5px' }}>2FA Authenticator</h2>
              <p className="text-[#A6A7AB] text-sm mt-1">
                Enter your secret key below to generate your 2FA verification code.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-[#C1C2C5] mb-2 uppercase tracking-wide">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value.replace(/\s+/g, "").toUpperCase())}
                  placeholder="Enter 2FA Secret Key (e.g., JBSWY3DPEHPK3PXP)"
                  className="w-full rounded-xl px-5 py-3 pr-12 text-white placeholder-[#5C5F66] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono border"
                  style={{ backgroundColor: '#1A1B1E', borderColor: '#373A40' }}
                />
                {secret && (
                  <button
                    onClick={() => setSecret("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#5C5F66] hover:text-red-400 transition-colors rounded-full"
                    title="Clear secret"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>

            {secret && (
              <div className="mt-8">
                <div className="rounded-2xl p-7 relative overflow-hidden group border shadow-sm" style={{ backgroundColor: '#1A1B1E', borderColor: '#373A40' }}>
                  {/* Progress bar background line */}
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: '#2C2E33' }}>
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      style={{ width: `${calculateProgress()}%` }}
                     />
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-[#A6A7AB] text-sm mb-2 font-medium">Verification Code</p>
                      <h3 className="text-4xl md:text-5xl font-mono font-bold tracking-[0.25em]">
                        {token ? (
                          token === "Invalid Secret" ? (
                            <span className="text-red-400 text-2xl tracking-normal">{token}</span>
                          ) : (
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                              {token.slice(0, 3)} {token.slice(3)}
                            </span>
                          )
                        ) : (
                          <span className="text-[#373A40]">--- ---</span>
                        )}
                      </h3>
                    </div>

                    {token && token !== "Invalid Secret" && (
                      <div className="flex flex-col items-center gap-4 border-t md:border-t-0 md:border-l pt-5 md:pt-0 md:pl-8 w-full md:w-auto" style={{ borderColor: '#373A40' }}>
                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="#2C2E33"
                              strokeWidth="4"
                              fill="transparent"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray="175"
                              strokeDashoffset={175 - (175 * calculateProgress()) / 100}
                              className={`transition-all duration-1000 ease-linear ${
                                timeRemaining <= 5 ? "text-red-500" : timeRemaining <= 10 ? "text-yellow-500" : "text-blue-500"
                              }`}
                            />
                          </svg>
                          <span className={`absolute text-lg font-bold font-mono ${
                            timeRemaining <= 5 ? "text-red-500" : timeRemaining <= 10 ? "text-yellow-500" : "text-blue-400"
                          }`}>
                            {timeRemaining}
                          </span>
                        </div>
                        
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg transition-colors text-sm font-semibold w-full justify-center shadow-sm"
                          style={{ backgroundColor: '#25262B', border: '1px solid #373A40' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2C2E33'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25262B'}
                        >
                          {copied ? (
                            <>
                              <FaCheck className="text-green-400" /> Copied
                            </>
                          ) : (
                            <>
                              <FaCopy className="text-[#A6A7AB]" /> Copy Code
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {!secret && (
              <div className="mt-8 rounded-2xl p-10 text-center border-dashed border-2" style={{ backgroundColor: 'rgba(26, 27, 30, 0.5)', borderColor: '#373A40' }}>
                <FaKey className="mx-auto text-[#5C5F66] mb-4" size={36} />
                <p className="text-[#A6A7AB] font-medium">
                  Enter a valid 2FA Secret Key to view your verification code.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoFaAuthPage;
