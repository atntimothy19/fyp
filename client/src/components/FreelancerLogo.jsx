import React from 'react';

function CustomLogo({ width = 50, height = 50 }) {
  return (
    <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <image href="/FreelancerLogo.svg" width={width} height={height} />
      </svg>
    </div>
  );
}

export default CustomLogo;
