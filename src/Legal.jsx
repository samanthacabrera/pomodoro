import { Link } from "react-router-dom"; 

export default function Legal() {
  return (
    <div className="min-h-screen bg-yellow-50 text-stone-700">
      <div className="flex flex-col justify-center items-center space-y-6 p-6 h-screen max-w-xl mx-auto">
        <h1 className="text-2xl">Legal & Privacy Information</h1>

        <div className="max-w-2xl text-sm space-y-4">
            <p>
                This app is an original, personal project based on a general time-management
                method, which is not protected by copyright and may be freely implemented.
                “Pomodoro®” and “The Pomodoro Technique®” are trademarks of Francesco Cirillo 
                and are used here only to reference the technique; this app is not affiliated with him.       
            </p>

            <p>
                This app stores your timer settings, session statistics, and to-do items directly 
                on your device using your browser’s local storage. All information stays on your 
                device and is never shared with third parties.
            </p>

            <p>
                The app will always request your permission to send browser notifications for 
                timer alerts. You must grant this permission for alerts to appear outside the app. 
                If you deny permission, all alerts will only appear inside the app itself.
            </p>
            
            <p>
                Art assets, such as the tomato image used in this app, are provided by <a href="https://www.vecteezy.com/free-png/tomato" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-800">Vecteezy</a>.
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
