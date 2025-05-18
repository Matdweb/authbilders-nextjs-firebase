import React from "react";

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                width="1em"
                {...props}
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="1.5"></circle>
                    <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"></path>
                </g>
            </svg>
        </>
    );
};