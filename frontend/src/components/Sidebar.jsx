import ThreadCard from "./ThreadCard";

function Sidebar({
    threads,
    currentThread,
    onSelectThread,
    onNewChat
}) {

    return (

        <div className="w-72 h-screen bg-slate-900 text-white flex flex-col">

            {/* Header */}
            <div className="p-5 border-b border-slate-700">

                <h1 className="text-2xl font-bold">
                     Smart Spend
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                    AI Expense Tracker
                </p>

            </div>

            {/* New Chat */}

            <div className="p-4">

                <button

                    onClick={onNewChat}

                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-medium transition"

                >

                    + New Chat

                </button>

            </div>

            {/* Chat List */}

            <div className="px-4 pb-2">

                <p className="text-xs uppercase tracking-wider text-slate-400">

                    Chats

                </p>

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

            {/* Footer */}

            <div className="border-t border-slate-700 p-4">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">

                        A

                    </div>

                    <div>

                        <p className="font-medium">

                            Abhi

                        </p>

                        <p className="text-xs text-slate-400">

                            Expense Tracker

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Sidebar;