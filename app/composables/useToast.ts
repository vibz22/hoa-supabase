import { ref } from "vue"

const message = ref("")
const show = ref(false)

export const useToast = () => {
  const success = (msg: string) => {
    message.value = msg
    show.value = true

    setTimeout(() => {
      show.value = false
    }, 2500)
  }

  return { message, show, success }
}