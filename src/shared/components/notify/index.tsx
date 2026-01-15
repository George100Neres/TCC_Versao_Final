 'use client'

export const notify = (data: { message: string, duration?: number, type: 'success' | 'error' }) => {
  const { message, duration = 3000, type } = data
  const notification = document.createElement('div')
  notification.classList.add(
    'max-w-xl',
    'w-full',
    'fixed',
    'bottom-4',
    'left-1/2',
    'transform',
    '-translate-x-1/2',
    'px-4',
    'py-2',
    'rounded-md',
    'shadow-lg',
    'opacity-0',
    'transition-opacity',
    'duration-300',
    'z-50',
    'text-center',
    'font-bold'
  )
  if (type === 'success') {
    notification.classList.add('bg-green-600', 'text-white')
  }
  if (type === 'error') {
    notification.classList.add('bg-red-700', 'text-white')
  }

  notification.innerText = message

  document.body.appendChild(notification)

  // Trigger reflow to enable the transition
  void notification.offsetWidth
  notification.style.opacity = '1'

  setTimeout(() => {
    notification.style.opacity = '0'
    notification.addEventListener('transitionend', () => {
      document.body.removeChild(notification)
    })
  }, duration)
}
