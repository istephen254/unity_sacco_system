import { useEffect, useState } from "react";
import api from "../../../api";

export default function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/reports/summary");
        setReport(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h2>Reports</h2>

      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
}