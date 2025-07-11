import React from 'react';
import { Typography } from 'antd';

const TermsR = () => {
    const { Title, Paragraph, Text } = Typography;
    return (
        <>
            <div className="terms-content">
                <Title level={2}>
                    Terms and Conditions of Trade Conx
                </Title>
                <Text type="secondary">Last Updated: 8/02/2025</Text>

                <Paragraph>
                    Welcome to Trade Conx, a platform connecting tradespeople, laborers, and skilled workers with recruiters and employers. By using our website, you agree to comply with the following Terms and Conditions.
                </Paragraph>

                <hr />

                <Title level={3}>1. Introduction</Title>
                <Paragraph>
                    1.1 These Terms and Conditions govern your use of Trade Conx as a recruiter, jobseeker, or visitor.
                    <br />
                    1.2 By registering an account, posting a job, or applying for a job, you agree to these terms.
                    <br />
                    1.3 We reserve the right to modify these Terms and Conditions at any time. Continued use of the platform after updates means acceptance of the revised terms.
                </Paragraph>

                <hr />

                <Title level={3}>2. Account Registration and Usage</Title>
                <Paragraph>
                    2.1 Users (both recruiters and jobseekers) must provide accurate and up-to-date information during registration.
                    <br />
                    2.2 Recruiters and jobseekers are responsible for maintaining the confidentiality of their account credentials.
                    <br />
                    2.3 We may suspend or terminate accounts found in violation of our Terms and Conditions.
                </Paragraph>

                <hr />

                <Title level={3}>3. Job Postings and Approvals</Title>
                <Paragraph>
                    3.1 All job postings submitted by recruiters and profiles created by jobseekers must be pre-approved by Trade Conx before being published.
                    <br />
                    3.2 Trade Conx reserves the right to reject, modify, or remove any job posting or profile that contains misleading, offensive, or inappropriate content.
                    <br />
                    3.3 Job postings must comply with relevant employment laws and regulations in Ireland.
                </Paragraph>

                <hr />

                <Title level={3}>4. Recruiter Payment Terms</Title>
                <Paragraph>
                    4.1 Recruiters pay a fee for job postings based on the duration they select (e.g., €5 per day for 10 days).
                    <br />
                    4.2 Payment is processed securely through a third-party payment provider. Trade Conx does not store payment details.
                    <br />
                    4.3 No refunds will be issued once a job posting is approved and published unless a technical issue on our part prevents the job from being displayed.
                    <br />
                    4.4 Recruiters can manage their job postings, payment plans, and account details through their dashboard.
                </Paragraph>

                <hr />

                <Title level={3}>5. Jobseeker Terms</Title>
                <Paragraph>
                    5.1 Jobseekers must provide accurate and truthful information in their profiles.
                    <br />
                    5.2 Trade Conx does not guarantee job placement or response from recruiters.
                    <br />
                    5.3 Jobseekers are responsible for verifying the legitimacy of job offers before accepting any employment.
                </Paragraph>

                <hr />

                <Title level={3}>6. Data Protection and Communication</Title>
                <Paragraph>
                    6.1 By using our platform, recruiters agree to have their contact information stored on our mailing list. We may contact them occasionally with updates and offers.
                    <br />
                    6.2 Users can update their details or opt out of marketing communications through their dashboard.
                    <br />
                    6.3 Trade Conx complies with GDPR and Irish data protection laws to safeguard user information.
                </Paragraph>

                <hr />

                <Title level={3}>7. Platform Responsibilities and Liability</Title>
                <Paragraph>
                    7.1 Trade Conx acts as a facilitator between jobseekers and recruiters and is not responsible for the outcome of any employment agreements.
                    <br />
                    7.2 We do not verify the background, qualifications, or identity of jobseekers or recruiters. Users are responsible for conducting their own due diligence.
                    <br />
                    7.3 Trade Conx is not liable for any direct, indirect, or consequential losses arising from the use of our platform.
                </Paragraph>

                <hr />

                <Title level={3}>8. Termination and Suspension</Title>
                <Paragraph>
                    8.1 We reserve the right to suspend or terminate accounts that violate our terms, including fraudulent activity or misuse of the platform.
                    <br />
                    8.2 Users can request account deletion at any time via their dashboard.
                </Paragraph>

                <hr />

                <Title level={3}>9. Governing Law</Title>
                <Paragraph>
                    9.1 These Terms and Conditions are governed by the laws of Ireland.
                    <br />
                    9.2 Any disputes arising from these terms shall be resolved in Irish courts.
                </Paragraph>

                <hr />

                <Title level={3}>10. Contact Information</Title>
                <Paragraph>
                    For questions or concerns regarding these Terms and Conditions, please contact us.
                </Paragraph>
            </div>
        </>
    );
};

export default TermsR;