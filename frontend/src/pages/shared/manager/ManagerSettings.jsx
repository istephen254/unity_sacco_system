import { useState } from "react";
import api from "../../../api";

export default function ManagerSettings() {
  const [settings, setSettings] = useState({
    interestRate: "",
    loanLimit: "",
  });

  const updateSettings = async (e) => {
    e.preventDefault();
    await api.put("/manager/settings", settings);
    alert("Settings updated");
  };

  return (
    <div className="dash-section">
      <h3>System Settings</h3>

      <form className="card" onSubmit={updateSettings}>
        <input
          placeholder="Interest Rate %"
          value={settings.interestRate}
          onChange={(e) =>
            setSettings({ ...settings, interestRate: e.target.value })
          }
        />

        <input
          placeholder="Loan Limit"
          value={settings.loanLimit}
          onChange={(e) =>
            setSettings({ ...settings, loanLimit: e.target.value })
          }
        />

        <button>Save Settings</button>
      </form>
    </div>
  );
}