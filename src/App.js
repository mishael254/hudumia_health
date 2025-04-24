import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3004/api/health-check")
      .then((res) => setStatus(res.data.status))
      .catch((err) => setStatus("Backend unreachable"));
  }, []);

  return (
    <div className="App">
      <h1>hudumia app works</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;
