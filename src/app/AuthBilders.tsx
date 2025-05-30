import { Providers } from "./providers";
import { verifySession } from "./lib/(AuthBilders)/dal";
import { CountDownTimer } from "@/components/(AuthBilders)/CountDownTimer";
import { UserInfo } from "@/components/(AuthBilders)/UserInfo";
import SessionErrorToastHandler from "@/components/(AuthBilders)/Handlers/SessionErrorToastHandler";

export async function AuthBilders({ children }: { children: React.ReactNode }) {
    const decoded = await verifySession();

    return (
        <Providers>
            {children}
            {<SessionErrorToastHandler decoded={decoded} />}
            {<CountDownTimer data={decoded} />}
            {<UserInfo data={decoded} />}
        </Providers>
    )
}