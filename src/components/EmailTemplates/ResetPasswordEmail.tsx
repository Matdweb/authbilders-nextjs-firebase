interface EmailTemplateProps {
    firstName: string;
    redirectUrl: string;
}

export const ResetPasswordEmail: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    redirectUrl
}) => {

    const sectionStyle = {
        width: '100%',
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'flex-start',
        paddingLeft: '24px',
        paddingTop: '48px',
        paddingRight: '24px',
        background: 'linear-gradient(to right, #12222b, #0e0e0e)',
    };

    const containerStyle = {
        paddingLeft: '24px',
        paddingTop: '56px',
        paddingRight: '24px',
        paddingBottom: '0',
        maxWidth: 'none', /* Removed max-width from original container */
        margin: '0 auto',
    };

    const backgroundBlobTopStyle = {
        position: 'absolute',
        insetInlineStart: '0',
        top: '-160px',
        zIndex: '-10',
        transform: 'translateY(0px) translateX(0px) rotate(-30deg)',
        overflow: 'hidden',
        filter: 'blur(100px)',
    };

    const backgroundBlobBottomStyle = {
        insetInlineStart: '0',
        top: 'calc(100% - 208px)',
        zIndex: '-10',
        transform: 'translateY(0px) translateX(0px) rotate(-30deg)',
        overflow: 'hidden',
        filter: 'blur(100px)',
    };

    const blobStyle = {
        left: 'calc(50% - 176px)',
        aspectRatio: '1155 / 678',
        width: '36.125rem',
        transform: 'translateX(-50%) rotate(30deg)',
        backgroundImage: 'linear-gradient(to top right, #ff80b5, #9089fc)',
        opacity: '0.3',
        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
    };

    const textContainerStyle = {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '32rem',
        paddingTop: '8rem',
        paddingBottom: '2rem',
    };

    const titleStyle = {
        fontWeight: '600',
        letterSpacing: '-0.025em',
        color: 'rgba(249, 250, 251, 1)',
        fontSize: '3rem',
    };

    const paragraph1Style = {
        marginTop: '2rem',
        fontSize: '1.125rem',
        lineHeight: '1.75rem',
        color: 'rgba(209, 213, 219, 1)',
    };

    const buttonStyle = {
        marginTop: '2.5rem',
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '1.5rem',
    };

    const resetButtonBaseStyle = { // Encapsulate common styles
        borderRadius: '0.375rem',
        backgroundColor: '#1E90FF',
        paddingLeft: '0.875rem',
        paddingRight: '0.875rem',
        paddingTop: '0.625rem',
        paddingBottom: '0.625rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#fff',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transitionProperty: 'color, background-color, border-color, text-decoration-line, opacity',
        transitionDuration: '0.15s',
        transitionTimingFunction: 'ease-in-out',
        cursor: 'pointer',
        outline: '2px solid transparent',
        outlineOffset: '2px',
        border: 'none'
    };

    const resetButtonStyle = {
        ...resetButtonBaseStyle,
    };

    const paragraph2Style = {
        marginTop: '2rem',
        fontSize: '1.125rem',
        lineHeight: '1.75rem',
        color: 'rgba(209, 213, 219, 1)',
        textAlign: 'left',
    };

    const footerStyle = {
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'center',
    };

    const footerTextStyle = {
        fontWeight: '600',
        color: '#93c5fd',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
    };

    return (
        <section style={{ ...sectionStyle, flexDirection: 'column' }}>
            <div style={{ ...containerStyle, position: 'relative' }}>
                <div style={{ ...backgroundBlobTopStyle, position: 'absolute' }} aria-hidden="true">
                    <div style={{ ...blobStyle, position: 'relative' }}></div>
                </div>
                <div style={textContainerStyle}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{ ...titleStyle, textAlign: 'left' }}>Reset your Password</h1>
                        <p style={{ ...paragraph1Style, textAlign: 'left' }}>Hello {firstName}, <br />Click on the button below to be redirected</p>
                        <div style={buttonStyle}>
                            <a href={redirectUrl} style={resetButtonStyle}>
                                Reset Password Page
                            </a>
                        </div>
                        <p style={{ ...paragraph2Style, textAlign: 'left' }}>Don&apos;t share this with anyone 🤫, <br />Thank you</p>
                    </div>
                </div>
                <div style={footerStyle}>
                    <div style={footerTextStyle}>
                        AuthBilders.dev team
                    </div>
                </div>
                <div style={backgroundBlobBottomStyle} aria-hidden="true">
                    <div style={blobStyle}></div>
                </div>
            </div>
        </section>
    );
}

