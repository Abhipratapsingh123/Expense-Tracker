import MessageBubble from "./MessageBubble";

function ChatWindow({ messages, loading }) {

    return (

        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">

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
                    />

                )
            }

        </div>

    );

}

export default ChatWindow;