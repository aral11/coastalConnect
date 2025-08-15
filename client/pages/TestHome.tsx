import React from 'react';

export default function TestHome() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#ff6600', fontSize: '48px', textAlign: 'center' }}>
        🌊 CoastalConnect is Working! 🌊
      </h1>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', margin: '20px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
          Welcome to CoastalConnect
        </h2>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          Your gateway to coastal Karnataka experiences
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginTop: '30px'
        }}>
          <div style={{ padding: '20px', backgroundColor: '#ff6600', color: 'white', borderRadius: '8px' }}>
            <h3>🏨 Hotels</h3>
            <p>45+ Properties</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px' }}>
            <h3>🍽️ Restaurants</h3>
            <p>78+ Dining Options</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#16a34a', color: 'white', borderRadius: '8px' }}>
            <h3>🚗 Transport</h3>
            <p>32+ Drivers</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#dc2626', color: 'white', borderRadius: '8px' }}>
            <h3>🎉 Events</h3>
            <p>23+ Experiences</p>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>✅ Status Check</h3>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>✓ React Router Working</p>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Component Rendering</p>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Styles Applied</p>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>✓ UI Visible</p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <button 
            style={{ 
              padding: '15px 30px', 
              backgroundColor: '#ff6600', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '18px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            onClick={() => alert('Navigation working!')}
          >
            Test Button
          </button>
          <button 
            style={{ 
              padding: '15px 30px', 
              backgroundColor: '#6b7280', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '18px',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/about'}
          >
            Navigate to About
          </button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        <p>If you can see this, the app is working correctly!</p>
        <p>Current URL: {window.location.href}</p>
        <p>Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
