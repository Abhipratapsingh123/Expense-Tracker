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
        handleSend,
        setMessages
    } = useChat(
        userId,
        currentThread
    );

    function createNewChat() {

        const id = crypto.randomUUID();

        const newThread = {
            id,
            title: "New Chat"
        };

        setThreads(prev => [
            newThread,
            ...prev
        ]);

        setCurrentThread(id);

        // Clear chat window
        setMessages([
            {
                role: "assistant",
                content: "Hi! How can I help you today?"
            }
        ]);
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