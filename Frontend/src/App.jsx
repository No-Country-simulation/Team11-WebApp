import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./share/routes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
