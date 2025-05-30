import { Providers } from "./providers";
import { CountDownTimer } from "@/components/(AuthBilders)/CountDownTimer";
import { verifySession } from "./lib/(AuthBilders)/dal";
import { UserInfo } from "@/components/(AuthBilders)/UserInfo";
import SessionErrorToastHandler from "@/components/(AuthBilders)/Handlers/SessionErrorToastHandler";

export default async function AuthBilders({ children }: { children: React.ReactNode; }) {
    const decoded = await verifySession();

    return (
        <Providers>
            {children}
            {<SessionErrorToastHandler decoded={decoded} />}
            {<CountDownTimer data={decoded} />}
            {<UserInfo data={decoded} />}
        </Providers>
    );
}