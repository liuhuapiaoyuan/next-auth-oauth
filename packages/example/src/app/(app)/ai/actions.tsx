'use server'
export async function submit() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('submit')
  return 'success'
}
