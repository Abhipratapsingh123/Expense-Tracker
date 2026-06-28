import ThreadCard from "./ThreadCard";

function Sidebar({
    threads,
    currentThread,
    onSelectThread,
    onNewChat
}) {
    return (
        <div className="w-72 h-screen bg-gray-900 text-white flex flex-col">

            <div className="p-4">

                <button
                    onClick={onNewChat}
                    className="w-full bg-blue-600 rounded-lg py-2 hover:bg-blue-700"
                >
                    + New Chat
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