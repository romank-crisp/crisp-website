export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white py-64 px-32">
            <div className="max-w-[800px] mx-auto">
                <h1 className="font-mega text-mega-h2 leading-[var(--lh-mega)] tracking-[var(--ls-mega)] uppercase mb-48">
                    PRIVACY POLICY
                </h1>

                <div className="space-y-32 text-text-md text-text leading-relaxed">
                    <section>
                        <h2 className="font-heading text-h2 font-bold mb-16">Data Collection</h2>
                        <p>
                            When you submit our contact form, we collect your name, email address,
                            service interest, message, and optional meeting preference. This information
                            is used solely to respond to your inquiry.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-h2 font-bold mb-16">Data Usage</h2>
                        <p>
                            Your data will only be used to:
                        </p>
                        <ul className="list-disc pl-24 mt-12 space-y-8">
                            <li>Respond to your contact form submission</li>
                            <li>Schedule meetings if requested</li>
                            <li>Provide information about our services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-heading text-h2 font-bold mb-16">Data Storage</h2>
                        <p>
                            We do not store your contact form data in a database. Your information
                            is sent directly to our team via email and is retained only in our email
                            system for the purpose of responding to your inquiry.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-h2 font-bold mb-16">Your Rights</h2>
                        <p>
                            Under GDPR, you have the right to:
                        </p>
                        <ul className="list-disc pl-24 mt-12 space-y-8">
                            <li>Request access to your personal data</li>
                            <li>Request correction of your personal data</li>
                            <li>Request deletion of your personal data</li>
                            <li>Object to processing of your personal data</li>
                        </ul>
                        <p className="mt-16">
                            To exercise these rights, please contact us at{" "}
                            <a href="mailto:privacy@crisp.com" className="text-brand underline hover:no-underline">
                                privacy@crisp.com
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="font-heading text-h2 font-bold mb-16">Contact</h2>
                        <p>
                            If you have any questions about this privacy policy, please contact us at{" "}
                            <a href="mailto:privacy@crisp.com" className="text-brand underline hover:no-underline">
                                privacy@crisp.com
                            </a>
                        </p>
                    </section>

                    <p className="text-text-sm text-text/60 mt-48">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </main>
    );
}
