import Image from 'next/image'
import React from 'react'

const Logo: React.FC = () => (
  <Image src="/lovosis.svg" alt="My Brand Logo" width={120} height={50} priority />
)

export default Logo
