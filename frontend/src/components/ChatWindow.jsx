import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function ChatWindow({ messages, loading, onQuickPrompt }) {

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);

    const showWelcome =
        messages.length === 1 &&
        messages[0].role === "assistant";

    return (

        <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

            {

                showWelcome && (

                    <div className="flex flex-col items-center mt-16">

                        <h1 className="text-6xl font-bold text-gray-900 dark:text-white transition-colors">


                            Smart Spend

                        </h1>

                        <p className="text-gray-500 mt-4">

                            Your AI Expense Assistant

                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-12">

                            <button
                                onClick={() => onQuickPrompt("Add an expense")}
                                className="bg-white border rounded-xl p-5 hover:shadow"
                            >
                                ➕ Add Expense
                            </button>

                            <button
                                onClick={() => onQuickPrompt("List all expenses")}
                                className="bg-white border rounded-xl p-5 hover:shadow"
                            >
                                📋 List Expenses
                            </button>

                            <button
                                onClick={() => onQuickPrompt("Show monthly summary")}
                                className="bg-white border rounded-xl p-5 hover:shadow"
                            >
                                📊 Monthly Summary
                            </button>

                            <button
                                onClick={() => onQuickPrompt("Delete an expense")}
                                className="bg-white border rounded-xl p-5 hover:shadow"
                            >
                                🗑 Delete Expense
                            </button>

                        </div>

                    </div>

                )

            }

            {

                !showWelcome && (

                    <>

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
                                    typing={true}
                                    message={{
                                        role: "assistant",
                                        content: ""
                                    }}
                                />

                            )

                        }

                    </>

                )

            }

            <div ref={bottomRef}></div>

        </div>

    );

}

export default ChatWindow;