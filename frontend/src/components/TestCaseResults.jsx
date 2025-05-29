import React from "react";

const TestCaseResults = ({ resultDetails }) => {
  return (
    <div style={{ fontSize: '0.8em', margin: 0, padding: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {resultDetails.map((tc, idx) => (
        <span key={idx}>
          TC{idx + 1}: In:{tc.input} Exp:{tc.expected_output} User:{tc.user_output} Res:{tc.result}{tc.error ? ` Err:${tc.error}` : ''}{idx < resultDetails.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
};

export default TestCaseResults;
