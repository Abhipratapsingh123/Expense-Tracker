import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function ChatWindow({ messages, loading }) {

    const bottomRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);

    return (

        <div className="flex-1 overflow-y-auto bg-slate-50">

            {
                messages.length === 0 && (

                    <div className="h-full flex flex-col justify-center items-center text-center">

                        <h1 className="text-4xl font-bold mb-3">
                            💰 Expense AI
                        </h1>

                        <p className="text-gray-500">
                            Start tracking your expenses naturally.
                        </p>

                        <div className="mt-8 space-y-2 text-gray-400">

                            <p>"I spent ₹250 on coffee."</p>

                            <p>"Show expenses this month."</p>

                            <p>"Delete expense ID 5."</p>

                        </div>

                    </div>

                )
            }

            <div className="max-w-4xl mx-auto px-6 py-8">

                {
                    messages.map((message, index) => (

                        <MessageBubble
                            key={index}
                            message={message}
                        />

                    ))
                }

                {
                    loading && (

                        <MessageBubble

                            message={{
                                role: "assistant",
                                content: "Thinking..."
                            }}

                            typing

                        />

                    )
                }

                <div ref={bottomRef}></div>

            </div>

        </div>

    );

}

export default ChatWindow;