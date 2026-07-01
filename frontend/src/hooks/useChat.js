import { useState, useEffect } from "react";
import { sendMessage, getHistory } from "../services/api";

export default function useChat(
    userId,
    threadId,
    threads,
    setThreads
) {

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! How can I help you today?"
        }
    ]);

    const [loading, setLoading] = useState(false);

    // Generate a better thread title
    function generateTitle(message) {

        const text = message.trim();

        if (text.length <= 30) {
            return text;
        }

        return text.substring(0, 30) + "...";
    }

    // Load history whenever the active thread changes
    useEffect(() => {

        async function loadHistory() {

            try {

                const data = await getHistory(threadId);

                if (data.messages.length === 0) {

                    setMessages([
                        {
                            role: "assistant",
                            content: "Hi! How can I help you today?"
                        }
                    ]);

                } else {

                    setMessages(data.messages);

                }

            } catch (error) {

                console.error(error);

                setMessages([
                    {
                        role: "assistant",
                        content: "Hi! How can I help you today?"
                    }
                ]);

            }

        }

        loadHistory();

    }, [threadId]);

    async function handleSend(userMessage) {

        if (!userMessage.trim()) return;

        // Rename only once
        const currentThread = threads.find(
            thread => thread.id === threadId
        );

        if (currentThread && currentThread.title === "New Chat") {

            setThreads(prev =>

                prev.map(thread =>

                    thread.id === threadId

                        ? {
                              ...thread,
                              title: generateTitle(userMessage)
                          }

                        : thread

                )

            );

        }

        // Add user message immediately
        const userMsg = {
            role: "user",
            content: userMessage
        };

        setMessages(prev => [
            ...prev,
            userMsg
        ]);

        setLoading(true);

        try {

            const response = await sendMessage(
                userMessage,
                userId,
                threadId
            );

            const assistantMsg = {
                role: "assistant",
                content: response.response
            };

            setMessages(prev => [
                ...prev,
                assistantMsg
            ]);

        } catch (error) {

            console.error(error);

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Something went wrong."
                }
            ]);

        } finally {

            setLoading(false);

        }

    }

    return {
        messages,
        loading,
        handleSend
    };

}