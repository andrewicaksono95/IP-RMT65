// Cute alert system with beautiful styling
export const cuteAlert = {
  success: (message, options = {}) => {
    showAlert({
      type: 'success',
      message,
      icon: '🎉',
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
      borderColor: '#86efac',
      ...options
    });
  },
  
  error: (message, options = {}) => {
    showAlert({
      type: 'error', 
      message,
      icon: '😔',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #fef2f2, #fecaca)',
      borderColor: '#fca5a5',
      ...options
    });
  },
  
  warning: (message, options = {}) => {
    showAlert({
      type: 'warning',
      message, 
      icon: '⚠️',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #fefbeb, #fef3c7)',
      borderColor: '#fcd34d',
      ...options
    });
  },
  
  info: (message, options = {}) => {
    showAlert({
      type: 'info',
      message,
      icon: '💡',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
      borderColor: '#93c5fd',
      ...options
    });
  },
  
  love: (message, options = {}) => {
    showAlert({
      type: 'love',
      message,
      icon: '💖',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
      borderColor: '#f9a8d4',
      ...options
    });
  },
  
  confirm: (message, onConfirm, onCancel = null, options = {}) => {
    return showConfirm({
      message,
      icon: '🤔',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
      borderColor: '#c4b5fd',
      onConfirm,
      onCancel,
      ...options
    });
  }
};

