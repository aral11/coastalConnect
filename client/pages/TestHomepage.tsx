import React from "react";

const TestHomepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          🎉 Phase 1 Test Homepage Working!
        </h1>
        <p className="text-xl text-blue-700 mb-8">
          Routing is working correctly - Phase1Homepage should load next
        </p>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Next Steps:</h2>
            <p>This confirms routing is working. The issue is with Phase1Homepage component.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHomepage;
