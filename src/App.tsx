import { ConfigProvider } from "antd";
import svSE from "antd/locale/sv_SE";
import DeviationList from "./components/DeviationList";
import "./App.css";

function App() {
  return (
    <ConfigProvider
      locale={svSE}
      theme={{
        token: {
          colorPrimary: "rgb(39, 152, 215)",
        },
      }}
    >
      <div className="app">
        <DeviationList />
      </div>
    </ConfigProvider>
  );
}

export default App;
