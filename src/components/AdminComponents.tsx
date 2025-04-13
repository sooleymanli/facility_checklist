import React from 'react';

// Boolean cell renderer - show + or - instead of yes/no
export const BooleanCell: React.FC<{ value: boolean | null }> = ({ value }) => {
  if (value === null) return <span>—</span>;
  return (
    <span style={{ 
      color: value ? 'green' : 'red', 
      fontWeight: 'bold',
      fontSize: '16px' 
    }}>
      {value ? '+' : '−'}
    </span>
  );
}; 