function showAlert({ type, message, icon, color, gradient, borderColor, duration = 4000 }) {
  // Remove existing alerts
  const existingAlert = document.querySelector('.cute-alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  const alertDiv = document.createElement('div');
  alertDiv.className = 'cute-alert';
  alertDiv.innerHTML = `
    <div class="cute-alert-content">
      <div class="cute-alert-icon">${icon}</div>
      <div class="cute-alert-message">${message}</div>
      <button class="cute-alert-close">✨</button>
    </div>
  `;
  
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: ${gradient};
    border: 2px solid ${borderColor};
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05);
    transform: translateX(400px) scale(0.8);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    overflow: hidden;
    max-width: 400px;
    animation: slideInBounce 0.6s ease-out forwards;
  `;
  
  const contentDiv = alertDiv.querySelector('.cute-alert-content');
  contentDiv.style.cssText = `
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px 25px;
    position: relative;
  `;
  
  const iconDiv = alertDiv.querySelector('.cute-alert-icon');
  iconDiv.style.cssText = `
    font-size: 2rem;
    animation: bounce 2s infinite;
    flex-shrink: 0;
  `;
  
  const messageDiv = alertDiv.querySelector('.cute-alert-message');
  messageDiv.style.cssText = `
    color: ${color};
    font-weight: 600;
    font-size: 1rem;
    flex: 1;
    line-height: 1.4;
  `;
  
  const closeBtn = alertDiv.querySelector('.cute-alert-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: all 0.3s ease;
    opacity: 0.7;
  `;
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = `rgba(0, 0, 0, 0.1)`;
    closeBtn.style.transform = 'scale(1.2) rotate(360deg)';
    closeBtn.style.opacity = '1';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'none';
    closeBtn.style.transform = 'scale(1) rotate(0deg)';
    closeBtn.style.opacity = '0.7';
  });
  
  closeBtn.addEventListener('click', () => {
    alertDiv.style.animation = 'slideOutBounce 0.4s ease-out forwards';
    setTimeout(() => alertDiv.remove(), 400);
  });
  
  // Add CSS animations
  if (!document.querySelector('#cute-alert-styles')) {
    const styles = document.createElement('style');
    styles.id = 'cute-alert-styles';
    styles.textContent = `
      @keyframes slideInBounce {
        0% {
          transform: translateX(400px) scale(0.8);
          opacity: 0;
        }
        60% {
          transform: translateX(-20px) scale(1.05);
          opacity: 1;
        }
        100% {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes slideOutBounce {
        0% {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateX(400px) scale(0.8);
          opacity: 0;
        }
      }
      
      @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translate3d(0, 0, 0);
        }
        40%, 43% {
          transform: translate3d(0, -8px, 0);
        }
        70% {
          transform: translate3d(0, -4px, 0);
        }
        90% {
          transform: translate3d(0, -2px, 0);
        }
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(alertDiv);
  
  // Auto dismiss
  setTimeout(() => {
    if (document.body.contains(alertDiv)) {
      alertDiv.style.animation = 'slideOutBounce 0.4s ease-out forwards';
      setTimeout(() => alertDiv.remove(), 400);
    }
  }, duration);
}

function showConfirm({ message, icon, color, gradient, borderColor, onConfirm, onCancel }) {
  return new Promise((resolve) => {
    // Remove existing modals
    const existingModal = document.querySelector('.cute-modal-backdrop');
    if (existingModal) {
      existingModal.remove();
    }
    
    const backdrop = document.createElement('div');
    backdrop.className = 'cute-modal-backdrop';
    backdrop.innerHTML = `
      <div class="cute-modal">
        <div class="cute-modal-content">
          <div class="cute-modal-icon">${icon}</div>
          <div class="cute-modal-message">${message}</div>
          <div class="cute-modal-buttons">
            <button class="cute-modal-cancel">Cancel</button>
            <button class="cute-modal-confirm">Confirm</button>
          </div>
        </div>
      </div>
    `;
    
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(5px);
    `;
    
    const modal = backdrop.querySelector('.cute-modal');
    modal.style.cssText = `
      background: ${gradient};
      border: 2px solid ${borderColor};
      border-radius: 25px;
      padding: 0;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
      transform: scale(0.8) translateY(-50px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    const content = backdrop.querySelector('.cute-modal-content');
    content.style.cssText = `
      padding: 30px;
      text-align: center;
    `;
    
    const iconDiv = backdrop.querySelector('.cute-modal-icon');
    iconDiv.style.cssText = `
      font-size: 3rem;
      margin-bottom: 20px;
      animation: bounce 2s infinite;
    `;
    
    const messageDiv = backdrop.querySelector('.cute-modal-message');
    messageDiv.style.cssText = `
      color: ${color};
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 25px;
      line-height: 1.4;
    `;
    
    const buttonsDiv = backdrop.querySelector('.cute-modal-buttons');
    buttonsDiv.style.cssText = `
      display: flex;
      gap: 15px;
      justify-content: center;
    `;
    
    const cancelBtn = backdrop.querySelector('.cute-modal-cancel');
    cancelBtn.style.cssText = `
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
      border: 2px solid #d1d5db;
      color: #6b7280;
      padding: 12px 24px;
      border-radius: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    
    const confirmBtn = backdrop.querySelector('.cute-modal-confirm');
    confirmBtn.style.cssText = `
      background: linear-gradient(135deg, #ec4899, #be185d);
      border: none;
      color: white;
      padding: 12px 24px;
      border-radius: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    
    // Button hover effects
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.background = 'linear-gradient(135deg, #e5e7eb, #d1d5db)';
      cancelBtn.style.transform = 'translateY(-2px)';
    });
    
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.background = 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
      cancelBtn.style.transform = 'translateY(0)';
    });
    
    confirmBtn.addEventListener('mouseenter', () => {
      confirmBtn.style.background = 'linear-gradient(135deg, #be185d, #9d174d)';
      confirmBtn.style.transform = 'translateY(-2px)';
    });
    
    confirmBtn.addEventListener('mouseleave', () => {
      confirmBtn.style.background = 'linear-gradient(135deg, #ec4899, #be185d)';
      confirmBtn.style.transform = 'translateY(0)';
    });
    
    // Event handlers
    const handleCancel = () => {
      backdrop.style.opacity = '0';
      modal.style.transform = 'scale(0.8) translateY(-50px)';
      setTimeout(() => {
        backdrop.remove();
        if (onCancel) onCancel();
        resolve(false);
      }, 300);
    };
    
    const handleConfirm = () => {
      backdrop.style.opacity = '0';
      modal.style.transform = 'scale(0.8) translateY(-50px)';
      setTimeout(() => {
        backdrop.remove();
        if (onConfirm) onConfirm();
        resolve(true);
      }, 300);
    };
    
    cancelBtn.addEventListener('click', handleCancel);
    confirmBtn.addEventListener('click', handleConfirm);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) handleCancel();
    });
    
    document.body.appendChild(backdrop);
    
    // Animate in
    setTimeout(() => {
      backdrop.style.opacity = '1';
      modal.style.transform = 'scale(1) translateY(0)';
    }, 10);
  });
}