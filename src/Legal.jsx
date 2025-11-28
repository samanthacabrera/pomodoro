import { Link } from "react-router-dom"; 

export default function Legal() {
  return (
    <div className="min-h-screen bg-yellow-50 text-stone-700">
      <div className="flex flex-col justify-center items-center space-y-6 p-6 h-screen max-w-xl mx-auto">
        <h1 className="text-2xl">Legal & Privacy Information</h1>

        <div className="max-w-2xl text-sm space-y-4">
            <p>
                This app is a personal project based on a simple time-management technique called the Pomodoro method. 
                “Pomodoro®” is a registered trademark owned by Francesco Cirillo. We only mention it to explain the technique; 
                this app is not affiliated with him. The method itself is not copyrighted and can be freely used by anyone.    
            </p>

            <p>
                This app saves your timer settings, session statistics, main focus, and to-do items directly 
                on your device using your browser’s local storage. All information stays on your 
                device and is never shared with third parties.
            </p>

            <p>
                This app will request your permission to send browser notifications for 
                timer alerts. You must grant this permission for alerts to appear outside the app. 
                If you deny permission, all alerts will only appear inside the app itself.
            </p>
            
            <p>
                The tomato image used in this app, is provided by <a href="https://www.vecteezy.com/free-png/tomato" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-800">Vecteezy</a>.
            </p>

            <p>
                By using this app, you agree to these terms.
            </p>
        </div>

        <Link
          to="/pomodoro"
          className="self-start text-sm hover:underline"
        >
          Back to Tomate
        </Link>
      </div>
    </div>
  );
}
