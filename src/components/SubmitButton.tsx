import { ReactNode } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export default function SubmitButton({children, loadingState, className}: {children: ReactNode, loadingState: boolean, className?: string}) {
    return (
        <Button type="submit" disabled={loadingState} className={`w-full ${className}`}>
            {loadingState ? <><Spinner /> Loading...</> : children}
        </Button>
    )
}