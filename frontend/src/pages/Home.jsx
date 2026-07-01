import { useState } from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";

import useChat from "../hooks/useChat";

function Home() {

    const userId = "user_1";

    // Current active thread
    const [currentThread, setCurrentThread] = useState(
        crypto.randomUUID()
    );

    // Sidebar thread list
    const [threads, setThreads] = useState([
        {
            id: currentThread,
            title: "New Chat"
        }
    ]);

    const {
        messages,
        loading,
        handleSend
    } = useChat(
        userId,
        currentThread
    );

    function createNewChat() {

        const id = crypto.randomUUID();

        setThreads(prev => [
            {
                id,
                title: "New Chat"
            },
            ...prev
        ]);

        // Switch to the new thread
        // useChat() will automatically load its history
        setCurrentThread(id);

    }

    return (

        <div className="flex h-screen">

            <Sidebar
                threads={threads}
                currentThread={currentThread}
                onSelectThread={setCurrentThread}
                onNewChat={createNewChat}
            />

            <div className="flex flex-col flex-1">

                <ChatWindow
                    messages={messages}
                    loading={loading}
                />

                <InputBar
                    onSend={handleSend}
                />

            </div>

        </div>

    );

}

export default Home;