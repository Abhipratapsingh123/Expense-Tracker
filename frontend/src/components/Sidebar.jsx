import ThreadCard from "./ThreadCard";
import { Moon, Sun } from "lucide-react";

function Sidebar({
    threads,
    currentThread,
    onSelectThread,
    onNewChat,
    darkMode,
    toggleDarkMode
}) {

    return (

        <div className="w-72 h-screen bg-gray-900 dark:bg-black text-white flex flex-col transition-colors duration-300">

            <div className="p-4 space-y-3">

                <button
                    onClick={onNewChat}
                    className="w-full bg-blue-600 rounded-lg py-2 hover:bg-blue-700 transition"
                >
                    + New Chat
                </button>

                <button
                    onClick={toggleDarkMode}
                    className="w-full border border-gray-700 rounded-lg py-2 hover:bg-gray-800 flex items-center justify-center gap-2 transition"
                >

                    {

                        darkMode

                        ?

                        <>

                            <Sun size={18} />

                            Light Mode

                        </>

                        :

                        <>

                            <Moon size={18} />

                            Dark Mode

                        </>

                    }

                </button>

            </div>

            <div className="flex-1 overflow-y-auto">

                {

                    threads.map(thread => (

                        <ThreadCard
                            key={thread.id}
                            thread={thread}
                            active={thread.id === currentThread}
                            onClick={() => onSelectThread(thread.id)}
                        />

                    ))

                }

            </div>

        </div>

    );

}

export default Sidebar;