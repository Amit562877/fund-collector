'use client';

import React, { useState, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const Signup: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const phoneNumber = mobile.startsWith('+91') ? mobile : `+91${mobile}`;
      // Set up reCAPTCHA
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            'size': 'invisible',
            'callback': () => {},
          }
        );
      }
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setMessage('OTP sent to your mobile number.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await confirmationResult.confirm(otp);
      setMessage('Mobile number verified and signed up successfully!');
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      setMessage(error.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <form
        onSubmit={confirmationResult ? handleVerifyOtp : handleSendOtp}
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minWidth: '300px'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>
        {!confirmationResult ? (
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="mobile">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              required
              pattern="[0-9]{10}"
              placeholder="Enter mobile number"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              maxLength={10}
            />
          </div>
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="otp">Enter OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              placeholder="Enter OTP"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              maxLength={6}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}
        >
          {loading
            ? 'Processing...'
            : confirmationResult
              ? 'Verify OTP'
              : 'Send OTP'}
        </button>
        <div id="recaptcha-container" ref={recaptchaRef} />
        {message && (
          <div style={{ color: confirmationResult ? 'green' : 'red', textAlign: 'center' }}>{message}</div>
        )}
      </form>
    </div>
  );
};

export default Signup;