import { useState } from "react";

function InputBar({ onSend }) {

    const [message, setMessage] = useState("");

    function handleSend() {

        if (!message.trim()) return;

        onSend(message);

        setMessage("");

    }

    return (

        <div className="bg-white border-t">

            <div className="max-w-4xl mx-auto p-5">

                <div className="flex items-center rounded-2xl border shadow-sm px-4">

                    <input

                        className="flex-1 py-4 outline-none"

                        placeholder="Ask anything about your expenses..."

                        value={message}

                        onChange={(e) =>
                            setMessage(e.target.value)
                        }

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                handleSend();

                            }

                        }}

                    />

                    <button

                        onClick={handleSend}

                        className="ml-3 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-xl"

                    >

                        Send

                    </button>

                </div>

            </div>

        </div>

    );

}

export default InputBar;