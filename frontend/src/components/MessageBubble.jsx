import ExpenseCard from "./ExpenseCard";
import SummaryCard from "./SummaryCard";

function MessageBubble({

    message,

    typing = false

}) {

    const isUser = message.role === "user";

    function renderContent() {

        // Typing animation
        if (typing) {

            return (

                <div className="flex gap-1">

                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>

                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>

                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>

                </div>

            );

        }

        // Future support:
        // Backend returns an array of expenses
        if (Array.isArray(message.content)) {

            return message.content.map((item) => {

                // Expense list
                if ("amount" in item) {

                    return (

                        <ExpenseCard
                            key={item.id}
                            expense={item}
                        />

                    );

                }

                // Summary list
                if ("total_amount" in item) {

                    return (

                        <SummaryCard
                            key={item.category}
                            summary={item}
                        />

                    );

                }

                return null;

            });

        }

        // Default (normal AI message)
        return (

            <p className="leading-7 whitespace-pre-wrap">

                {message.content}

            </p>

        );

    }

    return (

        <div
            className={`flex mb-6 ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            {/* AI Avatar */}

            {

                !isUser && (

                    <div className="mr-3 flex-shrink-0">

                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">

                            AI

                        </div>

                    </div>

                )

            }

            {/* Bubble */}

            <div

                className={`

                    max-w-2xl

                    rounded-2xl

                    px-5

                    py-4

                    shadow-sm

                    ${
                        isUser
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200"
                    }

                `}

            >

                {renderContent()}

            </div>

            {/* User Avatar */}

            {

                isUser && (

                    <div className="ml-3 flex-shrink-0">

                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">

                            U

                        </div>

                    </div>

                )

            }

        </div>

    );

}

export default MessageBubble;