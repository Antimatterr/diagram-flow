import { CanvasStateProvider } from "./state/canvasStateProvider";
import "./App.css";
import Canvas from "./Canvas";
import { Toolbar } from "./Components/Toolbar";
function App() {
  return (
    <CanvasStateProvider>
      <div className="app-container">
        <div className="main-area">
          <Toolbar />
          <Canvas /> {/* The drawing canvas */}
        </div>
      </div>
    </CanvasStateProvider>
  );
}

export default App;
