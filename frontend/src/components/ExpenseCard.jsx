function ExpenseCard({ expense }) {

    return (

        <div className="bg-white rounded-xl border shadow-sm p-4 mb-3">

            <div className="flex justify-between items-center">

                <div>

                    <h3 className="font-semibold text-lg">

                        {expense.subcategory || expense.category}

                    </h3>

                    <p className="text-gray-500">

                        {expense.category}

                    </p>

                </div>

                <div className="text-xl font-bold text-green-600">

                    ₹{expense.amount}

                </div>

            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-500">

                <span>{expense.date}</span>

                <span>ID: {expense.id}</span>

            </div>

            {

                expense.note &&

                <div className="mt-3 text-sm">

                    📝 {expense.note}

                </div>

            }

        </div>

    );

}

export default ExpenseCard;