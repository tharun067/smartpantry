"use client";
function EmptyState({title,description,icon}) {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <div className="mx-auto flex justify-center">
                {icon}
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
    );
}

export default EmptyState
