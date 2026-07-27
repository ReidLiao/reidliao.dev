import * as React from 'react'

import { emailConfig } from '../config/email'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from './_components'

export default function Layout({
  previewText,
  children,
}: {
  previewText: string
  children: React.ReactNode
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-zinc-50 pt-[32px] font-sans">
          <Container className="mx-auto my-[40px] w-[465px] max-w-[465px] rounded-2xl border border-solid border-zinc-100 bg-white px-[24px] py-[20px]">
            {children}
          </Container>

          <Container className="mx-auto mt-[32px] w-[465px]">
            <Hr className="mx-0 my-[20px] h-px w-full bg-zinc-100" />
            <Section className="text-center">
              <Img
                src={`${emailConfig.baseUrl}/avatar.jpg`}
                width="80"
                height="80"
                alt="Reidliao.dev"
                className="mx-auto my-0"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
              <Text className="text-center">
                <Link
                  href="https://reidliao.dev"
                  className="text-zinc-700 underline"
                >
                  <strong>Reidliao.dev</strong>
                </Link>
                <br />
                开发者、架构师、软件迷、自建者
              </Text>
              <Text className="text-center">
                <Link
                  href="https://github.com/ReidLiao/reidliao.dev"
                  className="text-xs text-zinc-600 underline"
                >
                  GitHub
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
