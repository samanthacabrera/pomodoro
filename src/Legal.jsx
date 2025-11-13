import { Link } from "react-router-dom"; 

export default function Legal() {
  return (
    <div className="min-h-screen bg-yellow-50 text-stone-700">
        <div className="flex flex-col justify-center items-center space-y-6 p-6 h-screen max-w-xl mx-auto">
            <h1 className="text-2xl">Legal & Privacy Information</h1>

            <div className="max-w-2xl text-sm space-y-4">
                <p>
                We respect your privacy. This app does not collect personal information
                beyond what is necessary for the timer and task tracking.
                </p>
                <p>
                All data is stored locally in your browser and is not shared with third parties.
                </p>
                <p>
                The app uses browser notifications to alert you when a timer ends. Notifications require your explicit permission. You can allow or deny notifications through your browser settings. If you deny permission, timer alerts will only appear visually in the app.
                </p>
                <p>
                By using this app, you agree to these terms. 
                </p>
            </div>

            <Link
                to="/pomodoro"
                className="self-start text-sm hover:underline"
            >
                Back to Pomodoro
            </Link>
        </div>
    </div>
  );
}
