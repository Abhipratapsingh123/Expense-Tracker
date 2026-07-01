function SummaryCard({ summary }) {

    return (

        <div className="bg-white rounded-xl border shadow-sm p-5 mb-4">

            <div className="flex justify-between">

                <h3 className="font-semibold">

                    {summary.category}

                </h3>

                <h3 className="font-bold text-green-600">

                    ₹{summary.total_amount}

                </h3>

            </div>

            <p className="text-gray-500 mt-2">

                {summary.count} expenses

            </p>

        </div>

    );

}

export default SummaryCard;