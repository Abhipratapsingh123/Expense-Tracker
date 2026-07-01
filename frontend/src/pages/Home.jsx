import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";

import useChat from "../hooks/useChat";

function Home() {

    const userId = "user_1";

    const initialThreadId = crypto.randomUUID();

    const [currentThread, setCurrentThread] = useState(initialThreadId);

    const [threads, setThreads] = useState([
        {
            id: initialThreadId,
            title: "New Chat"
        }
    ]);

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {

        if (darkMode) {

            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");

        } else {

            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");

        }

    }, [darkMode]);

    const {
        messages,
        loading,
        handleSend
    } = useChat(
        userId,
        currentThread,
        threads,
        setThreads
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

        setCurrentThread(id);

    }

    return (

        <div className="flex h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

            <Sidebar
                threads={threads}
                currentThread={currentThread}
                onSelectThread={setCurrentThread}
                onNewChat={createNewChat}
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
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