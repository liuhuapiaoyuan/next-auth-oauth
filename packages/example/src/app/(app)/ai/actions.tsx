'use server'

import { revalidatePath } from 'next/cache'

const messages = [
  {
    role: 'user',
    content: `Explain quantum computing in simple terms`,
  },
  {
    role: 'assistant',
    content: `Certainly! Quantum computing is a new type of computing that relies on the principles of quantum physics. Traditional computers, like the one you might be using right now, use bits to store and process information. These bits can represent either a 0 or a 1. In contrast, quantum computers use quantum bits, or qubits.
Unlike bits, qubits can represent not only a 0 or a 1 but also a superposition of both states simultaneously. This means that a qubit can be in multiple states at once, which allows quantum computers to perform certain calculations much faster and more efficiently`,
  },
  { role: 'user', content: 'I need to submit a form' },
  { role: 'assistant', content: 'Hello, how can I assist you?' },
]

export async function getMessages() {
  return messages
}
export async function submit(content: string) {
  messages.push({ role: 'user', content: content })
  revalidatePath('/ai')
  await new Promise(resolve => setTimeout(resolve, 1000))
  messages.push({ role: 'assistant', content: 'receive:' + content })
  revalidatePath('/ai')
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('submit')
  return 'success'
}
