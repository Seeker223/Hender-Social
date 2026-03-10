import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
   <> 
      <Toaster/>
       <main className="min-h-screen bg-[var(--hx-app-bg)] text-[var(--hx-text)]" >
        <Outlet/>
       </main>
     
   </>
  );
}

export default App;
