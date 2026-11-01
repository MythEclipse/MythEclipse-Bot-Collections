import * as React from "react";
import { useLocale } from "../i18n";
import { Bullets, Section } from "../legal/blocks";
import { contactEmail } from "../legal/types";

export function SupportPage(): React.ReactElement {
  const { t } = useLocale();

  return (
    <main className="legal container" id="main">
      <h1>{t("support.h1")}</h1>
      <p className="legal-date">{t("support.intro")}</p>
      <article>
        <p>{t("support.body")}</p>

        <Section title={t("support.before")}>
          <Bullets items={[t("support.before.one"), t("support.before.two"), t("support.before.three")]} />
        </Section>

        <Section title={t("support.contact")}>
          <p className="support-card">
            {t("support.emailLabel")}
            <a href={`mailto:${contactEmail}`}>
              <strong>{contactEmail}</strong>
            </a>
          </p>
          <p>{t("support.legal")}</p>
        </Section>
      </article>
    </main>
  );
}
