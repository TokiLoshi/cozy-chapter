import { Link, createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <section className="max-w-2xl mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Terms of Use
          </h1>
          <p className="text-slate-400 mb-10">
            The short (only) version. Last updated June 2026.
          </p>
          <div className="space-y-8 text-slate-300 leading-relaxed">
            <p>
              Cozy Chapter is a personal hobby project created by a solo dev for
              fun. By using it, you're agreeing to a few things. If at any point
              you would like your account deleted please reach out via the{' '}
              <Link
                to="/contact"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                reach out
              </Link>{' '}
              from the email you signed up with.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                It's provided "as is"
              </h2>
              <p>
                Cozy Chapter comes with no warranties of any kind. It might
                break, go offline or lose data or encounter bugs. To the fullest
                extent allowed by law, I'm not liable for any loss or damage
                from using (or not being able to use) it. Please keep a copy of
                anything you'd be sad to lose and don't rely on any of the data
                here. The site also uses external apis, which I may in future be
                forced to limit or which themselves may have downtime.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                Your stuff stays yours
              </h2>
              <p>
                Anything you upload belongs to you. You give me permission to
                store, display and process it as needed to run the app - nothing
                more. Please only upload things you have the rights to, and
                don't use the app to do anything illegal or harmful. I reserve
                the right to remove content or suspend access if needed.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                The boring essentials
              </h2>
              <p>
                I may update these terms or change or shut down the app at any
                time. I'll update the date above if the terms change. These
                terms are governed by the State of Californi, USA. Details are
                in the{' '}
                <Link
                  to="/privacy"
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                >
                  privacy policy
                </Link>
                . If the app ever shuts down, I'd do my best to notify active
                users and, within reason, provide an export of their data on
                request.
              </p>
            </div>
            <p>
              Questions? Please feel free to{' '}
              <Link
                to="/contact"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                reach out
              </Link>
              .
            </p>
          </div>
          <p className="mt-2">
            Thanks for being here, and I hope you enjoy the cozy space 🫶
          </p>
        </section>
      </div>
      <Footer />
    </>
  )
}
