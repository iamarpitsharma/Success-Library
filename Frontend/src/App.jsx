import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home"
import About from "./pages/About"
import Service from "./pages/Service";
import Contact from "./pages/Contact";
function App() {
  return (
     <Routes>
      {/* <Route path={["/", "/home"]} element={<Home />} /> */}
      <Route path={"/"} element={<Home />} />
      <Route path={"/home"} element={<Home />} />
      <Route path="/about" element={<About />} />    
      <Route path="/services" element={<Service />} />      
      <Route path="/contact" element={<Contact />} />      

    </Routes>
  )
}
export default App;

// export default App
// App.jsx
// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// function App() {
//   return (   
//   );
// }
// export default App;