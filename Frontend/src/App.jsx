import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./share/routes";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
