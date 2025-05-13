'use client';
import { useState } from 'react';
import { Tooltip, Button, Code } from "@heroui/react";

export default function ButtonAPIRequest() {
    const [response, setResponse] = useState<string | null>(null);

    const handleAPIRequest = async () => {
        const response = await fetch("/api/data", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.log("Failed to fetch data from API route.");
            return;
        }

        const data = await response.json();
        setResponse(JSON.stringify(data, null, 2)); // Format the response as a string
    }

    return (
        <>
            <Tooltip
                content={
                    <div className="px-1 py-2">
                        <div className="text-small font-bold">/api/data</div>
                        <div className="text-tiny">Request sensible data</div>
                    </div>
                }
                color="success"
                showArrow
            >
                <Button
                    color="primary"
                    variant="shadow"
                    onPress={handleAPIRequest}
                >
                    <p className="text-sm/6 font-semibold text-gray-200">API route</p>
                </Button>
            </Tooltip>
            {
                (response !== null) &&
                (<div className="fixed bottom-0 left-0 p-4 pb-20 rounded-lg shadow-lg">
                    <Code color={response.includes("error") ? "danger" : "success"}>
                        <pre className="whitespace-pre-wrap break-words">
                            {response}
                        </pre>
                    </Code>
                </div>)
            }
        </>
    )
}