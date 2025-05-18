'use client'
import { useState } from 'react'
import { Tooltip, Button, Code, Spinner } from '@heroui/react'
import { CloseIcon } from './icons';
import { createPortal } from 'react-dom';

export default function ButtonAPIRequest({ className }: { className?: string }) {

    const [isPending, setIsPending] = useState<boolean>(false);
    const [response, setResponse] = useState<string | null>(null)

    const handleAPIRequest = async () => {
        setIsPending(true);
        const response = await fetch('/api/data');
        setIsPending(false);
        if (!response.ok) return console.log('Failed to fetch data.')

        const data = await response.json()
        setResponse(JSON.stringify(data, null, 2))
    }

    const handleDismiss = () => {
        setResponse(null)
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
                    className={"min-w-28 " + className}
                >
                    {
                        isPending ?
                            <Spinner color="white" variant="dots" />
                            :
                            <p className="text-sm/6 font-semibold text-gray-200">
                                API Route
                            </p>
                    }
                </Button>
            </Tooltip>

            {response &&
                createPortal(
                    <div className="fixed bottom-0 left- z-[9999] md:max-w-md max-w-sm w-full bg-[#0e0e0e] border border-gray-800 rounded-xl shadow-xl p-4 text-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-gray-400">API Response</span>
                            <button
                                onClick={handleDismiss}
                                className="text-gray-500 hover:text-red-400 transition-colors"
                                aria-label="Close"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <Code
                            color={response.includes('error') ? 'danger' : 'success'}
                            className="w-full max-h-64 overflow-auto"
                        >
                            <pre className="whitespace-pre-wrap break-words text-xs">{response}</pre>
                        </Code>
                    </div>,
                    document.body
                )}
        </>
    )
}
