// TestCaseResults.jsx
// This component displays a summary of test case results for a coding problem submission.

import React from "react";

/**
 * TestCaseResults component.
 * Displays a compact summary of test case results for a coding problem submission.
 * @param {object} props
 * @param {Array} props.resultDetails - Array of test case result objects.
 */
const TestCaseResults = ({ resultDetails }) => {
  return (
    <div style={{ fontSize: '0.8em', margin: 0, padding: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {resultDetails.map((tc, idx) => (
        <span key={idx}>
          {/* Display test case index, input, expected output, user output, result, and error if any */}
          TC{idx + 1}: In:{tc.input} Exp:{tc.expected_output} User:{tc.user_output} Res:{tc.result}{tc.error ? ` Err:${tc.error}` : ''}{idx < resultDetails.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
};

export default TestCaseResults;
