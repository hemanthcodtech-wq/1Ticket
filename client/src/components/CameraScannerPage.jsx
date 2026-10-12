import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Scan,
  ShieldCheck,
  Sparkles,
  Search,
  Check,
  SwitchCamera
} from 'lucide-react';

export default function CameraScannerPage({ bookings = [], token, onScanSuccess }) {
  const [manualCode, setManualCode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);

  const [continuousMode, setContinuousMode] = useState(true);
  const [cooldownCountdown, setCooldownCountdown] = useState(0);

  // Rear ('environment') vs Front ('user') camera toggle state for mobile phones
  const [facingMode, setFacingMode] = useState('environment');
  const [isFlipping, setIsFlipping] = useState(false);

  const html5QrCodeRef = useRef(null);
  const isProcessingScanRef = useRef(false);
  const cooldownTimerRef = useRef(null);
  const scannedCodesHistoryRef = useRef(new Set());
  const scannerContainerId = 'interactive-camera-qr-reader';

  // Fetch available cameras on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back camera if available
          const backCam = devices.find((d) => {
            const lbl = (d.label || '').toLowerCase();
            return lbl.includes('back') || lbl.includes('rear') || lbl.includes('environment');
          });
          setSelectedCameraId(backCam ? backCam.id : devices[0].id);
        } else {
          setCameraError('No camera devices detected on this system.');
        }
      })
      .catch((err) => {
        console.warn('Camera permission or availability check error:', err);
        setCameraError(
          'Camera access not granted or not available. Please allow camera permissions in your browser or enter the code manually.'
        );
      });

    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      stopCameraScanner();
    };
  }, []);

  const startCameraScanner = async (cameraIdToUse, modeToUse) => {
    const currentMode = modeToUse || facingMode;
    const camId = cameraIdToUse !== undefined ? cameraIdToUse : selectedCameraId;
    setCameraError(null);

    // Make sure container is visible in DOM before starting scanner
    setIsCameraActive(true);
    setScanning(true);

    try {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.stop();
          }
          await html5QrCodeRef.current.clear();
        } catch (cleanErr) {
          console.warn('Instance cleanup notice:', cleanErr);
        }
      }

      // Small tick to ensure DOM renders the container with valid dimensions
      await new Promise((resolve) => setTimeout(resolve, 80));

      const container = document.getElementById(scannerContainerId);
      if (!container) throw new Error('Scanner container element not found');

      html5QrCodeRef.current = new Html5Qrcode(scannerContainerId, {
        verbose: false
      });

      const config = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minDim = Math.min(viewfinderWidth, viewfinderHeight);
          const edge = Math.floor(minDim * 0.72) || 240;
          return { width: edge, height: edge };
        },
        aspectRatio: 1.333333
      };

      // If specific camera ID is passed and valid, use it;
      // otherwise use standard mobile constraint { facingMode: currentMode }
      const cameraSpec = camId ? camId : { facingMode: currentMode };

      await html5QrCodeRef.current.start(
        cameraSpec,
        config,
        (decodedText) => {
          handleVoucherCodeDetected(decodedText);
        },
        () => {
          // Frame callback
        }
      );

      // Force video element to play and be visible on macOS / iOS / Chrome
      const applyVideoStyles = () => {
        const video = container.querySelector('video');
        if (video) {
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.muted = true;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.minHeight = '320px';
          video.style.objectFit = 'cover';
          video.style.display = 'block';
          video.style.visibility = 'visible';
          if (video.paused) {
            video.play().catch((e) => console.warn('Video play retry:', e));
          }
        }
      };

      applyVideoStyles();
      setTimeout(applyVideoStyles, 200);
      setTimeout(applyVideoStyles, 500);

    } catch (err) {
      console.error('Failed to start camera scanner:', err);
      setCameraError(
        err.message || 'Unable to open camera stream. Ensure camera permissions are granted in browser settings.'
      );
      setIsCameraActive(false);
      setScanning(false);
    }
  };

  // Flip Camera between Rear (Environment) and Front (Selfie) lenses
  const handleFlipCamera = async () => {
    if (isFlipping) return;
    setIsFlipping(true);
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);

    // If multiple camera devices exist, resolve the matching device ID
    let targetCamId = '';
    if (cameras && cameras.length > 1) {
      if (nextMode === 'user') {
        const frontCam = cameras.find((d) => {
          const label = (d.label || '').toLowerCase();
          return label.includes('front') || label.includes('user') || label.includes('selfie') || label.includes('face');
        });
        if (frontCam) {
          targetCamId = frontCam.id;
          setSelectedCameraId(frontCam.id);
        } else {
          // Fall back to alternating camera
          const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
          const nextIndex = (currentIndex + 1) % cameras.length;
          targetCamId = cameras[nextIndex].id;
          setSelectedCameraId(targetCamId);
        }
      } else {
        const rearCam = cameras.find((d) => {
          const label = (d.label || '').toLowerCase();
          return label.includes('back') || label.includes('rear') || label.includes('environment');
        });
        if (rearCam) {
          targetCamId = rearCam.id;
          setSelectedCameraId(rearCam.id);
        } else {
          const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
          const nextIndex = (currentIndex + 1) % cameras.length;
          targetCamId = cameras[nextIndex].id;
          setSelectedCameraId(targetCamId);
        }
      }
    } else {
      // With single or generic device list on mobile, clearing targetCamId lets Html5Qrcode use { facingMode: nextMode }
      targetCamId = '';
      setSelectedCameraId('');
    }

    try {
      if (isCameraActive) {
        await stopCameraScanner();
        await startCameraScanner(targetCamId, nextMode);
      }
    } catch (err) {
      console.error('Error flipping camera lens:', err);
    } finally {
      setIsFlipping(false);
    }
  };

  const stopCameraScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      }
    } catch (err) {
      console.warn('Error stopping camera:', err);
    } finally {
      setIsCameraActive(false);
      setScanning(false);
    }
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCameraScanner();
    } else {
      startCameraScanner();
    }
  };

  const handleVoucherCodeDetected = async (code) => {
    if (!code || isProcessingScanRef.current) return;
    const cleanCode = code.trim().toUpperCase();

    // Prevent immediate re-trigger on the same code within current session
    if (scannedCodesHistoryRef.current.has(cleanCode)) {
      return;
    }

    isProcessingScanRef.current = true;
    scannedCodesHistoryRef.current.add(cleanCode);
    setManualCode(cleanCode);

    // Verify voucher code while keeping camera running seamlessly
    await verifyVoucherCode(cleanCode);

    // Start 3-second cooldown before allowing next scan
    setCooldownCountdown(3);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);

    let secondsLeft = 3;
    cooldownTimerRef.current = setInterval(() => {
      secondsLeft -= 1;
      setCooldownCountdown(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
        isProcessingScanRef.current = false;
        // Keep scanResult visible briefly or clear banner
      }
    }, 1000);
  };

  const handleScanNextImmediately = () => {
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = null;
    isProcessingScanRef.current = false;
    setCooldownCountdown(0);
    setScanResult(null);
    setManualCode('');
    if (!isCameraActive) {
      startCameraScanner();
    }
  };

  const verifyVoucherCode = async (codeToVerify) => {
    const code = (codeToVerify || manualCode).trim();
    if (!code) return;

    try {
      setVerifyLoading(true);

      const res = await fetch('/api/tickets/verify-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ticket_code: code })
      });

      const data = await res.json();
      setScanResult(data);

      const bookingInfo = data.booking || data.ticket;

      if (data.valid) {
        // Add to recent verified history
        setRecentScans((prev) => [
          {
            code: bookingInfo?.ticket_code || code,
            name: bookingInfo?.customer_name,
            offer: bookingInfo?.event_title,
            verifiedBy: bookingInfo?.verified_by_name || 'You',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            alreadyRedeemed: data.alreadyRedeemed
          },
          ...prev.filter(p => p.code !== (bookingInfo?.ticket_code || code)).slice(0, 9)
        ]);
        if (onScanSuccess) onScanSuccess();
      }
    } catch (err) {
      console.error('Verify error:', err);
      setScanResult({
        valid: false,
        error: 'Network connection failed while verifying voucher pass'
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="scanner-page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(246, 192, 66, 0.15)',
            border: '1px solid rgba(246, 192, 66, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f6c042',
            flexShrink: 0
          }}>
            <Scan size={20} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', color: '#ffffff', margin: 0 }}>
              Live Camera <span className="gold-gradient-text">QR Scanner & Verification</span>
            </h2>
            <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.82rem' }}>
              Aim your device camera at attendee voucher passes or enter voucher serial numbers directly.
            </p>
          </div>
        </div>
      </div>

      <div className="scanner-main-grid">
        {/* Left Column: Live Camera Video Stream */}
        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '16px',
          padding: 'clamp(14px, 2.5vw, 20px)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
        }}>
          <div className="scanner-controls-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: isCameraActive ? '#22c55e' : '#ef4444',
                boxShadow: isCameraActive ? '0 0 10px #22c55e' : 'none',
                flexShrink: 0
              }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>
                {isCameraActive ? 'Live Camera Feed Active' : 'Camera Feed Inactive'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Flip Camera Button (Always accessible, optimized for Mobile Field Teams) */}
              <button
                type="button"
                onClick={handleFlipCamera}
                disabled={isFlipping}
                className="btn-gold-outline"
                style={{
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: isFlipping ? 'wait' : 'pointer',
                  borderColor: 'rgba(246, 192, 66, 0.4)',
                  background: 'rgba(246, 192, 66, 0.08)'
                }}
                title="Switch between Rear (Back) and Front (Selfie) lens for mobile phones"
              >
                <SwitchCamera size={15} className={isFlipping ? 'animate-spin' : ''} />
                <span>
                  {facingMode === 'environment' ? 'Rear Camera (Back)' : 'Front Camera (Selfie)'}
                </span>
              </button>

              {/* Toggle Camera Button */}
              <button
                onClick={toggleCamera}
                className={isCameraActive ? 'btn-gold-outline' : 'btn-gold'}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isCameraActive ? (
                  <>
                    <CameraOff size={15} />
                    <span>Stop Camera</span>
                  </>
                ) : (
                  <>
                    <Camera size={15} />
                    <span>Start Camera</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Camera Selection Dropdown (if multiple cameras exist) */}
          {cameras.length > 1 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.74rem', color: '#9ca3af' }}>
                  Select Lens / Hardware Sensor:
                </label>
                <span style={{ fontSize: '0.7rem', color: '#f6c042', fontWeight: 600 }}>
                  Active: {facingMode === 'environment' ? 'Rear (Back Lens)' : 'Front (Selfie Lens)'}
                </span>
              </div>
              <select
                value={selectedCameraId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedCameraId(newId);
                  const selectedDev = cameras.find(c => c.id === newId);
                  if (selectedDev) {
                    const lbl = (selectedDev.label || '').toLowerCase();
                    if (lbl.includes('front') || lbl.includes('user') || lbl.includes('selfie')) {
                      setFacingMode('user');
                    } else if (lbl.includes('back') || lbl.includes('rear') || lbl.includes('environment')) {
                      setFacingMode('environment');
                    }
                  }
                  if (isCameraActive) {
                    stopCameraScanner().then(() => startCameraScanner(newId));
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#151922',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.8rem'
                }}
              >
                {cameras.map((c) => {
                  const lbl = (c.label || '').toLowerCase();
                  const isRear = lbl.includes('back') || lbl.includes('rear') || lbl.includes('environment');
                  const isFront = lbl.includes('front') || lbl.includes('user') || lbl.includes('selfie');
                  const badge = isRear ? ' • [Rear / Back]' : (isFront ? ' • [Front / Selfie]' : '');
                  return (
                    <option key={c.id} value={c.id}>
                      {c.label || `Camera ${c.id.substring(0, 8)}`}{badge}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Viewport Box */}
          <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '340px',
            background: '#000000',
            borderRadius: '12px',
            border: isCameraActive ? '2px solid rgba(246, 192, 66, 0.6)' : '2px dashed rgba(212, 175, 55, 0.4)',
            overflow: 'hidden',
            boxShadow: isCameraActive ? '0 0 25px rgba(246, 192, 66, 0.2)' : 'none'
          }}>
            {/* Target ID for Html5Qrcode rendering */}
            <div
              id={scannerContainerId}
              style={{
                width: '100%',
                minHeight: '340px',
                display: isCameraActive ? 'block' : 'none',
                position: 'relative'
              }}
            />

            {!isCameraActive && !scanResult && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 20px',
                color: '#6b7280',
                background: '#040507'
              }}>
                <Camera size={48} color="#d4af37" style={{ marginBottom: '12px', opacity: 0.8 }} />
                <p style={{ margin: '0 0 6px', fontSize: '0.92rem', color: '#e5e7eb', fontWeight: 600 }}>
                  Camera Scanner is Ready
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af', maxWidth: '280px' }}>
                  Click "Start Camera" above to scan voucher QR passes directly from attendee screens or printouts.
                </p>
              </div>
            )}

            {!isCameraActive && scanResult && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 20px',
                background: 'rgba(9, 11, 16, 0.95)',
                backdropFilter: 'blur(10px)',
                zIndex: 20
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: scanResult.valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: scanResult.valid ? '2px solid #10b981' : '2px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: scanResult.valid ? '#34d399' : '#f87171',
                  marginBottom: '14px'
                }}>
                  {scanResult.valid ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 6px', fontWeight: 800 }}>
                  {scanResult.valid ? 'Coupon Verified!' : 'Verification Failed'}
                </h3>
                <p style={{
                  fontSize: '0.84rem',
                  color: scanResult.valid ? '#34d399' : '#f87171',
                  margin: '0 0 8px',
                  fontWeight: 600
                }}>
                  {scanResult.message || scanResult.error}
                </p>
                {(scanResult.booking || scanResult.ticket) && (
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#e5e7eb',
                    margin: '0 0 20px',
                    fontFamily: 'monospace',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 12px',
                    borderRadius: '6px'
                  }}>
                    {(scanResult.booking || scanResult.ticket).ticket_code} • {(scanResult.booking || scanResult.ticket).customer_name}
                  </p>
                )}

                <button
                  onClick={handleScanAnother}
                  className="btn-gold"
                  style={{
                    padding: '12px 24px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 700
                  }}
                >
                  <Camera size={18} />
                  <span>Scan Another Coupon</span>
                </button>
              </div>
            )}

            {/* Live Camera Active HUD Overlay */}
            {isCameraActive && (
              <>
                {/* Center scan aiming guide */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'clamp(180px, 58vw, 220px)',
                  height: 'clamp(180px, 58vw, 220px)',
                  border: isProcessingScanRef.current ? '3px solid #10b981' : '2px dashed rgba(246, 192, 66, 0.7)',
                  borderRadius: '16px',
                  pointerEvents: 'none',
                  boxShadow: isProcessingScanRef.current ? '0 0 30px rgba(16, 185, 129, 0.5)' : 'none',
                  transition: 'all 0.3s ease'
                }} />

                {/* Instant Verification Banner Overlay on Video */}
                {scanResult ? (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    right: '10px',
                    background: scanResult.valid ? 'rgba(6, 78, 59, 0.94)' : 'rgba(127, 29, 29, 0.94)',
                    backdropFilter: 'blur(10px)',
                    border: scanResult.valid ? '1px solid #10b981' : '1px solid #ef4444',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.8)',
                    zIndex: 25,
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {scanResult.valid ? (
                        <CheckCircle2 size={24} color="#34d399" />
                      ) : (
                        <XCircle size={24} color="#f87171" />
                      )}
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>
                          {scanResult.valid
                            ? (scanResult.alreadyRedeemed ? 'Already Redeemed Prior' : 'VERIFIED & REDEEMED!')
                            : 'Invalid Voucher'}
                        </div>
                        {(scanResult.booking || scanResult.ticket) && (
                          <div style={{ fontSize: '0.74rem', color: '#d1fae5' }}>
                            {(scanResult.booking || scanResult.ticket).customer_name} • {(scanResult.booking || scanResult.ticket).ticket_code}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {cooldownCountdown > 0 ? (
                        <span style={{
                          fontSize: '0.72rem',
                          background: 'rgba(0, 0, 0, 0.4)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          color: '#fef08a'
                        }}>
                          Next in {cooldownCountdown}s...
                        </span>
                      ) : null}
                      <button
                        onClick={handleScanNextImmediately}
                        style={{
                          background: '#f6c042',
                          color: '#000000',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Next Guest ➜
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(246, 192, 66, 0.3)',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    color: '#f6c042',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 10
                  }}>
                    <Sparkles size={13} />
                    <span>Auto Continuous Scanner Active • Point at Voucher QR</span>
                  </div>
                )}

                {/* Floating Mobile Thumb Quick-Flip Button */}
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  disabled={isFlipping}
                  title={`Switch to ${facingMode === 'environment' ? 'Front (Selfie)' : 'Rear (Back)'} camera lens`}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    background: 'rgba(15, 18, 26, 0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(246, 192, 66, 0.55)',
                    color: '#f6c042',
                    borderRadius: '24px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: isFlipping ? 'wait' : 'pointer',
                    zIndex: 28,
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.75)'
                  }}
                >
                  <SwitchCamera size={15} className={isFlipping ? 'animate-spin' : ''} />
                  <span>{facingMode === 'environment' ? 'Flip to Front' : 'Flip to Rear'}</span>
                </button>
              </>
            )}
          </div>

          {cameraError && (
            <div style={{
              marginTop: '14px',
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* Right Column: Code Entry, Instant Verification & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Manual Input Box */}
          <div style={{
            background: '#0d1017',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
          }}>
            <h3 style={{ fontSize: '1rem', color: '#ffffff', margin: '0 0 12px', fontWeight: 700 }}>
              Manual Voucher Code Lookup
            </h3>

            <div className="scanner-manual-input-row">
              <input
                type="text"
                placeholder="e.g. 1TKT-WXYZ12-4567"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') verifyVoucherCode(); }}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  background: '#151922',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={() => verifyVoucherCode()}
                disabled={verifyLoading || !manualCode.trim()}
                className="btn-gold"
                style={{ padding: '11px 20px', fontSize: '0.86rem' }}
              >
                {verifyLoading ? 'Checking...' : 'Verify Pass'}
              </button>
            </div>

            {/* Quick-test buttons from active bookings */}
            {bookings.length > 0 && (
              <div>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                  Quick Test Recent Vouchers:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {bookings.slice(0, 4).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setManualCode(b.ticket_code);
                        verifyVoucherCode(b.ticket_code);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#d1d5db',
                        fontSize: '0.72rem',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f6c042'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                    >
                      {b.ticket_code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verification Result Card */}
          {scanResult && (
            <div style={{
              background: scanResult.valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: scanResult.valid ? '1px solid #10b981' : '1px solid #ef4444',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                {scanResult.valid ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <XCircle size={24} color="#ef4444" />
                )}
                <div>
                  <h4 style={{
                    fontSize: '1.05rem',
                    margin: 0,
                    color: scanResult.valid ? '#34d399' : '#f87171',
                    fontWeight: 800
                  }}>
                    {scanResult.valid
                      ? (scanResult.alreadyRedeemed ? 'Pass Already Redeemed' : 'Valid Coupon Voucher Verified!')
                      : 'Invalid Voucher Code'}
                  </h4>
                  <span style={{ fontSize: '0.76rem', color: '#d1d5db' }}>
                    {scanResult.message || scanResult.error}
                  </span>
                </div>
              </div>

              {(scanResult.booking || scanResult.ticket) && (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                  fontSize: '0.8rem',
                  marginTop: '10px'
                }}>
                  <div>
                    <span style={{ color: '#9ca3af', display: 'block', fontSize: '0.7rem' }}>CAMPAIGN</span>
                    <strong style={{ color: '#ffffff' }}>{(scanResult.booking || scanResult.ticket).event_title}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af', display: 'block', fontSize: '0.7rem' }}>CUSTOMER NAME</span>
                    <strong style={{ color: '#ffffff' }}>{(scanResult.booking || scanResult.ticket).customer_name}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af', display: 'block', fontSize: '0.7rem' }}>VOUCHER SERIAL</span>
                    <strong style={{ color: '#f6c042', fontFamily: 'monospace' }}>
                      {(scanResult.booking || scanResult.ticket).ticket_code}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#9ca3af', display: 'block', fontSize: '0.7rem' }}>STATUS</span>
                    <span style={{
                      color: (scanResult.booking || scanResult.ticket).status === 'redeemed' ? '#34d399' : '#10b981',
                      fontWeight: 700
                    }}>
                      ● {((scanResult.booking || scanResult.ticket).status || 'VERIFIED').toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              {/* Prompt to scan another coupon */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleScanAnother}
                  className="btn-gold"
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 700
                  }}
                >
                  <Camera size={16} />
                  <span>Scan Another Coupon</span>
                </button>
              </div>
            </div>
          )}

          {/* Recent Scans Session Log */}
          {recentScans.length > 0 && (
            <div style={{
              background: '#0d1017',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '18px'
            }}>
              <h4 style={{ fontSize: '0.88rem', color: '#ffffff', margin: '0 0 10px', fontWeight: 700 }}>
                Recent Scan Activity in this Session
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentScans.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '6px',
                      fontSize: '0.76rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#f6c042', fontFamily: 'monospace' }}>{s.code}</strong>
                      <span style={{ color: '#9ca3af', marginLeft: '8px' }}>{s.name}</span>
                    </div>
                    <span style={{ color: '#6b7280' }}>{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
